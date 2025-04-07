from tkinter import ttk, messagebox
import customtkinter as ctk
import tkinter.font as tkFont
from .macro_utils import map_key_for_display

class TableManager:
    def __init__(self, parent, macro_steps):
        self.macro_steps = macro_steps
        self.setup_ui(parent)
        self.setup_table(parent)


    def setup_ui(self, parent):
        """Sets up the entire macro steps section, including title, table, and inputs."""

        self.setup_table(parent)
        self.setup_inputs(parent)

    def setup_table(self, parent):
        self.table_frame = ctk.CTkFrame(parent)
        self.table_frame.grid(row=1, column=0, padx=20, pady=20, sticky="ew")

        columns = ("Step", "Keystrokes", "Hold Time")
        self.table = ttk.Treeview(
            self.table_frame,
            columns=columns,
            show="headings",
            height=10,
            style="SimpleDark.Treeview"
        )

        self.table.heading("Step", text="Step")
        self.table.heading("Keystrokes", text="Keystrokes")
        self.table.heading("Hold Time", text="Hold Time")

        self.table.column("Step", width=50, anchor="center")
        self.table.column("Keystrokes", width=150, anchor="center")
        self.table.column("Hold Time", width=100, anchor="center")

        self.table.pack(side="left", fill="both", expand=True)

        self.scrollbar = ttk.Scrollbar(
            self.table_frame,
            orient="vertical",
            command=self.table.yview,
            style="SimpleDark.Vertical.TScrollbar"
        )
        self.scrollbar.pack(side="right", fill="y")
        self.table.configure(yscrollcommand=self.scrollbar.set)

        style = ttk.Style(parent)
        heading_font = tkFont.Font(size=14)
        style.theme_use("default")

        style.configure("SimpleDark.Treeview",
                        background="#333",
                        foreground="#eee",
                        fieldbackground="#333",
                        borderwidth=0)
        style.configure("SimpleDark.Treeview.Heading",
                        background="#555",
                        foreground="#eee",
                        font=heading_font,
                        relief="flat",
                        borderwidth=0)

        style.map("SimpleDark.Treeview.Heading",
                background=[('active', '#777')],
                foreground=[('active', '#eee')])

        style.map("SimpleDark.Treeview",
                background=[('selected', '#666')],
                foreground=[('selected', '#eee')])

        style.configure("SimpleDark.Vertical.TScrollbar",
                        background="#333",
                        troughcolor="#555",
                        bordercolor="#000",
                        arrowcolor="#eee")
        style.map("SimpleDark.Vertical.TScrollbar",
                background=[('active', '#555')],
                arrowcolor=[('active', '#eee')])

        self.update_table()


    def setup_inputs(self, parent):
        self.input_frame = ctk.CTkFrame(parent)
        self.input_frame.grid(row=2, column=0, padx=20, pady=20, sticky="w")

        ctk.CTkLabel(self.input_frame, text="Keystroke:").grid(row=0, column=0, padx=5, pady=5)
        self.key_entry = ctk.CTkEntry(self.input_frame, width=30)  
        self.key_entry.grid(row=0, column=1, padx=10, pady=5, sticky="ew") 

        ctk.CTkLabel(self.input_frame, text="Hold Time (s):").grid(row=1, column=0, padx=5, pady=5)
        self.hold_time_entry = ctk.CTkEntry(self.input_frame, width=30)  
        self.hold_time_entry.grid(row=1, column=1, padx=10, pady=5, sticky="ew") 

        self.add_button = ctk.CTkButton(self.input_frame, text="Add Step", command=self.add_step)
        self.add_button.grid(row=2, column=0, columnspan=1, pady=10, padx=10, sticky="ew") 

        self.edit_button = ctk.CTkButton(self.input_frame, text="Edit Step", command=self.edit_step)
        self.edit_button.grid(row=2, column=1, columnspan=1, pady=10, padx=10, sticky="ew") 

        self.delete_button = ctk.CTkButton(self.input_frame, text="Delete Step", command=self.delete_step)
        self.delete_button.grid(row=2, column=2, columnspan=1, pady=10, padx=10, sticky="ew") 



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
        """Update the table to reflect the current state of the macro_steps list."""
        for row in self.table.get_children():
            self.table.delete(row)
        for i, step in enumerate(self.macro_steps):
            formatted_hold_time = f"{float(step['hold_time']):.2f}"
            self.table.insert("", "end", values=(i + 1, step['keys'], formatted_hold_time))

    def edit_step(self):
        """Edits the selected step"""
        selected_item = self.table.selection()
        if not selected_item:
            messagebox.showerror("Error", "Select a step to edit.")
            return

        step_number = self.table.item(selected_item[0], "values")[0]
        step_index = int(step_number) - 1  # Convert to zero-indexed

        # Populate input fields with existing data
        step_data = self.macro_steps[step_index]
        self.key_entry.delete(0, "end")
        self.key_entry.insert(0, step_data["keys"])
        self.hold_time_entry.delete(0, "end")
        self.hold_time_entry.insert(0, step_data["hold_time"])

        # Modify the "Edit Step" button to confirm the changes
        def save_changes():
            new_keys = self.key_entry.get()
            new_hold_time = self.hold_time_entry.get()

            if not new_keys or not new_hold_time:
                messagebox.showerror("Error", "Both fields are required.")
                return

            try:
                float(new_hold_time)  # Validate hold time
                self.macro_steps[step_index] = {"keys": map_key_for_display(new_keys), "hold_time": new_hold_time}
                self.update_table()
                self.edit_button.configure(text="Edit Step", command=self.edit_step)  # Restore original button behavior
            except ValueError:
                messagebox.showerror("Error", "Hold time must be a number.")

        self.edit_button.configure(text="Save Changes", command=save_changes)

    def delete_step(self):
        """Deletes the selected step from the macro_steps and updates the table."""
        selected_item = self.table.selection()
        if not selected_item:
            messagebox.showerror("Error", "Select a step to delete.")
            return

        # Get the step number (from the first column in the selected row)
        step_number = self.table.item(selected_item[0], "values")[0]
        step_index = int(step_number) - 1  # Convert to zero-indexed

        # Remove the selected step from the macro_steps list
        del self.macro_steps[step_index]

        # Update the table to reflect the changes
        self.update_table()
