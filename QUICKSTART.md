# ⚡ QUICK START - Get Running in 5 Minutes!

## 🎯 Fastest Way to Test Locally

### Method 1: Automated Setup (Recommended)

```bash
# 1. Navigate to project folder
cd music-separator-mern

# 2. Run setup script (installs everything)
chmod +x setup.sh
./setup.sh

# 3. Start backend (Terminal 1)
cd backend
npm start

# 4. Start frontend (Terminal 2 - open new terminal)
cd frontend
npm start
```

Your app will automatically open at `http://localhost:3000`! 🎉

---

### Method 2: Manual Setup

**Terminal 1 - Backend:**
```bash
cd music-separator-mern/backend
npm install
pip3 install demucs --break-system-packages
npm start
```

**Terminal 2 - Frontend:**
```bash
cd music-separator-mern/frontend
npm install
npm start
```

---

## 🧪 Quick Test

1. Open `http://localhost:3000`
2. Drag and drop any MP3 file
3. Click "Separate Audio"
4. Wait 2-3 minutes
5. Download and play stems!

---

## 🌐 Deploy Online (FREE)

### Option 1: All-in-One (Easiest)

**Use Railway.app:**
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "Deploy from GitHub"
4. Select your repo
5. Done! Get your live URL

**Time:** 5 minutes  
**Cost:** FREE ($5 credit/month)

---

### Option 2: Best Performance

**Frontend on Vercel + Backend on Render:**

**Step 1 - Deploy Backend (Render):**
1. Go to https://render.com
2. New Web Service → Connect GitHub
3. Root directory: `backend`
4. Build: `npm install && pip3 install demucs`
5. Start: `npm start`
6. Deploy!

**Step 2 - Deploy Frontend (Vercel):**
1. Go to https://vercel.com
2. Import Project → Connect GitHub
3. Root directory: `frontend`
4. Add env var: `REACT_APP_API_URL` = your Render URL
5. Deploy!

**Time:** 10 minutes  
**Cost:** FREE

---

## 📱 What You Get

✅ **Beautiful animated UI** with glassmorphism  
✅ **Real-time progress tracking** with smooth animations  
✅ **6-stem separation**: Vocals, Drums, Bass, Guitar, Piano, Other  
✅ **Audio preview** for each stem  
✅ **Batch download** all stems as ZIP  
✅ **Fully responsive** works on mobile too  
✅ **Production-ready** can be shared with anyone  

---

## 🎨 UI Features

- **Drag & drop** file upload
- **Animated gradient background** with moving waves
- **Real-time progress** with animated sound waves
- **Glassmorphism cards** modern blur effect
- **Smooth transitions** professional feel
- **Emoji icons** fun and friendly
- **Audio players** built-in for each stem

---

## 📊 Tech Stack

- **Frontend:** React 18 + Modern CSS
- **Backend:** Node.js + Express
- **AI Model:** Meta's Demucs (state-of-the-art)
- **Hosting:** Vercel + Render (both FREE)

---

## 🔧 Common Issues

### "Port 3000 already in use"
```bash
# Kill process using port
lsof -ti:3000 | xargs kill -9
```

### "Demucs not found"
```bash
pip3 install demucs --break-system-packages
# or
pip install demucs
```

### "Cannot connect to backend"
Check if backend is running:
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"ok"}`

---

## 📸 Screenshots to Take for Report

1. **Homepage** - Drag & drop area
2. **File uploaded** - Audio preview
3. **Processing** - Animated progress with stem indicators
4. **Results** - Grid of stems with audio players
5. **Mobile view** - Show responsive design

---

## 🎓 For Your Presentation

### Demo Flow (3 minutes):
1. Show landing page (10 sec)
2. Upload a popular song (10 sec)
3. Explain tech while processing (90 sec)
4. Show results and play stems (60 sec)
5. Mention deployment (10 sec)

### Key Talking Points:
- "Full-stack MERN application"
- "Deployed on cloud for free"
- "State-of-the-art AI model"
- "Modern, responsive UI"
- "Real-time progress updates"

---

## ⏱️ Timeline

| Day | Task | Time |
|-----|------|------|
| **Today** | Setup local + test | 1 hour |
| **Day 2** | Deploy online | 1 hour |
| **Week 2** | Testing + metrics | 5 hours |
| **Week 3** | Report writing | 10 hours |
| **Week 4** | Presentation prep | 5 hours |

**Total: ~22 hours** for a professional project! 🚀

---

## 🎉 You're Ready!

You now have everything you need:
- ✅ Beautiful modern web app
- ✅ Production-ready code
- ✅ Free deployment options
- ✅ Complete documentation

**Just run `./setup.sh` and you're live in 5 minutes!**

Questions? Check the full `README.md` or `DEPLOYMENT_GUIDE.md`

**Good luck! You're going to ace this project!** 🎸✨
