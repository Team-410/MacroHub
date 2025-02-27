import requests
import os
from api_requests.token import get_token
from dotenv import load_dotenv

load_dotenv()

API_BASE_URL = os.getenv("API_BASE_URL")

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
