# 🚀 CrowdSight Deployment Guide

## Overview
This guide will help you deploy CrowdSight to production using free hosting services.

**Deployment Stack:**
- **Backend API**: Render.com (Free)
- **Frontend**: Vercel.com (Free)  
- **Database**: Neon.tech (Free PostgreSQL)

---

## 🗄️ Step 1: Database Setup (Neon)

### 1.1 Create Neon Account
1. Go to [Neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create a new project: **"CrowdSight"**

### 1.2 Get Database URL
1. In Neon dashboard, go to **Connection Details**
2. Copy the connection string (looks like):
   ```
   postgresql://username:password@hostname.neon.tech/dbname?sslmode=require
   ```

### 1.3 Test Database Connection
```bash
cd backend
# Update your .env file with the Neon URL
echo "DATABASE_URL=your_neon_connection_string_here" > .env
echo "JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")" >> .env

# Test the connection
npm run prisma:push
```

---

## 🔧 Step 2: Backend Deployment (Render)

### 2.1 Prepare Backend for Production
1. Ensure your `package.json` has proper scripts:
   ```json
   {
     "scripts": {
       "dev": "nodemon index.js",
       "start": "node index.js",
       "build": "npx prisma generate",
       "prisma:generate": "prisma generate",
       "prisma:push": "prisma db push"
     }
   }
   ```

2. Make sure `render.yaml` exists (already configured ✅)

### 2.2 Deploy to Render
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository: `CrowdSight`
5. Configure:
   - **Name**: `crowdsight-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`

### 2.3 Set Environment Variables
In Render dashboard, add these environment variables:

| Key | Value | Note |
|-----|-------|------|
| `DATABASE_URL` | `your_neon_connection_string` | From Step 1.2 |
| `JWT_SECRET` | `generate_random_64_char_string` | Use crypto.randomBytes |
| `NODE_ENV` | `production` | Production mode |
| `FRONTEND_URL` | `https://your-vercel-app.vercel.app` | Will get this in Step 3 |

### 2.4 Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🌐 Step 3: Frontend Deployment (Vercel)

### 3.1 Update Frontend for Production
Create `.env.local` in frontend directory:
```bash
# Frontend Environment Variables
NEXT_PUBLIC_BACKEND_URL=https://your-render-app.onrender.com
```

### 3.2 Update API Base URL
The frontend is already configured to use environment variables ✅

### 3.3 Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"New Project"**
4. Import `CrowdSight` repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3.4 Set Vercel Environment Variables
In Vercel project settings → Environment Variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://your-backend-app.onrender.com` |

---

## 🔗 Step 4: Connect Frontend & Backend

### 4.1 Update CORS in Backend
Once you have your Vercel URL, update backend environment:
- Go to Render dashboard
- Update `FRONTEND_URL` to your Vercel app URL
- Redeploy backend

### 4.2 Test Connection
1. Visit your Vercel app URL
2. Try to register/login
3. Create a test report
4. Check admin portal

---

## 📂 Step 5: File Structure Check

Ensure your project structure is correct:
```
CrowdSight/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── package.json
│   ├── index.js
│   └── render.yaml ✅
├── frontend/
│   ├── pages/
│   ├── styles/
│   ├── package.json
│   └── next.config.js
└── README.md
```

---

## 🔧 Step 6: Production Configuration Files

### Backend Production Updates Needed:
- Database connection configured ✅
- CORS configured for production ✅  
- Environment variables ready ✅
- Build scripts ready ✅

### Frontend Production Updates Needed:
- API URL environment variable ✅
- Build configuration ✅
- Static export disabled (using SSR) ✅

---

## 🚀 Step 7: Deploy Commands

### Quick Deployment Checklist:

1. **Database (Neon)**:
   ```bash
   # Already have account? Update .env and run:
   cd backend && npm run prisma:push
   ```

2. **Backend (Render)**:
   - Push code to GitHub
   - Connect repository in Render
   - Set environment variables
   - Deploy automatically

3. **Frontend (Vercel)**:
   - Push code to GitHub  
   - Connect repository in Vercel
   - Set NEXT_PUBLIC_BACKEND_URL
   - Deploy automatically

---

## 📋 Final URLs

After deployment, you'll have:
- **Frontend**: `https://crowdsight.vercel.app`
- **Backend API**: `https://crowdsight-backend.onrender.com`
- **Database**: Managed by Neon

---

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**: 
   - Check FRONTEND_URL in backend env vars
   - Ensure no trailing slashes

2. **Database Connection**:
   - Verify DATABASE_URL format
   - Check Neon dashboard for connection details

3. **API Not Working**:
   - Check Render logs
   - Verify environment variables
   - Test endpoints individually

4. **Frontend Build Errors**:
   - Check Vercel build logs
   - Verify NEXT_PUBLIC_BACKEND_URL

---

## 🎯 Production Features

Your deployed CrowdSight will have:
- ✅ User authentication with JWT
- ✅ Role-based access (User/Admin)
- ✅ Report CRUD operations
- ✅ Pagination (10 items per page)
- ✅ Search, sort, and filter
- ✅ Image upload support
- ✅ Responsive design
- ✅ Admin portal for management

Ready to deploy! 🚀