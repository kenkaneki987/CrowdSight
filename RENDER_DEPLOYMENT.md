# 🚀 Deploy Backend to Render

Complete guide to deploy your CrowdSight backend to Render.

## ✅ Prerequisites

- GitHub account
- Render account (sign up at [render.com](https://render.com))
- Your code pushed to GitHub
- Neon PostgreSQL database (already configured ✓)

---

## 📝 Step-by-Step Deployment

### Step 1: Push Your Code to GitHub

If you haven't already:

```bash
cd /Users/kushpuri1/Desktop/projects/CrowdSight

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create a new repo on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/crowdsight.git
git branch -M main
git push -u origin main
```

---

### Step 2: Create Web Service on Render

1. **Go to [render.com](https://render.com) and sign in**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository:**
   - Click "Connect account" to link GitHub
   - Find and select your `crowdsight` repository
   - Click "Connect"

4. **Configure the service:**
   ```
   Name: crowdsight-backend
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install && npx prisma generate
   Start Command: npm start
   ```

5. **Select the Free plan**

---

### Step 3: Add Environment Variables

In the Render dashboard, scroll down to **"Environment Variables"** and add these:

#### Required Variables:

```env
DATABASE_URL
postgresql://neondb_owner:npg_bmT5UwW4ghGp@ep-winter-cherry-ahhabkcj-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

NODE_ENV
production

PORT
5001

FRONTEND_URL
http://localhost:3000
```

**Note:** You'll update `FRONTEND_URL` later when you deploy your frontend!

---

### Step 4: Deploy!

1. **Click "Create Web Service"**

2. **Wait for deployment** (usually 2-3 minutes)
   - Render will:
     - Install dependencies
     - Generate Prisma Client
     - Start your server
   
3. **Check the logs** to ensure it's running:
   ```
   🚀 CrowdSight Backend running on port 5001
   ```

4. **Your backend URL will be:**
   ```
   https://crowdsight-backend.onrender.com
   ```
   (or similar - Render will show you the exact URL)

---

### Step 5: Test Your Deployment

Open your Render URL in a browser:
```
https://crowdsight-backend.onrender.com/
```

You should see:
```json
{
  "message": "CrowdSight API is running",
  "version": "1.0.0",
  "timestamp": "2025-11-18T..."
}
```

---

## 🔄 Update Frontend to Use Deployed Backend

Once deployed, update your frontend to use the production API:

1. **In `frontend/pages/_app.js` or wherever you make API calls:**

```javascript
// For development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Update your .env.local in frontend:
NEXT_PUBLIC_API_URL=https://crowdsight-backend.onrender.com
```

2. **Update CORS in backend** (if needed):
   - Go to Render dashboard → Environment Variables
   - Update `FRONTEND_URL` with your actual frontend URL when you deploy it

---

## 🎯 Important Notes

### Free Tier Limitations:
- ⚠️ **Spin down after 15 minutes of inactivity**
  - First request after inactivity takes ~30-60 seconds (cold start)
  - Subsequent requests are fast
  
- ✅ **Solutions:**
  - Acceptable for development/demo projects
  - Use a ping service like [cron-job.org](https://cron-job.org) to keep it warm
  - Upgrade to paid plan ($7/month) for always-on service

### Database Connection:
- ✅ Your Neon PostgreSQL is already configured
- ✅ Connection string is secure in environment variables
- ✅ SSL is enabled for secure connections

---

## 🔧 Troubleshooting

### "Application failed to respond"
- Check logs in Render dashboard
- Verify PORT environment variable is set
- Ensure `npm start` runs successfully locally

### "Prisma Client not generated"
- Verify build command includes: `npx prisma generate`
- Check that `@prisma/client` is in dependencies (not devDependencies)

### "Can't reach database"
- Verify `DATABASE_URL` is correctly set in environment variables
- Check for trailing spaces in the connection string
- Ensure `sslmode=require` is in the connection string

### Database tables not created:
Run this command locally (one time only):
```bash
cd backend
npx prisma db push
```

---

## 🚀 Next Steps

1. ✅ Backend deployed to Render
2. 🔜 Deploy frontend to Vercel/Netlify
3. 🔜 Update frontend to use production backend URL
4. 🔜 Update backend CORS to allow frontend domain

---

## 📊 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render web service created
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] Health check endpoint working
- [ ] Database connection working
- [ ] API endpoints responding
- [ ] CORS configured for frontend

---

**🎉 Your backend is now live!**

Your API is accessible at: `https://crowdsight-backend.onrender.com`
