# 🚀 CrowdSight Deployment Guide

Complete guide to deploy CrowdSight to production.

## Deployment Architecture

```
Frontend (Vercel) → Backend (Railway) → Database (Free MySQL)
     :3000              :5000                MySQL
```

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free tier available)
- Choose one free MySQL service (options below)

---

## 1️⃣ Setup Database (Free MySQL Options)

Choose one of these **completely free** MySQL database options:

### Option A: Railway MySQL (Recommended - Same Platform)

1. **In your Railway project:**
   - Click "New Service" → "Database" → "MySQL"
   - Railway will provision a free MySQL database
   - No additional setup required

2. **Get connection string:**
   - Go to MySQL service → "Variables" tab
   - Copy the `DATABASE_URL` (automatically generated)
   - Format: `mysql://user:pass@host:port/dbname`

### Option B: PlanetScale (Free Tier)

1. **Go to [planetscale.com](https://planetscale.com)**
2. **Create new database:**
   - Sign up with GitHub
   - Create database: "crowdsight"
   - Choose free "Hobby" plan
   - Select region closest to you

3. **Get connection string:**
   - Click "Connect" → "Prisma"
   - Copy connection string
   - Format: `mysql://user:pass@aws.connect.psdb.cloud/crowdsight?sslaccept=strict`

### Option C: Aiven MySQL (1 Month Free)

1. **Go to [aiven.io](https://aiven.io)**
2. **Create MySQL service:**
   - Sign up for free account
   - Create MySQL service
   - Choose free trial (1 month)

### Option D: FreeSQLDatabase.com

1. **Go to [freesqldatabase.com](https://freesqldatabase.com)**
2. **Create free MySQL database:**
   - Fill registration form
   - Get database credentials via email
   - 5MB storage limit (good for testing)

**💡 Recommendation:** Use Railway MySQL since it's on the same platform as your backend.

---

## 2️⃣ Deploy Backend (Railway)

### Push to GitHub First

```bash
cd /Users/kushpuri1/Desktop/CrowdSight

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - CrowdSight backend and frontend"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/crowdsight.git
git push -u origin main
```

### Deploy to Railway

1. **Go to [railway.app](https://railway.app)**

2. **Create new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub
   - Select your `crowdsight` repository

3. **Configure backend service:**
   - Railway may auto-detect the setup
   - If not, click "Add Service" → "GitHub Repo"
   - Select `crowdsight` repo

4. **Set root directory:**
   - Go to Settings
   - Set "Root Directory" to `backend`
   - Save changes

5. **Configure environment variables:**
   - Go to "Variables" tab
   - Add the following:

   ```env
   DATABASE_URL=mysql://user:pass@host:port/dbname
   JWT_SECRET=generate-a-strong-random-secret-key-here
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://crowdsight.vercel.app
   ```

   **Note:** If using Railway MySQL, the `DATABASE_URL` will be automatically provided.

6. **Configure build settings:**
   - Go to Settings → "Build"
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`

7. **Deploy:**
   - Railway will automatically deploy
   - Wait for deployment to complete
   - Copy the deployment URL (e.g., `https://crowdsight-production.up.railway.app`)

8. **Initialize database:**
   ```bash
   # After first deployment, push Prisma schema
   DATABASE_URL="your-mysql-url" npx prisma db push
   ```

   Or use Railway CLI:
   ```bash
   railway run npx prisma db push
   ```

### Generate JWT Secret

```bash
# Generate a secure random string for JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 3️⃣ Deploy Frontend (Vercel)

### Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**

2. **Import project:**
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will detect Next.js automatically

3. **Configure project:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `frontend`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Configure environment variables:**
   - Add the following in "Environment Variables":

   ```env
   NEXT_PUBLIC_API_URL=https://crowdsight-production.up.railway.app
   ```

   Replace with your Railway backend URL

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at: `https://crowdsight-xxxx.vercel.app`

6. **Custom domain (optional):**
   - Go to Settings → Domains
   - Add custom domain
   - Follow DNS configuration steps

---

## 4️⃣ Post-Deployment Configuration

### Update CORS Settings (Backend)

If you have CORS issues, update `backend/index.js`:

```javascript
app.use(cors({
  origin: [
    'https://crowdsight.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

### Update Frontend API URL

Make sure frontend's `.env.local` (for local dev) differs from Vercel environment variables:

**Local (`.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Production (Vercel):**
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

---

## 5️⃣ Verify Deployment

### Test Production API

```bash
# Health check
curl https://your-backend.railway.app

# Test signup
curl -X POST https://your-backend.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Test Production Frontend

1. Visit your Vercel URL
2. Try signing up with a new account
3. Login with credentials
4. Access dashboard
5. Verify all features work

---

## 🔒 Security Checklist

- ✅ **Strong JWT_SECRET** - Use 32+ character random string
- ✅ **DATABASE_URL secure** - Never commit to git
- ✅ **Environment variables** - Set in hosting platforms, not in code
- ✅ **HTTPS enabled** - Both Railway and Vercel provide SSL
- ✅ **CORS configured** - Only allow your frontend domain
- ✅ **Password hashing** - bcrypt with 10 rounds (already implemented)
- ✅ **Rate limiting** - Consider adding express-rate-limit
- ✅ **Input validation** - Both frontend and backend (implemented)

---

## 📊 Monitoring & Maintenance

### Railway (Backend + Database)

- **Logs:** View in Railway dashboard → Logs tab
- **Metrics:** CPU, Memory, Network usage for both backend and database
- **Restart:** Settings → Restart service
- **Rollback:** Deployments → Select previous version
- **Database:** Monitor MySQL metrics in separate service

### Vercel (Frontend)

- **Logs:** View in Vercel dashboard → Deployments → View logs
- **Analytics:** Enable Vercel Analytics
- **Preview deployments:** Each PR gets preview URL
- **Rollback:** Deployments → Promote to production

### Database Monitoring (Free Tiers)

**Railway MySQL:**
- **Monitor:** Dashboard shows connections, storage usage
- **Backups:** Manual exports (free tier)
- **Logs:** Query logs in Railway dashboard
- **Scaling:** Upgrade to paid plan for more resources

**PlanetScale:**
- **Monitor:** Dashboard with real-time metrics
- **Backups:** Point-in-time recovery
- **Branching:** Git-like database branching for schema changes
- **Insights:** Query performance and optimization tips

**FreeSQLDatabase:**
- **Monitor:** Basic connection monitoring
- **Backups:** Manual export/import
- **Limited features:** Good for testing only

---

## 🔄 Continuous Deployment

Both Vercel and Railway support automatic deployments:

### Auto-Deploy Setup

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```

2. **Automatic deployment:**
   - Vercel: Deploys on every push to `main`
   - Railway: Deploys on every push to `main`

3. **Preview deployments:**
   - Vercel: Creates preview for each PR
   - Railway: Can configure per branch

---

## 💰 Cost Estimate

### Free Tier (Good for MVP/Demo)

- **Railway MySQL:** Free
  - 512 MB storage
  - 1 GB RAM
  - Included with Railway backend
  
- **PlanetScale:** Free "Hobby" plan
  - 5 GB storage
  - 1 billion row reads/month
  - 10 million row writes/month
  
- **Railway Backend:** $5 credit/month
  - ~500 hours of usage
  - Good for low traffic
  
- **Vercel:** Free
  - Unlimited bandwidth
  - 100 GB-hours compute

**Total Cost:** $0/month (using Railway credits or PlanetScale free tier)

### Alternative Free Options

- **FreeSQLDatabase:** Completely free
  - 5 MB storage (good for testing)
  - No time limit
  - Basic MySQL features

- **Aiven:** 1-month free trial
  - Full MySQL features
  - Then $25/month minimum

### Paid Plans (For Production)

- **Railway:** $20/month (Developer plan)
  - Includes MySQL database
  - No separate database cost needed
  
- **PlanetScale:** $29/month (Scaler plan)
  - 25 GB storage
  - Advanced features
  
- **Vercel:** $20/month (Pro)

**Total:** $40-49/month for production-ready setup

---

## 🚨 Troubleshooting

### Common Issues

**Backend not starting:**
- Check Railway logs
- Verify all environment variables set
- Ensure DATABASE_URL is correct

**Frontend can't connect to backend:**
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS settings
- Ensure backend is deployed and running

**Database connection failed:**
- Check database service is active (Railway/PlanetScale)
- Verify connection string format for MySQL
- Run `npx prisma db push` again
- For Railway: ensure MySQL service is running

**Prisma schema issues:**
- Ensure schema.prisma uses MySQL:
  ```prisma
  generator client {
    provider = "prisma-client-js"
  }

  datasource db {
    provider = "mysql"  // Keep as MySQL
    url      = env("DATABASE_URL")
  }
  ```

**401 Unauthorized errors:**
- Check JWT_SECRET matches between deployments
- Clear browser localStorage
- Verify token format in requests

---

## 📈 Scaling Tips

1. **Add Redis** - For session management and caching
2. **Implement rate limiting** - Prevent abuse
3. **Add logging** - Winston or Morgan for backend
4. **Monitor errors** - Sentry for error tracking
5. **Optimize images** - Use Next.js Image component
6. **Enable caching** - CDN for static assets
7. **Database indexing** - Add indexes for common queries
8. **Load testing** - Test with k6 or Artillery

---

## 🎉 You're Live!

Your CrowdSight application is now deployed and accessible worldwide!

**Share your URLs:**
- Frontend: https://crowdsight.vercel.app
- Backend API: https://crowdsight.railway.app

**Next steps:**
- Set up custom domain
- Configure analytics
- Add monitoring
- Implement more features

---

**Questions?** Check the main README.md or open an issue on GitHub.

Happy deploying! 🚀
