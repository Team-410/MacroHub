from tkinter import *
from tkinter import ttk    
import tkinter as tk
from tkinter import messagebox
from api_requests.login import login
from pages.welcome import welcome_window
from ttkthemes import ThemedTk

def create_main_window():
    
    window = ThemedTk(theme="arc")
    window.title("Login")
    
    window.config(padx=50, pady=50)

    tk.Label(window, text="Email:").grid(row=0, column=0, padx=10, pady=10)
    email_entry = ttk.Entry(window)
    email_entry.grid(row=0, column=1, padx=10, pady=10)

    tk.Label(window, text="Password:").grid(row=1, column=0, padx=10, pady=10)
    password_entry = ttk.Entry(window, show="*")
    password_entry.grid(row=1, column=1, padx=10, pady=10)

    def on_login():
        email = email_entry.get()
        password = password_entry.get()

        if email and password:
            success = login(email, password)
            if not success:
                messagebox.showerror("Error", "Wrong email or password.")
            else:
                messagebox.showinfo("Login successful!", "Login successful!")
                window.destroy()
                welcome_window()
        else:
            messagebox.showerror("Input Error", "Fill both inputs")

    login_button = ttk.Button(window, text="Login", command=on_login)
    login_button.grid(row=2, column=0, columnspan=2, pady=10)

    window.mainloop()

# Suorita sovellus
if __name__ == "__main__":
    create_main_window()
