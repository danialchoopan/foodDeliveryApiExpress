const { Order, Cart } = require('../models');

exports.listMyOrders = (userId) => Order.find({ userId }).sort({ placedAt: -1 });

exports.createFromCart = async (userId, { restaurantId, delivery, pricingOverride }) => {
  const cart = await Cart.findOne({ userId, restaurantId, status: 'active' });
  if (!cart || cart.items.length === 0) throw Object.assign(new Error('Cart is empty'), { status: 400 });

  const subtotal = cart.items.reduce((s, it) => s + it.quantity * it.priceSnapshot, 0);
  const deliveryFee = pricingOverride?.deliveryFee ?? 0;
  const discountTotal = pricingOverride?.discountTotal ?? 0;
  const total = subtotal + deliveryFee - discountTotal;

  const order = await Order.create({
    userId,
    restaurantId,
    items: cart.items,
    pricing: { subtotal, deliveryFee, discountTotal, total },
    delivery: delivery || { type: 'delivery' },
    payment: { status: 'unpaid' },
    status: 'pending',
    statusHistory: [{ status: 'pending', by: userId }],
    placedAt: new Date(),
  });

  cart.status = 'converted';
  cart.items = [];
  await cart.save();

  return order;
};
    