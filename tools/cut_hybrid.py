"""Hybrid cutout v2 — flood backdrop, sealed opaque core, thin despilled rim.

Never hole-punches gold labels / brass caps. Ivory fringe dies on dark fields.
"""

from __future__ import annotations

import json
import re
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC = Path("/Users/m3/.cursor/projects/Users-m3-store-new/assets")
OUT = Path("/Users/m3/store new/public/products")
CATALOG = Path("/Users/m3/store new/src/lib/catalog.ts")
OUT.mkdir(parents=True, exist_ok=True)

SHOTS = {
    "body-oil": "product-body-oil-studio.png",
    "hair-perfume": "product-hair-perfume-studio.png",
    "body-scrub": "product-body-scrub-studio.png",
    "hair-mask": "product-hair-mask-studio.png",
    "shampoo": "product-shampoo-studio.png",
    "conditioner": "product-conditioner-studio.png",
    "body-milk": "product-body-milk-studio.png",
    "signature-jar": "product-signature-jar-studio.png",
}


def estimate_bg(rgb: np.ndarray) -> np.ndarray:
    h, w, _ = rgb.shape
    band = max(24, min(h, w) // 12)
    samples = np.concatenate(
        [
            rgb[:band].reshape(-1, 3),
            rgb[-band:].reshape(-1, 3),
            rgb[:, :band].reshape(-1, 3),
            rgb[:, -band:].reshape(-1, 3),
        ],
        axis=0,
    )
    return np.median(samples, axis=0)


def flood(candidate: np.ndarray) -> np.ndarray:
    h, w = candidate.shape
    reached = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()

    def seed(y: int, x: int) -> None:
        if candidate[y, x] and not reached[y, x]:
            reached[y, x] = True
            q.append((y, x))

    for x in range(w):
        seed(0, x)
        seed(h - 1, x)
    for y in range(h):
        seed(y, 0)
        seed(y, w - 1)

    while q:
        y, x = q.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w and candidate[ny, nx] and not reached[ny, nx]:
                reached[ny, nx] = True
                q.append((ny, nx))
    return reached


def morph(mask: np.ndarray, size: int, grow: bool) -> np.ndarray:
    img = Image.fromarray((mask.astype(np.uint8) * 255), "L")
    img = img.filter(ImageFilter.MaxFilter(size) if grow else ImageFilter.MinFilter(size))
    return np.asarray(img) > 127


def process(slug: str, filename: str) -> dict:
    rgb = np.asarray(Image.open(SRC / filename).convert("RGB")).astype(np.float32) / 255.0
    h, w, _ = rgb.shape
    bg = estimate_bg(rgb)
    diff = np.linalg.norm(rgb - bg[None, None, :], axis=2)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    lum = rgb @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    bg_lum = float(bg @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32))

    # Backdrop only — never treat saturated / warm product colour as sky.
    # Adaptive: some studio plates (jars) have warmer, uneven plaster.
    near_ivory = (diff < 0.088) & (chroma < 0.085) & (lum > bg_lum - 0.08)
    soft_shadow = (chroma < 0.055) & (lum < bg_lum + 0.02) & (lum > bg_lum - 0.22) & (diff < 0.12)
    background = flood(near_ivory | soft_shadow)
    if background.mean() < 0.08:
        near_ivory = (diff < 0.135) & (chroma < 0.13) & (lum > 0.72)
        soft_shadow = (chroma < 0.07) & (lum < bg_lum + 0.03) & (lum > bg_lum - 0.28) & (diff < 0.16)
        background = flood(near_ivory | soft_shadow)
    subject = ~background

    # Seal pinholes inside the object; strip dust outside.
    subject = morph(morph(subject, 5, grow=True), 5, grow=False)
    subject = morph(morph(subject, 3, grow=False), 3, grow=True)

    # Hard core stays fully opaque — gold labels / brass never get keyed.
    core = morph(subject, 5, grow=False)
    # Slightly contracted silhouette kills chalk rim before soft falloff.
    tight = morph(subject, 3, grow=False)

    soft = Image.fromarray((tight.astype(np.uint8) * 255), "L").filter(
        ImageFilter.GaussianBlur(0.55)
    )
    alpha = np.asarray(soft).astype(np.float32) / 255.0
    alpha = np.where(core, 1.0, alpha)
    alpha = np.where(background, 0.0, alpha)

    # Kill residual ivory only on the thin rim — never inside core.
    rim = (alpha > 0.04) & (alpha < 0.98) & ~core
    ivory_rim = rim & (diff < 0.16) & (chroma < 0.11) & (lum > bg_lum - 0.05)
    alpha = np.where(ivory_rim, 0.0, alpha)
    # Remaining semi-transparent rim that still looks like plaster → crush.
    chalk = rim & (lum > 0.78) & (chroma < 0.10) & (diff < 0.20)
    alpha = np.where(chalk, alpha * 0.08, alpha)
    alpha = np.where(alpha < 0.05, 0.0, alpha)
    alpha = np.clip(alpha, 0.0, 1.0)

    # Unmix backdrop colour only on the soft rim.
    fringe = (alpha > 0.06) & (alpha < 0.97) & ~core
    out_rgb = rgb.copy()
    with np.errstate(invalid="ignore", divide="ignore"):
        lifted = (rgb - bg * (1.0 - alpha[:, :, None])) / np.maximum(alpha[:, :, None], 1e-3)
    out_rgb[fringe] = np.clip(lifted[fringe], 0.0, 1.0)

    # Second pass: drop any leftover bright island still attached at low alpha.
    still = alpha > 0.08
    # Re-flood true exterior through near-transparent / ivory pixels.
    exterior_cand = (alpha < 0.35) & ((diff < 0.18) | (lum > 0.88) | ~still)
    exterior = flood(exterior_cand | background)
    alpha = np.where(exterior & ~core, 0.0, alpha)
    alpha = np.where(core, 1.0, alpha)

    rgba = (np.dstack([out_rgb, alpha]) * 255).astype(np.uint8)
    ys, xs = np.where(alpha > 0.12)
    pad = 16
    y0, y1 = max(0, int(ys.min()) - pad), min(h, int(ys.max()) + pad + 1)
    x0, x1 = max(0, int(xs.min()) - pad), min(w, int(xs.max()) + pad + 1)
    img = Image.fromarray(rgba[y0:y1, x0:x1], "RGBA")

    if img.height > 1800:
        ratio = 1800 / img.height
        img = img.resize((max(1, int(img.width * ratio)), 1800), Image.Resampling.LANCZOS)

    img.save(OUT / f"{slug}.png", optimize=True)
    img.save(OUT / f"{slug}.webp", quality=92, method=6)
    return {"slug": slug, "width": img.width, "height": img.height}


def update_catalog(report: list[dict]) -> None:
    text = CATALOG.read_text()
    for row in report:
        fname = f"{row['slug']}.webp"
        pattern = (
            rf'(image: "/products/{re.escape(fname)}",\n\s*imageWidth: )\d+'
            rf"(,\n\s*imageHeight: )\d+"
        )
        text, n = re.subn(pattern, rf"\g<1>{row['width']}\g<2>{row['height']}", text)
        row["catalog"] = n
    CATALOG.write_text(text)


def main() -> None:
    report = [process(slug, name) for slug, name in SHOTS.items()]
    update_catalog(report)
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
