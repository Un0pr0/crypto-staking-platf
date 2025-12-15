# Dexfi Deployment Guide

This guide explains how to deploy the Dexfi application to your server using Docker.

## Prerequisites

- Docker installed on your server
- Docker Compose installed on your server  
- Domain configured to point to your server (dexfistaking.com)

## Quick Start

### 1. Build and Run with Docker Compose

```bash
# Clean up any previous builds
docker-compose down
docker system prune -f

# Build and start the application
docker-compose up -d --build
```

The application will be available on port 3000.

### 2. Configure Nginx (on your server)

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
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/dexfistaking /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d dexfistaking.com -d www.dexfistaking.com
```

## Manual Build (without Docker Compose)

```bash
# Build the Docker image
docker build -t dexfi-app .

# Run the container
docker run -d -p 3000:80 --name dexfi-app --restart unless-stopped dexfi-app
```

## Updating the Application

```bash
# Stop and remove old container
docker-compose down

# Pull latest code (if using git)
git pull

# Rebuild and restart
docker-compose up -d --build
```

## Troubleshooting

### Application not loading

1. Check if container is running:
```bash
docker ps
```

2. Check container logs:
```bash
docker-compose logs -f
```

### Changes not appearing

Make sure to rebuild the Docker image:
```bash
docker-compose up -d --build
```

### Clear browser cache

The application uses aggressive caching. Clear your browser cache or use incognito mode to see changes.

## Login Credentials

- **Login**: Weravest
- **Password**: Weravest_13579/

To access static demo data, use password: `Weravest_13579//`

## Support

If you encounter any issues with the platform, contact: support@dexfistaking.com
