# Food Order API (Node.js + Express + MongoDB/Mongoose)

نمونه‌کار بک‌اند با معماری تمیز، NoSQL (MongoDB)، احراز هویت JWT، RBAC (customer/vendor/admin)،
مدیریت منو/سبد/سفارش، و پنل ادمین برای کنترل سفارش‌ها و فروشنده‌ها.

## Tech
- Node.js, Express
- MongoDB, Mongoose (Indexes, Embeds, Refs)
- JWT Auth + Role-based Access
- Swagger (OpenAPI 3) → `/api/docs`
- Jest + Supertest + mongodb-memory-server (E2E)

## Run
```bash
npm i
cp .env.example .env
npm run dev
# Swagger: http://localhost:4000/api/docs

npm run seed
# Admin: admin@example.com / admin123
# Vendor: vendor@example.com / vendor123
