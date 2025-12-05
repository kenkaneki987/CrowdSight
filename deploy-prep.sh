#!/bin/bash

# 🚀 CrowdSight Deployment Script
# This script helps you prepare for deployment

echo "🚀 CrowdSight Deployment Preparation"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the CrowdSight root directory"
    exit 1
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo "1. ✅ Database setup (Neon)"
echo "2. ✅ Backend configuration"
echo "3. ✅ Frontend configuration" 
echo "4. ✅ Environment variables"
echo ""

# Generate JWT Secret
echo "🔑 Generating JWT Secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
echo "Your JWT Secret: $JWT_SECRET"
echo "Save this for your environment variables!"
echo ""

# Check backend dependencies
echo "📦 Checking backend dependencies..."
cd backend
if npm list > /dev/null 2>&1; then
    echo "✅ Backend dependencies OK"
else
    echo "⚠️ Installing backend dependencies..."
    npm install
fi
cd ..

# Check frontend dependencies  
echo "📦 Checking frontend dependencies..."
cd frontend
if npm list > /dev/null 2>&1; then
    echo "✅ Frontend dependencies OK"
else
    echo "⚠️ Installing frontend dependencies..."
    npm install
fi
cd ..

echo ""
echo "🌐 Deployment URLs to configure:"
echo "Backend (Render): https://your-app-name.onrender.com"
echo "Frontend (Vercel): https://your-app-name.vercel.app"
echo ""

echo "📋 Environment Variables needed:"
echo ""
echo "🔧 Backend (Render):"
echo "DATABASE_URL=postgresql://user:pass@host.neon.tech/db"
echo "JWT_SECRET=$JWT_SECRET"
echo "FRONTEND_URL=https://your-vercel-app.vercel.app"
echo "NODE_ENV=production"
echo ""
echo "🌐 Frontend (Vercel):"
echo "BACKEND_URL=https://your-render-app.onrender.com"
echo ""

echo "✅ Your project is ready for deployment!"
echo "📖 See DEPLOYMENT-GUIDE.md for detailed instructions"