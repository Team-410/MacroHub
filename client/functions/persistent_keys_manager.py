from tkinter import ttk, messagebox

class PersistentKeysManager:
    def __init__(self, parent, persistent_keys):
        self.persistent_keys = persistent_keys  # Initialize persistent keys
        self.parent = parent  # Parent window to update display
        self.setup_persistent_keys_section(parent)

    def setup_persistent_keys_section(self, parent):
        # Display the section title
        ttk.Label(parent, text="Persistent Keys", font=("Helvetica", 12, "bold")).grid(row=0, column=0, columnspan=3, pady=5)

        # Label that will display the current persistent keys
        self.persistent_keys_label = ttk.Label(parent, text="Persistent Keys: None")
        self.persistent_keys_label.grid(row=1, column=0, padx=5, pady=5)

        # Entry field for adding persistent keys
        ttk.Label(parent, text="Add Persistent Key:").grid(row=2, column=0, padx=5, pady=5)
        self.persistent_key_entry = ttk.Entry(parent, width=20)
        self.persistent_key_entry.grid(row=2, column=1, padx=5, pady=5)

        # Button for adding a persistent key
        self.add_persistent_key_button = ttk.Button(parent, text="Add", command=self.add_persistent_key)
        self.add_persistent_key_button.grid(row=2, column=2, padx=5, pady=5)

        # Label and Dropdown for deleting persistent keys
        ttk.Label(parent, text="Delete Persistent Key:").grid(row=3, column=0, padx=5, pady=5)
        self.persistent_key_dropdown = ttk.Combobox(parent, state="readonly", width=18)
        self.persistent_key_dropdown.grid(row=3, column=1, padx=5, pady=5)

        # Button to delete a selected persistent key
        self.delete_persistent_key_button = ttk.Button(parent, text="Delete", command=self.delete_persistent_key)
        self.delete_persistent_key_button.grid(row=3, column=2, padx=5, pady=5)

        # Update the display of the persistent keys
        self.update_persistent_keys_display()

    def add_persistent_key(self):
        key = self.persistent_key_entry.get()
        if not key:
            messagebox.showerror("Error", "Please enter a key.")
            return

        if key in self.persistent_keys:
            messagebox.showerror("Error", "Key already added.")
            return

        self.persistent_keys.append(key)
        self.update_persistent_keys_display()

    def delete_persistent_key(self):
        selected_key = self.persistent_key_dropdown.get()
        if not selected_key:
            messagebox.showerror("Error", "Please select a key to delete.")
            return

        self.persistent_keys.remove(selected_key)
        self.update_persistent_keys_display()

    def update_persistent_keys_display(self):
        """Update the label with the list of current persistent keys."""
        # Update the label text to show the current persistent keys
        if self.persistent_keys:
            self.persistent_keys_label.config(text=f"Persistent Keys: {', '.join(self.persistent_keys)}")
        else:
            self.persistent_keys_label.config(text="Persistent Keys: None")

        # Update the dropdown with available persistent keys
        self.persistent_key_dropdown['values'] = self.persistent_keys
        if self.persistent_keys:
            self.persistent_key_dropdown.current(0)
        else:
            self.persistent_key_dropdown.set("")

    def get_persistent_keys(self):
        """Return the list of persistent keys for other parts of the application."""
        return self.persistent_keys

    def update_persistent_keys(self, new_keys):
        """Update the persistent keys from external changes (e.g., advanced settings)."""
        self.persistent_keys = new_keys
        self.update_persistent_keys_display()
