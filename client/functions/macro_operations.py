import time
import random
from pynput.keyboard import Controller, Key
from tkinter import messagebox
from functions.key_mapping import map_display_to_key

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