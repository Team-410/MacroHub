from tkinter import ttk, messagebox
from ttkthemes import ThemedTk
from api_requests.macros import fetch_personal_macros
from api_requests.user import get_user_info
from pages.macropage import show_macro_details

import tkinter as tk

## testing macrohub.py
import subprocess
import os
import sys

def show_personal_macros(parent_window):
    """Display the user's personal macro list in a new window."""

    window = ThemedTk(theme="arc")
    window.configure(bg='black')
    window.title("My Personal Macros")

    user_data = get_user_info()
    fullname = user_data.get("fullname", "Unknown User") if user_data else "Unknown User"

    # Fetch macros from the backend
    macros_data = fetch_personal_macros()
    
    if not macros_data.get('success'):
        messagebox.showerror("Error", macros_data.get('error', 'Failed to load macros'))
        window.destroy()
        parent_window()  # Return to the previous window
        return

    # Title
    title_label = ttk.Label(window, text=f"Welcome back {fullname}", font=("Arial", 24, "bold"), foreground="white", background="black")
    title_label.pack(pady=(20, 10))
    
    # Create a Treeview to display the macros
    tree = ttk.Treeview(window, columns=("name", "category", "type"), show="headings")
    tree.heading("name", text="Macro Name")
    tree.heading("category", text="Category")
    tree.heading("type", text="Type")

    tree.column("name", anchor="center")
    tree.column("category", anchor="center")
    tree.column("type", anchor="center")

    # Insert macros into the Treeview with macroid as row ID
    macro_dict = {}  # Store macro data for quick lookup
    for macro in macros_data.get('macros', []):
        macroid = macro.get('macroid', 'N/A')
        macro_dict[str(macroid)] = macro  # Store macro details
        tree.insert("", "end", iid=str(macroid), values=(
            macro.get('macroname', 'N/A'),
            macro.get('category', 'N/A'),
            macro.get('macrotype', 'N/A')
        ))

    tree.pack(expand=True, fill="both", padx=20, pady=20)
    
    # Function to open macro details on row click
    def on_row_click(event):
        selected_item = tree.selection()  # Get selected row
        if selected_item:
            macroid = selected_item[0]  # The iid is macroid
            macro_data = macro_dict.get(macroid, {})  # Fetch macro data
            show_macro_details(macroid, macro_data)  # show window

    # double click to open new window
    tree.bind("<Double-1>", on_row_click)

    # Add a back button
    def on_back():
        window.destroy()
        parent_window()  # Reopen the parent window

    def run_macrohub():
        """Executes macrohub.py in the right environment"""
        script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "macrohub.py"))
        subprocess.run([sys.executable, script_path], cwd=os.path.dirname(script_path))

    # Buttons

    frame = tk.Frame(window, bg="black") 
    frame.pack(pady=10, padx=10, fill="x")

    back_button = ttk.Button(frame, text="Exit", command=on_back)
    back_button.grid(row=0, column=0, sticky="ew", padx=5)

    new_macro_button = ttk.Button(frame, text="New Macro", command=run_macrohub)
    new_macro_button.grid(row=0, column=1, sticky="ew", padx=5)

    frame.columnconfigure((0, 1), weight=1)


    window.mainloop()
