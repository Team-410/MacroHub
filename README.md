<p align="center">
  <img src="web/app/public/logo.png" alt="Logo" width="300" />
</p>

<p align="center">
  <img src="https://github.com/Team-410/MacroHub/workflows/CI/badge.svg" alt="Build">
  <img src="https://img.shields.io/github/v/release/Team-410/MacroHub" alt="Release">
  <img src="https://img.shields.io/github/license/Team-410/MacroHub" alt="License">
  <img src="https://img.shields.io/badge/node-%3E%3D14.0-blue" alt="Node">
  <img src="https://img.shields.io/badge/python-3.8%2B-blue" alt="Python">
   <img src="https://img.shields.io/badge/React-%3E%3D16.8-blue" alt="React">
  <img src="https://img.shields.io/github/contributors/Team-410/MacroHub" alt="Contributors">
</p>


# 📦 MacroHub

**Contributors:** Juho Järvinen, Makar Korostik, Jehu Enberg, Kaito Stenroos

## 🚀 Tech Stack
- **Frontend:** React, Vite
- **Backend:** Node
- **Local client** Python, Inno installer
- **Database:** MySQL

---

## 📋 Developer Usage Guide

### 🐍 PYTHON CLIENT
```bash
# Step 0: Navigate to the client directory
cd ./client/

# Step 1: Activate Virtual Env
venv/scripts/activate

# Step 2: Install required dependencies
python -m pip install -r requirements.txt

# Step 3: Run the Python client
python .\main.py
OPTIONAL(no login): python .\create_macro.py 
```

### ⚙️ INSTALLER
```bash
# Step 0: Download inno compiler

# Step 1: cd ./client

# Step 2: Create exe file pyinstaller --onedir --noconsole --name Macrohub main.py

# Step 3: Navigate to the installer directory
cd ./client/installer

# Step 4: Choose the correct path to ouput dir

# Step 5: Choose the correct paths to all sources

# Step 6: Press run

```

### 🛢️ BACKEND
```bash
# Step 0: Navigate to the backend directory
cd ./web/app/backend/

# Step 1: Start the backend server
node server.js
```

### 🌐 FRONTEND
```bash
# Step 0: Navigate to the frontend directory
cd ./web/app/

# Step 1: Run the development server
npm run dev
```

### DATABASE
```mermaid
erDiagram
    user ||--o{ personal_list : "has"
    user ||--o{ vote : "casts"
    macro ||--o{ personal_list : "is in"
    macro ||--o{ vote : "receives"
    macro ||--o{ comment : "has"
```

### Class diagram
```mermaid
classDiagram
    class user {
        +INT userid
        +VARCHAR(255) email
        +VARCHAR(255) password
        +VARCHAR(255) fullname
        +VARCHAR(50) role
    }

    class macro {
        +INT macroid
        +VARCHAR(255) macroname
        +VARCHAR(255) macrodescription
        +VARCHAR(255) app
        +VARCHAR(255) category
        +VARCHAR(255) macrotype
        +TEXT macro
        +TIMESTAMP timestamp
    }

    class personal_list {
        +INT listid
        +INT userid
        +INT macroid
        +VARCHAR(255) activation_key
    }

    class vote {
        +INT voteid
        +INT macroid
        +INT userid
        +BOOLEAN vote
    }

    class comment {
        +INT commentid
        +INT macroid
        +VARCHAR(255) fullname
        +TEXT comment
        +TIMESTAMP timestamp
    }

```
###  Workflow
```mermaid
sequenceDiagram
    participant User as User
    participant WebClient as Web Client
    participant API
    participant LocalClient as Local Python Client

    User->>WebClient: Log in
    WebClient->>API: Authenticate user
    API-->>WebClient: Return auth token

    User->>WebClient: Browse macros
    WebClient->>API: Request macros
    API-->>WebClient: Send macro list

    User->>WebClient: Save macro to personal list
    WebClient->>API: Store macro in user’s personal list
    API-->>WebClient: Confirm save

    User->>LocalClient: Open local client
    LocalClient->>API: Request user’s personal macros
    API-->>LocalClient: Send personal macros

    User->>LocalClient: Edit and save macros
    LocalClient->>API: Update personal macros
    API-->>LocalClient: Confirm changes

```

### SWAGGER
Swagger documentation is available [here](https://macrohub-backend-6-3-25-macrohub.2.rahtiapp.fi/swagger/)

If backend is run locally, by default Swagger documentation is available at:
[http://localhost:5000/swagger](http://localhost:5000/swagger)

---
