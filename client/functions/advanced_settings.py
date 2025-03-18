import tkinter as tk
from tkinter import ttk
from ttkthemes import ThemedTk

class AdvancedSettings:
    def __init__(self, parent, loop_var, humanization_var, persistent_keys, current_hotkey, update_hotkey_callback, update_persistent_keys):
        self.window = tk.Toplevel(parent)
        self.window.configure(bg='black')
        self.window.title("Advanced Settings")
        self.window.geometry("300x350")
        self.window.resizable(False, False)

        self.loop_var = loop_var
        self.humanization_var = humanization_var
        self.persistent_keys = persistent_keys
        self.current_hotkey = current_hotkey
        self.update_hotkey_callback = update_hotkey_callback
        self.update_persistent_keys_callback = update_persistent_keys  # Store the callback

        # Loop Macro checkbox
        self.loop_checkbox = tk.Checkbutton(self.window, text="Loop Macro", fg="white", bg="black", variable=self.loop_var)
        self.loop_checkbox.pack(pady=5)

        # Humanization checkbox
        self.humanization_checkbox = tk.Checkbutton(self.window, text="Humanization (Random Delay)", fg="white", bg="black", variable=self.humanization_var)
        self.humanization_checkbox.pack(pady=5)

        # Persistent Keys section
        tk.Label(self.window, text="Persistent Keys:", fg="white", bg="black").pack(pady=5)
        self.persistent_keys_entry = ttk.Entry(self.window, width=30)
        self.persistent_keys_entry.pack(pady=5)
        self.persistent_keys_entry.insert(0, ", ".join(self.persistent_keys))

        self.update_persistent_keys_button = ttk.Button(self.window, text="Update Persistent Keys", command=self.update_persistent_keys)
        self.update_persistent_keys_button.pack(pady=5)

        # Hotkey selection
        tk.Label(self.window, text="Hotkey:", fg="white", bg="black").pack(pady=5)
        self.hotkey_entry = ttk.Entry(self.window, width=10)
        self.hotkey_entry.pack(pady=5)
        self.hotkey_entry.insert(0, self.current_hotkey)

        self.update_hotkey_button = ttk.Button(self.window, text="Update Hotkey", command=self.update_hotkey)
        self.update_hotkey_button.pack(pady=5)

        # Close button
        self.close_button = ttk.Button(self.window, text="Close", command=self.window.destroy)
        self.close_button.pack(pady=10)

    def update_persistent_keys(self):
        """Updates the persistent keys list from advanced settings."""
        new_keys = self.persistent_keys_entry.get().split(", ")
        self.persistent_keys.clear()
        self.persistent_keys.extend(new_keys)
        
        # Call the callback function to notify the main window
        self.update_persistent_keys_callback(self.persistent_keys)

    def update_hotkey(self):
        """Updates the hotkey setting."""
        new_hotkey = self.hotkey_entry.get()
        if new_hotkey:
            self.update_hotkey_callback(new_hotkey)
