#!/bin/bash

# CrowdSight Quick Start Script
# Run this script to set up the project quickly

echo "🚀 CrowdSight Quick Start Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) detected${NC}"
echo ""

# Backend Setup
echo -e "${BLUE}📦 Setting up Backend...${NC}"
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found, creating from .env.example${NC}"
    cp .env.example .env
    echo -e "${RED}⚠️  IMPORTANT: Please configure DATABASE_URL and JWT_SECRET in backend/.env${NC}"
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo -e "${GREEN}✅ Backend setup complete${NC}"
echo ""

# Frontend Setup
echo -e "${BLUE}📦 Setting up Frontend...${NC}"
cd ../frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local file not found, creating from .env.example${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✅ Created .env.local${NC}"
else
    echo -e "${GREEN}✅ .env.local file exists${NC}"
fi

echo -e "${GREEN}✅ Frontend setup complete${NC}"
echo ""

# Summary
cd ..
echo "================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure your database:"
echo "   - Edit backend/.env"
echo "   - Set DATABASE_URL to your PlanetScale connection string"
echo "   - Set JWT_SECRET to a random secure string"
echo ""
echo "2. Push database schema:"
echo "   cd backend"
echo "   npx prisma db push"
echo ""
echo "3. Start the backend server:"
echo "   cd backend"
echo "   npm run dev"
echo "   (runs on http://localhost:5000)"
echo ""
echo "4. In a new terminal, start the frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo "   (runs on http://localhost:3000)"
echo ""
echo "5. Open your browser to http://localhost:3000"
echo ""
echo "📚 For detailed instructions, see SETUP.md"
echo ""
echo -e "${BLUE}Happy coding! 🚀${NC}"
