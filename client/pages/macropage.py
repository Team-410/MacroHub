from tkinter import ttk
from ttkthemes import ThemedTk
import tkinter as tk

def show_macro_details(macroid, macro_data):

    """Open a new window displaying macro details."""
    details_window = ThemedTk(theme="arc")
    details_window.configure(bg='black')
    details_window.title(f"Macro Details - {macro_data['macroname']}")

    # Tree view
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
        ("Desciption", macro_data.get("macrodescription", "N/A")),
        ("Macro", macro_data.get("macro", "N/A")),
    ]

    for field, value in data:
        tree.insert("", "end", values=(field, value))

    tree.pack(padx=50, pady=50, expand=True, fill="both")

    frame = tk.Frame(details_window, bg="black") 
    frame.pack(pady=10, padx=10, fill="x")

    ttk.Button(frame, text="Close", command=details_window.destroy).grid(row=0, column=0, sticky="ew", padx=5)
    ttk.Button(frame, text="Edit", command=details_window.destroy).grid(row=0, column=1, sticky="ew", padx=5)
    ttk.Button(frame, text="Run", command=details_window.destroy).grid(row=0, column=2, sticky="ew", padx=5)

    frame.columnconfigure((0, 1, 2), weight=1)


    details_window.mainloop()
