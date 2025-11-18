# CrowdSight - Real-Time Crowd Density & Safety Monitoring System

**AI-powered Crowd Monitoring Made Simple**

A full-stack application built with Next.js, Node.js/Express, and MySQL (PlanetScale) with Prisma ORM for real-time crowd density monitoring and safety analysis.

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
- **MySQL** (PlanetScale) - Database
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
- PlanetScale account (or any MySQL database)
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
   DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/crowdsight?sslaccept=strict"
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   PORT=5000
   NODE_ENV=development
   ```

5. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

6. **Push database schema to PlanetScale:**
   ```bash
   npx prisma db push
   ```

7. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

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
   NEXT_PUBLIC_API_URL=http://localhost:5000
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
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get User:**
```bash
curl http://localhost:5000/api/auth/me \
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
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```

4. **Deploy!**

### Backend (Railway)

1. **Push code to GitHub**

2. **Create new project in Railway:**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub repo
   - Select `backend` as root directory

3. **Configure environment variables:**
   ```
   DATABASE_URL=your-planetscale-connection-string
   JWT_SECRET=your-secret-key
   PORT=5000
   NODE_ENV=production
   ```

4. **Add build command:**
   ```
   npm install && npx prisma generate
   ```

5. **Add start command:**
   ```
   npm start
   ```

### Database (PlanetScale)

1. **Create database:**
   - Go to [planetscale.com](https://planetscale.com)
   - Create new database named `crowdsight`
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

1. **Start both servers** (backend on :5000, frontend on :3000)

2. **Visit** `http://localhost:3000`

3. **Create an account** via `/signup`

4. **Login** with your credentials

5. **Access dashboard** to see protected content

## 📝 Development Notes

- Backend uses CommonJS (`require`/`module.exports`)
- Frontend uses ES6 modules (`import`/`export`)
- Prisma uses `relationMode = "prisma"` for PlanetScale compatibility
- JWT tokens stored in `localStorage` (consider `httpOnly` cookies for production)
- Forms use `react-hook-form` for validation

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
