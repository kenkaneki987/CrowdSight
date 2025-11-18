# CrowdSight Backend

Express.js API server with JWT authentication and Prisma ORM.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure DATABASE_URL and JWT_SECRET in .env

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start development server
npm run dev
```

Server runs on **http://localhost:5000**

## API Endpoints

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user (requires JWT)

## Environment Variables

```env
DATABASE_URL="mysql://user:pass@host/db?sslaccept=strict"
JWT_SECRET="your-secret-key"
PORT=5000
NODE_ENV=development
```

## Scripts

- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema to DB

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // bcrypt hashed
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Deployment

### Railway

1. Push to GitHub
2. Create Railway project
3. Add environment variables
4. Deploy!

Build command: `npm install && npx prisma generate`
Start command: `npm start`

## Security

- Passwords hashed with bcrypt
- JWT tokens (7-day expiration)
- CORS enabled
- Input validation
