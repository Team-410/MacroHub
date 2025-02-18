import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json
import os
from .key_mapping import map_key_for_display
from .macro_operations import run_macro
from create_macro import *

# Add macro step to the table
def add_step():
    keys = key_entry.get()
    hold_time = hold_time_entry.get()
    if not keys or not hold_time:
        messagebox.showerror("Error", "Both fields are required.")
        return

    try:
        float(hold_time)  # Validate hold time
        macro_steps.append({'keys': map_key_for_display(keys), 'hold_time': hold_time})
        update_table()
    except ValueError:
        messagebox.showerror("Error", "Hold time must be a number.")

# Update the table display
def update_table():
    for row in table.get_children():
        table.delete(row)
    for i, step in enumerate(macro_steps):
        table.insert("", "end", values=(i + 1, step['keys'], step['hold_time']))

# Delete selected step
def delete_step():
    selected_item = table.selection()
    if not selected_item:
        messagebox.showerror("Error", "Select a step to delete.")
        return

    index = table.index(selected_item[0])
    del macro_steps[index]
    update_table()

# Save macro to a file
def save_macro():
    # Ask user for the filename
    filename = filedialog.asksaveasfilename(defaultextension=".json", filetypes=[("JSON files", "*.json")])
    if filename:
        # Create a dictionary containing the steps and persistent keys
        macro_data = {
            "steps": macro_steps,
            "persistent_keys": persistent_keys
        }
        try:
            with open(filename, "w") as file:
                json.dump(macro_data, file)
            messagebox.showinfo("Saved", f"Macro saved to {filename}.")
        except Exception as e:
            messagebox.showerror("Error", f"Error saving macro: {e}")

# Load macro from a file
def load_macro():
    global macro_steps, persistent_keys, macroName

    # Ask user for the filename
    filename = filedialog.askopenfilename(defaultextension=".json", filetypes=[("JSON files", "*.json")])
    macroName_extention = os.path.basename(filename)
    macroName = os.path.splitext(macroName_extention)[0]
    if filename:
        try:
            with open(filename, "r") as file:
                macro_data = json.load(file)
                macro_steps = macro_data.get("steps", [])
                persistent_keys = macro_data.get("persistent_keys", [])
            update_table()
            update_persistent_keys_display()
            messagebox.showinfo("Loaded", f"Macro loaded from {filename}.")
        except Exception as e:
            messagebox.showerror("Error", f"Error loading macro: {e}")