import tkinter as tk
from tkinter import ttk
import customtkinter as ctk
import threading
from .table_manager import TableManager
from .persistent_keys_manager import PersistentKeysManager
from .hotkey_manager import HotkeyManager
from .keyboard_listener import KeyboardListener
from .macro_runner import MacroRunner
from .macro_recorder import MacroRecorder
from .advanced_settings import AdvancedSettings

from pages.macro_details import add_details

class MainWindow:
    def __init__(self, macro_steps=None, persistent_keys=None):

        ctk.set_appearance_mode("dark") 
        ctk.set_default_color_theme("green")

        self.root = ctk.CTk()
        self.root.title("MacroHub")
        self.root.resizable(False, False)
        self.macro_running = False
        self.stop_event = threading.Event()
        self.macro_thread = None
        self.current_hotkey = "F3"  # Default hotkey
        self.recording = False
        self.macro_recorder = MacroRecorder(self.add_recorded_step)

        self.macro_steps = macro_steps if macro_steps is not None else []
        self.persistent_keys = persistent_keys if persistent_keys is not None else []
        
        self.loop_var = tk.BooleanVar()
        self.humanization_var = tk.BooleanVar()

        self.setup_ui()
        self.keyboard_listener = KeyboardListener(self)
        self.keyboard_listener.start()

    def setup_ui(self):
        self.middle_frame = ctk.CTkFrame(self.root)
        self.middle_frame.pack(pady=20, padx=20,  fill="both", expand=True)

        self.table_manager = TableManager(self.middle_frame, self.macro_steps)

        self.buttons_frame = ctk.CTkFrame(self.middle_frame)
        self.buttons_frame.grid(row=3, column=0, padx=20, pady=20, sticky="ew")

        self.record_button = ctk.CTkButton(self.buttons_frame, text="Start Recording", command=self.toggle_recording)
        self.record_button.grid(row=0, column=0, padx=10, pady=20, sticky="ew")

        self.save_button = ctk.CTkButton(self.buttons_frame, text="Save Macro", command=lambda: add_details(macro))
        self.save_button.grid(row=0, column=1, padx=10, pady=20, sticky="ew")

        self.advanced_button = ctk.CTkButton(self.buttons_frame, text="Advanced Settings", command=self.open_advanced_settings)
        self.advanced_button.grid(row=0, column=2, padx=10, pady=20, sticky="ew")

        macro = MacroRunner(self.macro_steps, self.persistent_keys, self.stop_event)

        self.hotkey_label = ctk.CTkLabel(self.root, text=f"Current Hotkey: {self.current_hotkey}")
        self.hotkey_label.pack(side="bottom", pady=5)

        self.persistent_keys_label = ctk.CTkLabel(self.root, text=f"Persistent Keys: {', '.join(self.persistent_keys) if self.persistent_keys else 'None'}")
        self.persistent_keys_label.pack(side="bottom", pady=5)

        self.manual_frame = ttk.Frame(self.middle_frame)
        self.manual_frame.grid(row=3, column=0, pady=5)

        self.status_label = ctk.CTkLabel(self.root, text="Status: Stopped", text_color="red")
        self.status_label.pack(side="bottom", pady=5)



    def toggle_macro(self):
        if self.macro_running:
            self.stop_event.set()
            self.macro_running = False
            self.status_label.configure(text="Status: Stopped", text_color="red")
        else:
            self.stop_event.clear()
            self.macro_running = True
            self.status_label.configure(text="Status: Running", text_color="green")
            loop = self.loop_var.get()
            humanization = self.humanization_var.get()
            self.macro_thread = threading.Thread(
                target=MacroRunner(self.macro_steps, self.persistent_keys, self.stop_event).run_macro,
                args=(loop, humanization)
            )
            self.macro_thread.start()

    def toggle_recording(self):
        if self.recording:
            self.macro_recorder.stop_recording()
            self.record_button.configure(text="Start Recording")
            self.recording = False
        else:
            self.macro_recorder.start_recording()
            self.record_button.configure(text="Stop Recording")
            self.recording = True

    def add_recorded_step(self, keys, delay):
        self.macro_steps.append({'keys': keys, 'hold_time': delay})
        self.table_manager.update_table()

    def change_hotkey(self, new_hotkey):
        self.current_hotkey = new_hotkey
        self.hotkey_label.configure(text=f"Current Hotkey: {new_hotkey}")  # Update UI
    
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
            self.update_persistent_keys
        )

    def run(self):
        self.root.mainloop()
