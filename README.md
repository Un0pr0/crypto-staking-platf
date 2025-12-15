# Dexfi - Crypto Asset Management Platform

A demonstration cryptocurrency portfolio management application with static data for staking, deposits, and trading visualization.

## 🎯 Features

- **Balance Overview** - View total portfolio value and individual cryptocurrency holdings
- **Deposits** - Time-locked savings with automatic interest calculation
- **Staking** - Earn rewards on staked assets
- **Transaction History** - Complete log of all operations
- **Secure Login** - Password-protected access

## 🚀 Quick Deploy Guide

### Option 1: Docker (Recommended for Production)

```bash
# Clone and navigate to project
cd /path/to/dexfi

# Build and run
docker-compose up -d --build

# Application available at http://localhost:3000
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 Login Credentials

- **Username:** `Weravest`
- **Main Password:** `Weravest_13579/`
- **Static Data Password:** `Weravest_13579//`

## 🐳 Docker Deployment

### Complete Build Process

```bash
# Stop existing containers
docker-compose down

# Clean up old images
docker system prune -af

# Build fresh image
docker-compose up -d --build

# Check status
docker ps | grep dexfi

# View logs
docker-compose logs -f
```

### Using Deploy Script

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## 🌐 Production Deployment on Server

### 1. Setup Nginx Reverse Proxy

Create `/etc/nginx/sites-available/dexfistaking`:

```nginx
server {
    listen 80;
    server_name dexfistaking.com www.dexfistaking.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/dexfistaking /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. Install SSL Certificate

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d dexfistaking.com -d www.dexfistaking.com
```

### 3. Auto-renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Renewal runs automatically via cron
```

## 🔧 Troubleshooting

### Application Not Loading

```bash
# Check container status
docker ps

# Check logs
docker-compose logs -f dexfi

# Restart container
docker-compose restart
```

### KV/Persistence Errors

If you see console errors about KV or storage:

1. **Rebuild Docker image:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

2. **Clear browser cache:**
   - Press `Ctrl+Shift+R` (Windows/Linux)
   - Press `Cmd+Shift+R` (Mac)

3. **Check logs for errors:**
   ```bash
   docker-compose logs -f
   ```

### Changes Not Appearing

Always rebuild after code changes:

```bash
docker-compose up -d --build
```

### Port Already in Use

If port 3000 is occupied:

```bash
# Find process using port
sudo lsof -i :3000

# Or change port in docker-compose.yml
ports:
  - "8080:80"  # Use port 8080 instead
```

## 📊 Application Data

All data is **static and hardcoded** for demonstration purposes:

- Total Balance: $21,155
- Available Balance: $6,135  
- Total Staked: $8,700
- Active Positions: 3
- Total Deposits: $6,320

## 🔐 Security Notes

- This is a demonstration application with static data
- No real cryptocurrency transactions occur
- Passwords are validated client-side only
- Not recommended for production use with real funds

## 📧 Support

If you encounter any issues with the platform, contact:  
**support@dexfistaking.com**

## 📁 Project Structure

```
.
├── src/
│   ├── components/
│   │   └── crypto/          # Main application components
│   ├── lib/
│   │   ├── static-data.ts   # All static data definitions
│   │   ├── crypto-utils.ts  # Utility functions
│   │   └── spark-mock.ts    # Mock for Spark runtime
│   ├── App.tsx              # Main application
│   └── main.tsx             # Entry point
├── Dockerfile               # Docker build config
├── docker-compose.yml       # Docker Compose config
├── nginx.conf              # Nginx configuration
└── deploy.sh               # Deployment script
```

## 🛠️ Development

### Local Development Server

```bash
npm run dev
```

Runs on http://localhost:5173

### Build for Production

```bash
npm run build
```

Output in `dist/` directory

### Preview Production Build

```bash
npm run preview
```

## 📝 Environment

- **Node.js**: 20+
- **React**: 19
- **TypeScript**: 5.7
- **Tailwind CSS**: 4.1
- **Vite**: 7.2

## 📄 License

See LICENSE file for details.

---

**Built with ❤️ for cryptocurrency portfolio demonstration**
