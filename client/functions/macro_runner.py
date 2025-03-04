import time
import random
from pynput.keyboard import Controller, Key
from tkinter import messagebox

class MacroRunner:
    def __init__(self, macro_steps, persistent_keys, stop_event):
        self.macro_steps = macro_steps
        self.persistent_keys = persistent_keys
        self.stop_event = stop_event
        self.keyboard_controller = Controller()

    def to_dict(self):
        return {
            "macro_steps": self.macro_steps,
            "persistent_keys": self.persistent_keys
        }

    def run_macro(self, loop=False, humanization=False):
        persistent_keys_pressed = []
        try:
            for key in self.persistent_keys:
                actual_key = self.map_display_to_key(key)
                self.keyboard_controller.press(actual_key)
                persistent_keys_pressed.append(actual_key)

            while True:
                if self.stop_event.is_set():
                    break

                for step in self.macro_steps:
                    if self.stop_event.is_set():
                        break

                    keys = self.map_display_to_key(step['keys'])
                    hold_time = float(step['hold_time'])

                    if isinstance(keys, str):
                        for char in keys:
                            self.keyboard_controller.press(char)
                            time.sleep(hold_time)
                            self.keyboard_controller.release(char)

                    elif keys == Key.enter:
                        self.keyboard_controller.press(Key.enter)
                        time.sleep(hold_time)
                        self.keyboard_controller.release(Key.enter)

                    if humanization:
                        random_delay = random.uniform(0, 0.5)  # Random delay between 0-500ms
                        time.sleep(random_delay)

                    time.sleep(0.2)  # Small delay between steps

                if not loop:
                    break
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {e}")
        finally:
            for key in persistent_keys_pressed:
                self.keyboard_controller.release(key)

    def map_display_to_key(self, display_name):
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