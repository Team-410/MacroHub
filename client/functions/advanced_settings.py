import tkinter as tk
import customtkinter as ctk
import winsound
from tkinter import messagebox

class AdvancedSettings:
    def __init__(self, parent, loop_var, humanization_var, persistent_keys, current_hotkey, update_hotkey_callback, update_persistent_keys_callback):
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
        self.update_persistent_keys_callback = update_persistent_keys_callback

        main_frame = ctk.CTkFrame(self.window)
        main_frame.grid(row=0, column=0, sticky="nsew", padx=50, pady=50)

        self.loop_checkbox = ctk.CTkCheckBox(main_frame, text="Loop Macro", variable=self.loop_var)
        self.loop_checkbox.grid(row=0, column=0, columnspan=3, sticky="w", pady=5)

        self.humanization_checkbox = ctk.CTkCheckBox(main_frame, text="Humanization (Random Delay)", variable=self.humanization_var)
        self.humanization_checkbox.grid(row=1, column=0, columnspan=3, sticky="w", pady=5)

        # --- Persistent Keys Section ---
        ctk.CTkLabel(main_frame, text="Persistent Keys:").grid(row=2, column=0, sticky="w", pady=(10, 0))
        self.persistent_keys_label = ctk.CTkLabel(main_frame, text=", ".join(self.persistent_keys) if self.persistent_keys else "None", anchor="w")
        self.persistent_keys_label.grid(row=2, column=1, columnspan=2, sticky="w", pady=(10, 0))


        ctk.CTkLabel(main_frame, text="Add Persistent Key:").grid(row=3, column=0, sticky="w")
        self.persistent_key_entry = ctk.CTkEntry(main_frame, width=80)
        self.persistent_key_entry.grid(row=3, column=1, pady=5)
        ctk.CTkButton(main_frame, text="Add", command=self.add_persistent_key).grid(row=3, column=2, padx=5)

        ctk.CTkLabel(main_frame, text="Delete Persistent Key:").grid(row=4, column=0, sticky="w")
        self.persistent_key_dropdown_var = tk.StringVar()
        self.persistent_key_dropdown = ctk.CTkOptionMenu(main_frame, variable=self.persistent_key_dropdown_var, values=self.persistent_keys or [""])
        self.persistent_key_dropdown.grid(row=4, column=1, pady=5, sticky="ew")
        ctk.CTkButton(main_frame, text="Delete", command=self.delete_persistent_key).grid(row=4, column=2, padx=5)

        ctk.CTkLabel(main_frame, text="Hotkey:").grid(row=5, column=0, sticky="w", pady=(15, 5))
        self.hotkey_entry = ctk.CTkEntry(main_frame, width=80)
        self.hotkey_entry.grid(row=5, column=1, pady=5)
        self.hotkey_entry.insert(0, self.current_hotkey)

        self.update_hotkey_button = ctk.CTkButton(main_frame, text="Update Hotkey", command=self.update_hotkey)
        self.update_hotkey_button.grid(row=5, column=2, padx=5)

        self.close_button = ctk.CTkButton(main_frame, text="Close", command=self.window.destroy)
        self.close_button.grid(row=6, column=0, columnspan=3, pady=15, sticky="ew")

        main_frame.columnconfigure(1, weight=1)
        self.update_persistent_keys_display()

    def add_persistent_key(self):
        key = self.persistent_key_entry.get().strip()
        if not key:
            messagebox.showerror("Error", "Please enter a key.")
            return
        if key in self.persistent_keys:
            messagebox.showerror("Error", "Key already exists.")
            return

        self.persistent_keys.append(key)
        self.update_persistent_keys()
        self.persistent_key_entry.delete(0, tk.END)

    def delete_persistent_key(self):
        selected_key = self.persistent_key_dropdown_var.get()
        if not selected_key or selected_key not in self.persistent_keys:
            messagebox.showerror("Error", "Please select a valid key to delete.")
            return

        self.persistent_keys.remove(selected_key)
        self.update_persistent_keys()

    def update_persistent_keys(self):
        """Call the callback and refresh UI elements."""
        self.update_persistent_keys_callback(self.persistent_keys)
        self.update_persistent_keys_display()

    def update_persistent_keys_display(self):
        self.persistent_keys_label.configure(
            text=", ".join(self.persistent_keys) if self.persistent_keys else "None"
        )
        self.persistent_key_dropdown.configure(
            values=self.persistent_keys or [""]
        )
        if self.persistent_keys:
            self.persistent_key_dropdown_var.set(self.persistent_keys[0])
        else:
            self.persistent_key_dropdown_var.set("")

    def update_hotkey(self):
        new_hotkey = self.hotkey_entry.get().strip()
        if new_hotkey:
            self.update_hotkey_callback(new_hotkey)
