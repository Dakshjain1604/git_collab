# 🚀 How to Run the Resume Analyzer Application

## Quick Start (Easiest Method)

### Step 1: Make sure you're in the project directory
```bash
cd "/Users/dakshjain/Desktop/College Project/git_collab"
```

### Step 2: Run the automated startup script
```bash
./start.sh
```

This will automatically:
- ✅ Check and install dependencies
- ✅ Start MongoDB (if not running)
- ✅ Start AI Backend on port 8000
- ✅ Start Backend API on port 3000
- ✅ Start Frontend on port 5173

**Press `Ctrl+C` to stop all services**

---

## Manual Start (If you prefer more control)

Open **4 separate terminal windows/tabs**:

### Terminal 1: MongoDB
```bash
cd "/Users/dakshjain/Desktop/College Project/git_collab"

# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# OR if MongoDB is already installed differently
mongod --dbpath ~/data/db
```

### Terminal 2: AI Backend (Python/FastAPI)
```bash
cd "/Users/dakshjain/Desktop/College Project/git_collab/AI_backend"

# Install dependencies (first time only)
uv sync
# OR: pip install -r requirements.txt

# Start the server
python main.py
```

You should see: `Uvicorn running on http://0.0.0.0:8000`

### Terminal 3: Backend API (Node.js/Express)
```bash
cd "/Users/dakshjain/Desktop/College Project/git_collab/Backend"

# Install dependencies (first time only)
npm install

# Start the server
npm run dev
```

You should see: `Backend server running on port 3000`

### Terminal 4: Frontend (React/Vite)
```bash
cd "/Users/dakshjain/Desktop/College Project/git_collab/Fe"

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

You should see: `Local: http://localhost:5173`

---

## ✅ Verify Everything is Running

### Check AI Backend
Open browser or run:
```bash
curl http://localhost:8000/health
```
Should return: `{"status":"healthy",...}`

### Check Backend API
```bash
curl http://localhost:3000/
```
Should return: `{"message":"back"}`

### Check Frontend
Open browser: **http://localhost:5173**

---

## 🎯 Using the Application

1. **Open your browser**: Go to http://localhost:5173

2. **Sign Up**:
   - Click "Create New Account" or go to http://localhost:5173/user/signup
   - Enter your details (email, password, name)
   - Click "Register"

3. **Sign In**:
   - Go to http://localhost:5173/user/signin
   - Enter your email and password
   - Click "Sign In"

4. **Upload and Analyze Resume**:
   - Click "New Analysis" in the dashboard
   - Upload a PDF or DOCX resume file
   - Paste the job description
   - (Optional) Enter job title
   - Click "Start AI Analysis"
   - Wait for results!

5. **View History**:
   - Click "History" in the sidebar
   - See all your previous analyses

6. **View Profile**:
   - Click on your profile icon or go to http://localhost:5173/user/profile
   - Edit your profile if needed

---

## 🛑 Stop the Application

### If using start.sh script:
Press `Ctrl+C` in the terminal where you ran `./start.sh`

### If running manually:
Press `Ctrl+C` in each terminal window

### Stop MongoDB:
```bash
brew services stop mongodb-community
```

---

## 📋 Prerequisites Checklist

Before running, make sure you have:

- [ ] **Node.js** installed (v18+)
  - Check: `node --version`
  - Install: https://nodejs.org/

- [ ] **Python** installed (v3.13+)
  - Check: `python --version`
  - Install: https://www.python.org/

- [ ] **MongoDB** installed and running
  - Check: `mongod --version`
  - Install: `brew install mongodb-community` (macOS)
  - Or use MongoDB Atlas (cloud)

- [ ] **Environment Variables** configured:
  - `Backend/.env` file with:
    ```
    MONGODB_URL=mongodb://localhost:27017/resume_analyzer
    JWT_SECRET=your-super-secret-jwt-key-change-this
    ```
  - `AI_backend/.env` file with (optional but recommended):
    ```
    OPENAI_API_KEY=your_openai_api_key_here
    ```

---

## 🐛 Common Issues

### Port Already in Use
If you see "port already in use" errors:
```bash
# Check what's using the port
lsof -i :8000  # AI Backend
lsof -i :3000  # Backend API
lsof -i :5173  # Frontend

# Kill the process (replace PID with actual process ID)
kill -9 <PID>
```

### MongoDB Not Starting
```bash
# Check if MongoDB is running
pgrep mongod

# Start MongoDB manually
brew services start mongodb-community

# Check MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

### Dependencies Not Found
```bash
# Backend
cd Backend && npm install

# Frontend
cd Fe && npm install

# AI Backend
cd AI_backend && uv sync
# OR: pip install -r requirements.txt
```

### CORS Errors in Browser
- Make sure all services are running
- Check browser console for specific errors
- Verify backend CORS allows `http://localhost:5173`

---

## 📞 Need Help?

1. Check the logs:
   - AI Backend: `cat logs/ai_backend.log`
   - Backend API: `cat logs/backend.log`
   - Frontend: Check browser console (F12)

2. Verify all services are running:
   ```bash
   # Check ports
   lsof -i :8000
   lsof -i :3000
   lsof -i :5173
   ```

3. Test each service individually:
   - AI Backend: http://localhost:8000/health
   - Backend API: http://localhost:3000/
   - Frontend: http://localhost:5173

---

## 🎉 You're All Set!

Once all services are running, open **http://localhost:5173** in your browser and start using the Resume Analyzer!




