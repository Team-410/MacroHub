from tkinter import ttk, messagebox
from ttkthemes import ThemedTk
from api_requests.macros import fetch_personal_macros
from api_requests.user import get_user_info
from pages.macropage import show_macro_details
from functions.main_window import MainWindow

import tkinter as tk

def show_personal_macros(parent_window):
    """Display the user's personal macro list in a new window."""

    global window
    window = ThemedTk(theme="arc")
    window.configure(bg='black')
    window.title("My Personal Macros")

    user_data = get_user_info()
    fullname = user_data.get("fullname", "Unknown User") if user_data else "Unknown User"

    # Fetch macros from the backend
    macros_data = fetch_personal_macros()

    # Varmistetaan, että macros_data on sanakirja
    if not isinstance(macros_data, dict):
        macros_data = {"success": False, "macros": [], "error": "Data format error"}

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
    macro_dict = {} 
    for macro in macros_data["macros"]: 
        macroid = macro.get('macroid', 'N/A')
        macro_dict[str(macroid)] = macro 
        tree.insert("", "end", iid=str(macroid), values=(
            macro.get('macroname', 'N/A'),
            macro.get('category', 'N/A'),
            macro.get('macrotype', 'N/A')
        ))

    tree.pack(expand=True, fill="both", padx=20, pady=20)
    
    # Function to open macro details on row click
    def on_row_click(event):
        selected_item = tree.selection() 
        if selected_item:
            macroid = selected_item[0]  
            macro_data = macro_dict.get(macroid, {})  
            show_macro_details(macroid, macro_data)  

    # double click to open new window
    tree.bind("<Double-1>", on_row_click)


    def reload():
        window.destroy()
        show_personal_macros(parent_window)  

    def run_macrohub():
        print("run macrohub")
        app = MainWindow()
        app.run()

    # Buttons

    frame = tk.Frame(window, bg="black") 
    frame.pack(pady=10, padx=10, fill="x")

    back_button = ttk.Button(frame, text="Reload", command=reload)
    back_button.grid(row=0, column=0, sticky="ew", padx=5)

    new_macro_button = ttk.Button(frame, text="New Macro", command=run_macrohub)
    new_macro_button.grid(row=0, column=1, sticky="ew", padx=5)

    frame.columnconfigure((0, 1), weight=1)

    # show message when page is loaded
    if not macros_data.get('success'):
        messagebox.showinfo("Info", macros_data.get('error', ''))
        #macros_data["macros"] = []


    window.mainloop()
