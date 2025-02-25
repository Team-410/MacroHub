import threading
from pynput import keyboard
from functions.macro_operations import run_macro

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