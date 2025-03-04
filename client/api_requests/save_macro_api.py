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
    macro_dict = macro.to_dict()
    print(macro_dict)

    try:
        response = requests.post(
            f"{API_BASE_URL}/api/save_macro",
            headers={"Authorization": f"Bearer {get_token()}"},
            json=macro_dict,
            timeout=10
        )
        
        if response.status_code == 401:
            return {
                'success': False,
                'error': 'Token expired or invalid. Please log in again.'
            }
        
        response.raise_for_status()
        
        data = response.json()
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
