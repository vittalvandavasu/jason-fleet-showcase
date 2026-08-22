"""One-time script to generate clean AI trailer photos for the 4 fleet trailers.
Removes visible manufacturer branding.
"""
import asyncio
import base64
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")

OUT_DIR = Path("/app/frontend/public/trailers/ai")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Prompts crafted for clean, brand-free professional product photography
PROMPTS = {
    "maxxd-c4x-7k": (
        "Professional product photograph of a black tandem-axle open flatbed car hauler trailer, "
        "unbranded and clean (no logos, no text, no manufacturer name anywhere on the trailer), "
        "channel-frame construction with 2x8 wood-plank deck, double-broke diamond-plate fenders, "
        "slide-in rear ramps stowed underneath, dual black steel wheels on each side, "
        "spare tire mounted on the tongue, drop-leg jack extended, "
        "photographed on smooth grey asphalt in a dealership lot with soft daylight, "
        "clear blue sky, wide 3/4 side view showing the length of the deck and the tongue, "
        "crisp automotive product photography style, high detail, sharp focus."
    ),
    "continental-cargo": (
        "Professional product photograph of a white enclosed cargo trailer, "
        "single-axle bumper-pull style, aluminum siding, diamond-plate lower body protection, "
        "completely unbranded and clean (no logos, no text, no company name on the sides, no phone numbers), "
        "rear ramp door closed, side entry door with keyed lock, "
        "roof vent visible on top, LED marker lights, "
        "photographed on smooth grey asphalt in a paved lot, soft overcast daylight, "
        "wide 3/4 side view showing the full length of the trailer body, "
        "crisp automotive product photography style, high detail, sharp focus."
    ),
    "olympic-utility": (
        "Professional product photograph of a small single-axle open utility trailer, "
        "gray solid ribbed metal side panels about 18 inches tall, "
        "steel diamond-plate floor, A-frame tongue with swivel jack, "
        "single axle with black fenders, drop-down rear tailgate, "
        "completely unbranded and clean (no logos, no text, no manufacturer name), "
        "photographed on green grass in an open field with soft daylight, "
        "wide 3/4 side view showing the length of the trailer, "
        "crisp automotive product photography style, high detail, sharp focus."
    ),
    "eagle-landscape": (
        "Professional product photograph of a black single-axle open landscape trailer, "
        "with tall expanded-metal mesh sides about 4 feet high, "
        "solid front panel, rear drop-down mesh ramp gate, "
        "white steel modular wheels, red side marker reflectors, "
        "tongue jack with safety chains and a 2-inch coupler, "
        "completely unbranded and clean (no logos, no text, no manufacturer name), "
        "photographed on paved gravel yard with soft daylight and a treeline background, "
        "wide 3/4 side view showing the length of the trailer, "
        "crisp automotive product photography style, high detail, sharp focus."
    ),
}


async def gen_one(trailer_id: str, prompt: str):
    api_key = os.getenv("EMERGENT_LLM_KEY")
    chat = LlmChat(
        api_key=api_key,
        session_id=f"nwh-gen-{trailer_id}",
        system_message="You are a photorealistic image generator producing clean product photography.",
    )
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(
        modalities=["image", "text"]
    )
    msg = UserMessage(text=prompt)
    print(f"[{trailer_id}] Generating...", flush=True)
    _text, images = await chat.send_message_multimodal_response(msg)
    if not images:
        print(f"[{trailer_id}] No image returned", flush=True)
        return
    img = images[0]
    ext = "png" if "png" in img.get("mime_type", "") else "jpg"
    out = OUT_DIR / f"{trailer_id}.{ext}"
    data = base64.b64decode(img["data"])
    out.write_bytes(data)
    print(f"[{trailer_id}] Saved -> {out} ({len(data)} bytes)", flush=True)


async def main():
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    if which == "all":
        for tid, prompt in PROMPTS.items():
            try:
                await gen_one(tid, prompt)
            except Exception as e:
                print(f"[{tid}] ERROR: {e}", flush=True)
    else:
        await gen_one(which, PROMPTS[which])


if __name__ == "__main__":
    asyncio.run(main())
