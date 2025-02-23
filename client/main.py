from tkinter import *
from tkinter import ttk    
import tkinter as tk
from tkinter import messagebox
import json
import os
from api_requests.login import login
from pages.personal_list import show_personal_macros
from ttkthemes import ThemedTk

# Tiedoston nimi, johon tallennetaan käyttäjätiedot
CREDENTIALS_FILE = "credentials.json"

def save_credentials(email, password):
    """Tallentaa käyttäjätunnukset tiedostoon."""
    with open(CREDENTIALS_FILE, "w") as file:
        json.dump({"email": email, "password": password}, file)

def load_credentials():
    """Lataa tallennetut käyttäjätunnukset, jos ne löytyvät."""
    if os.path.exists(CREDENTIALS_FILE):
        with open(CREDENTIALS_FILE, "r") as file:
            return json.load(file)
    return {}

def create_main_window():
    window = ThemedTk(theme="arc")
    window.configure(bg='black')
    window.title("Login")
    window.config(padx=100, pady=80)

    # Load credentials
    credentials = load_credentials()
    saved_email = credentials.get("email", "")
    saved_password = credentials.get("password", "")

    # Email
    tk.Label(window, text="Email:", fg='white', bg='black').grid(row=0, column=0, padx=10, pady=10)
    email_entry = ttk.Entry(window)
    email_entry.grid(row=0, column=1, padx=10, pady=10)
    email_entry.insert(0, saved_email)

    # Password
    tk.Label(window, text="Password:", fg='white', bg='black').grid(row=1, column=0, padx=10, pady=10)
    password_entry = ttk.Entry(window, show="*")
    password_entry.grid(row=1, column=1, padx=10, pady=10)
    password_entry.insert(0, saved_password)

    # Remember Me -checkbox
    remember_var = tk.BooleanVar(value=bool(saved_email))
    remember_me_checkbox = tk.Checkbutton(
        window, 
        text="Remember Me", 
        variable=remember_var, 
        bg="black",    
        fg="white",     
        selectcolor="black", 
        activebackground="black",
        activeforeground="white"
    )
    remember_me_checkbox.grid(row=2, column=0, columnspan=2, pady=5)


    def on_login():
        email = email_entry.get()
        password = password_entry.get()

        if email and password:
            success = login(email, password)
            if not success:
                messagebox.showerror("Error", "Wrong email or password.")
            else:
                # save credentials
                if remember_var.get():
                    save_credentials(email, password)
                else:
                    if os.path.exists(CREDENTIALS_FILE):
                        os.remove(CREDENTIALS_FILE)  # delete credentials

                window.destroy()
                show_personal_macros(window)
        else:
            messagebox.showerror("Input Error", "Fill both inputs")

    # Login-button
    login_button = ttk.Button(window, text="Login", command=on_login)
    login_button.grid(row=3, column=0, columnspan=2, pady=10)

    window.mainloop()

# Suorita sovellus
if __name__ == "__main__":
    create_main_window()
