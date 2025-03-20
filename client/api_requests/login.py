import requests
from functions.load_config import load_config

config = load_config()

API_BASE_URL = config.get("API_BASE_URL", "http://localhost:5000")

def login(email, password):
    # API-osoite
    url = f"{API_BASE_URL}/api/login"

    payload = {
        "email": email,
        "password": password
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()

        data = response.json()
        token = data.get("token")

        if token:
            print(f"Kirjautuminen onnistui! Token: {token}")

            secret_file = 'secret.txt'

            with open(secret_file, 'w') as file:
                file.write(token)
            print("Token tallennettu tiedostoon secret.txt.")
            return True 
        else:
            print("Virhe: Tokenia ei löydy vastauksesta.")
            return False

    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP-virhe: {http_err}")
        return False 
    except requests.exceptions.RequestException as err:
        print(f"Virhe: {err}")
        return False 
