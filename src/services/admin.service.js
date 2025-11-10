const { User, Order, AdminAction, Restaurant } = require('../models');

exports.listUsers = ({ role, status }) => {
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  return User.find(filter).select('fullName email role status createdAt').sort({ createdAt: -1 });
};

exports.listOrders = ({ status, restaurantId }) => {
  const filter = {};
  if (status) filter.status = status;
  if (restaurantId) filter.restaurantId = restaurantId;
  return Order.find(filter).sort({ placedAt: -1 });
};

exports.setOrderStatus = async (adminId, orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });
  order.status = status;
  order.statusHistory.push({ status, by: adminId, at: new Date() });
  await order.save();
  await AdminAction.create({
    actorId: adminId, target: { type: 'order', id: order._id }, action: 'set_order_status', payload: { status }
  });
  return order;
};

exports.approveVendor = async (adminId, userId) => {
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  user.role = 'vendor';
  await user.save();
  await AdminAction.create({
    actorId: adminId, target: { type: 'user', id: user._id }, action: 'approve_vendor', payload: {}
  });
  return user;
};

exports.listVendorsRestaurants = (vendorId) =>
  Restaurant.find({ owner: vendorId }).sort({ createdAt: -1 });
