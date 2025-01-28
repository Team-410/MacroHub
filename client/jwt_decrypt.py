import jwt
import os

def jwt_decrypt():
    # Lue token 'secret.txt' tiedostosta
    secret_file = 'secret.txt'
    if not os.path.exists(secret_file):
        print("Error: secret.txt not found.")
        return

    with open(secret_file, 'r') as file:
        token = file.read()

    secret_key = 'salainen_avain'

    try:
        # Puretaan token ja saadaan payload
        decoded_token = jwt.decode(token, secret_key, algorithms=["HS256"])

        print(f"Decoded token: {decoded_token}")

        user_id = decoded_token.get('userId')
        fullname = decoded_token.get('fullname')

        if user_id and fullname:
            print(f"User ID: {user_id}, Full Name: {fullname}")

            # funktio palauttaa userid ja fullname
            # jotta näitä voidaan käyttää muualla
            return {"user_id": user_id, "fullname": fullname}
        else:
            print("User ID or Full Name not found in the token.")
    except jwt.ExpiredSignatureError:
        print("Token has expired.")
    except jwt.InvalidTokenError:
        print("Invalid token.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Kutsu funktiota
jwt_decrypt()
