# Food Order API (Node.js + Express.js + MongoDB/Mongoose)

## Tech
- Node.js, Express
- MongoDB, Mongoose (Indexes, Embeds, Refs)
- JWT Auth + Role-based Access

## Run
```bash
npm i
cp .env.example .env
npm run dev
```

## Seed (اختیاری)
```bash
npm run seed
# Admin: admin@example.com / admin123
# Vendor: vendor@example.com / vendor123
```


## Key Endpoints
- `POST /api/auth/register|login|me`
- `GET/POST /api/restaurants`
- `GET/POST /api/menus/:restaurantId/categories`
- `GET/POST /api/menus/:restaurantId/items`
- `GET /api/carts/me`, `POST /api/carts/me/items`, `POST /api/orders/from-cart`
- `GET /api/admin/orders`, `PATCH /api/admin/orders/:id/status`

## Structure
- `src/models` 
- `src/services` 
- `src/controllers` 
- `src/routes` 
