from pynput.keyboard import Key

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