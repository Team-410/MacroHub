import tkinter as tk
from tkinter import ttk, messagebox
import threading
from .table_manager import TableManager
from .persistent_keys_manager import PersistentKeysManager
from .hotkey_manager import HotkeyManager
from .keyboard_listener import KeyboardListener
from .macro_runner import MacroRunner
from .macro_recorder import MacroRecorder

from api_requests.save_macro_api import save_macro

class MainWindow:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("MacroHub")
        self.macro_steps = []
        self.persistent_keys = []
        self.macro_running = False
        self.stop_event = threading.Event()
        self.macro_thread = None
        self.current_hotkey = "F3"
        self.recording = False
        self.macro_recorder = MacroRecorder(self.add_recorded_step)

        # Add loop and humanization variables
        self.loop_var = tk.BooleanVar()
        self.humanization_var = tk.BooleanVar()

        self.setup_ui()
        self.keyboard_listener = KeyboardListener(self)
        self.keyboard_listener.start()

    def setup_ui(self):
        # Main title at the top middle
        ttk.Label(self.root, text="MacroHub", font=("Helvetica", 16, "bold")).pack(pady=10)

        # Main frame for the content
        self.main_frame = ttk.Frame(self.root)
        self.main_frame.pack(padx=20, pady=10)

        # Left frame for Persistent Keys
        self.left_frame = ttk.Frame(self.main_frame)
        self.left_frame.grid(row=0, column=0, padx=10, pady=10, sticky="n")

        # Persistent keys section
        self.persistent_keys_manager = PersistentKeysManager(self.left_frame, self.persistent_keys)

        # Middle frame for Keystrokes and Steps
        self.middle_frame = ttk.Frame(self.main_frame)
        self.middle_frame.grid(row=0, column=1, padx=10, pady=10, sticky="n")

        # Table for macro steps
        self.table_manager = TableManager(self.middle_frame, self.macro_steps)
    
        self.record_button = ttk.Button(self.middle_frame, text="Start Recording", command=self.toggle_recording)
        self.record_button.grid(row=3, column=0, pady=5)

        # Luo olio
        macro = MacroRunner(self.macro_steps, self.persistent_keys, self.stop_event)
        self.save_button = ttk.Button(
            self.middle_frame,
            text="Save Macro", 
            command=lambda: save_macro(macro)
        )

        self.save_button.grid(row=5, column=0, pady=10)


        # Manual step addition below the recording button
        self.manual_frame = ttk.Frame(self.middle_frame)
        self.manual_frame.grid(row=3, column=0, pady=10)

        # Right frame for Additional Settings
        self.right_frame = ttk.Frame(self.main_frame)
        self.right_frame.grid(row=0, column=2, padx=10, pady=10, sticky="n")

        ttk.Label(self.right_frame, text="Additional Settings", font=("Helvetica", 12, "bold")).grid(row=0, column=0, pady=5)

        # Checkboxes for Looping and Humanization
        self.loop_checkbox = ttk.Checkbutton(self.right_frame, text="Loop Macro", variable=self.loop_var)
        self.loop_checkbox.grid(row=1, column=0, padx=5, pady=5, sticky="w")

        self.humanization_checkbox = ttk.Checkbutton(self.right_frame, text="Humanization (Random Delay)", variable=self.humanization_var)
        self.humanization_checkbox.grid(row=2, column=0, padx=5, pady=5, sticky="w")

        # Hotkey section at the bottom right
        self.hotkey_frame = ttk.Frame(self.root)
        self.hotkey_frame.pack(side="bottom", anchor="se", padx=20, pady=10)

        self.hotkey_label = ttk.Label(self.hotkey_frame, text=f"Current Hotkey: {self.current_hotkey}")
        self.hotkey_label.grid(row=0, column=0, padx=5, pady=5)

        ttk.Label(self.hotkey_frame, text="Change Hotkey:").grid(row=1, column=0, padx=5, pady=5)
        self.hotkey_entry = ttk.Entry(self.hotkey_frame, width=10)
        self.hotkey_entry.grid(row=1, column=1, padx=5, pady=5)

        self.change_hotkey_button = ttk.Button(self.hotkey_frame, text="Change", command=self.change_hotkey)
        self.change_hotkey_button.grid(row=1, column=2, padx=5, pady=5)

        # Status section at the bottom middle
        self.status_label = ttk.Label(self.root, text="Status: Stopped", foreground="red")
        self.status_label.pack(side="bottom", pady=10)

    def toggle_macro(self):
        if self.macro_running:
            # Stop the macro
            self.stop_event.set()
            self.macro_running = False
            self.status_label.config(text="Status: Stopped", foreground="red")
        else:
            # Start the macro
            self.stop_event.clear()
            self.macro_running = True
            self.status_label.config(text="Status: Running", foreground="green")
            loop = self.loop_var.get()
            humanization = self.humanization_var.get()
            self.macro_thread = threading.Thread(
                target=MacroRunner(self.macro_steps, self.persistent_keys, self.stop_event).run_macro,
                args=(loop, humanization)
            )
            self.macro_thread.start()

    def toggle_recording(self):
        if self.recording:
            # Stop recording
            self.macro_recorder.stop_recording()
            self.record_button.config(text="Start Recording")
            self.recording = False
        else:
            # Start recording
            self.macro_recorder.start_recording()
            self.record_button.config(text="Stop Recording")
            self.recording = True

    def add_recorded_step(self, keys, delay):
        self.macro_steps.append({'keys': keys, 'hold_time': delay})
        self.table_manager.update_table()

    def change_hotkey(self, new_hotkey):
        self.current_hotkey = new_hotkey
        self.hotkey_manager.update_hotkey_label(new_hotkey)

    def run(self):
        self.root.mainloop()
