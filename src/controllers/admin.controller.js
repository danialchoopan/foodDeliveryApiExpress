const { User, Restaurant, Coupon, Order } = require('../models');

exports.getStats = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    const restaurantCount = await Restaurant.countDocuments();
    const orderCount = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    res.json({
      users: userCount,
      restaurants: restaurantCount,
      orders: orderCount,
      revenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    next(err);
  }
};

exports.approveRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
    res.json(restaurant);
  } catch (err) {
    next(err);
  }
};

exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    next(err);
  }
};
