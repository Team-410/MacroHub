from pynput import keyboard
import threading

class KeyboardListener:
    def __init__(self, main_window):
        self.main_window = main_window
        self.listener_thread = None

    def start(self):
        self.listener_thread = threading.Thread(target=self._start_listener)
        self.listener_thread.daemon = True
        self.listener_thread.start()

    def _start_listener(self):
        # Use a global listener to work even when the window is not in focus
        with keyboard.GlobalHotKeys({
            f'<{self.main_window.current_hotkey}>': self.main_window.toggle_macro
        }) as listener:
            listener.join()