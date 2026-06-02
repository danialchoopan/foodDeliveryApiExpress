# مستندات API فودغذا فروش

تمامی پاسخ‌ها با فرمت JSON ارسال می‌شوند.

## احراز هویت
- `POST /api/auth/register`: ثبت‌نام کاربر جدید
- `POST /api/auth/login`: ورود و دریافت توکن JWT
- `POST /api/auth/otp/send`: ارسال کد تایید (شبیه‌سازی شده)
- `POST /api/auth/otp/verify`: تایید کد و دریافت توکن

## رستوران‌ها
- `GET /api/restaurants`: لیست رستوران‌ها (با فیلتر lat, lng, category, search)
- `GET /api/restaurants/:slug`: جزئیات رستوران و منو
- `POST /api/restaurants`: ثبت رستوران جدید (نقش vendor)

## سفارشات
- `POST /api/orders`: ثبت سفارش جدید (نقش customer)
- `GET /api/orders/my`: لیست سفارشات من
- `PATCH /api/orders/:id/status`: تغییر وضعیت سفارش
- `PATCH /api/orders/:id/assign`: پذیرش سفارش توسط پیک

## مدیریت (Admin)
- `GET /api/admin/stats`: آمار کلی سامانه
- `PATCH /api/admin/restaurants/:id/approve`: تایید رستوران
- `POST /api/admin/coupons`: ساخت کد تخفیف جدید

## نمونه درخواست (ثبت سفارش)
```json
{
  "restaurantId": "ID_HERE",
  "items": [
    { "itemId": "ITEM_ID", "titleSnapshot": "پیتزا پپرونی", "priceSnapshot": 220000, "quantity": 1 }
  ],
  "pricing": { "subtotal": 220000, "deliveryFee": 20000, "total": 240000 },
  "delivery": { "address": "تهران، سعادت آباد", "geo": { "coordinates": [51.37, 35.78] } },
  "paymentMethod": "wallet"
}
```
