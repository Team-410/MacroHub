import requests
from api_requests.token import get_token
from functions.load_config import load_config

config = load_config()

API_BASE_URL = config.get("API_BASE_URL", "http://localhost:5000")

def get_user_info(): 
    if not API_BASE_URL:
        raise ValueError("API_BASE_URL is not set in the environment variables.")

    try: 
        response = requests.get(
            f"{API_BASE_URL}/api/token/userinfo",
            headers={"Authorization": f"Bearer {get_token()}"},
            timeout=10
        )

        response.raise_for_status()

        data = response.json()
        return data['user'] 

    except requests.exceptions.Timeout:
        print("Error: Request timed out.")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

    return None  # Palautetaan None virheen sattuessa
