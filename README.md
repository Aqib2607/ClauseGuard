# ClauseGuard MVP - Phase 1

![ClauseGuard Logo](https://via.placeholder.com/150x150?text=ClauseGuard)

**AI-powered contract review for freelancers**

ClauseGuard helps freelancers protect themselves from unfair contract terms by providing instant AI-powered analysis of contracts, identifying risky clauses, and explaining them in plain English.

---

## 🚀 Features

### Phase 1 (Current)
- ✅ Contract upload (PDF, DOCX, DOC, TXT)
- ✅ AI-powered contract analysis using Claude 3.5 Sonnet
- ✅ Risk identification with Low/Medium/High severity levels
- ✅ Plain-English explanations of risky clauses
- ✅ 3-5 bullet point contract summaries
- ✅ PDF export of analysis results
- ✅ Email capture for marketing
- ✅ Rate limiting (5 requests/minute for free tier)
- ✅ Legal disclaimers
- ✅ Responsive mobile-first design

---

## 📋 Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Docker**: 20.x or higher (optional, for containerized setup)
- **PostgreSQL**: 16.x (or use Docker)
- **Redis**: 7.x (or use Docker)
- **Anthropic API Key**: Get one from [Anthropic](https://www.anthropic.com/)

---

## 🛠️ Setup Instructions

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clauseguard-mvp
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Add your Anthropic API key to `.env`**
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

4. **Start all services**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   docker-compose exec backend npm run migrate
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health Check: http://localhost:3001/api/health

### Option 2: Manual Setup

#### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up PostgreSQL database**
   ```bash
   createdb clauseguard
   ```

3. **Set up Redis**
   ```bash
   redis-server
   ```

4. **Create `.env` file in backend directory**
   ```bash
   cp ../.env.example .env
   # Edit .env with your actual values
   ```

5. **Run migrations**
   ```bash
   npm run migrate
   ```

6. **Seed database (optional)**
   ```bash
   npm run seed
   ```

7. **Start backend server**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Create `.env.local` file**
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
   ```

3. **Start frontend server**
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```
clauseguard-mvp/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # TypeORM entities
│   │   ├── prompts/        # LLM prompts
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   ├── workers/        # Bull queue workers
│   │   ├── migrations/     # Database migrations
│   │   └── scripts/        # Utility scripts
│   └── package.json
├── frontend/               # Next.js 14 app
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities and API client
│   │   └── types/         # TypeScript types
│   └── package.json
├── infra/                 # Infrastructure files
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docs/                  # Documentation
├── .github/workflows/     # CI/CD workflows
├── docker-compose.yml     # Docker composition
└── README.md
```

---

## 🔌 API Endpoints

### Contract Analysis

**POST** `/api/v1/contracts/analyze`
- Upload a contract for analysis
- Body: `multipart/form-data` with `contract` file field
- Returns: `{ jobId, status, message }`

**GET** `/api/v1/contracts/analyze/:jobId`
- Get analysis status and results
- Returns: Analysis results with summary and risk clauses

**POST** `/api/v1/contracts/:jobId/export`
- Export analysis to PDF
- Returns: PDF file

**POST** `/api/v1/contracts/:jobId/email`
- Capture user email
- Body: `{ email }`

### Contract Generation (Future Phase)

**POST** `/api/v1/contracts/generate`
- Generate a contract from template
- Body: `{ templateType, ...inputData }`

**GET** `/api/v1/contracts/generate/:jobId`
- Get generated contract status and text

### Health Check

**GET** `/api/health`
- Returns: `{ status: "ok", timestamp }`

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm run test
```

### Run Frontend Tests
```bash
cd frontend
npm run test
```

### Run All Tests
```bash
npm run test
```

---

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │────────>│  Next.js 14  │────────>│  Express.js │
│  (Client)   │<────────│  (Frontend)  │<────────│  (Backend)  │
└─────────────┘         └──────────────┘         └─────────────┘
                                                          │
                            ┌─────────────────────────────┼─────────────┐
                            │                             │             │
                            ▼                             ▼             ▼
                    ┌───────────────┐           ┌──────────────┐ ┌──────────┐
                    │  PostgreSQL   │           │  Bull Queue  │ │  Claude  │
                    │  (Database)   │           │  (+ Redis)   │ │   API    │
                    └───────────────┘           └──────────────┘ └──────────┘
```

### Key Technologies

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, React Query
- **Backend**: Express.js, TypeScript, TypeORM, Bull (job queue)
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis 7
- **LLM**: Anthropic Claude 3.5 Sonnet
- **File Processing**: pdf-parse, mammoth, pdfkit
- **DevOps**: Docker, Docker Compose, GitHub Actions

---

## 🔐 Security Features

- ✅ Rate limiting (IP-based)
- ✅ File size validation (10MB max)
- ✅ File type validation (PDF, DOCX, DOC, TXT only)
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ SQL injection protection (TypeORM)
- ✅ Virus scan mock (ClamAV stub for future integration)
- ✅ Secure file path isolation

---

## 🚀 Deployment

### Deploy to Fly.io (Backend)

```bash
cd backend
fly launch
fly secrets set ANTHROPIC_API_KEY=your_key DATABASE_URL=your_db_url
fly deploy
```

### Deploy to Vercel (Frontend)

```bash
cd frontend
vercel
# Set NEXT_PUBLIC_API_URL environment variable in Vercel dashboard
```

### Deploy with Render

1. Create new Web Service for backend
2. Create new Static Site for frontend
3. Add PostgreSQL and Redis add-ons
4. Set environment variables

---

## 📊 Monitoring & Logging

- Structured JSON logging with Winston
- Request/response logging middleware
- Job queue event listeners
- Database query logging (development mode)

---

## 🧹 Maintenance

### File Cleanup

Uploaded files are automatically deleted after 1 hour. The cleanup job runs every hour.

### Database Migrations

Create a new migration:
```bash
cd backend
npm run typeorm migration:create -- -n MigrationName
```

Run migrations:
```bash
npm run migrate
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify credentials

### "Redis connection failed"
- Ensure Redis is running
- Check REDIS_HOST and REDIS_PORT in .env

### "Anthropic API error"
- Verify ANTHROPIC_API_KEY is set correctly
- Check API key validity on Anthropic dashboard
- Ensure you have sufficient credits

### "File upload fails"
- Check file size (max 10MB)
- Verify file type (PDF, DOCX, DOC, TXT only)
- Ensure uploads directory exists and is writable

---

## 📝 Environment Variables

See `.env.example` for all available environment variables.

**Required:**
- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_HOST` - Redis host address

**Optional:**
- `PORT` - Backend server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 5)
- `MAX_FILE_SIZE_MB` - Max upload size (default: 10)

---

## 🗺️ Roadmap

### Phase 2 (Planned)
- [ ] User authentication
- [ ] Stripe integration for Pro plan
- [ ] Enhanced rate limiting per user tier
- [ ] Contract history dashboard

### Phase 3 (Planned)
- [ ] Contract generation feature
- [ ] One-click protective clauses
- [ ] Custom contract templates

### Phase 4 (Planned)
- [ ] Advanced filtering and search
- [ ] Contract comparison tool
- [ ] Collaboration features

---

## 📄 License

Proprietary - All Rights Reserved

---

## 🤝 Contributing

This is a private MVP. Contact the maintainers for contribution guidelines.

---

## 📧 Support

For support, email: support@clauseguard.com (placeholder)

---

**Built with ❤️ for freelancers**
