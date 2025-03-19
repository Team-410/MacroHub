import json
import sys
from pathlib import Path

def load_config():
    """ Lataa config.json-tiedoston sisällön oikeasta sijainnista """
    
    # Määritä config.json -polku
    if getattr(sys, 'frozen', False):
        root_path = Path(sys.executable).parent
    else:
        root_path = Path(__file__).resolve().parent.parent  # Siirrytään client-kansioon

    config_path = root_path / "dist" / "config.json"

    if config_path.exists():
        print(f"📂 Ladataan asetukset tiedostosta: {config_path}")
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except json.JSONDecodeError:
            print("⚠️ Virhe: config.json ei ole validi JSON!")
            return {}
    else:
        print("⚠️ config.json EI löydy! Käytetään oletusasetuksia.")
        return {}
