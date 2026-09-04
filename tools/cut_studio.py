"""Key the ivory studio backdrop off the regenerated packshots."""

from __future__ import annotations

import json
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


def border_bg(rgb: np.ndarray) -> np.ndarray:
    h, w, _ = rgb.shape
    band = max(12, min(h, w) // 18)
    samples = np.concatenate(
        [
            rgb[:band, :, :].reshape(-1, 3),
            rgb[-band:, :, :].reshape(-1, 3),
            rgb[:, :band, :].reshape(-1, 3),
            rgb[:, -band:, :].reshape(-1, 3),
        ],
        axis=0,
    )
    return np.median(samples, axis=0)


def process(path: Path, slug: str) -> dict:
    src = Image.open(path).convert("RGB")
    rgb = np.asarray(src).astype(np.float32) / 255.0
    bg = border_bg(rgb)
    diff = np.linalg.norm(rgb - bg[None, None, :], axis=2)

    # Soft matte: keep tassels and frosted glass, drop the ivory field.
    alpha = np.clip((diff - 0.045) / 0.10, 0.0, 1.0)
    alpha = np.asarray(
        Image.fromarray((alpha * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.8))
    ).astype(np.float32) / 255.0
    alpha = np.clip((alpha - 0.08) / 0.84, 0.0, 1.0)

    # Unmix residual ivory from the fringe so gold caps do not look chalky.
    fringe = (alpha > 0.04) & (alpha < 0.92)
    unmixed = rgb.copy()
    with np.errstate(invalid="ignore", divide="ignore"):
        lifted = (rgb - bg * (1.0 - alpha[:, :, None])) / np.maximum(alpha[:, :, None], 1e-3)
    unmixed[fringe] = np.clip(lifted[fringe], 0.0, 1.0)

    rgba = np.dstack([unmixed, alpha])
    ys, xs = np.where(alpha > 0.12)
    pad = 18
    h, w = alpha.shape
    y0, y1 = max(0, int(ys.min()) - pad), min(h, int(ys.max()) + pad + 1)
    x0, x1 = max(0, int(xs.min()) - pad), min(w, int(xs.max()) + pad + 1)
    crop = rgba[y0:y1, x0:x1]

    img = Image.fromarray((np.clip(crop, 0, 1) * 255).astype(np.uint8), "RGBA")
    # Keep cards sharp on retina without making files huge.
    max_h = 1800
    if img.height > max_h:
        ratio = max_h / img.height
        img = img.resize((int(img.width * ratio), max_h), Image.Resampling.LANCZOS)

    img.save(OUT / f"{slug}.png", optimize=True)
    img.save(OUT / f"{slug}.webp", quality=90, method=6)
    return {"slug": slug, "width": img.width, "height": img.height}


def main() -> None:
    report = []
    for slug, name in SHOTS.items():
        path = SRC / name
        if not path.exists():
            raise SystemExit(f"missing {path}")
        report.append(process(path, slug))
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
