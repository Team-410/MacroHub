import tkinter as tk
from tkinter import messagebox
from api_requests.login import login
from pages.welcome import welcome_window

# tämä on pääikkuna joka avautuu joka kerta kun käyttäjä ajaa ohjelman
# jos kirjautuminen menee läpi siirrytään welcome pagelle jne...
# Kaikki ikkunat pages kansioon
# kaikki api pyynnöt api_requests kansioon
# jwt_decrypt importattuna funktioosi palauttaa kirjautuneen käyttäjän secret.txt purettuna (userid ja fullname) 

# Pääikkuna
def create_main_window():
    window = tk.Tk()
    window.title("Login")
    
    # Ikkunalle padding
    window.config(padx=20, pady=20)

    # Käyttäjän syöttö
    tk.Label(window, text="Email:").grid(row=0, column=0, padx=10, pady=10)
    email_entry = tk.Entry(window)
    email_entry.grid(row=0, column=1, padx=10, pady=10)

    tk.Label(window, text="Password:").grid(row=1, column=0, padx=10, pady=10)
    password_entry = tk.Entry(window, show="*")
    password_entry.grid(row=1, column=1, padx=10, pady=10)

    # Kirjautumisnappi
    def on_login():
        email = email_entry.get()
        password = password_entry.get()

        if email and password:
            # Kutsutaan login-funktiota ja tarkistetaan sen paluuarvo
            success = login(email, password)
            if not success:
                messagebox.showerror("Error", "Wrong email or password. If you don't have user yet go to macrohub.com and create user")
            else:
                messagebox.showinfo("Login successful!", "Login successful!")
                
                # Sulje nykyinen ikkuna ja avaa uusi
                window.destroy()
                welcome_window() # tervetuloa ikkuna
        else:
            messagebox.showerror("Input Error", "Fill both inputs")

    login_button = tk.Button(window, text="Login", command=on_login)
    login_button.grid(row=2, column=0, columnspan=2, pady=10)

    # Käynnistä pääikkuna
    window.mainloop()

# Suorita sovellus
if __name__ == "__main__":
    create_main_window()
