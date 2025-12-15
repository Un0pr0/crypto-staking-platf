# Deployment Checklist ✅

## Pre-Deployment

- [ ] Code changes committed
- [ ] All console.log removed
- [ ] No useKV imports in code
- [ ] spark-mock.ts imported in main.tsx
- [ ] Static data verified in static-data.ts

## Deployment Steps

### 1. Clean Environment

```bash
cd /workspaces/spark-template
docker-compose down
docker system prune -af
```

### 2. Build Application

```bash
docker-compose build --no-cache
```

### 3. Start Application

```bash
docker-compose up -d
```

### 4. Verify

```bash
# Check container running
docker ps | grep dexfi

# Check logs for errors
docker-compose logs -f

# Test in browser
# Open: http://localhost:3000
```

## Post-Deployment Verification

- [ ] Application loads without errors
- [ ] Login works (Username: Weravest, Password: Weravest_13579/)
- [ ] Balance view shows correct data ($21,155 total)
- [ ] Deposits tab shows 3 deposits
- [ ] Staking tab shows 4 stakes
- [ ] History tab shows transactions
- [ ] No KV errors in browser console
- [ ] All tabs switch correctly

## Server Deployment (Production)

### Upload to Server

```bash
# On your local machine
scp -r /workspaces/spark-template user@your-server:/path/to/app

# OR using git
ssh user@your-server
cd /path/to/app
git pull origin main
```

### On Server

```bash
cd /path/to/app
chmod +x deploy.sh
./deploy.sh
```

### Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/dexfistaking
# Paste nginx config (see DEPLOYMENT.md)

sudo ln -s /etc/nginx/sites-available/dexfistaking /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Setup SSL

```bash
sudo certbot --nginx -d dexfistaking.com -d www.dexfistaking.com
```

## Troubleshooting

### If you see KV errors

1. Check spark-mock.ts is imported in main.tsx
2. Rebuild: `docker-compose up -d --build`
3. Clear browser cache: Ctrl+Shift+R

### If shared balance doesn't show

1. Check AVAILABLE_BALANCE in static-data.ts
2. Rebuild Docker image
3. Hard refresh browser

### If history doesn't show

1. Check staticTransactions array in HistoryView.tsx
2. Verify no console errors
3. Rebuild and refresh

## Success Criteria

✅ Application accessible at http://dexfistaking.com
✅ HTTPS working with valid certificate
✅ No console errors
✅ All features functional
✅ Static data displays correctly
✅ Login works properly

## Emergency Rollback

```bash
# Stop current version
docker-compose down

# Restore previous version
docker pull previous-image:tag
docker run -d -p 3000:80 previous-image:tag
```

## Monitoring

```bash
# Watch logs in real-time
docker-compose logs -f

# Check container health
docker ps
docker stats dexfi-app

# Check Nginx status
sudo systemctl status nginx

# Check SSL certificate
sudo certbot certificates
```

## Maintenance

### Regular Updates

```bash
# Pull latest code
git pull

# Rebuild and redeploy
./deploy.sh
```

### Renew SSL (Auto-renews, but to test)

```bash
sudo certbot renew --dry-run
```

### Backup

```bash
# Backup configuration
tar -czf dexfi-backup-$(date +%Y%m%d).tar.gz \
  docker-compose.yml \
  Dockerfile \
  nginx.conf \
  src/

# Upload to safe location
```

## Support Contacts

- Email: support@dexfistaking.com
- Technical issues: Check logs first
- SSL issues: Check certbot logs

---

Last updated: 2025-12-08
