#!/usr/bin/env python3
"""Export the current mascot actions as standalone looping GIF files."""

from __future__ import annotations

import math
from pathlib import Path
from typing import Callable

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public" / "mascot"
OUTPUT_DIR = SOURCE_DIR / "gifs"
CANVAS_SIZE = 512
FPS = 12
FRAME_MS = round(1000 / FPS)

SOURCES = {
    "idle": "kenchan-mascot-pixel-v3.png",
    "wave": "kenchan-mascot-wave.png",
    "eat": "kenchan-mascot-eat-mango.png",
    "laugh": "kenchan-mascot-laugh.png",
    "coffee": "kenchan-mascot-drink-coffee.png",
    "read": "kenchan-mascot-read-book.png",
    "water": "kenchan-mascot-water-seedling.png",
    "avocado": "kenchan-mascot-avocado-celebrate.png",
    "run1": "kenchan-mascot-run-1.png",
    "run2": "kenchan-mascot-run-2.png",
    "run3": "kenchan-mascot-run-3.png",
}


def load_sources() -> dict[str, Image.Image]:
    loaded: dict[str, Image.Image] = {}
    for key, filename in SOURCES.items():
        image = Image.open(SOURCE_DIR / filename).convert("RGBA")
        loaded[key] = image.resize((CANVAS_SIZE, CANVAS_SIZE), Image.Resampling.LANCZOS)
    return loaded


def ease_in_out(value: float) -> float:
    return 0.5 - 0.5 * math.cos(math.pi * value)


def transform(
    source: Image.Image,
    *,
    x: float = 0,
    y: float = 0,
    scale: float = 1,
    angle: float = 0,
) -> Image.Image:
    width = max(1, round(CANVAS_SIZE * scale))
    height = max(1, round(CANVAS_SIZE * scale))
    changed = source.resize((width, height), Image.Resampling.BICUBIC)
    if angle:
        changed = changed.rotate(
            angle,
            resample=Image.Resampling.BICUBIC,
            expand=True,
            center=(changed.width / 2, changed.height * 0.72),
        )

    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    left = round((CANVAS_SIZE - changed.width) / 2 + x)
    top = round((CANVAS_SIZE - changed.height) / 2 + y)
    canvas.alpha_composite(changed, (left, top))
    return canvas


def make_frames(
    source: Image.Image,
    seconds: float,
    motion: Callable[[float], tuple[float, float, float, float]],
) -> list[Image.Image]:
    count = max(2, round(seconds * FPS))
    return [
        transform(source, x=x, y=y, scale=scale, angle=angle)
        for index in range(count)
        for x, y, scale, angle in [motion(index / count)]
    ]


def hold(source: Image.Image, seconds: float) -> list[Image.Image]:
    return make_frames(source, seconds, lambda _t: (0, 0, 1, 0))


def save_gif(name: str, frames: list[Image.Image]) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUTPUT_DIR / name
    gif_frames: list[Image.Image] = []
    for frame in frames:
        alpha = frame.getchannel("A")
        palette_frame = frame.convert("RGB").quantize(
            colors=255,
            method=Image.Quantize.FASTOCTREE,
            dither=Image.Dither.NONE,
        )
        transparent_pixels = alpha.point(lambda value: 255 if value < 128 else 0)
        palette_frame.paste(255, mask=transparent_pixels)
        palette = palette_frame.getpalette()
        palette[255 * 3 : 255 * 3 + 3] = [255, 0, 255]
        palette_frame.putpalette(palette)
        gif_frames.append(palette_frame)

    gif_frames[0].save(
        output,
        save_all=True,
        append_images=gif_frames[1:],
        duration=FRAME_MS,
        loop=0,
        disposal=2,
        transparency=255,
        optimize=False,
    )
    print(f"{output.relative_to(ROOT)} ({len(frames)} frames)")


def main() -> None:
    images = load_sources()

    idle = make_frames(
        images["idle"],
        3.2,
        lambda t: (0, -5 * (0.5 - 0.5 * math.cos(2 * math.pi * t)), 1, 0),
    )
    save_gif("kenchan-idle-float.gif", idle)

    wave = hold(images["idle"], 0.45)
    wave += make_frames(
        images["wave"],
        1.8,
        lambda t: (0, -2 * math.sin(math.pi * t), 1.012, -1.2 * math.sin(4 * math.pi * t)),
    )
    wave += hold(images["idle"], 0.45)
    save_gif("kenchan-wave.gif", wave)

    eat = hold(images["idle"], 0.4)
    eat += make_frames(
        images["eat"],
        2.4,
        lambda t: (
            0,
            -2.5 * max(0, math.sin(6 * math.pi * t)),
            1.01 + 0.006 * math.sin(6 * math.pi * t),
            0.45 * math.sin(6 * math.pi * t),
        ),
    )
    eat += hold(images["idle"], 0.4)
    save_gif("kenchan-eat-mango.gif", eat)

    laugh = hold(images["idle"], 0.35)
    laugh += make_frames(
        images["laugh"],
        1.9,
        lambda t: (
            0,
            -15 * max(0, math.sin(2 * math.pi * t)) ** 1.35,
            1.018,
            -1.5 * math.sin(4 * math.pi * t),
        ),
    )
    laugh += hold(images["idle"], 0.4)
    save_gif("kenchan-laugh-jump.gif", laugh)

    coffee = hold(images["idle"], 0.35)
    coffee += make_frames(
        images["coffee"],
        2.6,
        lambda t: (
            0,
            -2 * math.sin(math.pi * t) ** 2,
            1.012,
            -1.1 * math.sin(math.pi * min(1, t * 1.35)) ** 2,
        ),
    )
    coffee += hold(images["idle"], 0.4)
    save_gif("kenchan-drink-coffee.gif", coffee)

    reading = hold(images["idle"], 0.35)
    reading += make_frames(
        images["read"],
        3.2,
        lambda t: (0, -2 * math.sin(math.pi * t) ** 2, 1.012, 0.7 * math.sin(2 * math.pi * t)),
    )
    reading += hold(images["idle"], 0.4)
    save_gif("kenchan-read-book.gif", reading)

    watering = hold(images["idle"], 0.35)
    watering += make_frames(
        images["water"],
        3,
        lambda t: (
            0,
            -2 * math.sin(math.pi * t) ** 2,
            1.018,
            -1.25 * math.sin(2 * math.pi * t) ** 2 + 0.5 * math.sin(4 * math.pi * t),
        ),
    )
    watering += hold(images["idle"], 0.4)
    save_gif("kenchan-water-seedling.gif", watering)

    avocado = hold(images["idle"], 0.35)
    avocado += make_frames(
        images["avocado"],
        2.2,
        lambda t: (
            0,
            -17 * max(0, math.sin(4 * math.pi * t)) ** 1.45,
            1.022,
            -1.8 * math.sin(4 * math.pi * t),
        ),
    )
    avocado += hold(images["idle"], 0.4)
    save_gif("kenchan-avocado-celebrate.gif", avocado)

    run_frames: list[Image.Image] = []
    run_cycle = [images["run1"], images["run2"], images["run3"]]
    for index in range(30):
        phase = index / 30
        source = run_cycle[index % len(run_cycle)]
        run_frames.append(
            transform(
                source,
                x=5 * math.sin(2 * math.pi * phase),
                y=-4 * abs(math.sin(6 * math.pi * phase)),
                angle=1.2 * math.sin(6 * math.pi * phase),
            )
        )
    save_gif("kenchan-running.gif", run_frames)

    stroll_frames: list[Image.Image] = []
    total_steps = 72
    for index in range(total_steps):
        t = index / (total_steps - 1)
        if t < 0.42:
            progress = ease_in_out(t / 0.42)
            x = -145 * progress
            source = run_cycle[index % 3]
            flip = False
        elif t < 0.58:
            x = -145
            source = images["idle"]
            flip = False
        else:
            progress = ease_in_out((t - 0.58) / 0.42)
            x = -145 * (1 - progress)
            source = run_cycle[index % 3]
            flip = True

        if flip:
            source = source.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        y = 0 if source is images["idle"] else -3 * abs(math.sin(index * math.pi / 3))
        stroll_frames.append(transform(source, x=x, y=y))
    save_gif("kenchan-stroll-and-return.gif", stroll_frames)


if __name__ == "__main__":
    main()
