"""Flood-fill ivory studio backdrop — never punches holes in the subject.

Unlike a global color key, only pixels reachable from the frame border that
match the studio ivory are removed. Bottle interiors stay solid even when
highlights approach the backdrop colour.
"""

from __future__ import annotations

import json
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC = Path("/Users/m3/.cursor/projects/Users-m3-store-new/assets")
OUT = Path("/Users/m3/store new/public/products")
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
    band = max(16, min(h, w) // 16)
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


def flood_background(candidate: np.ndarray) -> np.ndarray:
    """BFS flood of True-candidate pixels from the image border."""
    h, w = candidate.shape
    bg = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()

    def seed(y: int, x: int) -> None:
        if candidate[y, x] and not bg[y, x]:
            bg[y, x] = True
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
            if 0 <= ny < h and 0 <= nx < w and candidate[ny, nx] and not bg[ny, nx]:
                bg[ny, nx] = True
                q.append((ny, nx))
    return bg


def morph_close(mask: np.ndarray, size: int = 9) -> np.ndarray:
    img = Image.fromarray((mask.astype(np.uint8) * 255), "L")
    img = img.filter(ImageFilter.MaxFilter(size))
    img = img.filter(ImageFilter.MinFilter(size))
    return np.asarray(img) > 127


def morph_open(mask: np.ndarray, size: int = 3) -> np.ndarray:
    img = Image.fromarray((mask.astype(np.uint8) * 255), "L")
    img = img.filter(ImageFilter.MinFilter(size))
    img = img.filter(ImageFilter.MaxFilter(size))
    return np.asarray(img) > 127


def process(slug: str, filename: str) -> dict:
    path = SRC / filename
    rgb_u8 = np.asarray(Image.open(path).convert("RGB"))
    rgb = rgb_u8.astype(np.float32) / 255.0
    h, w, _ = rgb.shape
    bg = estimate_bg(rgb)

    # Distance to studio ivory — generous so soft shadows on the sweep go too.
    diff = np.linalg.norm(rgb - bg[None, None, :], axis=2)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    lum = rgb @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    bg_lum = float(bg @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32))

    # Soft contact shadows on the sweep: low chroma, slightly darker than bg.
    shadow = (chroma < 0.08) & (lum < bg_lum + 0.01) & (lum > bg_lum - 0.22)

    # Candidate for removal: near-ivory OR soft shadow. NEVER flood into product.
    candidate = (diff < 0.11) | shadow

    background = flood_background(candidate)
    subject = ~background
    # Close small gaps (speckle in gold caps / lace tassels) without eating silhouette.
    subject = morph_close(subject, size=7)
    subject = morph_open(subject, size=3)

    # Soft alpha only at the true edge of the flooded background.
    edge = Image.fromarray((subject.astype(np.uint8) * 255), "L").filter(
        ImageFilter.GaussianBlur(0.9)
    )
    alpha = np.asarray(edge).astype(np.float32) / 255.0
    # Force fully opaque deep inside the subject.
    core = Image.fromarray((subject.astype(np.uint8) * 255), "L").filter(
        ImageFilter.MinFilter(5)
    )
    core_m = np.asarray(core) > 127
    alpha = np.where(core_m, 1.0, alpha)
    alpha = np.where(background & (diff < 0.07), 0.0, alpha)
    alpha = np.clip(alpha, 0.0, 1.0)

    # Unmix ivory fringe so gold/glass edges stay clean on dark fields.
    fringe = (alpha > 0.05) & (alpha < 0.95)
    out_rgb = rgb.copy()
    with np.errstate(invalid="ignore", divide="ignore"):
        lifted = (rgb - bg * (1.0 - alpha[:, :, None])) / np.maximum(alpha[:, :, None], 1e-3)
    out_rgb[fringe] = np.clip(lifted[fringe], 0.0, 1.0)

    rgba = (np.dstack([out_rgb, alpha]) * 255).astype(np.uint8)
    ys, xs = np.where(alpha > 0.08)
    if len(ys) == 0:
        raise RuntimeError(f"no subject in {slug}")
    pad = 28
    y0, y1 = max(0, int(ys.min()) - pad), min(h, int(ys.max()) + pad + 1)
    x0, x1 = max(0, int(xs.min()) - pad), min(w, int(xs.max()) + pad + 1)
    crop = rgba[y0:y1, x0:x1]

    img = Image.fromarray(crop, "RGBA")
    max_h = 1800
    if img.height > max_h:
        ratio = max_h / img.height
        img = img.resize((max(1, int(img.width * ratio)), max_h), Image.Resampling.LANCZOS)

    img.save(OUT / f"{slug}.png", optimize=True)
    img.save(OUT / f"{slug}.webp", quality=92, method=6)
    return {"slug": slug, "width": img.width, "height": img.height}


def main() -> None:
    report = []
    for slug, name in SHOTS.items():
        print("cutting", slug, flush=True)
        report.append(process(slug, name))
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
