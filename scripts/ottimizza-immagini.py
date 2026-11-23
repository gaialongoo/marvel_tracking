"""
OTTIMIZZA IMMAGINI — prepara per l'app le immagini generate.

Legge gli originali (PNG, JPG, WEBP, qualsiasi dimensione) da:
  immagini/avatars/<chiave>.*    → public/avatars/<chiave>.webp    (quadrato 256x256)
  immagini/universes/<chiave>.*  → public/universes/<chiave>.webp  (16:9, 1280x720)

Ritaglia al centro per avere la proporzione giusta, riduce e converte in
WEBP (file leggeri, veloci da caricare anche dal telefono).
Avvio (dalla cartella del progetto):  python scripts/ottimizza-immagini.py
Serve Pillow:  pip install pillow
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
EXT = {".png", ".jpg", ".jpeg", ".webp"}

# cartella di origine → (cartella di destinazione, larghezza, altezza)
JOBS = {
    "avatars": ("avatars", 256, 256),
    "universes": ("universes", 1280, 720),
}


def main() -> None:
    for src_name, (dst_name, w, h) in JOBS.items():
        src = ROOT / "immagini" / src_name
        dst = ROOT / "public" / dst_name
        dst.mkdir(parents=True, exist_ok=True)
        files = sorted(p for p in src.glob("*") if p.suffix.lower() in EXT) if src.exists() else []
        for p in files:
            with Image.open(p) as im:
                im = ImageOps.exif_transpose(im).convert("RGB")
                # ritaglio centrale alla proporzione giusta + riduzione di qualità alta
                out = ImageOps.fit(im, (w, h), Image.LANCZOS, centering=(0.5, 0.4 if src_name == "avatars" else 0.5))
                target = dst / f"{p.stem.lower()}.webp"
                out.save(target, "WEBP", quality=82, method=6)
                print(f"{p.name} → public/{dst_name}/{target.name} ({target.stat().st_size // 1024} KB)")
        if not files:
            print(f"Nessuna immagine in immagini/{src_name}/")


if __name__ == "__main__":
    main()
