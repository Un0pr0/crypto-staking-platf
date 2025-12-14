# Инструкция по развертыванию Dexfi

## Русский

### Требования
- Docker и Docker Compose установлены на сервере
- Доменное имя настроено (dexfistaking.com)
- Сервер с открытыми портами 80 и 443

### Быстрый старт

1. **Клонируйте проект на сервер:**
```bash
git clone <ваш-репозиторий> dexfi
cd dexfi
```

2. **Запустите приложение через Docker:**
```bash
docker-compose up -d
```

3. **Приложение будет доступно на порту 3000**

### Настройка с доменом

1. **Настройте Nginx (если используете):**

Создайте файл `/etc/nginx/sites-available/dexfistaking.com`:

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

2. **Активируйте конфигурацию:**
```bash
sudo ln -s /etc/nginx/sites-available/dexfistaking.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

3. **Установите SSL сертификат (Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d dexfistaking.com -d www.dexfistaking.com
```

### Управление приложением

**Остановить:**
```bash
docker-compose down
```

**Перезапустить:**
```bash
docker-compose restart
```

**Просмотр логов:**
```bash
docker-compose logs -f
```

**Обновить приложение:**
```bash
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Данные для входа

- **Логин:** Weravest
- **Пароль (основной):** Weravest_13579/
- **Пароль (статические данные):** Weravest_13579//

---

## English

### Requirements
- Docker and Docker Compose installed on server
- Domain name configured (dexfistaking.com)
- Server with open ports 80 and 443

### Quick Start

1. **Clone the project to your server:**
```bash
git clone <your-repository> dexfi
cd dexfi
```

2. **Start the application with Docker:**
```bash
docker-compose up -d
```

3. **Application will be available on port 3000**

### Domain Setup

1. **Configure Nginx (if using):**

Create file `/etc/nginx/sites-available/dexfistaking.com`:

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

2. **Activate configuration:**
```bash
sudo ln -s /etc/nginx/sites-available/dexfistaking.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

3. **Install SSL certificate (Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d dexfistaking.com -d www.dexfistaking.com
```

### Application Management

**Stop:**
```bash
docker-compose down
```

**Restart:**
```bash
docker-compose restart
```

**View logs:**
```bash
docker-compose logs -f
```

**Update application:**
```bash
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Login Credentials

- **Username:** Weravest
- **Password (main):** Weravest_13579/
- **Password (static data):** Weravest_13579//

---

## Troubleshooting / Решение проблем

### Порт уже занят / Port already in use
Измените порт в `docker-compose.yml` с 3000 на другой (например, 3001):
```yaml
ports:
  - "3001:80"
```

### Проблемы с правами / Permission issues
```bash
sudo chown -R $USER:$USER .
```

### Приложение не запускается / Application won't start
```bash
docker-compose logs
```
Проверьте логи для диагностики / Check logs for diagnostics
