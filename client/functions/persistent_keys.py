from .key_mapping import map_key_for_display
from create_macro import *
from tkinter import messagebox

def add_persistent_key():
    key = persistent_key_entry.get()
    if not key:
        messagebox.showerror("Error", "Please enter a key.")
        return

    key = map_key_for_display(key)
    if key in persistent_keys:
        messagebox.showerror("Error", "Key already added.")
        return

    persistent_keys.append(key)
    update_persistent_keys_display()  # Update the display after adding the key

def delete_persistent_key():
    selected_key = persistent_key_dropdown.get()
    if not selected_key:
        messagebox.showerror("Error", "Please select a key to delete.")
        return

    persistent_keys.remove(selected_key)
    update_persistent_keys_display()  # Update the display after deleting the key

def update_persistent_keys_display():
    # Update the label with the current persistent keys
    persistent_keys_label.config(text=f"Persistent Keys: {', '.join(persistent_keys) if persistent_keys else 'None'}")
    
    # Update the dropdown list with the current persistent keys
    persistent_key_dropdown['values'] = persistent_keys
    
    # If there are persistent keys, select the first one by default
    if persistent_keys:
        persistent_key_dropdown.current(0)  # Set the first item as the current selection
    else:
        # If no persistent keys, clear the dropdown value
        persistent_key_dropdown.set("")