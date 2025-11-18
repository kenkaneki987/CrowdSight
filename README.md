# CrowdSight - Real-Time Crowd Density & Safety Monitoring System

**AI-powered Crowd Monitoring Made Simple**

A full-stack application built with Next.js, Node.js/Express, and PostgreSQL (Neon) with Prisma ORM for real-time crowd density monitoring and safety analysis.

## 🌐 Live Demo

- **Frontend (Vercel):** https://crowd-sight.vercel.app/
- **Backend (Render):** https://crowdsight-zc3b.onrender.com
- **Database:** Neon PostgreSQL (Production)

## 📋 Project Proposal

### Problem Statement
Managing crowd density and safety in public spaces, events, and venues is a critical challenge. Traditional manual monitoring is inefficient, error-prone, and unable to provide real-time insights. There's a need for an intelligent system that can monitor, analyze, and alert authorities about crowd conditions in real-time.

### Solution
CrowdSight is a comprehensive full-stack web application that provides:
- **Secure User Management:** JWT-based authentication system with bcrypt password hashing for secure access control
- **Real-time Monitoring Dashboard:** Protected dashboard interface for authorized personnel to monitor crowd analytics
- **Scalable Architecture:** Built with modern technologies (Next.js, Express, PostgreSQL) ensuring scalability and performance
- **RESTful API Backend:** Clean, documented API endpoints for future integration with IoT devices, cameras, and ML models

### Target Users
- Event management companies
- Public venue administrators
- Security personnel and law enforcement
- Smart city authorities
- Large retail spaces and malls

### Key Features
1. **User Authentication System:** Secure signup/login with JWT tokens
2. **Protected Dashboard:** Role-based access to monitoring interface
3. **Responsive Design:** Works seamlessly across devices (desktop, tablet, mobile)
4. **Cloud-Based Infrastructure:** Fully deployed on modern cloud platforms (Vercel, Render, Neon)
5. **Production-Ready:** Complete with error handling, validation, and security best practices

### Technology Stack Rationale
- **Next.js:** Server-side rendering and optimal performance
- **Express.js:** Fast, minimalist backend framework
- **PostgreSQL:** Reliable, ACID-compliant database for critical data
- **Prisma ORM:** Type-safe database access and migrations
- **JWT:** Industry-standard authentication
- **TailwindCSS:** Rapid UI development with modern design

### Future Enhancements
- Integration with CCTV cameras for real-time video analysis
- ML-based crowd density prediction
- SMS/Email alert system for emergency situations
- Heat map visualization of crowd distribution
- Historical data analytics and reporting

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens and bcrypt password hashing
- **Protected Routes**: Dashboard access restricted to authenticated users
- **Responsive UI**: Beautiful TailwindCSS design with smooth animations
- **Real-Time Monitoring**: Dashboard for crowd analytics (demo)
- **RESTful API**: Clean Express.js backend with proper error handling

## 📁 Project Structure

```
CrowdSight/
├── backend/                      # Node.js + Express API
│   ├── controllers/
│   │   └── authController.js     # Authentication logic
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── routes/
│   │   └── auth.js               # Auth routes
│   ├── index.js                  # Express server
│   ├── package.json
│   └── .env.example
│
└── frontend/                     # Next.js React app
    ├── pages/
    │   ├── index.js              # Landing page
    │   ├── login.js              # Login page
    │   ├── signup.js             # Signup page
    │   ├── dashboard.js          # Protected dashboard
    │   ├── _app.js               # App wrapper
    │   └── _document.js          # HTML document
    ├── styles/
    │   └── globals.css           # Global styles + Tailwind
    ├── package.json
    ├── tailwind.config.js
    └── .env.example
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Prisma ORM** - Database toolkit
- **PostgreSQL** (Neon) - Production database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **CORS** - Cross-origin resource sharing

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **react-hook-form** - Form validation

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Neon PostgreSQL account (or any PostgreSQL database)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
   DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   PORT=5001
   NODE_ENV=development
   FRONTEND_URL="http://localhost:3000"
   ```

5. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

6. **Push database schema to PostgreSQL:**
   ```bash
   npx prisma db push
   ```

7. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables in `.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   App will run on `http://localhost:3000`

## 🎯 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create new user account | No |
| POST | `/api/auth/login` | Authenticate user | No |
| GET | `/api/auth/me` | Get current user data | Yes |

### Request/Response Examples

**Signup:**
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get User:**
```bash
curl http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🌐 Deployment

### Frontend (Vercel)

1. **Push code to GitHub**

2. **Import project in Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set root directory to `frontend`

3. **Configure environment variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy!**

### Backend (Render)

1. **Push code to GitHub**

2. **Create new Web Service in Render:**
   - Go to [render.com](https://render.com)
   - Create new Web Service from GitHub repo
   - Set root directory to `backend`

3. **Configure environment variables:**
   ```
   DATABASE_URL=your-neon-postgresql-connection-string
   JWT_SECRET=your-secret-key
   PORT=5001
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Set build command:**
   ```
   npm install && npx prisma generate
   ```

5. **Set start command:**
   ```
   npm start
   ```

### Database (Neon PostgreSQL)

1. **Create database:**
   - Go to [neon.tech](https://neon.tech)
   - Create new project named `crowdsight`
   - Get connection string

2. **Apply schema:**
   ```bash
   npx prisma db push
   ```

## 🎨 Pages Overview

- **`/`** - Landing page with hero section and features
- **`/login`** - User login form
- **`/signup`** - User registration form
- **`/dashboard`** - Protected dashboard (requires authentication)

## 🔒 Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiration
- Protected routes with middleware
- Input validation on both frontend and backend
- CORS enabled for cross-origin requests
- Environment variables for sensitive data

## 🧪 Testing the Application

1. **Start both servers** (backend on :5001, frontend on :3000)

2. **Visit** `http://localhost:3000`

3. **Create an account** via `/signup`

4. **Login** with your credentials

5. **Access dashboard** to see protected content

6. **Verify JWT Token:**
   - Open browser DevTools → Application → Local Storage
   - Copy the `token` value
   - Go to [jwt.io](https://jwt.io)
   - Paste token to verify payload

## 📝 Development Notes

- Backend uses CommonJS (`require`/`module.exports`)
- Frontend uses ES6 modules (`import`/`export`)
- Prisma schema configured for PostgreSQL
- JWT tokens stored in `localStorage` with 7-day expiration
- Passwords hashed with bcrypt (10 salt rounds)
- Forms use `react-hook-form` for validation
- CORS configured to allow production frontend URL

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Authors

Built with ❤️ by the CrowdSight team

---

**Need help?** Open an issue or contact us at support@crowdsight.com
