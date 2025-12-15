#!/bin/bash

set -e

echo "🚀 Deploying Dexfi Application..."
echo ""

# Stop existing container
echo "📦 Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Clean up
echo "🧹 Cleaning up old images and containers..."
docker system prune -f

# Build and start
echo "🔨 Building new Docker image..."
docker-compose build --no-cache

echo "🎯 Starting container..."
docker-compose up -d

# Wait for container to be healthy
echo "⏳ Waiting for container to start..."
sleep 3

# Show status
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Container status:"
docker ps | grep -E "CONTAINER|dexfi" || docker ps

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Useful commands:"
echo "  • View logs:     docker-compose logs -f"
echo "  • Stop app:      docker-compose down"
echo "  • Restart app:   docker-compose restart"
echo "  • Shell access:  docker exec -it dexfi-app sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Application URLs:"
echo "  • Local:         http://localhost:3000"
echo "  • Production:    http://dexfistaking.com"
echo ""
echo "🔐 Login Credentials:"
echo "  • Username: Weravest"
echo "  • Password: Weravest_13579/"
echo ""
echo "📧 Support: support@dexfistaking.com"
echo ""
