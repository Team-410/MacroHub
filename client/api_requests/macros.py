import requests
import os

def fetch_personal_macros(token):
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
            f"{os.getenv('API_BASE_URL')}/personal_list",
            headers={"Authorization": f"Bearer {token}"},
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
        return {
            'success': True,
            'macros': data.get('macros', []),
            'count': data.get('count', 0)
        }
        
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'error': f"Network error: {str(e)}"
        }
    except ValueError:  # JSON decode error
        return {
            'success': False,
            'error': "Invalid server response"
        }