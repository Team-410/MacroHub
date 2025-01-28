import requests

def login(email, password):
    # API-osoite
    url = 'http://localhost:5000/api/login'

    # Lähetettävä data
    payload = {
        "email": email,
        "password": password
    }

    try:
        # POST-pyyntö
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        # Käsittele vastaus
        data = response.json()
        token = data.get("token")
        
        if token:
            print(f"Kirjautuminen onnistui! Token: {token}")
        else:
            print("Virhe: Tokenia ei löydy vastauksesta.")
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP-virhe: {http_err}")
    except requests.exceptions.RequestException as err:
        print(f"Virhe: {err}")

# Käyttäjän tiedot
email = "juho.jarvinen1999@gmail.com"  # testi
password = "asd"  # testi

# Suorita kirjautuminen
login(email, password)
