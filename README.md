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
erDiagram
    user {
        INT userid PK AUTO_INCREMENT
        VARCHAR(255) email UNIQUE NOT NULL
        VARCHAR(255) password NOT NULL
        VARCHAR(255) fullname NOT NULL
        VARCHAR(50) role NOT NULL DEFAULT "user"
    }
    
    macro {
        INT macroid PK AUTO_INCREMENT
        VARCHAR(255) macroname NOT NULL
        VARCHAR(255) macrodescription NOT NULL
        VARCHAR(255) app NOT NULL
        VARCHAR(255) category NOT NULL
        VARCHAR(255) macrotype NOT NULL
        TEXT macro NOT NULL
        TIMESTAMP timestamp DEFAULT CURRENT_TIMESTAMP
    }
    
    personal_list {
        INT listid PK AUTO_INCREMENT
        INT userid FK
        INT macroid FK
        VARCHAR(255) activation_key
    }
    
    vote {
        INT voteid PK AUTO_INCREMENT
        INT macroid FK
        INT userid FK
        BOOLEAN vote NOT NULL
    }
    
    comment {
        INT commentid PK AUTO_INCREMENT
        INT macroid FK
        VARCHAR(255) fullname NOT NULL
        TEXT comment NOT NULL
        TIMESTAMP timestamp DEFAULT CURRENT_TIMESTAMP
    }

    %% Suhteet
    user ||--o{ personal_list : "has"
    user ||--o{ vote : "casts"
    macro ||--o{ personal_list : "is in"
    macro ||--o{ vote : "receives"
    macro ||--o{ comment : "has"


### 🌐 FRONTEND
```bash
# Step 0: Navigate to the frontend directory
cd ./web/app/

# Step 1: Run the development server
npm run dev
```

---
