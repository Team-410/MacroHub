import customtkinter as ctk
from tkinter import messagebox
from api_requests.macros import fetch_personal_macros
from api_requests.user import get_user_info
from pages.macropage import show_macro_details
from functions.main_window import MainWindow

def show_personal_macros(parent_window=None):
    """Display the user's personal macro list in a new CTk window."""
    ctk.set_appearance_mode("dark") 
    ctk.set_default_color_theme("green")

    window = ctk.CTk()
    window.title("My Personal Macros")
    window.geometry("850x500")

    user_data = get_user_info()
    fullname = user_data.get("fullname", "Unknown User") if user_data else "Unknown User"

    macros_data = fetch_personal_macros()
    if not isinstance(macros_data, dict):
        macros_data = {"success": False, "macros": [], "error": "Data format error"}

    title_label = ctk.CTkLabel(window, text=f"Welcome back {fullname}", font=ctk.CTkFont(size=24, weight="bold"))
    title_label.pack(pady=(20, 10))

    macro_frame = ctk.CTkScrollableFrame(window, width=0, height=0)
    macro_frame.pack(padx=20, pady=10, fill="both", expand=True)


    header_font = ctk.CTkFont(size=16, weight="bold")
    ctk.CTkLabel(macro_frame, text="Macro Name", font=header_font, width=200).grid(row=0, column=0, padx=10, pady=5)
    ctk.CTkLabel(macro_frame, text="Category", font=header_font, width=200).grid(row=0, column=1, padx=10, pady=5)
    ctk.CTkLabel(macro_frame, text="Type", font=header_font, width=200).grid(row=0, column=2, padx=10, pady=5)

    macro_dict = {}
    for i, macro in enumerate(macros_data["macros"], start=1):
        macroid = macro.get('macroid', 'N/A')
        macro_dict[str(macroid)] = macro

        ctk.CTkLabel(macro_frame, text=macro.get('macroname', 'N/A')).grid(row=i, column=0, padx=10, pady=5)
        ctk.CTkLabel(macro_frame, text=macro.get('category', 'N/A')).grid(row=i, column=1, padx=10, pady=5)
        ctk.CTkLabel(macro_frame, text=macro.get('macrotype', 'N/A')).grid(row=i, column=2, padx=10, pady=5)

        view_btn = ctk.CTkButton(macro_frame, text="View", width=80,
                                 command=lambda m_id=macroid, m_data=macro: show_macro_details(m_id, m_data))
        view_btn.grid(row=i, column=3, padx=10, pady=5)

    def reload():
        """Reload the macro list after re-fetching the data."""
        window.after(100, lambda: (window.destroy(), show_personal_macros(parent_window)))

    def run_macrohub():
        """Run the MacroHub to create a new macro."""
        app = MainWindow()
        app.run()

    button_frame = ctk.CTkFrame(window)
    button_frame.pack(padx=20, pady=10, fill="x")

    reload_button = ctk.CTkButton(button_frame, text="Reload", command=reload)
    reload_button.pack(side="left", expand=True, fill="x", padx=10)

    new_macro_button = ctk.CTkButton(button_frame, text="New Macro", command=run_macrohub)
    new_macro_button.pack(side="right", expand=True, fill="x", padx=10)

    if not macros_data.get('success'):
        messagebox.showinfo("Error", macros_data.get('error', 'Failed to fetch macros'))

    window.mainloop()
