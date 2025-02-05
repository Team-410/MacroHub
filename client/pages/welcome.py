from jwt_decrypt import jwt_decrypt
from ttkthemes import ThemedTk
from tkinter import ttk

def welcome_window():
    user_data = jwt_decrypt()

    if user_data and "fullname" in user_data:
        fullname = user_data["fullname"]
    else:
        fullname = "Unknown User"

    welcome_window = ThemedTk(theme="arc")
    welcome_window.title("Welcome")

    welcome_window.config(padx=50, pady=50)

    welcome_label = ttk.Label(welcome_window, text=f"Welcome, {fullname}!", font=("Arial", 24))
    welcome_label.pack(padx=20, pady=20)

    # Käytetään ttk.Button sen sijaan, että käytetään tk.Button
    close_button = ttk.Button(welcome_window, text="Close", command=welcome_window.quit)
    close_button.pack(pady=10)

    welcome_window.mainloop()

