# CrowdSight Frontend

Next.js application with TailwindCSS and JWT authentication.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Configure NEXT_PUBLIC_API_URL in .env.local

# Start development server
npm run dev
```

App runs on **http://localhost:3000**

## Pages

- `/` - Landing page
- `/login` - User login
- `/signup` - User registration
- `/dashboard` - Protected dashboard (requires auth)

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features

- 🎨 TailwindCSS styling
- 📝 React Hook Form validation
- 🔒 JWT authentication
- 🛡️ Protected routes
- 📱 Responsive design
- ✨ Smooth animations

## Project Structure

```
frontend/
├── pages/
│   ├── _app.js        # App wrapper
│   ├── _document.js   # HTML document
│   ├── index.js       # Landing page
│   ├── login.js       # Login page
│   ├── signup.js      # Signup page
│   └── dashboard.js   # Dashboard
├── styles/
│   └── globals.css    # Global styles
└── public/            # Static assets
```

## Authentication Flow

1. User signs up/logs in
2. JWT token stored in `localStorage`
3. Token sent in Authorization header
4. Dashboard verifies token via `/api/auth/me`
5. Invalid/expired tokens redirect to login

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL`
5. Deploy!

## Styling

Uses TailwindCSS with custom utility classes:

- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.input-field` - Input field
- `.card` - Card container
- `.feature-card` - Feature card with hover
- `.text-gradient` - Gradient text

## Form Validation

Uses `react-hook-form` for:
- Email validation
- Password strength
- Required fields
- Custom error messages
