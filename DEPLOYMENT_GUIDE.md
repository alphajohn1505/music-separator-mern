# 🚀 Deployment Guide - Free Hosting

Complete step-by-step guide to deploy your Music Separator app for FREE!

---

## 🎯 Deployment Strategy

We'll use **two separate services** (both free):
- **Vercel** for Frontend (React)
- **Render** for Backend (Node.js + Python)

**Total Cost: $0/month** ✅

---

## 📋 Prerequisites

Before deploying, you need:

1. ✅ GitHub account (free) - https://github.com
2. ✅ Vercel account (free) - https://vercel.com
3. ✅ Render account (free) - https://render.com
4. ✅ Your project code ready

---

## PART 1: Prepare Your Code for Deployment

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository:
   - Name: `music-separator-app`
   - Public (required for free hosting)
   - Don't initialize with README

3. Push your code:
```bash
cd music-separator-mern
git init
git add .
git commit -m "Initial commit - Music Separator App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/music-separator-app.git
git push -u origin main
```

### Step 2: Prepare Frontend for Deployment

Create `.env.production` in `frontend/` directory:

```bash
# frontend/.env.production
REACT_APP_API_URL=https://your-backend-app.onrender.com
```

**Note:** You'll get the actual Render URL in Part 3. For now, use a placeholder.

### Step 3: Prepare Backend for Deployment

Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: music-separator-api
    env: node
    buildCommand: npm install && pip3 install demucs torch torchaudio --break-system-packages
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

---

## PART 2: Deploy Backend on Render (Free)

### Step 1: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Verify your email

### Step 2: Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect GitHub"** and authorize Render
4. Find your `music-separator-app` repository
5. Click **"Connect"**

### Step 3: Configure Service

**Basic Settings:**
- **Name:** `music-separator-api` (or your choice)
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Node`

**Build & Deploy:**
- **Build Command:**
```bash
npm install && pip3 install demucs torch torchaudio --break-system-packages
```

- **Start Command:**
```bash
npm start
```

**Advanced Settings:**
- **Plan:** Free (select this!)
- **Environment Variables:**
  - Click "Add Environment Variable"
  - Key: `PORT`
  - Value: `10000`

### Step 4: Deploy!

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Render will show deployment logs
4. When done, you'll see: ✅ "Live"

### Step 5: Get Your Backend URL

Look for your service URL at the top:
```
https://music-separator-api-xxxx.onrender.com
```

**Copy this URL - you'll need it for the frontend!**

### Step 6: Test Backend

Open in browser:
```
https://your-backend-url.onrender.com/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Music Separator API is running"
}
```

✅ **Backend deployed successfully!**

---

## PART 3: Deploy Frontend on Vercel (Free)

### Step 1: Update Frontend API URL

1. Edit `frontend/src/App.js`
2. Find this line:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

3. Change to:
```javascript
const API_URL = 'https://your-render-backend-url.onrender.com';
```

4. Commit and push:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel

### Step 3: Import Project

1. Click **"Add New..."** → **"Project"**
2. Find your `music-separator-app` repository
3. Click **"Import"**

### Step 4: Configure Project

**Framework Preset:** `Create React App` (auto-detected)

**Root Directory:** Click "Edit" and set to `frontend`

**Build Settings:**
- Build Command: `npm run build` (auto-filled)
- Output Directory: `build` (auto-filled)
- Install Command: `npm install` (auto-filled)

**Environment Variables:**
- Key: `REACT_APP_API_URL`
- Value: `https://your-render-backend-url.onrender.com`

### Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Vercel will build and deploy your app

### Step 6: Get Your Frontend URL

When deployment is complete:
```
https://music-separator-app-xxxx.vercel.app
```

✅ **Frontend deployed successfully!**

---

## PART 4: Test Full Application

### Step 1: Open Your App

Visit your Vercel URL in a browser

### Step 2: Upload Test File

1. Drag and drop an audio file
2. Click "Separate Audio"
3. Wait for processing (2-3 minutes)
4. Check if stems are generated

### Step 3: Verify Downloads

1. Try downloading individual stems
2. Try downloading all as ZIP
3. Test on mobile device too

---

## 🔧 Troubleshooting Deployment Issues

### Issue 1: Backend "Build Failed"

**Error:** `Demucs installation failed`

**Solution:**
Update Build Command in Render:
```bash
pip3 install --upgrade pip && pip3 install demucs torch torchaudio --break-system-packages --no-cache-dir
```

### Issue 2: "CORS Error" in Frontend

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
Backend is already configured with CORS. Verify:
1. API_URL in frontend is correct
2. No typos in URL
3. Backend is running (check health endpoint)

### Issue 3: Backend Times Out

**Error:** Request takes too long

**Cause:** Free tier on Render "spins down" after inactivity

**Solution:**
- First request after idle takes 30-60 seconds (backend wakes up)
- This is normal on free tier
- Upgrading to paid tier ($7/month) keeps it always on

### Issue 4: Frontend Shows Old Version

**Solution:**
1. Go to Vercel dashboard
2. Click your project
3. Go to "Deployments" tab
4. Click "Redeploy" on latest

### Issue 5: "Module not found" Error

**Backend:**
```bash
# In Render dashboard, go to Shell and run:
npm install
```

**Frontend:**
```bash
# Redeploy from Vercel dashboard
```

---

## 🎨 Custom Domain (Optional)

### For Frontend (Vercel):

1. Buy domain from Namecheap/GoDaddy (~$10/year)
2. In Vercel project settings → "Domains"
3. Add your domain
4. Update DNS records as instructed
5. Wait 24-48 hours for propagation

### For Backend (Render):

1. In Render dashboard → Custom Domain
2. Add your subdomain (e.g., api.yourdomain.com)
3. Update DNS records
4. Update frontend API_URL to new domain

---

## 📊 Free Tier Limits

### Vercel (Frontend):
- ✅ Unlimited bandwidth
- ✅ Unlimited deployments
- ✅ Automatic SSL
- ✅ Global CDN
- ⚠️ 100GB bandwidth/month (more than enough)

### Render (Backend):
- ✅ 750 hours/month (enough for 1 always-on service)
- ✅ 512MB RAM
- ✅ Automatic SSL
- ⚠️ Spins down after 15 min inactivity (wakes on request)
- ⚠️ Build minutes limited (but plenty for this project)

**Both are MORE than sufficient for your academic project!**

---

## 🔄 Updating Your App

### To Update Frontend:
```bash
# Make changes to frontend code
git add .
git commit -m "Update frontend"
git push
# Vercel automatically redeploys!
```

### To Update Backend:
```bash
# Make changes to backend code
git add .
git commit -m "Update backend"
git push
# Render automatically redeploys!
```

**Both services have automatic deployment from GitHub!**

---

## 📱 Alternative: Deploy Everything on Railway

If you want simpler single-platform deployment:

### Railway (Free $5 credit/month):

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects and configures everything
6. Deploy both frontend and backend together

**Pros:**
- Simpler (one platform)
- No need to manage CORS
- Good for beginners

**Cons:**
- Free credit runs out faster
- Less control than Vercel + Render

---

## 🎯 Deployment Checklist

Before submission, verify:

- [ ] Backend is deployed and accessible
- [ ] Health endpoint returns success
- [ ] Frontend is deployed and loads
- [ ] Can upload audio files
- [ ] Processing works end-to-end
- [ ] Can play separated stems
- [ ] Can download stems
- [ ] Works on mobile
- [ ] No console errors
- [ ] URLs are shareable

---

## 📝 What to Include in Your Report

### Deployment Section:

```markdown
## Deployment

The application is deployed using a modern cloud architecture:

**Frontend:** Deployed on Vercel (https://your-app.vercel.app)
- Global CDN for fast loading
- Automatic HTTPS
- GitHub integration for CI/CD

**Backend:** Deployed on Render (https://your-api.onrender.com)
- RESTful API server
- Python integration for Demucs
- Automatic scaling

**Technologies:**
- React 18 for frontend
- Node.js + Express for backend
- Meta's Demucs for AI processing
- Cloud deployment on free tier

**Accessibility:** 
The application is publicly accessible and can be tested by anyone
with internet access.
```

---

## 🎉 Congratulations!

You now have a **live, production-grade web application** deployed on the internet!

**Share your URL with:**
- Friends and family
- Classmates for feedback
- Professors for demonstration
- Include in your resume/portfolio

**Your app is now:**
- ✅ Accessible 24/7
- ✅ Fast and responsive
- ✅ Professional quality
- ✅ Free to host

**This is a real achievement!** Most students never deploy their projects. You've gone above and beyond! 🚀🎵✨

---

## 📞 Need Help?

If deployment fails:

1. Check Render/Vercel build logs for errors
2. Verify all environment variables are set
3. Confirm GitHub repo is public
4. Test locally first to ensure code works
5. Check service status pages:
   - https://www.vercel-status.com/
   - https://status.render.com/

**Remember:** The free tiers are perfect for academic projects and have more than enough resources for your demo and testing!
