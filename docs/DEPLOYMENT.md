# Deployment Guide

This guide covers deploying ClauseGuard to various cloud platforms.

---

## Prerequisites

- Git repository with code pushed
- Anthropic API key
- Domain name (optional but recommended)

---

## Option 1: Fly.io (Backend) + Vercel (Frontend)

### Backend on Fly.io

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly**
   ```bash
   fly auth login
   ```

3. **Create Fly app**
   ```bash
   cd backend
   fly launch --no-deploy
   ```

4. **Provision PostgreSQL**
   ```bash
   fly postgres create --name clauseguard-db
   fly postgres attach --app your-app-name clauseguard-db
   ```

5. **Provision Redis**
   ```bash
   fly redis create --name clauseguard-redis
   ```

6. **Set secrets**
   ```bash
   fly secrets set ANTHROPIC_API_KEY=your_key
   fly secrets set CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

7. **Deploy**
   ```bash
   fly deploy
   ```

### Frontend on Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

4. **Set environment variables in Vercel dashboard**
   - `NEXT_PUBLIC_API_URL` = Your Fly.io backend URL

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

---

## Option 2: Render (All-in-One)

### Backend

1. **Create new Web Service**
   - Connect your Git repository
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

2. **Add PostgreSQL**
   - Go to Dashboard → New → PostgreSQL
   - Connect to your web service

3. **Add Redis**
   - Go to Dashboard → New → Redis
   - Copy the Redis URL

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=[from PostgreSQL addon]
   REDIS_HOST=[from Redis addon]
   ANTHROPIC_API_KEY=your_key
   CORS_ORIGIN=https://your-frontend.onrender.com
   ```

### Frontend

1. **Create new Static Site**
   - Connect your Git repository
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `.next`

2. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   ```

---

## Option 3: AWS (ECS + RDS + ElastiCache)

### Infrastructure Setup

1. **Create RDS PostgreSQL instance**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier clauseguard-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username admin \
     --master-user-password your-password \
     --allocated-storage 20
   ```

2. **Create ElastiCache Redis cluster**
   ```bash
   aws elasticache create-cache-cluster \
     --cache-cluster-id clauseguard-redis \
     --cache-node-type cache.t3.micro \
     --engine redis \
     --num-cache-nodes 1
   ```

3. **Build and push Docker images**
   ```bash
   # Backend
   docker build -f infra/Dockerfile.backend -t clauseguard-backend .
   docker tag clauseguard-backend:latest your-ecr-repo/clauseguard-backend:latest
   docker push your-ecr-repo/clauseguard-backend:latest

   # Frontend
   docker build -f infra/Dockerfile.frontend -t clauseguard-frontend .
   docker tag clauseguard-frontend:latest your-ecr-repo/clauseguard-frontend:latest
   docker push your-ecr-repo/clauseguard-frontend:latest
   ```

4. **Create ECS Task Definitions and Services**
   - Use AWS Console or Terraform
   - Set environment variables
   - Configure load balancer

---

## Option 4: DigitalOcean App Platform

1. **Connect GitHub repository**

2. **Configure backend service**
   - Type: Web Service
   - Dockerfile: `infra/Dockerfile.backend`
   - Port: 3001

3. **Configure frontend service**
   - Type: Web Service
   - Dockerfile: `infra/Dockerfile.frontend`
   - Port: 3000

4. **Add Managed Database (PostgreSQL)**

5. **Add Redis (via Dev Database)**

6. **Set environment variables for both services**

7. **Deploy**

---

## Option 5: Docker Compose on VPS

### Provision VPS

1. **Create VPS** (DigitalOcean, Linode, Vultr, etc.)
   - Minimum: 2 GB RAM, 1 CPU
   - Recommended: 4 GB RAM, 2 CPUs

2. **SSH into VPS**
   ```bash
   ssh root@your-vps-ip
   ```

3. **Install Docker and Docker Compose**
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   ```

### Deploy Application

1. **Clone repository**
   ```bash
   git clone your-repo-url
   cd clauseguard-mvp
   ```

2. **Create production `.env`**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

3. **Start services**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

4. **Run migrations**
   ```bash
   docker-compose exec backend npm run migrate
   ```

5. **Set up Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }

   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

6. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
   ```

---

## Environment Variables for Production

### Backend
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/clauseguard
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
ANTHROPIC_API_KEY=your_anthropic_key
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
MAX_FILE_SIZE_MB=10
RATE_LIMIT_MAX_REQUESTS=5
RATE_LIMIT_WINDOW_MS=60000
```

### Frontend
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## Post-Deployment Checklist

- [ ] Verify health endpoint: `https://api.yourdomain.com/api/health`
- [ ] Test contract upload flow
- [ ] Test PDF export
- [ ] Test email capture
- [ ] Verify rate limiting works
- [ ] Check logs for errors
- [ ] Set up monitoring (e.g., Sentry, Datadog)
- [ ] Set up backup strategy for database
- [ ] Configure log retention
- [ ] Set up alerts for errors and downtime
- [ ] Test HTTPS/SSL certificate
- [ ] Verify CORS configuration

---

## Monitoring & Logging

### Recommended Tools

- **Application Monitoring**: Sentry, Datadog, New Relic
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Log Aggregation**: Logtail, Papertrail, CloudWatch
- **Performance Monitoring**: Vercel Analytics, Google Analytics

### Set up Sentry (Optional)

1. **Install Sentry SDK**
   ```bash
   npm install @sentry/node @sentry/nextjs
   ```

2. **Configure backend**
   ```typescript
   import * as Sentry from '@sentry/node';

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

3. **Configure frontend**
   ```bash
   npx @sentry/wizard -i nextjs
   ```

---

## Backup Strategy

### Database Backups

**Fly.io**
```bash
fly postgres backup create --app clauseguard-db
```

**Render**
- Automatic daily backups included

**Manual (VPS)**
```bash
# Daily cron job
0 2 * * * pg_dump clauseguard | gzip > /backups/clauseguard-$(date +\%Y\%m\%d).sql.gz
```

### File Backups

Since files are temporary (1-hour retention), no backup needed for MVP.

---

## Scaling Considerations

### Backend
- Horizontal scaling: Add more backend instances
- Increase worker concurrency
- Use CDN for static assets
- Add Redis cluster for queue

### Frontend
- Vercel automatically scales
- Enable ISR (Incremental Static Regeneration)
- Add CDN (Cloudflare)

### Database
- Upgrade instance size
- Add read replicas
- Implement connection pooling (PgBouncer)

---

## Troubleshooting

### "Application crashed"
- Check logs: `fly logs` or `docker-compose logs`
- Verify environment variables
- Check database connectivity

### "Cannot connect to database"
- Verify DATABASE_URL format
- Check firewall rules
- Ensure database instance is running

### "Redis connection timeout"
- Verify Redis host and port
- Check Redis password
- Ensure Redis instance is running

### "Rate limit not working"
- Verify Redis connection
- Check rate limiter configuration
- Test with curl or Postman

---

## Rollback Procedure

### Fly.io
```bash
fly releases
fly releases rollback <release-id>
```

### Vercel
- Go to Deployments → Click previous deployment → Promote to Production

### Docker Compose
```bash
git checkout <previous-commit>
docker-compose up -d --build
```

---

## Security Checklist

- [ ] Environment variables not exposed in code
- [ ] API keys stored securely
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] File upload validation working
- [ ] SQL injection protection (TypeORM)
- [ ] XSS protection (React escaping)
- [ ] Helmet middleware enabled (optional)
- [ ] Regular dependency updates

---

For support, contact: devops@clauseguard.com (placeholder)
