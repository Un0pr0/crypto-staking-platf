# Dexfi Deployment Guide

This guide explains how to deploy the Dexfi application using Docker on your server at dexfistaking.com.

## Prerequisites

- A server with Docker and Docker Compose installed
- Domain name (dexfistaking.com) pointing to your server's IP address
- SSH access to your server

## Deployment Steps

### 1. Install Docker and Docker Compose

If not already installed on your server:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Transfer Files to Server

Upload all project files to your server:

```bash
# From your local machine
scp -r /path/to/spark-template user@your-server-ip:/home/user/dexfi
```

Or clone from your git repository if you have one:

```bash
# On your server
git clone <your-repository-url> /home/user/dexfi
cd /home/user/dexfi
```

### 3. Build and Run with Docker Compose

```bash
cd /home/user/dexfi

# Build and start the container
docker-compose up -d --build

# Check if the container is running
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Configure SSL (HTTPS) - Recommended

For production use with HTTPS, use Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Stop the Docker container temporarily
docker-compose down

# Get SSL certificate
sudo certbot certonly --standalone -d dexfistaking.com -d www.dexfistaking.com

# Update nginx.conf to include SSL configuration (see SSL Configuration section below)

# Restart the container
docker-compose up -d
```

### 5. SSL Configuration (nginx.conf with HTTPS)

Update the `nginx.conf` file to include SSL:

```nginx
server {
    listen 80;
    server_name dexfistaking.com www.dexfistaking.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dexfistaking.com www.dexfistaking.com;

    ssl_certificate /etc/letsencrypt/live/dexfistaking.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dexfistaking.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json image/svg+xml;
}
```

Then update `docker-compose.yml` to mount SSL certificates:

```yaml
version: '3.8'

services:
  dexfi-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: dexfi-app
    ports:
      - "80:80"
      - "443:443"
    restart: unless-stopped
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    environment:
      - NODE_ENV=production
    networks:
      - dexfi-network

networks:
  dexfi-network:
    driver: bridge
```

## Useful Commands

```bash
# Stop the application
docker-compose down

# Restart the application
docker-compose restart

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up -d --build

# Remove containers and images
docker-compose down --rmi all

# Access container shell
docker exec -it dexfi-app sh
```

## Updating the Application

When you make changes to the code:

```bash
# Pull latest changes (if using git)
git pull

# Rebuild and restart
docker-compose up -d --build
```

## Troubleshooting

### Container won't start
```bash
docker-compose logs dexfi-app
```

### Port already in use
```bash
# Check what's using port 80
sudo lsof -i :80

# Stop the service using the port or change the port in docker-compose.yml
```

### Permission issues
```bash
# Make sure Docker can access the files
sudo chown -R $USER:$USER /home/user/dexfi
```

## Security Notes

1. Always use HTTPS in production
2. Keep your server and Docker updated
3. Use a firewall to restrict access to necessary ports only
4. Regularly backup your data
5. Monitor your application logs

## Support

If you encounter issues, contact: support@dexfistaking.com
