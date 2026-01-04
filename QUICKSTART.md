# ClauseGuard MVP - Quick Start Guide

Get ClauseGuard up and running in under 5 minutes!

## Prerequisites Check

Before you begin, make sure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Docker and Docker Compose installed (optional but recommended)
- [ ] An Anthropic API key ([get one here](https://console.anthropic.com/))

## 🚀 Quick Start with Docker (Recommended)

### 1. Clone and Configure

```bash
# Clone the repository
git clone <your-repo-url>
cd clauseguard-mvp

# Copy environment template
cp .env.example .env

# Edit .env and add your Anthropic API key
# ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

### 2. Start Everything

```bash
# Start all services (PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d

# Wait ~30 seconds for services to initialize

# Run database migrations
docker-compose exec backend npm run migrate

# (Optional) Seed with sample data
docker-compose exec backend npm run seed
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

### 4. Test It Out

1. Go to http://localhost:3000
2. Upload a sample contract (PDF, DOCX, or TXT)
3. Wait 5-10 seconds for AI analysis
4. Review the risk analysis results
5. Export to PDF

---

## 🔧 Manual Setup (Without Docker)

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Start PostgreSQL

```bash
# Option A: Using Docker
docker run --name clauseguard-postgres \
  -e POSTGRES_USER=clauseguard \
  -e POSTGRES_PASSWORD=clauseguard \
  -e POSTGRES_DB=clauseguard \
  -p 5432:5432 \
  -d postgres:16-alpine

# Option B: Use your local PostgreSQL
# createdb clauseguard
```

### 3. Start Redis

```bash
# Option A: Using Docker
docker run --name clauseguard-redis \
  -p 6379:6379 \
  -d redis:7-alpine

# Option B: Use your local Redis
# redis-server
```

### 4. Configure Environment

```bash
# Copy and edit .env
cp .env.example .env

# Make sure these are set correctly:
# - ANTHROPIC_API_KEY=sk-ant-your-key
# - DATABASE_URL=postgresql://clauseguard:clauseguard@localhost:5432/clauseguard
# - REDIS_HOST=localhost
```

### 5. Run Migrations

```bash
cd backend
npm run migrate
cd ..
```

### 6. Start the Services

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

---

## ✅ Verification Checklist

Verify everything is working:

1. **Backend Health Check**
   ```bash
   curl http://localhost:3001/api/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

2. **Database Connection**
   ```bash
   docker-compose exec backend npm run typecheck
   # Should complete without errors
   ```

3. **Frontend Loads**
   - Open http://localhost:3000
   - Should see ClauseGuard landing page with upload area

4. **Upload Test** (with sample contract)
   - Create a sample text file: `echo "This is a test freelance contract with payment terms." > test-contract.txt`
   - Upload it via the web interface
   - Should see analysis results in ~10 seconds

---

## 🐛 Troubleshooting

### "Cannot connect to database"

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check connection string in .env
# DATABASE_URL should match your PostgreSQL setup
```

### "Redis connection failed"

```bash
# Check if Redis is running
docker ps | grep redis

# Test Redis connection
redis-cli ping
# Should return: PONG
```

### "Anthropic API error"

```bash
# Verify your API key is set
echo $ANTHROPIC_API_KEY

# Check .env file
cat .env | grep ANTHROPIC_API_KEY

# Test API key validity at https://console.anthropic.com/
```

### "Port already in use"

```bash
# Check what's using the port
lsof -i :3000  # Frontend
lsof -i :3001  # Backend
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Change ports in .env if needed
```

### "File upload fails"

```bash
# Check uploads directory exists and is writable
ls -la uploads/

# Create if missing
mkdir -p uploads
chmod 755 uploads
```

---

## 🔄 Development Workflow

### Restart Services

```bash
# Docker
docker-compose restart

# Manual
# Ctrl+C in each terminal, then restart
```

### View Logs

```bash
# Docker - All services
docker-compose logs -f

# Docker - Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Manual
# Logs appear in the terminal where you started the service
```

### Reset Database

```bash
# Docker
docker-compose down -v  # Remove volumes
docker-compose up -d
docker-compose exec backend npm run migrate

# Manual
dropdb clauseguard
createdb clauseguard
cd backend && npm run migrate
```

### Update Dependencies

```bash
# Root
npm install

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

---

## 📊 Sample Data

To test with realistic data:

```bash
# Seed database with sample analysis
docker-compose exec backend npm run seed

# Access sample analysis
# Visit: http://localhost:3000/analysis/sample-123
```

---

## 🚪 Stopping Services

```bash
# Docker - Stop but keep data
docker-compose stop

# Docker - Stop and remove everything
docker-compose down

# Docker - Stop, remove, and delete volumes (complete reset)
docker-compose down -v

# Manual - Just Ctrl+C in each terminal
```

---

## 📚 Next Steps

Now that you're up and running:

1. Read the [API Documentation](./docs/API.md)
2. Review the [Architecture Overview](./README.md#architecture)
3. Check out [Deployment Guide](./docs/DEPLOYMENT.md) for production setup
4. Learn about [Prompt Engineering](./docs/PROMPTS.md)

---

## 🆘 Still Having Issues?

1. Check the [main README](./README.md#troubleshooting)
2. Review [GitHub Issues](https://github.com/your-org/clauseguard/issues)
3. Join our Discord (placeholder)
4. Email: support@clauseguard.com (placeholder)

---

**Happy Guarding! 🛡️**
