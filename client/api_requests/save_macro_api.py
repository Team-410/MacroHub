import requests
import os
from api_requests.token import get_token
from functions.macro_runner import MacroRunner
from functions.load_config import load_config

config = load_config()

API_BASE_URL = config.get("API_BASE_URL", "http://localhost:5000")

def save_macro(macro_object):
    """
    Save a new macro to the backend.
    """

    print(macro_object)

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
