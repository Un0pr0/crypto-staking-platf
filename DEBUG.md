# Руководство по отладке / Debugging Guide

## Русский

### Проблема: Shared Balance и History не отображаются

Все данные в приложении полностью статичны и определены в файле `src/lib/static-data.ts`. Если данные не отображаются после деплоя через Docker, следуйте этим шагам:

#### 1. Проверьте консоль браузера

Откройте DevTools (F12) → Console и ищите следующие сообщения:

**BalanceView:**
```
BalanceView - holdings: Array(5) [{…}, {…}, {…}, {…}, {…}]
BalanceView - TOTAL_BALANCE: 21155
```

**DepositsView:**
```
DepositsView - deposits: Array(3) [{…}, {…}, {…}]
DepositsView - availableUSDT: 6135
DepositsView - ACTIVE_DEPOSITS: 2
```

**StakingView:**
```
StakingView - activeStakes: Array(4) [{…}, {…}, {…}, {…}]
StakingView - availableUSDT: 6135
StakingView - TOTAL_STAKED: 8700
StakingView - TOTAL_REWARDS: 1287
StakingView - ACTIVE_POSITIONS: 3
```

**HistoryView:**
```
HistoryView - rendering
```

#### 2. Если логи не появляются

Это означает, что JavaScript не загружается или выполняется с ошибками.

**Проверьте ошибки:**
1. Откройте Console в DevTools
2. Ищите красные сообщения об ошибках
3. Проверьте вкладку Network - все ли .js файлы загрузились (статус 200)

#### 3. Проверьте сборку Docker

```bash
# Пересоберите образ без кэша
docker-compose down
docker-compose build --no-cache

# Проверьте логи сборки на наличие ошибок
docker-compose build 2>&1 | tee build.log

# Запустите снова
docker-compose up -d
```

#### 4. Проверьте файлы в контейнере

```bash
# Найдите имя контейнера
docker ps

# Проверьте содержимое
docker exec -it <container-name> ls -la /usr/share/nginx/html

# Должны быть файлы:
# - index.html
# - assets/ (папка с .js и .css файлами)
```

#### 5. Проверьте права доступа

```bash
# На вашем сервере
ls -la /path/to/dexfi/

# Все файлы должны быть доступны для чтения
```

#### 6. Очистите кэш браузера

1. Откройте в режиме инкогнито
2. Или нажмите Ctrl+Shift+R (Windows/Linux) / Cmd+Shift+R (Mac) для жёсткой перезагрузки

---

## English

### Issue: Shared Balance and History not displaying

All data in the application is completely static and defined in `src/lib/static-data.ts`. If data is not displaying after Docker deployment, follow these steps:

#### 1. Check Browser Console

Open DevTools (F12) → Console and look for these messages:

**BalanceView:**
```
BalanceView - holdings: Array(5) [{…}, {…}, {…}, {…}, {…}]
BalanceView - TOTAL_BALANCE: 21155
```

**DepositsView:**
```
DepositsView - deposits: Array(3) [{…}, {…}, {…}]
DepositsView - availableUSDT: 6135
DepositsView - ACTIVE_DEPOSITS: 2
```

**StakingView:**
```
StakingView - activeStakes: Array(4) [{…}, {…}, {…}, {…}]
StakingView - availableUSDT: 6135
StakingView - TOTAL_STAKED: 8700
StakingView - TOTAL_REWARDS: 1287
StakingView - ACTIVE_POSITIONS: 3
```

**HistoryView:**
```
HistoryView - rendering
```

#### 2. If logs don't appear

This means JavaScript is not loading or executing with errors.

**Check for errors:**
1. Open Console in DevTools
2. Look for red error messages
3. Check Network tab - verify all .js files loaded (status 200)

#### 3. Check Docker Build

```bash
# Rebuild image without cache
docker-compose down
docker-compose build --no-cache

# Check build logs for errors
docker-compose build 2>&1 | tee build.log

# Start again
docker-compose up -d
```

#### 4. Check Files in Container

```bash
# Find container name
docker ps

# Check contents
docker exec -it <container-name> ls -la /usr/share/nginx/html

# Should have files:
# - index.html
# - assets/ (folder with .js and .css files)
```

#### 5. Check Permissions

```bash
# On your server
ls -la /path/to/dexfi/

# All files should be readable
```

#### 6. Clear Browser Cache

1. Open in incognito mode
2. Or press Ctrl+Shift+R (Windows/Linux) / Cmd+Shift+R (Mac) for hard reload

---

## Статические данные / Static Data

Все значения определены в `src/lib/static-data.ts`:

- **TOTAL_BALANCE**: 21155 USD
- **AVAILABLE_BALANCE**: 6135 USD (Shared Wallet)
- **TOTAL_STAKED**: 8700 USD
- **TOTAL_REWARDS**: 1287 USD
- **ACTIVE_POSITIONS**: 3
- **ACTIVE_DEPOSITS**: 2

Эти значения **не зависят** от:
- Текущей даты или времени
- localStorage или sessionStorage
- Внешних API
- Базы данных

Все данные захардкожены в коде и должны отображаться сразу после загрузки приложения.
