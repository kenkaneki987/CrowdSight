# 🚀 CrowdSight Setup Guide

Complete guide to get CrowdSight up and running locally.

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18+ installed ([download](https://nodejs.org/))
- ✅ npm or yarn package manager
- ✅ Git installed
- ✅ PlanetScale account (free tier works) or MySQL database

## Step-by-Step Setup

### 1️⃣ Clone/Navigate to Project

```bash
cd /Users/kushpuri1/Desktop/CrowdSight
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# This installs:
# - express (web server)
# - prisma & @prisma/client (database ORM)
# - bcrypt (password hashing)
# - jsonwebtoken (JWT auth)
# - cors (cross-origin requests)
# - dotenv (environment variables)
```

### 3️⃣ Configure Backend Environment

```bash
# Copy the example environment file
cp .env.example .env

# Open .env and configure:
nano .env  # or use any text editor
```

**Required environment variables:**

```env
# PlanetScale MySQL connection string
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/crowdsight?sslaccept=strict"

# Generate a secure JWT secret (use random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server port
PORT=5000

# Environment
NODE_ENV=development
```

**Getting PlanetScale Connection String:**

1. Go to [planetscale.com](https://planetscale.com)
2. Create account (free tier available)
3. Create new database named `crowdsight`
4. Click "Connect" → Select "Prisma"
5. Copy the connection string

### 4️⃣ Setup Database with Prisma

```bash
# Generate Prisma Client (creates database client code)
npx prisma generate

# Push schema to PlanetScale (creates User table)
npx prisma db push

# Optional: Open Prisma Studio to view database
npx prisma studio
```

### 5️⃣ Start Backend Server

```bash
# Start development server with auto-reload
npm run dev

# You should see:
# 🚀 CrowdSight Backend running on port 5000
# 📍 Environment: development
```

**Test backend:**
```bash
curl http://localhost:5000
# Should return: {"message":"CrowdSight API is running",...}
```

### 6️⃣ Frontend Setup (New Terminal Window)

```bash
# Open new terminal and navigate to frontend
cd /Users/kushpuri1/Desktop/CrowdSight/frontend

# Install all dependencies
npm install

# This installs:
# - next, react, react-dom (Next.js framework)
# - tailwindcss (styling)
# - axios (HTTP requests)
# - react-hook-form (form validation)
```

### 7️⃣ Configure Frontend Environment

```bash
# Copy environment file
cp .env.example .env.local

# Open and configure
nano .env.local
```

**Required environment variable:**

```env
# Backend API URL (local development)
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 8️⃣ Start Frontend Server

```bash
# Start Next.js development server
npm run dev

# You should see:
# - ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 9️⃣ Test the Application

**Open your browser and visit:**
- **Landing Page:** http://localhost:3000
- **Signup:** http://localhost:3000/signup
- **Login:** http://localhost:3000/login

**Test the complete flow:**

1. ✅ Click "Get Started" on landing page
2. ✅ Fill out signup form with:
   - Name: Your Name
   - Email: test@example.com
   - Password: test123
3. ✅ Submit form (creates account)
4. ✅ Should redirect to dashboard automatically
5. ✅ Logout and try logging in again

## 🎉 Success!

You now have CrowdSight running locally with:
- ✅ Backend API on http://localhost:5000
- ✅ Frontend app on http://localhost:3000
- ✅ Database connected via PlanetScale
- ✅ Full authentication flow working

## 🔧 Troubleshooting

### Backend Issues

**Problem:** `Cannot find module 'express'`
```bash
cd backend && npm install
```

**Problem:** `Prisma Client not generated`
```bash
npx prisma generate
```

**Problem:** Database connection error
- Check DATABASE_URL in .env
- Ensure PlanetScale database is active
- Verify connection string is correct

**Problem:** JWT_SECRET error
- Make sure JWT_SECRET is set in .env
- Use a long, random string

### Frontend Issues

**Problem:** `Module not found` errors
```bash
cd frontend && npm install
```

**Problem:** Can't connect to backend
- Ensure backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in .env.local
- Check browser console for CORS errors

**Problem:** Tailwind styles not working
```bash
# Restart dev server
npm run dev
```

### Common Mistakes

❌ **Forgot to start backend** - Both servers must run simultaneously
❌ **Wrong .env file** - Backend uses `.env`, frontend uses `.env.local`
❌ **Port already in use** - Kill process or use different port
❌ **Didn't run prisma generate** - Must run after schema changes

## 📝 Quick Commands Reference

```bash
# Backend
cd backend
npm run dev          # Start backend server
npx prisma studio    # Open database GUI
npx prisma db push   # Update database schema

# Frontend
cd frontend
npm run dev          # Start frontend server
npm run build        # Build for production
npm run lint         # Check for errors

# Both
npm install          # Install dependencies
```

## 🌐 Next Steps

- [ ] Customize landing page content
- [ ] Add more features to dashboard
- [ ] Implement crowd monitoring features
- [ ] Deploy to Vercel (frontend) and Railway (backend)
- [ ] Add real-time WebSocket connections
- [ ] Integrate AI/ML models for crowd analysis

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [PlanetScale Quickstart](https://planetscale.com/docs)

## 💡 Development Tips

1. **Keep both terminals open** - One for backend, one for frontend
2. **Check console logs** - Errors show in terminal and browser console
3. **Use Prisma Studio** - Visual database management tool
4. **Test API with curl** - Verify backend endpoints work
5. **Clear localStorage** - If auth issues, clear browser storage

---

**Need help?** Check the main README.md or create an issue on GitHub.

Happy coding! 🎉
