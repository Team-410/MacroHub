import customtkinter as ctk
import json
from functions.main_window import MainWindow

def show_macro_details(macroid, macro_data):
    """Open a new window displaying macro details using customtkinter."""
    
    ctk.set_appearance_mode("dark")
    ctk.set_default_color_theme("green")

    details_window = ctk.CTk()
    details_window.title(f"Macro Details - {macro_data.get('macroname', 'N/A')}")
    details_window.geometry("700x500")
    details_window.grid_columnconfigure(0, weight=1)
    details_window.grid_rowconfigure(0, weight=1)

    # Treeview korvaava komponentti (CTkTextbox) – ei ole suoraa treeviewiä
    info_box = ctk.CTkTextbox(details_window, height=300, font=("Consolas", 13))
    info_box.grid(row=0, column=0, padx=20, pady=20, sticky="nsew")


    data = [
        ("Macro ID", macroid),
        ("Name", macro_data.get("macroname", "N/A")),
        ("Category", macro_data.get("category", "N/A")),
        ("Type", macro_data.get("macrotype", "N/A")),
        ("Activation key", macro_data.get("activation_key", "N/A")),
        ("Description", macro_data.get("macrodescription", "N/A")),
        ("Macro", macro_data.get("macro", "N/A")),
    ]

    for field, value in data:
        info_box.insert("end", f"{field}: {value}\n\n")
    info_box.configure(state="disabled")

    button_frame = ctk.CTkFrame(details_window)
    button_frame.grid(row=1, column=0, padx=20, pady=10, sticky="ew")
    button_frame.grid_columnconfigure((0, 1, 2), weight=1)

    def run_macro():
        try:
            macro_data_dict = dict(data)
            macro_json = json.loads(macro_data_dict.get("Macro", "{}"))
            macro_steps = macro_json.get("macro_steps", [])
            persistent_keys = macro_json.get("persistent_keys", [])
            app = MainWindow(macro_steps=macro_steps, persistent_keys=persistent_keys)
            app.run()
        except json.JSONDecodeError:
            print("Error: Failed to parse macro JSON")

    ctk.CTkButton(button_frame, text="Close", command=details_window.destroy).grid(row=0, column=0, padx=10, sticky="ew")
    ctk.CTkButton(button_frame, text="Open", command=run_macro).grid(row=0, column=2, padx=10, sticky="ew")

    details_window.mainloop()
