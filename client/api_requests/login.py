import requests
import os

def login(email, password):
    # API-osoite
    url = 'http://localhost:5000/api/login'

    payload = {
        "email": email,
        "password": password
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Tarkistetaan, onko statuskoodi OK

        data = response.json()
        token = data.get("token")

        if token:
            print(f"Kirjautuminen onnistui! Token: {token}")

            # Tallenna token "secret.txt" tiedostoon
            secret_file = 'secret.txt'

            if not os.path.exists(secret_file):
                # Jos tiedostoa ei ole, luodaan se
                with open(secret_file, 'w') as file:
                    file.write(token)
                print("Token tallennettu tiedostoon secret.txt.")
            else:
                print("Tiedosto 'secret.txt' on jo olemassa.")
            return True  # Kirjautuminen onnistui
        else:
            print("Virhe: Tokenia ei löydy vastauksesta.")
            return False  # Ei tokenia, kirjautuminen epäonnistui

    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP-virhe: {http_err}")
        return False  # HTTP virhe, kirjautuminen epäonnistui
    except requests.exceptions.RequestException as err:
        print(f"Virhe: {err}")
        return False  # Pyyntö epäonnistui
