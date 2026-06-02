require('dotenv').config();
const mongoose = require('mongoose');
const { User, Restaurant, MenuItem, MenuCategory, Wallet } = require('../models');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/food_order_api');
    console.log('Connected to DB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      MenuItem.deleteMany({}),
      MenuCategory.deleteMany({}),
      Wallet.deleteMany({})
    ]);

    const passwordHash = await bcrypt.hash('password123', 10);

    // Create Users
    const admin = await User.create({
      fullName: 'مدیر کل',
      email: 'admin@foodghaza.ir',
      passwordHash,
      phone: '09120000000',
      role: 'admin'
    });

    const vendor = await User.create({
      fullName: 'مدیر رستوران نایب',
      email: 'nayeb@foodghaza.ir',
      passwordHash,
      phone: '09121111111',
      role: 'vendor'
    });

    const customer = await User.create({
      fullName: 'علی علوی',
      email: 'ali@gmail.com',
      passwordHash,
      phone: '09122222222',
      role: 'customer',
      addresses: [{
        label: 'خانه',
        line1: 'سعادت آباد، خیابان سرو',
        city: 'تهران',
        geo: { type: 'Point', coordinates: [51.378, 35.776] }
      }]
    });

    const courier = await User.create({
        fullName: 'رضا پیکی',
        email: 'reza@foodghaza.ir',
        passwordHash,
        phone: '09123333333',
        role: 'courier'
    });

    await Wallet.create([{ userId: admin._id }, { userId: vendor._id }, { userId: customer._id, balance: 500000 }, { userId: courier._id }]);

    // Create Restaurants
    const res1 = await Restaurant.create({
      owner: vendor._id,
      name: 'رستوران نایب',
      description: 'ارائه دهنده بهترین کباب‌های سنتی با برنج ایرانی',
      category: 'کباب',
      status: 'active',
      rating: 4.8,
      image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/64772b97950c4.jpg',
      locations: [{
        label: 'شعبه مرکزی',
        address: 'خیابان ولیعصر، نرسیده به میدان ونک',
        geo: { type: 'Point', coordinates: [51.41, 35.75] }
      }]
    });

    const res2 = await Restaurant.create({
        owner: vendor._id,
        name: 'پیتزا سیب ۳۶۰',
        description: 'پیتزاهای حجیم و با کیفیت',
        category: 'پیتزا',
        status: 'active',
        rating: 4.5,
        image: 'https://cdn.snappfood.ir/media/cache/vendor_item_cover/uploads/images/vendors/covers/645367123612d.jpg',
        locations: [{
          label: 'شعبه سعادت آباد',
          address: 'بلوار پاکنژاد',
          geo: { type: 'Point', coordinates: [51.37, 35.78] }
        }]
    });

    // Create Categories & Items
    const cat1 = await MenuCategory.create({ restaurantId: res1._id, title: 'کباب‌ها' });
    await MenuItem.create([
      { restaurantId: res1._id, categoryId: cat1._id, title: 'چلو کباب کوبیده مخصوص', price: 280000, description: 'دو سیخ کباب کوبیده ۱۸۰ گرمی + برنج ایرانی' },
      { restaurantId: res1._id, categoryId: cat1._id, title: 'چلو کباب برگ', price: 450000, description: 'یک سیخ کباب برگ گوسفندی + برنج ایرانی' }
    ]);

    const cat2 = await MenuCategory.create({ restaurantId: res2._id, title: 'پیتزا پنجره‌ای' });
    await MenuItem.create([
      { restaurantId: res2._id, categoryId: cat2._id, title: 'پیتزا پپرونی', price: 220000, description: 'پپرونی، پنیر موتزارلا، سس مخصوص' },
      { restaurantId: res2._id, categoryId: cat2._id, title: 'پیتزا مخصوص سیب', price: 260000, description: 'ژامبون، قارچ، فلفل دلمه، پنیر' }
    ]);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
