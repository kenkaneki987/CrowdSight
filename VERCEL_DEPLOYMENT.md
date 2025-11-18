# 🚀 Deploy Frontend to Vercel

Complete guide to deploy your CrowdSight Next.js frontend to Vercel.

## ✅ Prerequisites

- GitHub repository (already done ✓)
- Backend deployed on Render (already done ✓)
- Render backend URL (e.g., `https://crowdsight-backend-xxxx.onrender.com`)

---

## 📝 Step-by-Step Deployment

### Step 1: Sign Up for Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Sign Up"**
3. **Choose "Continue with GitHub"**
4. **Authorize Vercel** to access your GitHub repositories

---

### Step 2: Import Your Project

1. **Click "Add New..."** → **"Project"**

2. **Import Git Repository:**
   - Find `kenkaneki987/CrowdSight`
   - Click "Import"

3. **Configure Project:**
   ```
   Framework Preset: Next.js (auto-detected)
   Root Directory: frontend
   Build Command: npm run build (auto-detected)
   Output Directory: .next (auto-detected)
   Install Command: npm install (auto-detected)
   ```

---

### Step 3: Add Environment Variable

**IMPORTANT:** Before deploying, add your backend API URL!

1. **Expand "Environment Variables" section**

2. **Add this variable:**
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://your-backend-url.onrender.com
   ```
   
   **Replace with your actual Render backend URL!**
   
   Example:
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://crowdsight-backend-abc123.onrender.com
   ```

3. **Keep it for:** All (Production, Preview, and Development)

---

### Step 4: Deploy!

1. **Click "Deploy"**

2. **Wait for deployment** (usually 1-2 minutes)
   - Vercel will:
     - ✅ Clone your repository
     - ✅ Install dependencies
     - ✅ Build your Next.js app
     - ✅ Deploy to their CDN

3. **Your frontend URL will be:**
   ```
   https://crowd-sight.vercel.app
   ```
   (or similar - Vercel will show you the exact URL)

---

### Step 5: Update Backend CORS

Now that your frontend is deployed, update your backend to allow requests from it:

1. **Go to Render Dashboard**
2. **Select your backend service**
3. **Go to "Environment" tab**
4. **Update `FRONTEND_URL`:**
   ```
   Key: FRONTEND_URL
   Value: https://your-frontend-url.vercel.app
   ```

5. **Save Changes** (backend will auto-redeploy)

---

### Step 6: Update Backend CORS Code (Optional)

If you want to allow both localhost and production:

In `backend/index.js`, update CORS configuration:

```javascript
// Middleware Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://crowd-sight.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

Commit and push this change if needed.

---

## 🎯 Testing Your Deployment

### Test the Frontend:
1. Visit your Vercel URL
2. Try signing up with a new account
3. Try logging in
4. Check if dashboard loads

### Test the API Connection:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try signup/login
4. Check if API calls are successful (no CORS errors)

---

## 🔧 Troubleshooting

### "CORS Error" or "Network Error"

**Problem:** Backend not allowing requests from frontend

**Solution:**
1. Verify `FRONTEND_URL` in Render backend settings
2. Make sure it matches your Vercel URL exactly
3. No trailing slash in the URL
4. Restart backend service on Render

### "API_URL is undefined"

**Problem:** Environment variable not set

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `NEXT_PUBLIC_API_URL` with your Render backend URL
3. Redeploy from Vercel Dashboard

### "Failed to fetch" or timeout

**Problem:** Backend is in cold start (free tier)

**Solution:**
- Wait 30-60 seconds for backend to wake up
- Try the request again
- Consider keeping backend warm with a cron job

### Build Failed

**Problem:** Build errors during deployment

**Solution:**
1. Check Vercel build logs
2. Verify `frontend` is set as root directory
3. Make sure all dependencies are in `package.json`
4. Test build locally: `cd frontend && npm run build`

---

## 📊 Custom Domain (Optional)

Want a custom domain like `crowdsight.com`?

1. **Go to Vercel Dashboard** → Your Project → Settings → Domains
2. **Add your domain**
3. **Update DNS records** (Vercel will guide you)
4. **Update backend `FRONTEND_URL`** to your custom domain

---

## 🎉 Deployment Complete!

Your full-stack app is now live:

- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.onrender.com`
- **Database:** Neon PostgreSQL (hosted)

### Architecture:
```
User → Vercel (Frontend) → Render (Backend) → Neon (Database)
```

### What's Free:
- ✅ Vercel: Unlimited deployments, bandwidth
- ✅ Render: 750 hours/month free tier
- ✅ Neon: 512MB database free

---

## 🔄 Future Updates

To update your app:

1. **Make changes locally**
2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. **Automatic deployment:**
   - Vercel auto-deploys frontend
   - Render auto-deploys backend

No manual steps needed! 🎉

---

## 📋 Quick Reference

### Frontend Environment Variables:
```
NEXT_PUBLIC_API_URL = https://your-backend.onrender.com
```

### Backend Environment Variables:
```
DATABASE_URL = postgresql://...
JWT_SECRET = your-secret-key
NODE_ENV = production
FRONTEND_URL = https://your-frontend.vercel.app
```

---

**🎊 Congratulations! Your app is fully deployed and live!**
