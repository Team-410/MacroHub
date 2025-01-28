from jwt_decrypt import jwt_decrypt
import tkinter as tk

# Funktio uuden näkymän luomiseen
def welcome_window():
    # Kutsutaan jwt_decrypt ja saadaan käyttäjän tiedot
    user_data = jwt_decrypt()

    # Jos käyttäjän tiedot löytyvät, näytetään ne tervetuloikkunassa
    if user_data and "fullname" in user_data:
        fullname = user_data["fullname"]
    else:
        fullname = "Unknown User"

    welcome_window = tk.Tk()
    welcome_window.title("Welcome")

    welcome_label = tk.Label(welcome_window, text=f"Welcome, {fullname}!", font=("Arial", 24))
    welcome_label.pack(padx=20, pady=20)

    close_button = tk.Button(welcome_window, text="Close", command=welcome_window.quit)
    close_button.pack(pady=10)

    welcome_window.mainloop()
