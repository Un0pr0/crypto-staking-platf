# 🚀 Quick Deployment Instructions

## Быстрый деплой (Quick Deploy)

```bash
# 1. Очистить старую версию (Clean old version)
docker-compose down
docker system prune -af

# 2. Собрать новую версию (Build new version)
docker-compose up -d --build

# 3. Проверить статус (Check status)
docker ps
```

## Или используйте скрипт (Or use script)

```bash
chmod +x deploy.sh
./deploy.sh
```

## Доступ (Access)

- **Локально (Local):** http://localhost:3000
- **Продакшн (Production):** http://dexfistaking.com

## Вход (Login)

- **Логин (Username):** `Weravest`
- **Пароль (Password):** `Weravest_13579/`

## Проблемы (Troubleshooting)

### Ошибки KV в консоли (KV Errors in Console)

Это нормально при первой загрузке. Если ошибки не исчезают:

```bash
# Пересоберите образ (Rebuild image)
docker-compose down
docker-compose up -d --build

# Очистите кеш браузера (Clear browser cache)
# Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### Приложение не загружается (App not loading)

```bash
# Проверьте логи (Check logs)
docker-compose logs -f

# Перезапустите контейнер (Restart container)
docker-compose restart
```

### Порт 3000 занят (Port 3000 in use)

Измените порт в `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Используйте другой порт
```

## Логи (Logs)

```bash
# Смотреть логи в реальном времени (Watch logs in real-time)
docker-compose logs -f

# Последние 100 строк (Last 100 lines)
docker-compose logs --tail=100
```

## Управление (Management)

```bash
# Остановить (Stop)
docker-compose down

# Запустить (Start)
docker-compose up -d

# Перезапустить (Restart)
docker-compose restart

# Удалить все (Remove everything)
docker-compose down -v
docker system prune -af
```

## Обновление (Updating)

```bash
# После изменения кода (After code changes)
docker-compose down
docker-compose up -d --build
```

## Поддержка (Support)

📧 support@dexfistaking.com

## Статичные данные (Static Data)

Все данные статичны для демонстрации:
- Общий баланс: $21,155
- Доступно: $6,135
- В стейкинге: $8,700
- Активных позиций: 3
- В депозитах: $6,320
