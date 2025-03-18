import tkinter as tk
from tkinter import ttk, messagebox
import threading
from .table_manager import TableManager
from .persistent_keys_manager import PersistentKeysManager
from .hotkey_manager import HotkeyManager
from .keyboard_listener import KeyboardListener
from .macro_runner import MacroRunner
from .macro_recorder import MacroRecorder
from .advanced_settings import AdvancedSettings

from api_requests.save_macro_api import save_macro

class MainWindow:
    def __init__(self, macro_steps=None, persistent_keys=None):
        self.root = tk.Tk()
        self.root.title("MacroHub")
        self.root.resizable(False, False)
        self.macro_running = False
        self.stop_event = threading.Event()
        self.macro_thread = None
        self.current_hotkey = "F3"
        self.recording = False
        self.macro_recorder = MacroRecorder(self.add_recorded_step)

        self.macro_steps = macro_steps if macro_steps is not None else []
        self.persistent_keys = persistent_keys if persistent_keys is not None else []

        print(self.macro_steps)
        
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

        # Middle frame for Keystrokes and Steps
        self.middle_frame = ttk.Frame(self.main_frame)
        self.middle_frame.pack(pady=10)

        # Table for macro steps
        self.table_manager = TableManager(self.middle_frame, self.macro_steps)
    
        self.record_button = ttk.Button(self.middle_frame, text="Start Recording", command=self.toggle_recording)
        self.record_button.grid(row=3, column=0, pady=0)

        # Create object
        macro = MacroRunner(self.macro_steps, self.persistent_keys, self.stop_event)
        self.save_button = ttk.Button(
            self.middle_frame,
            text="Save Macro", 
            command=lambda: save_macro(macro)
        )
        self.save_button.grid(row=5, column=0, pady=5)

        self.advanced_button = ttk.Button(self.middle_frame, text="Advanced Settings", command=self.open_advanced_settings)
        self.advanced_button.grid(row=6, column=0, pady=5)

        self.hotkey_label = ttk.Label(self.root, text=f"Current Hotkey: {self.current_hotkey}")
        self.hotkey_label.pack(side="bottom", pady=5)

        # Display Persistent Keys in the main window
        self.persistent_keys_label = ttk.Label(self.root, text=f"Persistent Keys: {', '.join(self.persistent_keys) if self.persistent_keys else 'None'}")
        self.persistent_keys_label.pack(side="bottom", pady=5)

        # Manual step addition below the recording button
        self.manual_frame = ttk.Frame(self.middle_frame)
        self.manual_frame.grid(row=3, column=0, pady=10)

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
        self.hotkey_label.config(text=f"Current Hotkey: {new_hotkey}")  # Update UI
    
        # Update keyboard listener with the new hotkey
        if self.keyboard_listener:
            self.keyboard_listener.update_hotkey(new_hotkey)

    def update_persistent_keys(self, new_keys):
        """Update persistent keys displayed in the main window."""
        self.persistent_keys = new_keys
        self.persistent_keys_label.config(text=f"Persistent Keys: {', '.join(self.persistent_keys) if self.persistent_keys else 'None'}")

    def open_advanced_settings(self):
        """Opens the Advanced Settings window."""
        AdvancedSettings(
            self.root, 
            self.loop_var, 
            self.humanization_var, 
            self.persistent_keys, 
            self.current_hotkey, 
            self.change_hotkey,
            self.update_persistent_keys  # Pass the method to update persistent keys
        )

    def run(self):
        self.root.mainloop()
