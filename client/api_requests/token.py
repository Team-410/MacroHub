
def get_token():
    with open("secret.txt", "r") as file:
        token = file.read().strip()
        return token