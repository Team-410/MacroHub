# 📦 MacroHub

**Contributors:** Juho Järvinen, Makar Korostik, Jehu Enberg, Kaito Stenroos

## 🚀 Tech Stack
- **Frontend:** React
- **Backend:** Python Script / Flask App
- **Database:** MySQL

---

## 📋 Usage Guide

### 💻 DEMO CLIENT
```bash
# Step 0: Navigate to the client directory
cd Path/to/client

# Step 1: Activate the virtual environment
./venv/Scripts/activate

# Step 2: Install required dependencies
pip install -r requirements.txt

# Step 3: Run the demo client
python macroHub.py
```

### 🐍 PYTHON CLIENT
```bash
# Step 0: Navigate to the client directory
cd ./client/

# Step 1: Install required dependencies
python -m pip install -r requirements.txt

# Step 2: Run the Python client
python .\main.py
```

### ⚙️ BACKEND
```bash
# Step 0: Navigate to the backend directory
cd ./web/app/backend/

# Step 1: (Optional) Create authenticator.js if not available
# Step 2: Start the backend server
node server.js
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


### 🌐 FRONTEND
```bash
# Step 0: Navigate to the frontend directory
cd ./web/app/

# Step 1: Run the development server
npm run dev
```

### SWAGGER

If backend is run locally, by default Swagger documentation is available at:
[http://localhost:5000/swagger](http://localhost:5000/swagger)

---
