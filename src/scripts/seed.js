require('dotenv').config();
const mongoose = require('mongoose');
const { User, Restaurant, MenuItem, MenuCategory, Wallet } = require('../models');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/food_order_api');
    console.log('Connected to DB for seeding...');

    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      MenuItem.deleteMany({}),
      MenuCategory.deleteMany({}),
      Wallet.deleteMany({})
    ]);

    const passwordHash = await bcrypt.hash('password123', 10);

    const vendor = await User.create({
      fullName: 'مدیر رستوران‌های زنجیره‌ای',
      email: 'vendor@foodghaza.ir',
      passwordHash,
      phone: '09121111111',
      role: 'vendor'
    });

    const restaurantsData = [
      {
        name: 'رستوران نایب (سهروردی)',
        description: 'ارائه دهنده بهترین کباب‌های سنتی با برنج ۱۰۰٪ ایرانی',
        category: 'کباب',
        rating: 4.8,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/64772b97950c4.jpg',
        menu: [
            { cat: 'چلو کباب', items: [
                { title: 'چلو کباب کوبیده مخصوص', price: 320000, description: 'دو سیخ کوبیده ۱۸۰ گرمی' },
                { title: 'چلو کباب لقمه زعفرانی', price: 350000, description: 'یک سیخ لقمه ۲۲۰ گرمی' }
            ]}
        ]
      },
      {
        name: 'پیتزا سیب ۳۶۰ (سعادت‌آباد)',
        description: 'تجربه پیتزاهای مثلثی و حجیم با بهترین پنیر',
        category: 'پیتزا',
        rating: 4.6,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/645367123612d.jpg',
        menu: [
            { cat: 'پیتزا پنجره‌ای', items: [
                { title: 'پیتزا پپرونی', price: 245000, description: 'پپرونی تند، پنیر فراوان' },
                { title: 'پیتزا مخصوص سیب', price: 280000, description: 'ترکیب ژامبون و سبزیجات' }
            ]}
        ]
      },
      {
        name: 'برگر هیزمی ۱۷',
        description: 'برگرهای ذغالی با طعم واقعی گوشت تازه',
        category: 'برگر',
        rating: 4.2,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/644799066666a.jpg',
        menu: [
            { cat: 'برگرها', items: [
                { title: 'چیزبرگر مخصوص', price: 210000, description: '۱۸۰ گرم گوشت، پنیر گودا' },
                { title: 'ماشروم برگر', price: 230000, description: 'برگر با سس قارچ و خامه' }
            ]}
        ]
      },
      {
        name: 'سوخاری چاکوچ',
        description: 'جوجه سوخاری کامل و ترد با ادویه مخصوص',
        category: 'سوخاری',
        rating: 4.4,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/64819d4547b74.jpg',
        menu: [
            { cat: 'مرغ سوخاری', items: [
                { title: 'سوخاری ۲ تکه', price: 195000, description: '۲ تکه سینه یا ران + سیب‌زمینی' },
                { title: 'جوجه کامل سوخاری', price: 420000, description: 'یک عدد جوجه کامل سرخ شده' }
            ]}
        ]
      },
      {
        name: 'کافه بستنی چیمنی',
        description: 'کیک دودکشی مجارستانی با بستنی تازه',
        category: 'بستنی',
        rating: 4.7,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/642969966b96e.jpg',
        menu: [
            { cat: 'چیمنی ها', items: [
                { title: 'چیمنی پسته', price: 120000, description: 'بستنی وانیلی با مغز پسته' },
                { title: 'چیمنی نوتلا', price: 140000, description: 'بستنی با لایه نوتلا' }
            ]}
        ]
      },
      {
        name: 'آش و حلیم سید مهدی',
        description: 'قدیمی‌ترین و با کیفیت‌ترین آش و حلیم تجریش',
        category: 'ایرانی',
        rating: 4.9,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/647585645524b.jpg',
        menu: [
            { cat: 'صبحانه و عصرانه', items: [
                { title: 'حلیم مخصوص (یک کیلو)', price: 180000, description: 'با گوشت گوسفندی فراوان' },
                { title: 'آش شله قلمکار', price: 160000, description: 'آش سنتی با حبوبات و گوشت' }
            ]}
        ]
      }
    ];

    for (const r of restaurantsData) {
        const restaurant = await Restaurant.create({
            owner: vendor._id,
            name: r.name,
            description: r.description,
            category: r.category,
            status: 'active',
            rating: r.rating,
            image: r.image,
            locations: [{ label: 'شعبه اصلی', address: 'تهران، محله نمونه', geo: { type: 'Point', coordinates: [51.4, 35.7] } }]
        });

        for (const m of r.menu) {
            const category = await MenuCategory.create({ restaurantId: restaurant._id, title: m.cat });
            for (const item of m.items) {
                await MenuItem.create({
                    restaurantId: restaurant._id,
                    categoryId: category._id,
                    title: item.title,
                    price: item.price,
                    description: item.description,
                    isAvailable: true
                });
            }
        }
    }

    console.log('Advanced seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
