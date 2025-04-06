import time
from pynput import keyboard

class MacroRecorder:
    def __init__(self, add_step_callback):
        self.add_step_callback = add_step_callback
        self.recording = False
        self.start_time = None
        self.last_key_time = None
        self.listener = None

    def start_recording(self):
        self.recording = True
        self.start_time = time.time()
        self.last_key_time = self.start_time
        self.listener = keyboard.Listener(on_press=self.on_press)
        self.listener.start()

    def stop_recording(self):
        self.recording = False
        if self.listener:
            self.listener.stop()

    def on_press(self, key):
        if not self.recording:
            return

        current_time = time.time()
        delay = current_time - self.last_key_time
        self.last_key_time = current_time

        try:
            key_char = key.char
        except AttributeError:
            special_keys = {
                keyboard.Key.space: "Spacebar",
                keyboard.Key.enter: "Enter",
                keyboard.Key.tab: "Tab",
                keyboard.Key.esc: "Escape",
                keyboard.Key.shift: "Shift",
                keyboard.Key.ctrl: "Ctrl",
                keyboard.Key.alt: "Alt",
                keyboard.Key.backspace: "Backspace",
            }
            key_char = special_keys.get(key, str(key)) 

            # FIXME: Stop recording when space is pressed
            if key_char == "Key.space":
                self.recording = True

        print(f"Tallennettu näppäin: {key_char}")
        self.add_step_callback(key_char, delay)
