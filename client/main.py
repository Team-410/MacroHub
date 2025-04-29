import customtkinter as ctk
import json
import os
import ctypes
from tkinter import messagebox
from api_requests.login import login
from pages.personal_list import show_personal_macros

CREDENTIALS_FILE = "credentials.json"

def save_credentials(email, password):
    """Tallenna tunnukset tiedostoon"""
    with open(CREDENTIALS_FILE, "w") as file:
        json.dump({"email": email, "password": password}, file)

def load_credentials():
    """Lataa tunnukset tiedostosta, jos olemassa"""
    if os.path.exists(CREDENTIALS_FILE):
        with open(CREDENTIALS_FILE, "r") as file:
            return json.load(file)
    return {}

def create_main_window():
    
    ctk.set_appearance_mode("dark") 
    ctk.set_default_color_theme("green")

    window = ctk.CTk()
    window.title("Login")
    window.geometry("400x300")
    window.grid_columnconfigure((0, 1), weight=1)

    credentials = load_credentials()
    saved_email = credentials.get("email", "")
    saved_password = credentials.get("password", "")

    title_label = ctk.CTkLabel(window, text="Login", font=ctk.CTkFont(size=20, weight="bold"))
    title_label.grid(row=0, column=0, columnspan=2, pady=(20, 10))

    email_label = ctk.CTkLabel(window, text="Email:")
    email_label.grid(row=1, column=0, padx=10, pady=10, sticky="e")
    email_entry = ctk.CTkEntry(window, width=200)
    email_entry.grid(row=1, column=1, padx=10, pady=10, sticky="w")
    email_entry.insert(0, saved_email)

    password_label = ctk.CTkLabel(window, text="Password:")
    password_label.grid(row=2, column=0, padx=10, pady=10, sticky="e")
    password_entry = ctk.CTkEntry(window, show="*", width=200)
    password_entry.grid(row=2, column=1, padx=10, pady=10, sticky="w")
    password_entry.insert(0, saved_password)

    remember_var = ctk.BooleanVar(value=bool(saved_email))
    remember_me_checkbox = ctk.CTkCheckBox(window, text="Remember Me", variable=remember_var)
    remember_me_checkbox.grid(row=3, column=0, columnspan=2, pady=(0, 10))

    def on_login():
        email = email_entry.get()
        password = password_entry.get()

        if email and password:
            success = login(email, password)
            if not success:
                messagebox.showerror("Error", "Wrong email or password.")
            else:
                if remember_var.get():
                    save_credentials(email, password)
                else:
                    if os.path.exists(CREDENTIALS_FILE):
                        os.remove(CREDENTIALS_FILE)

                window.after(500, lambda: (window.destroy(), show_personal_macros()))
        else:
            messagebox.showerror("Input Error", "Fill both inputs")

    login_button = ctk.CTkButton(window, text="Login", command=on_login)
    login_button.grid(row=4, column=0, columnspan=2, pady=20)

    window.mainloop()

if __name__ == "__main__":
    create_main_window()
