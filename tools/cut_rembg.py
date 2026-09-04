"""Cut regenerated studio packshots with rembg (ML matting), not color-keying.

Color-difference cuts punched holes in burgundy labels and left ivory halos
on tassels. rembg + alpha matting keeps the silhouette intact.
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove

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

# Tassel bottles need softer alpha matting; jars can be a bit firmer.
MATTING = {
    "shampoo": dict(foreground_threshold=240, background_threshold=10, erode_size=5),
    "conditioner": dict(foreground_threshold=240, background_threshold=10, erode_size=5),
    "body-milk": dict(foreground_threshold=245, background_threshold=8, erode_size=6),
    "signature-jar": dict(foreground_threshold=250, background_threshold=5, erode_size=8),
    "body-scrub": dict(foreground_threshold=250, background_threshold=5, erode_size=8),
    "hair-mask": dict(foreground_threshold=250, background_threshold=5, erode_size=8),
    "body-oil": dict(foreground_threshold=245, background_threshold=8, erode_size=7),
    "hair-perfume": dict(foreground_threshold=245, background_threshold=8, erode_size=7),
}


def despill_ivory(rgba: np.ndarray) -> np.ndarray:
    """Pull residual warm-ivory fringe out of semi-transparent edge pixels."""
    rgb = rgba[:, :, :3].astype(np.float32) / 255.0
    alpha = rgba[:, :, 3].astype(np.float32) / 255.0
    fringe = (alpha > 0.05) & (alpha < 0.92)
    # Studio plates sit on ~#F3EDE3
    bg = np.array([0.953, 0.929, 0.890], dtype=np.float32)
    with np.errstate(invalid="ignore", divide="ignore"):
        lifted = (rgb - bg * (1.0 - alpha[:, :, None])) / np.maximum(alpha[:, :, None], 1e-3)
    out = rgb.copy()
    out[fringe] = np.clip(lifted[fringe], 0.0, 1.0)
    # Slightly tighten near-zero alpha so dark fields do not show chalk dust.
    alpha = np.where(alpha < 0.04, 0.0, alpha)
    alpha = np.clip((alpha - 0.02) / 0.96, 0.0, 1.0)
    return (np.dstack([out, alpha]) * 255).astype(np.uint8)


def crop_content(img: Image.Image, pad: int = 24) -> Image.Image:
    alpha = np.asarray(img.split()[-1])
    ys, xs = np.where(alpha > 8)
    if len(ys) == 0:
        raise RuntimeError("empty alpha after rembg")
    y0, y1 = max(0, int(ys.min()) - pad), min(img.height, int(ys.max()) + pad + 1)
    x0, x1 = max(0, int(xs.min()) - pad), min(img.width, int(xs.max()) + pad + 1)
    return img.crop((x0, y0, x1, y1))


def soften_edge(img: Image.Image) -> Image.Image:
    """One-pixel soft edge so bottles do not look die-cut."""
    r, g, b, a = img.split()
    a = a.filter(ImageFilter.GaussianBlur(0.45))
    return Image.merge("RGBA", (r, g, b, a))


def process(slug: str, filename: str, session) -> dict:
    path = SRC / filename
    src = Image.open(path).convert("RGBA")
    matte = MATTING[slug]
    cut = remove(
        src,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=matte["foreground_threshold"],
        alpha_matting_background_threshold=matte["background_threshold"],
        alpha_matting_erode_size=matte["erode_size"],
        post_process_mask=True,
    )
    arr = despill_ivory(np.asarray(cut))
    img = Image.fromarray(arr, "RGBA")
    img = crop_content(img)
    img = soften_edge(img)

    max_h = 1800
    if img.height > max_h:
        ratio = max_h / img.height
        img = img.resize((max(1, int(img.width * ratio)), max_h), Image.Resampling.LANCZOS)

    img.save(OUT / f"{slug}.png", optimize=True)
    img.save(OUT / f"{slug}.webp", quality=92, method=6)
    return {"slug": slug, "width": img.width, "height": img.height}


def main() -> None:
    # u2net is the default and handles bottles well; isnet-general-use is sharper on edges.
    session = new_session("isnet-general-use")
    report = []
    for slug, name in SHOTS.items():
        print("cutting", slug, flush=True)
        report.append(process(slug, name, session))
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
