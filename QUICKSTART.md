# 🎯 CrowdSight Quick Reference

## 🚀 Quick Start Commands

### First Time Setup
```bash
# Run the automated setup script
./setup.sh

# Or manually:
cd backend && npm install && cd ../frontend && npm install
```

### Configure Environment
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env: Add DATABASE_URL and JWT_SECRET

# Frontend  
cd frontend
cp .env.example .env.local
# Edit .env.local: Add NEXT_PUBLIC_API_URL
```

### Database Setup
```bash
cd backend
npx prisma generate       # Generate Prisma client
npx prisma db push        # Push schema to database
npx prisma studio         # Open database GUI (optional)
```

### Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

---

## 📁 Project Structure

```
CrowdSight/
├── backend/              # Express API (Port 5000)
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth middleware
│   ├── prisma/          # Database schema
│   └── routes/          # API endpoints
│
└── frontend/            # Next.js App (Port 3000)
    ├── pages/           # Routes
    └── styles/          # CSS + Tailwind
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

---

## 🌐 Frontend Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Login form |
| `/signup` | Registration form |
| `/dashboard` | Protected dashboard |

---

## 🔒 Environment Variables

### Backend (.env)
```env
DATABASE_URL="mysql://..."
JWT_SECRET="random-secret-32-chars"
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 🧪 Test the Application

1. **Start both servers** ✅
2. **Visit** http://localhost:3000 ✅
3. **Sign up** with test credentials ✅
4. **Login** and access dashboard ✅

---

## 🐛 Common Issues

**Port already in use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Database connection error:**
- Check DATABASE_URL in backend/.env
- Ensure PlanetScale database is active
- Run `npx prisma db push` again

**Frontend can't connect:**
- Verify backend is running on port 5000
- Check NEXT_PUBLIC_API_URL in .env.local
- Clear browser cache and localStorage

**Prisma errors:**
```bash
cd backend
rm -rf node_modules
npm install
npx prisma generate
```

**Module not found:**
```bash
# Reinstall dependencies
npm install
```

---

## 📚 Useful Commands

### Backend
```bash
npm run dev           # Start dev server
npm start            # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:push     # Update database
npx prisma studio      # Open database GUI
```

### Frontend
```bash
npm run dev           # Start dev server
npm run build         # Build for production
npm start            # Start production server
npm run lint         # Check for errors
```

### Database
```bash
npx prisma db push    # Apply schema changes
npx prisma db pull    # Pull schema from DB
npx prisma migrate    # Create migration
npx prisma studio     # Database GUI
```

---

## 🚀 Deployment URLs

### Development
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Production
- Frontend: Deploy to **Vercel** (free)
- Backend: Deploy to **Railway** ($5 credit)
- Database: **PlanetScale** (free tier)

See DEPLOYMENT.md for complete guide.

---

## 📖 Documentation

- **README.md** - Project overview
- **SETUP.md** - Detailed setup guide
- **DEPLOYMENT.md** - Production deployment
- **PROJECT_SUMMARY.md** - Complete breakdown

---

## 🆘 Need Help?

1. Check documentation files
2. Review code comments
3. Check console logs (browser + terminal)
4. Verify environment variables
5. Try restarting servers

---

## 📞 Support Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

**Happy Coding! 🎉**
