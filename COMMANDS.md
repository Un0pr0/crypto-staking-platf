# Command Cheat Sheet

## Quick Start

```bash
# Deploy application
docker-compose up -d --build

# Or use script
./deploy.sh
```

## Docker Commands

```bash
# Build and run
docker-compose up -d --build

# Stop
docker-compose down

# Restart
docker-compose restart

# Rebuild without cache
docker-compose build --no-cache

# Full cleanup
docker-compose down -v
docker system prune -af
```

## Monitoring

```bash
# Live logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Container status
docker ps | grep dexfi

# Resource usage
docker stats dexfi-app
```

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Nginx (on server)

```bash
# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# Status
sudo systemctl status nginx
```

## SSL/Certbot

```bash
# Install certificate
sudo certbot --nginx -d dexfistaking.com

# Check certificates
sudo certbot certificates

# Renew
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

## Access

- Local: http://localhost:3000
- Production: http://dexfistaking.com

## Login

- Username: Weravest
- Password: Weravest_13579/

## Support

support@dexfistaking.com
