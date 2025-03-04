from tkinter import ttk, messagebox
from .macro_utils import map_key_for_display

class TableManager:
    def __init__(self, parent, macro_steps):
        self.macro_steps = macro_steps
        self.setup_ui(parent)

    def setup_ui(self, parent):
        """Sets up the entire macro steps section, including title, table, and inputs."""
        ttk.Label(parent, text="Macro Steps", font=("Helvetica", 12, "bold")).grid(row=0, column=0, columnspan=2, pady=5)

        self.setup_table(parent)
        self.setup_inputs(parent)

    def setup_table(self, parent):
        self.table_frame = ttk.Frame(parent)
        self.table_frame.grid(row=1, column=0, padx=20, pady=10, sticky="w")

        columns = ("Step", "Keystrokes", "Hold Time")
        self.table = ttk.Treeview(self.table_frame, columns=columns, show="headings", height=10)
        self.table.heading("Step", text="Step")
        self.table.heading("Keystrokes", text="Keystrokes")
        self.table.heading("Hold Time", text="Hold Time")
        self.table.column("Step", width=50, anchor="center")
        self.table.column("Keystrokes", width=150, anchor="center")
        self.table.column("Hold Time", width=100, anchor="center")
        self.table.pack(side="left")

        self.scrollbar = ttk.Scrollbar(self.table_frame, orient="vertical", command=self.table.yview)
        self.scrollbar.pack(side="right", fill="y")
        self.table.configure(yscrollcommand=self.scrollbar.set)

    def setup_inputs(self, parent):
        self.input_frame = ttk.Frame(parent)
        self.input_frame.grid(row=2, column=0, padx=20, pady=10, sticky="w")

        ttk.Label(self.input_frame, text="Keystrokes:").grid(row=0, column=0, padx=5, pady=5)
        self.key_entry = ttk.Entry(self.input_frame, width=20)
        self.key_entry.grid(row=0, column=1, padx=5, pady=5)

        ttk.Label(self.input_frame, text="Hold Time (s):").grid(row=1, column=0, padx=5, pady=5)
        self.hold_time_entry = ttk.Entry(self.input_frame, width=20)
        self.hold_time_entry.grid(row=1, column=1, padx=5, pady=5)

        self.add_button = ttk.Button(self.input_frame, text="Add Step", command=self.add_step)
        self.add_button.grid(row=2, column=0, columnspan=2, pady=5)

    def add_step(self):
        keys = self.key_entry.get()
        hold_time = self.hold_time_entry.get()
        if not keys or not hold_time:
            messagebox.showerror("Error", "Both fields are required.")
            return

        try:
            float(hold_time)  # Validate hold time
            self.macro_steps.append({'keys': map_key_for_display(keys), 'hold_time': hold_time})
            self.update_table()
        except ValueError:
            messagebox.showerror("Error", "Hold time must be a number.")

    def update_table(self):
        for row in self.table.get_children():
            self.table.delete(row)
        for i, step in enumerate(self.macro_steps):
            self.table.insert("", "end", values=(i + 1, step['keys'], step['hold_time']))
