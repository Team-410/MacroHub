from tkinter import ttk
from tkinter import messagebox
from ttkthemes import ThemedTk
from api_requests.macros import fetch_personal_macros
from jwt_decrypt import jwt_decrypt

def show_personal_macros(parent_window):
    """Display the user's personal macro list in a new window."""
    window = ThemedTk(theme="arc")
    window.configure(bg='black')
    window.title("My Personal Macros")

    user_data = jwt_decrypt()
    if user_data and "fullname" in user_data:
        fullname = user_data["fullname"]
    else:
        fullname = "Unknown User"
    
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
        
    # Insert macros into the Treeview
    for macro in macros_data.get('macros', []):
        tree.insert("", "end", values=(
            macro.get('macroname', 'N/A'),
            macro.get('category', 'N/A'),
            macro.get('macrotype', 'N/A')
        ))
    
    tree.pack(expand=True, fill="both", padx=20, pady=20)
    
    # Add a back button
    def on_back():
        window.destroy()
        parent_window()  # Reopen the parent window
    
    back_button = ttk.Button(window, text="Back", command=on_back)
    back_button.pack(pady=10)
    
    window.mainloop()