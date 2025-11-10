require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('../config/db');
const { User, Restaurant, MenuCategory, MenuItem } = require('../models');

(async () => {
  try {
    await connect();

    // Admin
    let admin = await User.findOne({ email: 'admin@example.com' });
    if (!admin) {
      admin = await User.create({
        fullName: 'Admin User',
        email: 'admin@example.com',
        passwordHash: await bcrypt.hash('admin123', 10),
        role: 'admin'
      });
      console.log('Admin created: admin@example.com / admin123');
    }

    // Vendor
    let vendor = await User.findOne({ email: 'vendor@example.com' });
    if (!vendor) {
      vendor = await User.create({
        fullName: 'Vendor User',
        email: 'vendor@example.com',
        passwordHash: await bcrypt.hash('vendor123', 10),
        role: 'vendor'
      });
      console.log('Vendor created: vendor@example.com / vendor123');
    }

    // Restaurant
    let rest = await Restaurant.findOne({ owner: vendor._id });
    if (!rest) {
      rest = await Restaurant.create({
        owner: vendor._id,
        name: 'رستوران نمونه',
        description: 'سفارش آنلاین غذا',
        tags: ['ایرانی','کباب'],
        isOpen: true,
        locations: [{ label: 'مرکزی', address: 'ت// 0=Sunهران', phone: '021-0000' }]
      });
      console.log('✅ Restaurant created:', rest.name);
    }

    // Categories
    const cats = await MenuCategory.find({ restaurantId: rest._id });
    if (cats.length === 0) {
      const mains = await MenuCategory.create({ restaurantId: rest._id, name: 'غذای اصلی', sortOrder: 1 });
      const drinks = await MenuCategory.create({ restaurantId: rest._id, name: 'نوشیدنی', sortOrder: 2 });
      console.log('✅ Categories created');

      // Items
      await MenuItem.create({
        restaurantId: rest._id, categoryId: mains._id,
        title: 'چلوکباب',
        description: 'چلو، کباب کوبیده، گوجه',
        price: 280000,
        options: [{ name: 'نوشابه', required: false, choices: [{ label: 'کوکا', priceDiff: 15000 }] }]
      });
      await MenuItem.create({
        restaurantId: rest._id, categoryId: drinks._id,
        title: 'دوغ',
        description: 'دوغ سنتی',
        price: 35000
      });
      console.log('Items created');
    }

    console.log('Seed done');
    process.exit(0);
  } catch (e) {
    console.error('Seed failed:', e);
    process.exit(1);
  }
})();
