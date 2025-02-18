import tkinter as tk
from tkinter import ttk
import threading
from functions.key_mapping import map_key_for_display, map_display_to_key
from functions.macro_operations import run_macro
from functions.gui_components import add_step, update_table, delete_step, save_macro, load_macro
from functions.hotkey_listener import toggle_macro, start_listener, change_hotkey
from functions.persistent_keys import add_persistent_key, delete_persistent_key, update_persistent_keys_display

# Initialize the main window
root = tk.Tk()
root.title("MacroHub")

# Variables
macro_steps = []
macro_running = False
stop_event = threading.Event()
macro_thread = None
current_hotkey = "F3"  # Default hotkey
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