# 🚀 Quick Start Guide - Resume Analyzer

## ✅ Pre-Flight Checklist

Before starting, ensure you have:

1. ✅ **Environment Variables Configured**:
   - `Backend/.env` with `MONGODB_URL` and `JWT_SECRET`
   - `AI_backend/.env` with `OPENAI_API_KEY` (optional but recommended)

2. ✅ **MongoDB Running**: 
   - Local MongoDB on port 27017, OR
   - MongoDB Atlas connection string in `.env`

3. ✅ **Dependencies Installed**:
   - Backend: `cd Backend && npm install`
   - Frontend: `cd Fe && npm install`
   - AI Backend: `cd AI_backend && uv sync` (or `pip install -r requirements.txt`)

## 🎯 Start Everything

### Option 1: Automated Script (Recommended)
```bash
./start.sh
```

This will start all services automatically:
- MongoDB (if not running)
- AI Backend (port 8000)
- Backend API (port 3000)
- Frontend (port 5173)

### Option 2: Manual Start

**Terminal 1 - AI Backend:**
```bash
cd AI_backend
python main.py
# Should see: "Uvicorn running on http://0.0.0.0:8000"
```

**Terminal 2 - Backend API:**
```bash
cd Backend
npm run dev
# Should see: "Backend server running on port 3000"
```

**Terminal 3 - Frontend:**
```bash
cd Fe
npm run dev
# Should see: "Local: http://localhost:5173"
```

## 🔍 Verify Everything is Working

### 1. Check AI Backend
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy","timestamp":"...","service":"Resume Analyzer AI Backend"}
```

### 2. Check Backend API
```bash
curl http://localhost:3000/
# Should return: {"message":"back"}
```

### 3. Check Frontend
Open browser: http://localhost:5173

### 4. Test Full Flow

1. **Sign Up**: Go to http://localhost:5173/user/signup
   - Create a new account
   - You'll be redirected to signin

2. **Sign In**: http://localhost:5173/user/signin
   - Login with your credentials
   - You'll be redirected to dashboard

3. **Upload Resume**: 
   - Click "New Analysis"
   - Upload a PDF/DOCX resume
   - Paste a job description
   - Click "Start AI Analysis"
   - Wait for results!

## 🐛 Troubleshooting

### AI Backend Not Starting
- Check if port 8000 is available: `lsof -i :8000`
- Verify Python dependencies: `python -c "import fastapi"`
- Check logs: `cat logs/ai_backend.log`

### Backend API Not Starting
- Check if port 3000 is available: `lsof -i :3000`
- Verify MongoDB connection in `.env`
- Check logs: `cat logs/backend.log`

### Frontend Not Loading
- Check if port 5173 is available: `lsof -i :5173`
- Clear browser cache
- Check browser console for errors

### MongoDB Connection Issues
- Verify MongoDB is running: `pgrep mongod`
- Check connection string format: `mongodb://localhost:27017/database_name`
- Test connection: `mongosh mongodb://localhost:27017`

### CORS Errors
- Ensure backend CORS allows `http://localhost:5173`
- Check browser console for specific CORS errors
- Verify all services are running on correct ports

### Authentication Errors
- Check JWT_SECRET is set in Backend/.env
- Verify token is being stored: `localStorage.getItem('token')` in browser console
- Clear localStorage and sign in again

## 📊 Service Status

| Service | Port | Health Check | Status |
|---------|------|--------------|--------|
| AI Backend | 8000 | http://localhost:8000/health | ✅ |
| Backend API | 3000 | http://localhost:3000/ | ✅ |
| Frontend | 5173 | http://localhost:5173 | ✅ |
| MongoDB | 27017 | `mongosh localhost:27017` | ✅ |

## 🛑 Stop Everything

```bash
./stop.sh
```

Or manually:
- Press `Ctrl+C` in each terminal
- Stop MongoDB: `brew services stop mongodb-community`

## 📝 Next Steps

1. ✅ Test user signup/signin
2. ✅ Upload a resume and analyze it
3. ✅ Check analysis history
4. ✅ View profile and edit it
5. ✅ Test dashboard statistics

Everything should be working end-to-end now! 🎉




