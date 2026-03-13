# Просто купить — SPA на Vue CLI

Готовый учебный проект по заданию: каталог товаров, регистрация, вход, корзина и оформленные заказы.

## Что реализовано

- Vue CLI + Vue 3
- Vue Router для маршрутов
- Vuex для состояния приложения
- Работа с API через отдельный транспортный слой `src/utils/api.js`
- Защита приватных роутов (`/cart`, `/orders`)
- Валидация форм регистрации и входа
- Сообщения об ошибках и успешных действиях
- Анимации переходов и toast-уведомления
- Группировка одинаковых товаров в корзине

## API

Используется точка входа:

`http://lifestealer86.ru/api-shop`

Примеры:

- `GET /products`
- `POST /login`
- `POST /signup`
- `GET /cart`
- `POST /cart/{product_id}`
- `DELETE /cart/{id}`
- `GET /order`
- `POST /order`
- `GET /logout`

## Установка и запуск

### 1. Установить зависимости

```bash
npm install
```

### 2. Создать `.env`

Скопируйте файл `.env.example` в `.env`:

```bash
cp .env.example .env
```

Для Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3. Запустить проект

```bash
npm run serve
```

После запуска откройте адрес, который покажет Vue CLI в терминале.

## Структура проекта

```text
src/
  assets/
    styles.css
  components/
    ui/
      AppHeader.vue
  router/
    index.js
  store/
    index.js
  utils/
    api.js
  views/
    CatalogView.vue
    LoginView.vue
    RegisterView.vue
    CartView.vue
    OrdersView.vue
  App.vue
  main.js
```

## Что можно показать преподавателю

- разделение на слои: `views` / `store` / `router` / `utils`
- использование Vuex actions и mutations
- хранение токена в `localStorage`
- route guards для авторизованных и неавторизованных пользователей
- обработка ошибок API, включая 401/403/422
- UX: анимации, hover-эффекты, уведомления, подсветка ошибок

## Важно

В архив не включены `node_modules`, потому что они скачиваются командой `npm install`.
