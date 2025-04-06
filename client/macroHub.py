import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json
import threading
from pynput import keyboard
from pynput.keyboard import Controller, Key
import time
import random
import os

# Function to map key names for user display
def map_key_for_display(key):
    special_keys = {
        " ": "Spacebar",
        Key.enter: "Enter",
        Key.tab: "Tab",
        Key.esc: "Escape",
        Key.shift: "Shift",
        Key.ctrl: "Ctrl",
        Key.alt: "Alt",
        Key.backspace: "Backspace",
    }
    return special_keys.get(key, key)

# Function to map user-friendly key names back to functional keys
def map_display_to_key(display_name):
    reverse_special_keys = {
        "Spacebar": " ",
        "Enter": Key.enter,
        "Tab": Key.tab,
        "Escape": Key.esc,
        "Shift": Key.shift,
        "Ctrl": Key.ctrl,
        "Alt": Key.alt,
        "Backspace": Key.backspace,
    }
    return reverse_special_keys.get(display_name, display_name)

# Function to run the macro with Looping and Humanization
def run_macro(steps, persistent_keys, stop_event, loop=False, humanization=False):
    keyboard_controller = Controller()
    persistent_keys_pressed = []
    try:
        # Press all persistent keys
        for key in persistent_keys:
            actual_key = map_display_to_key(key)
            keyboard_controller.press(actual_key)
            persistent_keys_pressed.append(actual_key)

        while True:
            if stop_event.is_set():  # Stop the macro if the event is triggered
                break

            # Run through macro steps
            for step in steps:
                if stop_event.is_set():  # Stop the macro if the event is triggered
                    break

                keys = map_display_to_key(step['keys'])
                hold_time = float(step['hold_time'])

                # Simulate keystrokes
                if isinstance(keys, str):
                    for char in keys:
                        keyboard_controller.press(char)
                        time.sleep(hold_time)
                        keyboard_controller.release(char)

                elif keys == Key.enter:
                    keyboard_controller.press(Key.enter)
                    time.sleep(hold_time)
                    keyboard_controller.release(Key.enter)

                # Humanization (randomized delay between steps)
                if humanization:
                    random_delay = random.uniform(0, 0.5)  # Random delay between 0-500ms
                    time.sleep(random_delay)

                time.sleep(0.2)  # Small delay between steps to make it smoother

            if not loop:
                break  # Exit the loop after one run if looping is not enabled
    except Exception as e:
        messagebox.showerror("Error", f"An error occurred: {e}")
    finally:
        # Release all persistent keys
        for key in persistent_keys_pressed:
            keyboard_controller.release(key)
        status_label.config(text="Status: Stopped", foreground="red")

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

# Start/Stop toggle listener
def toggle_macro(key):
    global macro_running, stop_event, macro_thread, current_hotkey


    try:
        if hasattr(key, 'name'):
            if key.name.lower() == current_hotkey.lower():
                if macro_running:
                    # Stop the macro
                    stop_event.set()
                    macro_running = False
                    status_label.config(text="Status: Stopped", foreground="red")
                    print("Macro stopped.")
                else:
                    # Start the macro
                    stop_event.clear()
                    macro_running = True
                    status_label.config(text=f"Status: {macroName} Running", foreground="green")
                    loop = loop_var.get()
                    humanization = humanization_var.get()
                    macro_thread = threading.Thread(target=run_macro, args=(macro_steps, persistent_keys, stop_event, loop, humanization))
                    macro_thread.start()
                    print("Macro started.")
        else:
            if hasattr(key, 'char') and key.char == current_hotkey.lower():
                if macro_running:
                    # Stop the macro
                    stop_event.set()
                    macro_running = False
                    status_label.config(text="Status: Stopped", foreground="red")
                    print("Macro stopped.")
                else:
                    # Start the macro
                    stop_event.clear()
                    macro_running = True
                    status_label.config(text="Status: Running", foreground="green")
                    loop = loop_var.get()
                    humanization = humanization_var.get()
                    macro_thread = threading.Thread(target=run_macro, args=(macro_steps, persistent_keys, stop_event, loop, humanization))
                    macro_thread.start()
                    print("Macro started.")
    except Exception as e:
        print(f"Error in toggle: {e}")

# Keyboard listener thread
def start_listener():
    with keyboard.Listener(on_press=toggle_macro) as listener:
        listener.join()

# Change the hotkey
def change_hotkey():
    global current_hotkey
    new_hotkey = hotkey_entry.get()
    if len(new_hotkey) == 1 and new_hotkey.isprintable():
        current_hotkey = new_hotkey.upper()
        hotkey_label.config(text=f"Current Hotkey: {current_hotkey}")
        messagebox.showinfo("Hotkey Changed", f"Hotkey changed to {current_hotkey}.")
    else:
        messagebox.showerror("Error", "Please enter a single printable character.")

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

# Initialize the main window
root = tk.Tk()
root.title("MacroHub")

# Variables
macro_steps = []
macro_running = False
stop_event = threading.Event()
macro_thread = None
current_hotkey = "F10"  # Default hotkey
persistent_keys = []  # List of persistent keys

# Main frame
main_frame = ttk.Frame(root)
main_frame.pack(padx=20, pady=20)

# Left frame for inputs, steps, and settings
input_frame = ttk.Frame(main_frame)
input_frame.grid(row=0, column=0, padx=20, pady=10, sticky="w")

# Title for the left section
ttk.Label(input_frame, text="Keystrokes and Steps", font=("Helvetica", 14, "bold")).grid(row=0, column=0, columnspan=2, pady=10)

# Keystroke and Hold Time inputs
ttk.Label(input_frame, text="Keystrokes:").grid(row=1, column=0, padx=5, pady=5)
key_entry = ttk.Entry(input_frame, width=20)
key_entry.grid(row=1, column=1, padx=5, pady=5)

ttk.Label(input_frame, text="Hold Time (s):").grid(row=2, column=0, padx=5, pady=5)
hold_time_entry = ttk.Entry(input_frame, width=20)
hold_time_entry.grid(row=2, column=1, padx=5, pady=5)

add_button = ttk.Button(input_frame, text="Add Step", command=add_step)
add_button.grid(row=3, column=0, columnspan=2, pady=5)

# Table for macro steps
table_frame = ttk.Frame(input_frame)  # Move the table frame here
table_frame.grid(row=4, column=0, columnspan=2, pady=10)

columns = ("Step", "Keystrokes", "Hold Time")
table = ttk.Treeview(table_frame, columns=columns, show="headings", height=10)
table.heading("Step", text="Step")
table.heading("Keystrokes", text="Keystrokes")
table.heading("Hold Time", text="Hold Time")
table.column("Step", width=50, anchor="center")
table.column("Keystrokes", width=150, anchor="center")
table.column("Hold Time", width=100, anchor="center")
table.pack(side="left")

scrollbar = ttk.Scrollbar(table_frame, orient="vertical", command=table.yview)
scrollbar.pack(side="right", fill="y")
table.configure(yscrollcommand=scrollbar.set)

# Control buttons below the table
control_frame = ttk.Frame(input_frame)
control_frame.grid(row=5, column=0, columnspan=2, pady=10)

delete_button = ttk.Button(control_frame, text="Delete Step", command=delete_step)
delete_button.grid(row=0, column=0, padx=5)

save_button = ttk.Button(control_frame, text="Save Macro", command=save_macro)
save_button.grid(row=0, column=1, padx=5)

load_button = ttk.Button(control_frame, text="Load Macro", command=load_macro)
load_button.grid(row=0, column=2, padx=5)

# Right frame for persistent keys, checkboxes, and macro controls
right_frame = ttk.Frame(main_frame)
right_frame.grid(row=0, column=1, padx=20, pady=10)

# Title for the right section
ttk.Label(right_frame, text="Persistent Keys", font=("Helvetica", 12, "bold")).grid(row=0, column=0, pady=10)

# Persistent keys section
persistent_frame = ttk.Frame(right_frame)
persistent_frame.grid(row=1, column=0, pady=10, sticky="w")

# Define the persistent_keys_label to display the current persistent keys
persistent_keys_label = ttk.Label(persistent_frame, text="Persistent Keys: None")
persistent_keys_label.grid(row=0, column=0, padx=5, pady=5)

# Add persistent key input
ttk.Label(persistent_frame, text="Add Persistent Key:").grid(row=1, column=0, padx=5, pady=5)
persistent_key_entry = ttk.Entry(persistent_frame, width=20)
persistent_key_entry.grid(row=1, column=1, padx=5, pady=5)

add_persistent_key_button = ttk.Button(persistent_frame, text="Add", command=add_persistent_key)
add_persistent_key_button.grid(row=1, column=2, padx=5, pady=5)

# Delete persistent key dropdown and button
ttk.Label(persistent_frame, text="Delete Persistent Key:").grid(row=2, column=0, padx=5, pady=5)
persistent_key_dropdown = ttk.Combobox(persistent_frame, state="readonly", width=18)
persistent_key_dropdown.grid(row=2, column=1, padx=5, pady=5)

delete_persistent_key_button = ttk.Button(persistent_frame, text="Delete", command=lambda: delete_persistent_key())
delete_persistent_key_button.grid(row=2, column=2, padx=5, pady=5)


# Checkboxes for Looping and Humanization
checkbox_frame = ttk.Frame(right_frame)
checkbox_frame.grid(row=2, column=0, pady=10)

ttk.Label(checkbox_frame, text="Additional Settings", font=("Helvetica", 12, "bold")).grid(row=0, column=0, columnspan=2, pady=10)

loop_var = tk.BooleanVar()
loop_checkbox = ttk.Checkbutton(checkbox_frame, text="Loop Macro", variable=loop_var)
loop_checkbox.grid(row=1, column=0, padx=5, pady=5)

humanization_var = tk.BooleanVar()
humanization_checkbox = ttk.Checkbutton(checkbox_frame, text="Humanization (Random Delay)", variable=humanization_var)
humanization_checkbox.grid(row=1, column=1, padx=5, pady=5)

# Hotkey section on top right
hotkey_frame = ttk.Frame(root)
hotkey_frame.pack(pady=10, padx=10, anchor="ne")

hotkey_label = ttk.Label(hotkey_frame, text=f"Current Hotkey: {current_hotkey}")
hotkey_label.grid(row=0, column=0, padx=5, pady=5)

ttk.Label(hotkey_frame, text="Change Hotkey:").grid(row=1, column=0, padx=5, pady=5)
hotkey_entry = ttk.Entry(hotkey_frame, width=10)
hotkey_entry.grid(row=1, column=1, padx=5, pady=5)

change_hotkey_button = ttk.Button(hotkey_frame, text="Change", command=change_hotkey)
change_hotkey_button.grid(row=1, column=2, padx=5, pady=5)

# Status section at the bottom
status_label = ttk.Label(root, text="Status: Stopped", foreground="red")
status_label.pack(pady=10)

# Start listener in a separate thread
listener_thread = threading.Thread(target=start_listener)
listener_thread.daemon = True
listener_thread.start()

# Run the Tkinter event loop
root.mainloop()
