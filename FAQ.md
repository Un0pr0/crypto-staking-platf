# FAQ - Часто Задаваемые Вопросы

## Деплой и Установка

### Q: Как развернуть приложение?

**A:** Используйте Docker:

```bash
docker-compose up -d --build
```

Или запустите скрипт:

```bash
chmod +x deploy.sh
./deploy.sh
```

### Q: На каком порту работает приложение?

**A:** По умолчанию на порту **3000**. Вы можете изменить это в `docker-compose.yml`.

### Q: Как обновить приложение после изменений?

**A:** 
```bash
docker-compose down
docker-compose up -d --build
```

## Ошибки

### Q: Вижу ошибки "Failed to parse KV key response" в консоли

**A:** Это нормально при первой загрузке. Если ошибки продолжаются:

1. Пересоберите Docker образ:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

2. Очистите кеш браузера (Ctrl+Shift+R)

3. Проверьте что файл `src/lib/spark-mock.ts` импортирован в `src/main.tsx`

### Q: Не отображается Shared Wallet Balance

**A:** 
1. Проверьте что `AVAILABLE_BALANCE` определен в `src/lib/static-data.ts`
2. Пересоберите приложение
3. Очистите кеш браузера

### Q: История транзакций пустая

**A:**
1. Убедитесь что массив `staticTransactions` заполнен в `HistoryView.tsx`
2. Проверьте консоль браузера на ошибки
3. Пересоберите Docker образ

### Q: Порт 3000 уже занят

**A:** Измените порт в `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Используйте другой порт
```

## Данные и Логин

### Q: Какие данные отображаются?

**A:** Все данные статичны:
- Общий баланс: $21,155
- Доступный баланс: $6,135
- Застейкано: $8,700
- Активных позиций: 3
- В депозитах: $6,320

### Q: Какие логин и пароль?

**A:**
- **Логин:** Weravest
- **Пароль:** Weravest_13579/

### Q: Можно ли изменить данные?

**A:** Да, редактируйте файл `src/lib/static-data.ts`:

```typescript
export const TOTAL_BALANCE = 21155  // Измените здесь
export const AVAILABLE_BALANCE = 6135
// и т.д.
```

После изменений пересоберите:
```bash
docker-compose up -d --build
```

## Production

### Q: Как настроить домен?

**A:** 
1. Настройте DNS вашего домена на IP сервера
2. Настройте Nginx (см. DEPLOYMENT.md)
3. Установите SSL сертификат с Certbot

### Q: Как включить HTTPS?

**A:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Q: Как проверить работу SSL?

**A:**
```bash
sudo certbot certificates
```

### Q: SSL сертификат истекает?

**A:** Certbot автоматически обновляет сертификаты. Проверить:
```bash
sudo certbot renew --dry-run
```

## Производительность

### Q: Приложение медленно загружается

**A:**
1. Проверьте логи: `docker-compose logs -f`
2. Проверьте ресурсы: `docker stats`
3. Убедитесь что gzip включен в nginx.conf

### Q: Как посмотреть логи?

**A:**
```bash
# В реальном времени
docker-compose logs -f

# Последние 100 строк
docker-compose logs --tail=100

# Только ошибки
docker-compose logs | grep -i error
```

## Разработка

### Q: Как запустить локально без Docker?

**A:**
```bash
npm install
npm run dev
```

Откроется на http://localhost:5173

### Q: Где находятся статичные данные?

**A:** 
- `src/lib/static-data.ts` - основные данные
- `src/components/crypto/HistoryView.tsx` - история транзакций
- `src/components/crypto/StakingView.tsx` - данные стейкинга

### Q: Как добавить новую криптовалюту?

**A:** Редактируйте `src/lib/crypto-utils.ts`:

```typescript
export const CRYPTO_INFO = {
  // ... существующие
  DOGE: { 
    name: 'Dogecoin', 
    priceUSD: 0.08, 
    color: 'oklch(0.70 0.20 60)', 
    symbol: 'Ð' 
  },
}
```

## Безопасность

### Q: Безопасно ли это приложение?

**A:** Это **демонстрационное** приложение:
- Статичные данные
- Нет реальных транзакций
- Не используйте с реальными средствами

### Q: Где хранятся пароли?

**A:** Пароли проверяются только на клиенте в `LoginForm.tsx`. Нет backend проверки.

### Q: Можно ли использовать в production?

**A:** Только как демо. Для реального использования необходимо:
- Backend с настоящей базой данных
- Настоящая аутентификация
- Шифрование данных
- Защита от CSRF/XSS

## Кастомизация

### Q: Как изменить цвета?

**A:** Редактируйте `src/index.css`:

```css
:root {
  --primary: oklch(0.45 0.19 250);  /* Измените здесь */
  --accent: oklch(0.75 0.15 195);
  /* и т.д. */
}
```

### Q: Как изменить название приложения?

**A:**
1. В `index.html`: измените `<title>`
2. В `LoginForm.tsx`: измените текст "Dexfi"
3. В `App.tsx`: измените заголовок

### Q: Как добавить новую вкладку?

**A:** В `App.tsx` добавьте новый `TabsTrigger` и `TabsContent`.

## Поддержка

### Q: Куда обращаться за помощью?

**A:** 
- Email: support@dexfistaking.com
- Проверьте логи: `docker-compose logs -f`
- Проверьте CHECKLIST.md для диагностики

### Q: Приложение вообще не работает

**A:**
1. Проверьте статус: `docker ps`
2. Проверьте логи: `docker-compose logs -f`
3. Пересоздайте контейнер:
   ```bash
   docker-compose down
   docker system prune -f
   docker-compose up -d --build
   ```

---

**Не нашли ответ?**  
Проверьте README.md, DEPLOYMENT.md и CHECKLIST.md
