"""Generate the Maison's material plates.

Everything here is procedural: fractal value noise warped into trowelled
plaster (tadelakt), a woven linen tile and a fine film grain tile. These sit
under the layout at very low opacity to give the flat colour fields a surface,
which is what separates a printed brand from a screen-only one.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

OUT = Path("public/textures")
OUT.mkdir(parents=True, exist_ok=True)
RNG = np.random.default_rng(20260903)


def value_noise(shape: tuple[int, int], cells: int) -> np.ndarray:
    h, w = shape
    grid = RNG.random((cells + 1, cells + 1)).astype(np.float32)
    img = Image.fromarray((grid * 255).astype(np.uint8), "L").resize((w, h), Image.BICUBIC)
    return np.asarray(img).astype(np.float32) / 255.0


def fbm(shape: tuple[int, int], octaves: int = 6, base: int = 3, gain: float = 0.5) -> np.ndarray:
    total = np.zeros(shape, dtype=np.float32)
    amp, norm, cells = 1.0, 0.0, base
    for _ in range(octaves):
        total += amp * value_noise(shape, cells)
        norm += amp
        amp *= gain
        cells *= 2
    out = total / norm
    return (out - out.min()) / (np.ptp(out) + 1e-6)


def warp(field: np.ndarray, dx: np.ndarray, dy: np.ndarray, amount: float) -> np.ndarray:
    h, w = field.shape
    yy, xx = np.mgrid[0:h, 0:w]
    sx = np.clip(xx + (dx - 0.5) * amount, 0, w - 1).astype(np.int32)
    sy = np.clip(yy + (dy - 0.5) * amount, 0, h - 1).astype(np.int32)
    return field[sy, sx]


def plaster(size: tuple[int, int], dark: tuple[int, int, int], light: tuple[int, int, int]) -> Image.Image:
    w, h = size
    shape = (h, w)
    height = fbm(shape, octaves=7, base=3, gain=0.55)
    # Trowel strokes: warp the height field along a low-frequency direction.
    height = warp(height, fbm(shape, 4, 2), fbm(shape, 4, 2), amount=min(w, h) * 0.05)
    height = 0.75 * height + 0.25 * fbm(shape, 3, 9, gain=0.6)

    # Near-pixel-scale relief. Without it the plate reads as cloud, not lime.
    grit = fbm(shape, octaves=4, base=max(w, h) // 5, gain=0.5)
    grit = np.asarray(
        Image.fromarray((grit * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.6))
    ).astype(np.float32) / 255.0

    # Shade from a raking top-left light so the surface reads as a wall.
    gy, gx = np.gradient(height + 0.5 * grit)
    shade = np.clip(0.5 + 9.0 * (gx * 0.7 + gy * 0.7), 0.0, 1.0)
    mix = np.clip(0.5 * height + 0.32 * shade + 0.18 * grit, 0.0, 1.0)

    # Broad tonal drift so the plate never looks like a flat repeat.
    mix = np.clip(mix * (0.82 + 0.36 * fbm(shape, 3, 2)), 0.0, 1.0)

    a = np.array(dark, dtype=np.float32) / 255.0
    b = np.array(light, dtype=np.float32) / 255.0
    rgb = a[None, None, :] + (b - a)[None, None, :] * mix[:, :, None]
    rgb += (RNG.random((h, w, 1)).astype(np.float32) - 0.5) * 0.018
    return Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8), "RGB")


def linen_tile(size: int = 320) -> Image.Image:
    x = np.arange(size, dtype=np.float32)
    warp_threads = 0.5 + 0.5 * np.sin(x / 2.0 * np.pi)
    weft_threads = 0.5 + 0.5 * np.sin(x / 2.0 * np.pi + np.pi / 2)
    weave = np.outer(weft_threads, np.ones(size)) * 0.5 + np.outer(np.ones(size), warp_threads) * 0.5
    slub = fbm((size, size), 4, 8, gain=0.6)
    field = np.clip(0.68 * weave + 0.32 * slub, 0, 1)
    alpha = np.clip((field - 0.35) * 1.5, 0, 1) * 0.5
    rgba = np.zeros((size, size, 4), dtype=np.float32)
    rgba[:, :, :3] = 1.0
    rgba[:, :, 3] = alpha
    return Image.fromarray((rgba * 255).astype(np.uint8), "RGBA")


def grain_tile(size: int = 256) -> Image.Image:
    noise = RNG.normal(0.5, 0.16, (size, size)).astype(np.float32)
    noise = np.asarray(
        Image.fromarray((np.clip(noise, 0, 1) * 255).astype(np.uint8), "L").filter(
            ImageFilter.GaussianBlur(0.35)
        )
    ).astype(np.float32) / 255.0
    rgba = np.zeros((size, size, 4), dtype=np.float32)
    rgba[:, :, :3] = noise[:, :, None]
    rgba[:, :, 3] = 1.0
    return Image.fromarray((rgba * 255).astype(np.uint8), "RGBA")


def main() -> None:
    plates = {
        "plaster-espresso": ((1600, 1000), (18, 12, 10), (72, 47, 34)),
        "plaster-burgundy": ((1600, 1000), (44, 14, 13), (128, 51, 40)),
        "plaster-ivory": ((1600, 1000), (214, 202, 184), (250, 245, 237)),
        "plaster-terracotta": ((1400, 1750), (96, 40, 30), (183, 106, 74)),
        "plaster-sand": ((1400, 1750), (169, 148, 121), (233, 221, 203)),
    }
    for name, (size, dark, light) in plates.items():
        plaster(size, dark, light).save(OUT / f"{name}.jpg", quality=84, optimize=True, progressive=True)
        print("wrote", name)

    linen_tile().save(OUT / "linen.png", optimize=True)
    grain_tile().save(OUT / "grain.png", optimize=True)
    print("wrote linen + grain tiles")


if __name__ == "__main__":
    main()
