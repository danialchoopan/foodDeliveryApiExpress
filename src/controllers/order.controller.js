const { Order, Cart, Wallet, Transaction, User } = require('../models');

exports.placeOrder = async (req, res, next) => {
  try {
    const { restaurantId, items, pricing, delivery, paymentMethod } = req.body;

    // In a real app, validate pricing and items from DB
    const order = await Order.create({
      userId: req.user._id,
      restaurantId,
      items,
      pricing,
      delivery,
      payment: { method: paymentMethod, status: paymentMethod === 'wallet' ? 'paid' : 'unpaid' },
      status: 'pending',
      statusHistory: [{ status: 'pending', by: req.user._id }]
    });

    if (paymentMethod === 'wallet') {
      const wallet = await Wallet.findOne({ userId: req.user._id });
      if (wallet.balance < pricing.total) {
        return res.status(400).json({ message: 'Insufficient wallet balance' });
      }
      wallet.balance -= pricing.total;
      await wallet.save();
      await Transaction.create({
        walletId: wallet._id,
        amount: -pricing.total,
        type: 'payment',
        referenceId: order._id,
        description: `Payment for order ${order._id}`
      });
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const query = req.user.role === 'customer' ? { userId: req.user._id } :
                  req.user.role === 'vendor' ? { restaurantId: req.query.restaurantId } :
                  { courierId: req.user._id };

    const orders = await Order.find(query).sort({ createdAt: -1 }).populate('restaurantId', 'name image');
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurantId')
      .populate('courierId', 'fullName phone')
      .populate('userId', 'fullName phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Simple role-based status logic
    order.status = status;
    order.statusHistory.push({ status, by: req.user._id });

    if (status === 'ready') {
        order.status = 'searching_courier';
    }

    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.assignCourier = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.status !== 'searching_courier') {
      return res.status(400).json({ message: 'Order not available for pickup' });
    }

    order.courierId = req.user._id;
    order.status = 'courier_assigned';
    order.statusHistory.push({ status: 'courier_assigned', by: req.user._id });
    await order.save();

    res.json(order);
  } catch (err) {
    next(err);
  }
};
