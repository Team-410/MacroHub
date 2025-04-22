from pynput import keyboard
import threading

class KeyboardListener:
    def __init__(self, main_window):
        self.main_window = main_window
        self.listener = None
        self.listener_thread = None
        self.current_hotkey = main_window.current_hotkey

    def start(self):
        """Starts the keyboard listener in a separate thread."""
        self.stop()
        self.listener_thread = threading.Thread(target=self._start_listener)
        self.listener_thread.daemon = True
        self.listener_thread.start()

    def _start_listener(self):
        """Creates and starts the actual hotkey listener."""
        hotkey = self._format_hotkey(self.current_hotkey)
        self.listener = keyboard.GlobalHotKeys({
            hotkey: self.main_window.toggle_macro
        })
        self.listener.run()

    def stop(self):
        """Stops the keyboard listener thread."""
        if self.listener:
            self.listener.stop()
            self.listener = None

    def update_hotkey(self, new_hotkey):
        """Updates the hotkey and restarts the listener."""
        self.current_hotkey = new_hotkey
        self.start()

    def _format_hotkey(self, hotkey):
        """Formats the hotkey correctly based on whether it's a special key or a printable character."""
        # Check if the hotkey is a printable character ('a', 'b', etc.)
        if len(hotkey) == 1 and hotkey.isalpha():
            return hotkey.lower()
        else:
            return f"<{hotkey}>"
