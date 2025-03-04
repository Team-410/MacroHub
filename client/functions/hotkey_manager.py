from tkinter import ttk, messagebox

class HotkeyManager:
    def __init__(self, parent, current_hotkey, change_hotkey_callback):
        self.current_hotkey = current_hotkey
        self.change_hotkey_callback = change_hotkey_callback
        self.setup_hotkey_section(parent)

    def setup_hotkey_section(self, parent):
        self.hotkey_frame = ttk.Frame(parent)
        self.hotkey_frame.pack(pady=10, padx=10, anchor="ne")

        self.hotkey_label = ttk.Label(self.hotkey_frame, text=f"Current Hotkey: {self.current_hotkey}")
        self.hotkey_label.grid(row=0, column=0, padx=5, pady=5)

        ttk.Label(self.hotkey_frame, text="Change Hotkey:").grid(row=1, column=0, padx=5, pady=5)
        self.hotkey_entry = ttk.Entry(self.hotkey_frame, width=10)
        self.hotkey_entry.grid(row=1, column=1, padx=5, pady=5)

        self.change_hotkey_button = ttk.Button(self.hotkey_frame, text="Change", command=self.change_hotkey)
        self.change_hotkey_button.grid(row=1, column=2, padx=5, pady=5)

    def change_hotkey(self):
        new_hotkey = self.hotkey_entry.get()
        if len(new_hotkey) == 1 and new_hotkey.isprintable():
            self.change_hotkey_callback(new_hotkey.upper())
            messagebox.showinfo("Hotkey Changed", f"Hotkey changed to {new_hotkey.upper()}.")
        else:
            messagebox.showerror("Error", "Please enter a single printable character.")

    def update_hotkey_label(self, new_hotkey):
        self.hotkey_label.config(text=f"Current Hotkey: {new_hotkey}")