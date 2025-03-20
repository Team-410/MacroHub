import requests
from api_requests.token import get_token
from functions.load_config import load_config

config = load_config()

API_BASE_URL = config.get("API_BASE_URL", "http://localhost:5000")

def fetch_personal_macros():
    """
    Fetch the user's personal macro list from the backend.
    
    Args:
        token (str): JWT token for authentication.
    
    Returns:
        dict: A dictionary containing:
            - success (bool): Whether the request was successful.
            - error (str): Error message if the request failed.
            - macros (list): List of macros if the request succeeded.
    """
    try:
        response = requests.get(
            f"{API_BASE_URL}/api/personal_list",
            headers={"Authorization": f"Bearer {get_token()}"},
            timeout=10  # Add timeout for safety
        )
        
        # Handle unauthorized or expired tokens
        if response.status_code == 401:
            return {
                'success': False,
                'error': 'Token expired or invalid. Please log in again.'
            }
        
        # Raise an exception for other HTTP errors
        response.raise_for_status()
        
        # Parse the response
        data = response.json()
        macros = data.get("results", [])

        return {
            'success': True,
            'macros': macros,
            'count': len(macros)
        }
        
    except requests.exceptions.RequestException as e:
        if isinstance(e, requests.exceptions.HTTPError) and e.response is not None and e.response.status_code == 404:
            return {
                'success': False,
                'macros': [],
                'error': "You don't have macros added to your personal list. Go to web client to add them."
            }
        else:
            return {
                'success': False,
                'macros': [],
                'error': f"Network error: {e}"
            }

    except ValueError:  # JSON decode error
        return {
            'success': False,
            'error': "Invalid server response"
        }