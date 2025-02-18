from pynput.keyboard import Key
from create_macro import *

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