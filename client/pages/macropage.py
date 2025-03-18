from tkinter import ttk
from ttkthemes import ThemedTk
import tkinter as tk
from functions.main_window import MainWindow
import json

def show_macro_details(macroid, macro_data):
    """Open a new window displaying macro details."""
    details_window = ThemedTk(theme="arc")
    details_window.configure(bg='black')
    details_window.title(f"Macro Details - {macro_data['macroname']}")

    details_window.columnconfigure(0, weight=1)
    details_window.rowconfigure(0, weight=1)

    # Treeview
    tree = ttk.Treeview(details_window, columns=("Field", "Value"), show="headings")
    tree.heading("Field", text="Field", anchor="center")
    tree.heading("Value", text="Value", anchor="center")

    tree.column("Field", anchor="center", width=150)
    tree.column("Value", anchor="center", width=250)

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
        tree.insert("", "end", values=(field, value))

    tree.grid(row=0, column=0, padx=50, pady=50, sticky="nsew")

    # Frame for buttons
    frame = tk.Frame(details_window, bg="black")
    frame.grid(row=1, column=0, padx=10, pady=10, sticky="ew")
    frame.columnconfigure((0, 1, 2), weight=1)

    def run_macro():
        try:
            macro_data = dict(data)
            macro_json = json.loads(macro_data.get('Macro', '{}'))

            macro_steps = macro_json.get("macro_steps", [])
            persistent_keys = macro_json.get("persistent_keys", [])

            app = MainWindow(macro_steps=macro_steps, persistent_keys=persistent_keys)
            app.run()

        except json.JSONDecodeError:
            print("Error: Failed to parse macro JSON")

    ttk.Button(frame, text="Close", command=details_window.destroy).grid(row=0, column=0, sticky="ew", padx=5)
    ttk.Button(frame, text="Edit", command=details_window.destroy).grid(row=0, column=1, sticky="ew", padx=5)
    ttk.Button(frame, text="Run", command=run_macro).grid(row=0, column=2, sticky="ew", padx=5)

    details_window.mainloop()

