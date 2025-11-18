# ✅ Evaluation Checklist - CrowdSight Project

## 📋 Pre-Evaluation Requirements

### ✅ Frontend Deployment
- [ ] Hosted on Vercel/Netlify/AWS
- [ ] Link is functional and accessible
- [ ] Belongs to your own account (kenkaneki987)
- [ ] Backend URL integrated in production mode via `NEXT_PUBLIC_API_URL`
- [ ] All pages load correctly (Home, Login, Signup, Dashboard)

**Vercel Environment Variable Required:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

---

### ✅ Backend Deployment
- [x] Hosted on Render (Free tier)
- [x] Belongs to your own account
- [x] Production database URL configured (Neon PostgreSQL)
- [x] Environment variables properly set
- [ ] Health check endpoint working: `GET /`
- [ ] API endpoints responding: `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`

**Render Environment Variables Required:**
```
DATABASE_URL=postgresql://neondb_owner:npg_bmT5UwW4ghGp@ep-winter-cherry-ahhabkcj-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
NODE_ENV=production
PORT=5001
FRONTEND_URL=https://your-frontend-url.vercel.app
```

---

### ✅ Database Deployment
- [x] Neon PostgreSQL (Free tier)
- [x] Belongs to your own account
- [x] Connection string points to production environment
- [x] Schema deployed via `npx prisma db push`
- [ ] Users table exists and is accessible

**Verify Database:**
```bash
cd backend
npx prisma studio
```

---

### ✅ Sign-Up Verification
**Test Steps:**
1. [ ] Go to your production frontend URL
2. [ ] Navigate to `/signup`
3. [ ] Fill in: Name, Email, Password
4. [ ] Click "Sign Up"
5. [ ] Check for success message/redirect
6. [ ] **Verify in Database:** 
   - Go to Neon dashboard
   - Check `users` table
   - Confirm new entry exists
   - **Verify password is HASHED** (should start with `$2b$10$...`)

**Expected Database Entry:**
```
id: cuid (e.g., clpqr...)
name: "Test User"
email: "test@example.com"
password: "$2b$10$hashedpasswordstring..."
createdAt: timestamp
updatedAt: timestamp
```

---

### ✅ Sign-In Verification
**Test Steps:**
1. [ ] Go to your production frontend URL
2. [ ] Navigate to `/login`
3. [ ] Enter registered email and password
4. [ ] Click "Login"
5. [ ] **Verify JWT Token:**
   - Open browser DevTools (F12)
   - Go to "Application" → "Local Storage"
   - Find `token` key
   - Copy the token value
6. [ ] **Verify on jwt.io:**
   - Go to [jwt.io](https://jwt.io)
   - Paste token in "Encoded" section
   - **Check payload contains:**
     ```json
     {
       "userId": "cuid_here",
       "email": "test@example.com",
       "iat": timestamp,
       "exp": timestamp (7 days from iat)
     }
     ```
7. [ ] Verify redirect to `/dashboard`
8. [ ] Confirm dashboard loads with user data

---

### ✅ GitHub Repository
- [x] Repository: https://github.com/kenkaneki987/CrowdSight
- [ ] **Hosted frontend URL in README.md** (UPDATE THIS!)
- [x] **Project proposal in README.md** ✓
- [x] All code pushed to main branch
- [x] `.env` files in `.gitignore` (secrets not exposed)

**Required Updates to README:**
```markdown
## 🌐 Live Demo

- **Frontend (Vercel):** https://your-app.vercel.app
- **Backend (Render):** https://your-backend.onrender.com
```

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend to Render
1. Go to [render.com](https://render.com)
2. New Web Service → Connect GitHub repo
3. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`
4. Add all environment variables (listed above)
5. Deploy and wait ~3 minutes
6. Copy backend URL

### Step 2: Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Configure:
   - Root Directory: `frontend`
   - Framework: Next.js (auto-detected)
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = Your Render backend URL
5. Deploy and wait ~2 minutes
6. Copy frontend URL

### Step 3: Update Backend CORS
1. Go to Render dashboard
2. Select your backend service
3. Environment tab
4. Update `FRONTEND_URL` with your Vercel URL
5. Save (auto-redeploys)

### Step 4: Update README
1. Edit README.md locally
2. Add your deployed URLs under "Live Demo" section
3. Commit and push:
   ```bash
   git add README.md
   git commit -m "Add deployment URLs"
   git push
   ```

---

## 🧪 Pre-Evaluation Testing

### Manual Test Script
```bash
# 1. Test Backend Health
curl https://your-backend.onrender.com/

# Expected: {"message":"CrowdSight API is running",...}

# 2. Test Signup
curl -X POST https://your-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test@123"}'

# Expected: {"message":"User created successfully","user":{...}}

# 3. Test Login
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'

# Expected: {"message":"Login successful","token":"jwt_token_here","user":{...}}

# 4. Verify JWT at jwt.io (copy token from response)
```

### Browser Test
1. Open frontend URL in incognito window
2. Signup → Should redirect to login
3. Login → Should redirect to dashboard
4. Check DevTools for errors
5. Verify token in localStorage
6. Verify API calls succeed (Network tab)

---

## ⚠️ Common Issues & Solutions

### CORS Error
**Problem:** `Access-Control-Allow-Origin` error
**Solution:** 
- Verify `FRONTEND_URL` in Render matches exact Vercel URL
- No trailing slash
- Redeploy backend after changing

### Database Connection Error
**Problem:** `Can't reach database`
**Solution:**
- Verify `DATABASE_URL` in Render
- Check Neon database is active
- Ensure `sslmode=require` in connection string

### JWT Verification Fails
**Problem:** Token invalid or expired
**Solution:**
- Check `JWT_SECRET` matches in backend
- Verify token not expired (7 days)
- Clear localStorage and login again

### 404 on Backend Routes
**Problem:** Routes not found
**Solution:**
- Verify root directory is `backend` in Render
- Check build logs for errors
- Ensure `npm start` command is correct

---

## 📸 Screenshots to Prepare

1. Signup page with test user
2. Successful signup message
3. Database entry showing hashed password
4. Login page with credentials
5. JWT token in localStorage
6. JWT decoded on jwt.io showing payload
7. Dashboard with user data
8. Neon database dashboard showing users table

---

## ✅ Final Pre-Evaluation Checklist

Before evaluation, ensure:

- [ ] All 3 services deployed (Frontend, Backend, Database)
- [ ] All belong to YOUR accounts
- [ ] Frontend URL added to README
- [ ] Signup works in production
- [ ] Database shows new entry with hashed password
- [ ] Login works in production
- [ ] JWT token verifiable on jwt.io
- [ ] Dashboard accessible after login
- [ ] All links functional
- [ ] No console errors in browser
- [ ] Project proposal in README
- [ ] Code pushed to GitHub

---

## 🎯 Evaluation Day Checklist

- [ ] Have all URLs ready to share
- [ ] Have database credentials ready
- [ ] Have a test email/password ready
- [ ] Tested signup/login 30 mins before
- [ ] Backend not in cold start (visit URL to wake it)
- [ ] Browser DevTools ready for JWT verification
- [ ] Neon dashboard open to show database

---

**⚠️ Important:** Test everything 30 minutes before evaluation. Render free tier has cold starts (~30-60 seconds) on first request.

**✅ Good luck with your evaluation!**
