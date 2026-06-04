# مستندات API سامانه فودغذا فروش

تمامی درخواست‌ها باید دارای هدر `Content-Type: application/json` باشند. برای مسیرهای محافظت شده، توکن JWT باید در هدر `Authorization: Bearer <token>` ارسال شود.

## ۱. احراز هویت (Auth)

### ثبت‌نام
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body:** `{ "fullName", "email", "password", "phone", "role" }`
- **Roles:** `customer`, `vendor`, `courier`

### ورود
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:** `{ "email", "password" }`

### ارسال OTP
- **URL:** `/api/auth/otp/send`
- **Method:** `POST`
- **Body:** `{ "phone" }`

## ۲. رستوران‌ها (Restaurants)

### لیست رستوران‌ها
- **URL:** `/api/restaurants`
- **Method:** `GET`
- **Query Params:** `lat`, `lng`, `category`, `search`

### جزئیات رستوران
- **URL:** `/api/restaurants/:slug`
- **Method:** `GET`

### ایجاد رستوران (Vendor/Admin)
- **URL:** `/api/restaurants`
- **Method:** `POST`

## ۳. منو (Menus)

### لیست دسته‌بندی‌ها
- **URL:** `/api/menus/:restaurantId/categories`
- **Method:** `GET`

### افزودن غذای جدید (Vendor)
- **URL:** `/api/menus/:restaurantId/items`
- **Method:** `POST`

## ۴. سفارشات (Orders)

### ثبت سفارش
- **URL:** `/api/orders`
- **Method:** `POST`
- **Body:**
```json
{
  "restaurantId": "ID",
  "items": [{ "itemId": "ID", "priceSnapshot": 150000, "quantity": 1 }],
  "pricing": { "total": 150000 },
  "delivery": { "address": "...", "geo": { "coordinates": [51, 35] } },
  "paymentMethod": "wallet"
}
```

### تغییر وضعیت سفارش (Vendor/Courier)
- **URL:** `/api/orders/:id/status`
- **Method:** `PATCH`
- **Body:** `{ "status": "preparing" }`

## ۵. مدیریت (Admin)

### آمار کل
- **URL:** `/api/admin/stats`
- **Method:** `GET`

---
برای جزئیات بیشتر به کدهای موجود در پوشه `src/controllers` مراجعه کنید.
