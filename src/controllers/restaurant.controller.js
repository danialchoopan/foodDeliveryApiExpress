const { Restaurant, MenuItem, MenuCategory } = require('../models');

exports.listRestaurants = async (req, res, next) => {
  try {
    const { lat, lng, category, search } = req.query;
    let query = { status: 'active' };

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    // If coordinates provided, sort by distance
    let restaurants;
    if (lat && lng) {
      restaurants = await Restaurant.find({
        ...query,
        'locations.geo': {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: 50000 // 50km
          }
        }
      });
    } else {
      restaurants = await Restaurant.find(query);
    }

    res.json(restaurants);
  } catch (err) {
    next(err);
  }
};

exports.getRestaurantDetails = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const categories = await MenuCategory.find({ restaurantId: restaurant._id });
    const menuItems = await MenuItem.find({ restaurantId: restaurant._id, isAvailable: true });

    res.json({
      restaurant,
      menu: categories.map(cat => ({
        ...cat.toObject(),
        items: menuItems.filter(item => item.categoryId.toString() === cat._id.toString())
      }))
    });
  } catch (err) {
    next(err);
  }
};

exports.createRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.create({
      ...req.body,
      owner: req.user._id,
      status: 'pending'
    });
    res.status(201).json(restaurant);
  } catch (err) {
    next(err);
  }
};

exports.updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found or unauthorized' });
    res.json(restaurant);
  } catch (err) {
    next(err);
  }
};
