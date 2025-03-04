from tkinter import ttk, messagebox

class PersistentKeysManager:
    def __init__(self, parent, persistent_keys):
        self.persistent_keys = persistent_keys
        self.setup_persistent_keys_section(parent)

    def setup_persistent_keys_section(self, parent):
        ttk.Label(parent, text="Persistent Keys", font=("Helvetica", 12, "bold")).grid(row=0, column=0, columnspan=3, pady=5)

        self.persistent_keys_label = ttk.Label(parent, text="Persistent Keys: None")
        self.persistent_keys_label.grid(row=1, column=0, padx=5, pady=5)

        ttk.Label(parent, text="Add Persistent Key:").grid(row=2, column=0, padx=5, pady=5)
        self.persistent_key_entry = ttk.Entry(parent, width=20)
        self.persistent_key_entry.grid(row=2, column=1, padx=5, pady=5)

        self.add_persistent_key_button = ttk.Button(parent, text="Add", command=self.add_persistent_key)
        self.add_persistent_key_button.grid(row=2, column=2, padx=5, pady=5)

        ttk.Label(parent, text="Delete Persistent Key:").grid(row=3, column=0, padx=5, pady=5)
        self.persistent_key_dropdown = ttk.Combobox(parent, state="readonly", width=18)
        self.persistent_key_dropdown.grid(row=3, column=1, padx=5, pady=5)

        self.delete_persistent_key_button = ttk.Button(parent, text="Delete", command=self.delete_persistent_key)
        self.delete_persistent_key_button.grid(row=3, column=2, padx=5, pady=5)


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
        self.persistent_keys_label.config(text=f"Persistent Keys: {', '.join(self.persistent_keys) if self.persistent_keys else 'None'}")
        self.persistent_key_dropdown['values'] = self.persistent_keys
        if self.persistent_keys:
            self.persistent_key_dropdown.current(0)
        else:
            self.persistent_key_dropdown.set("")