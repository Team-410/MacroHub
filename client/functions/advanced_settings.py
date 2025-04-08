import tkinter as tk
import customtkinter as ctk
import winsound

class AdvancedSettings:
    def __init__(self, parent, loop_var, humanization_var, persistent_keys, current_hotkey, update_hotkey_callback, update_persistent_keys):
        self.window = ctk.CTkToplevel(parent)
        self.window.transient(parent)     
        self.window.grab_set()             
        self.window.focus_force()          
        self.window.lift()
        self.window.title("Advanced Settings")

        winsound.MessageBeep()

        self.loop_var = loop_var
        self.humanization_var = humanization_var
        self.persistent_keys = persistent_keys
        self.current_hotkey = current_hotkey
        self.update_hotkey_callback = update_hotkey_callback
        self.update_persistent_keys_callback = update_persistent_keys

        main_frame = ctk.CTkFrame(self.window)
        main_frame.grid(row=0, column=0, sticky="nsew", padx=50, pady=50)

        self.loop_checkbox = ctk.CTkCheckBox(main_frame, text="Loop Macro", variable=self.loop_var)
        self.loop_checkbox.grid(row=0, column=0, columnspan=2, sticky="w", pady=5)

        self.humanization_checkbox = ctk.CTkCheckBox(main_frame, text="Humanization (Random Delay)", variable=self.humanization_var)
        self.humanization_checkbox.grid(row=1, column=0, columnspan=2, sticky="w", pady=5)

        ctk.CTkLabel(main_frame, text="Persistent Keys:").grid(row=2, column=0, sticky="w", pady=5)
        self.persistent_keys_entry = ctk.CTkEntry(main_frame, width=80)
        self.persistent_keys_entry.grid(row=2, column=1, pady=5)
        self.persistent_keys_entry.insert(0, ", ".join(self.persistent_keys))

        self.update_persistent_keys_button = ctk.CTkButton(main_frame, text="Update", command=self.update_persistent_keys)
        self.update_persistent_keys_button.grid(row=2, column=2, padx=5, pady=5)

        ctk.CTkLabel(main_frame, text="Hotkey:").grid(row=3, column=0, sticky="w", pady=5)
        self.hotkey_entry = ctk.CTkEntry(main_frame, width=80)
        self.hotkey_entry.grid(row=3, column=1, pady=5)
        self.hotkey_entry.insert(0, self.current_hotkey)

        self.update_hotkey_button = ctk.CTkButton(main_frame, text="Update", command=self.update_hotkey)
        self.update_hotkey_button.grid(row=3, column=2, padx=5, pady=5)

        self.close_button = ctk.CTkButton(main_frame, text="Close", command=self.window.destroy)
        self.close_button.grid(row=4, column=0, columnspan=3, pady=15, sticky="ew")

        main_frame.columnconfigure(1, weight=1)

    def update_persistent_keys(self):
        """Updates the persistent keys list from advanced settings."""
        new_keys = self.persistent_keys_entry.get().split(", ")
        self.persistent_keys.clear()
        self.persistent_keys.extend(new_keys)
        
        self.update_persistent_keys_callback(self.persistent_keys)

    def update_hotkey(self):
        """Updates the hotkey setting."""
        new_hotkey = self.hotkey_entry.get()
        if new_hotkey:
            self.update_hotkey_callback(new_hotkey)
