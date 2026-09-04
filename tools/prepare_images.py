"""Cut the studio grey out of the Maison product photography.

The source frames are shot on a smooth, vertically graded light-grey sweep.
We estimate that sweep per row, flood the connected background in from the
frame border, drop the neutral contact shadow, then feather the resulting
alpha so the bottles can be composed on ivory, burgundy or espresso fields.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC = Path(sys.argv[1])
OUT = Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)

# filename stem -> product slug
MAPPING = {
    "WhatsApp_Image_2026-09-02_at_21.00.24-0ced88fd-4ded-4035-95d9-bb8e617bc785": "hair-perfume",
    "WhatsApp_Image_2026-09-02_at_21.00.23__1_-8ad837c9-a7e3-40da-b202-5a0eb1d38285": "body-oil",
    "WhatsApp_Image_2026-09-02_at_21.00.23__2_-12b134fd-310a-4eac-bab5-378fc1927c10": "signature-jar",
    "WhatsApp_Image_2026-09-02_at_21.00.23-1b2f7fea-e709-45f3-afb2-e4b0bce7730e": "body-scrub",
    "WhatsApp_Image_2026-09-02_at_21.00.25__1_-ce733f5c-2268-450e-871e-3a4042063880": "shampoo",
    "WhatsApp_Image_2026-09-02_at_21.00.23__3_-c80e8dc5-7fac-4d9f-afec-9c0c194fe145": "hair-mask",
    "WhatsApp_Image_2026-09-02_at_21.00.24__1_-91fb6c0c-a69c-4865-8e10-5c3adb67fa56": "conditioner",
    "WhatsApp_Image_2026-09-02_at_21.00.25-7e67d8e1-65b7-4e41-b065-ca5a7f77d0fb": "body-milk",
}


def flood_from_border(candidate: np.ndarray) -> np.ndarray:
    """Connected component of `candidate` reachable from the image border."""
    reached = np.zeros_like(candidate)
    reached[0, :] = candidate[0, :]
    reached[-1, :] = candidate[-1, :]
    reached[:, 0] = candidate[:, 0]
    reached[:, -1] = candidate[:, -1]

    # Raster sweeps converge far faster than isotropic dilation.
    for _ in range(64):
        before = reached.sum()
        for _pass in range(2):
            for axis in (0, 1):
                for flip in (False, True):
                    work = np.flip(reached, axis) if flip else reached
                    cand = np.flip(candidate, axis) if flip else candidate
                    acc = work.copy()
                    if axis == 0:
                        for i in range(1, acc.shape[0]):
                            acc[i] |= acc[i - 1] & cand[i]
                    else:
                        for j in range(1, acc.shape[1]):
                            acc[:, j] |= acc[:, j - 1] & cand[:, j]
                    acc = np.flip(acc, axis) if flip else acc
                    reached = acc
        if reached.sum() == before:
            break
    return reached


def morph(mask: np.ndarray, size: int, grow: bool) -> np.ndarray:
    img = Image.fromarray((mask * 255).astype(np.uint8), "L")
    img = img.filter(ImageFilter.MaxFilter(size) if grow else ImageFilter.MinFilter(size))
    return np.asarray(img) > 127


def blur(mask: np.ndarray, radius: float) -> np.ndarray:
    img = Image.fromarray((mask * 255).astype(np.uint8), "L")
    img = img.filter(ImageFilter.GaussianBlur(radius))
    return np.asarray(img).astype(np.float32) / 255.0


def process(path: Path, slug: str) -> dict:
    rgb = np.asarray(Image.open(path).convert("RGB")).astype(np.float32) / 255.0
    h, w, _ = rgb.shape

    # Background sweep, estimated per row from the outer columns.
    edge = max(8, w // 24)
    border = np.concatenate([rgb[:, :edge, :], rgb[:, -edge:, :]], axis=1)
    bg_row = np.median(border, axis=1)  # (h, 3)
    bg_row = np.asarray(
        Image.fromarray((bg_row[None, :, :] * 255).astype(np.uint8))
        .filter(ImageFilter.GaussianBlur(9))
    ).astype(np.float32)[0] / 255.0
    bg = bg_row[:, None, :]

    diff = np.abs(rgb - bg).max(axis=2)

    lum = rgb @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    bg_lum = bg @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    chroma = rgb.max(axis=2) - rgb.min(axis=2)

    # The sweep's soft contact shadow is neutral and mid-tone; the products are
    # warm (amber glass, burgundy label, brass) or near-black (pump heads).
    shadow = (chroma < 0.06) & (lum < bg_lum + 0.02) & (lum > 0.26)

    candidate = (diff < 0.13) | shadow
    background = flood_from_border(candidate)
    solid = ~background
    # Close the speckle the printed jar lids leave along their top edge.
    solid = morph(morph(solid, 5, grow=True), 5, grow=False)

    # Soft alpha ramp so edges do not look die-cut.
    ramp = np.clip((diff - 0.05) / 0.11, 0.0, 1.0)
    alpha = np.where(solid, np.maximum(ramp, 0.0), 0.0).astype(np.float32)
    alpha = np.where(solid & (diff > 0.16), 1.0, alpha)
    alpha = blur(alpha, 0.7)
    alpha = np.clip((alpha - 0.12) / 0.8, 0.0, 1.0)

    # Pull a touch of the grey sweep out of the remaining fringe.
    fringe = (alpha > 0.02) & (alpha < 0.96)
    warm = rgb.copy()
    with np.errstate(invalid="ignore", divide="ignore"):
        unmixed = (rgb - bg * (1.0 - alpha[:, :, None])) / np.maximum(alpha[:, :, None], 1e-3)
    warm[fringe] = np.clip(unmixed[fringe], 0.0, 1.0)

    rgba = np.dstack([warm, alpha])
    ys, xs = np.where(alpha > 0.06)
    if len(ys) == 0:
        raise RuntimeError(f"no subject found in {path.name}")
    pad = 6
    y0, y1 = max(0, ys.min() - pad), min(h, ys.max() + pad + 1)
    x0, x1 = max(0, xs.min() - pad), min(w, xs.max() + pad + 1)
    rgba = rgba[y0:y1, x0:x1]

    out_img = Image.fromarray((rgba * 255).astype(np.uint8), "RGBA")
    out_img.save(OUT / f"{slug}.png", optimize=True)
    out_img.save(OUT / f"{slug}.webp", lossless=False, quality=92, method=6)

    return {
        "slug": slug,
        "width": out_img.width,
        "height": out_img.height,
        "coverage": round(float((alpha > 0.5).mean()), 4),
    }


def main() -> None:
    report = []
    for stem, slug in MAPPING.items():
        matches = list(SRC.glob(f"{stem}.*"))
        if not matches:
            print(f"missing source for {slug}: {stem}")
            continue
        report.append(process(matches[0], slug))
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
