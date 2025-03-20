import tkinter as tk
from tkinter import ttk

class AdvancedSettings:
    def __init__(self, parent, loop_var, humanization_var, persistent_keys, current_hotkey, update_hotkey_callback, update_persistent_keys):
        self.window = tk.Toplevel(parent)
        self.window.configure(bg='black')
        self.window.title("Advanced Settings")

        self.loop_var = loop_var
        self.humanization_var = humanization_var
        self.persistent_keys = persistent_keys
        self.current_hotkey = current_hotkey
        self.update_hotkey_callback = update_hotkey_callback
        self.update_persistent_keys_callback = update_persistent_keys

        # Pääkehys grid-asettelulla
        main_frame = ttk.Frame(self.window, padding=10)
        main_frame.grid(row=0, column=0, sticky="nsew")

        # Loop Macro -valintaruutu
        self.loop_checkbox = ttk.Checkbutton(main_frame, text="Loop Macro", variable=self.loop_var)
        self.loop_checkbox.grid(row=0, column=0, columnspan=2, sticky="w", pady=5)

        # Humanization -valintaruutu
        self.humanization_checkbox = ttk.Checkbutton(main_frame, text="Humanization (Random Delay)", variable=self.humanization_var)
        self.humanization_checkbox.grid(row=1, column=0, columnspan=2, sticky="w", pady=5)

        # Persistent Keys -kenttä
        ttk.Label(main_frame, text="Persistent Keys:").grid(row=2, column=0, sticky="w", pady=5)
        self.persistent_keys_entry = ttk.Entry(main_frame, width=30)
        self.persistent_keys_entry.grid(row=2, column=1, pady=5)
        self.persistent_keys_entry.insert(0, ", ".join(self.persistent_keys))

        self.update_persistent_keys_button = ttk.Button(main_frame, text="Update", command=self.update_persistent_keys)
        self.update_persistent_keys_button.grid(row=2, column=2, padx=5, pady=5)

        # Hotkey-kenttä
        ttk.Label(main_frame, text="Hotkey:").grid(row=3, column=0, sticky="w", pady=5)
        self.hotkey_entry = ttk.Entry(main_frame, width=15)
        self.hotkey_entry.grid(row=3, column=1, pady=5)
        self.hotkey_entry.insert(0, self.current_hotkey)

        self.update_hotkey_button = ttk.Button(main_frame, text="Update", command=self.update_hotkey)
        self.update_hotkey_button.grid(row=3, column=2, padx=5, pady=5)

        # Close-painike
        self.close_button = ttk.Button(main_frame, text="Close", command=self.window.destroy)
        self.close_button.grid(row=4, column=0, columnspan=3, pady=15, sticky="ew")

        # Tehdään sarakkeista joustavia
        main_frame.columnconfigure(1, weight=1)
    
    def update_persistent_keys(self):
        """Updates the persistent keys list from advanced settings."""
        new_keys = self.persistent_keys_entry.get().split(", ")
        self.persistent_keys.clear()
        self.persistent_keys.extend(new_keys)
        
        # Ilmoitetaan pääikkunalle päivityksestä
        self.update_persistent_keys_callback(self.persistent_keys)

    def update_hotkey(self):
        """Updates the hotkey setting."""
        new_hotkey = self.hotkey_entry.get()
        if new_hotkey:
            self.update_hotkey_callback(new_hotkey)
