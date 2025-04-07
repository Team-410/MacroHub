import tkinter as tk
import customtkinter as ctk

from api_requests.save_macro_api import save_macro
from functions.macro_runner import MacroRunner

def add_details(macro: MacroRunner):
    macrodict = macro.to_dict()

    if not macrodict["macro_steps"] and not macrodict["persistent_keys"]:
        error_window = ctk.CTk()
        error_window.title("Error")
        error_window.geometry("300x150")

        error_label = ctk.CTkLabel(error_window, text="Can't save empty macro...", font=("Arial", 14))
        error_label.pack(pady=30)

        close_button = ctk.CTkButton(error_window, text="Close", command=error_window.destroy)
        close_button.pack()

        error_window.mainloop()
        return

    ctk.set_appearance_mode("dark")
    ctk.set_default_color_theme("green")

    details_window = ctk.CTk()
    details_window.title("Macro Details")
    details_window.geometry("700x500")

    details_window.grid_columnconfigure(0, weight=1)
    details_window.grid_columnconfigure(1, weight=2)

    title_frame = ctk.CTkFrame(details_window)
    title_frame.grid(row=0, column=0, columnspan=2, padx=20, pady=10, sticky="ew")

    title_label = ctk.CTkLabel(title_frame, text="Macro Details", font=("Arial", 18, "bold"), anchor="center")
    title_label.grid(row=0, column=0, padx=20, pady=10)

    form_frame = ctk.CTkFrame(details_window)
    form_frame.grid(row=1, column=0, columnspan=2, padx=20, pady=10, sticky="ew")
    form_frame.grid_columnconfigure(1, weight=1)

    macro_name_label = ctk.CTkLabel(form_frame, text="Macro Name:")
    macro_name_label.grid(row=0, column=0, padx=20, pady=10, sticky="w")
    macro_name_entry = ctk.CTkEntry(form_frame)
    macro_name_entry.grid(row=0, column=1, padx=20, pady=10, sticky="ew")

    macro_description_label = ctk.CTkLabel(form_frame, text="Macro Description:")
    macro_description_label.grid(row=1, column=0, padx=20, pady=10, sticky="w")
    macro_description_entry = ctk.CTkEntry(form_frame)
    macro_description_entry.grid(row=1, column=1, padx=20, pady=10, sticky="ew")

    app_label = ctk.CTkLabel(form_frame, text="App:")
    app_label.grid(row=2, column=0, padx=20, pady=10, sticky="w")
    app_entry = ctk.CTkEntry(form_frame)
    app_entry.grid(row=2, column=1, padx=20, pady=10, sticky="ew")

    category_label = ctk.CTkLabel(form_frame, text="Category:")
    category_label.grid(row=3, column=0, padx=20, pady=10, sticky="w")
    category_entry = ctk.CTkEntry(form_frame)
    category_entry.grid(row=3, column=1, padx=20, pady=10, sticky="ew")

    macro_type_label = ctk.CTkLabel(form_frame, text="Macro Type:")
    macro_type_label.grid(row=4, column=0, padx=20, pady=10, sticky="w")
    macro_type_entry = ctk.CTkOptionMenu(form_frame, values=["loop", "single"])
    macro_type_entry.grid(row=4, column=1, padx=20, pady=10, sticky="ew")

    button_frame = ctk.CTkFrame(details_window)
    button_frame.grid(row=2, column=0, columnspan=2, padx=20, pady=10, sticky="ew")

    def save_and_close():
        if not all([
            macro_name_entry.get().strip(),
            macro_description_entry.get().strip(),
            app_entry.get().strip(),
            category_entry.get().strip(),
            macro_type_entry.get().strip()
        ]):
            error_window = ctk.CTk()
            error_window.title("Error")
            error_window.geometry("300x150")

            error_label = ctk.CTkLabel(error_window, text="Fill in all fields!", font=("Arial", 14))
            error_label.pack(pady=30)

            close_button = ctk.CTkButton(error_window, text="Close", command=error_window.destroy)
            close_button.pack()

            error_window.mainloop()
            return

        macro_object = {
            "macroname": macro_name_entry.get(),
            "macrodescription": macro_description_entry.get(),
            "app": app_entry.get(),
            "category": category_entry.get(),
            "macrotype": macro_type_entry.get(),
            "macro": macrodict
        }

        save_macro(macro_object)
        details_window.destroy()

    save_button = ctk.CTkButton(button_frame, text="Save and Close", command=save_and_close)
    save_button.grid(row=0, column=0, padx=20, pady=10, sticky="ew")

    close_button = ctk.CTkButton(button_frame, text="Close", command=details_window.destroy)
    close_button.grid(row=0, column=1, padx=20, pady=10, sticky="ew")

    details_window.mainloop()
