import requests
import os
from api_requests.token import get_token
from dotenv import load_dotenv
from functions.macro_runner import MacroRunner

load_dotenv()
API_BASE_URL = os.getenv("API_BASE_URL")

def save_macro(macro: MacroRunner):
    """
    Save a new macro to the backend.
    """

    macro_object = {
        "macroname": "test",
        "macrodescription": "test macro",
        "app": "test app",
        "category": "test category",
        "macrotype": "test type",
        "macro": macro.to_dict()
    }
    print("Sending macro:", macro_object)

    try:
        response = requests.post(
            f"{API_BASE_URL}/api/save_macro",
            headers={"Authorization": f"Bearer {get_token()}",
                     "Content-Type": "application/json"},
            json=macro_object,  
            timeout=10
        )
        
        if response.status_code == 401:
            return {
                'success': False,
                'error': 'Token expired or invalid. Please log in again.'
            }

        response.raise_for_status()  # Heittää virheen, jos statuskoodi on 4xx tai 5xx

        data = response.json()  # Muutetaan vastaus JSON-muotoon
        return {
            'success': True,
            'macroid': data.get("macroid")
        }
        
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'error': f"Network error: {str(e)}"
        }
    except ValueError:
        return {
            'success': False,
            'error': "Invalid server response"
        }
