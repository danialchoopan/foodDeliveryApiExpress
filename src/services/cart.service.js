const { Cart, MenuItem } = require('../models');

async function ensureCart(userId, restaurantId) {
  let cart = await Cart.findOne({ userId, restaurantId, status: 'active' });
  if (!cart) cart = await Cart.create({ userId, restaurantId, items: [], status: 'active' });
  return cart;
}

exports.getMyCart = async (userId, restaurantId) => {
  if (!restaurantId) throw Object.assign(new Error('restaurantId required'), { status: 400 });
  const cart = await ensureCart(userId, restaurantId);
  const total = cart.items.reduce((s, it) => s + it.quantity * it.priceSnapshot, 0);
  return { cart, total };
};

exports.addItem = async (userId, restaurantId, { itemId, quantity = 1, selectedOptions = [] }) => {
  const menuItem = await MenuItem.findById(itemId);
  if (!menuItem || String(menuItem.restaurantId) !== String(restaurantId))
    throw Object.assign(new Error('Item not available'), { status: 404 });

  const cart = await ensureCart(userId, restaurantId);
  const idx = cart.items.findIndex(i => String(i.itemId) === String(itemId));
  if (idx >= 0) {
    cart.items[idx].quantity += Number(quantity);
  } else {
    cart.items.push({
      itemId,
      titleSnapshot: menuItem.title,
      priceSnapshot: menuItem.price,
      quantity,
      selectedOptions,
    });
  }
  await cart.save();
  return cart;
};

exports.updateItem = async (userId, restaurantId, itemId, quantity) => {
  const cart = await ensureCart(userId, restaurantId);
  const it = cart.items.find(i => String(i.itemId) === String(itemId));
  if (!it) throw Object.assign(new Error('Item not in cart'), { status: 404 });
  if (quantity < 1) throw Object.assign(new Error('Quantity must be >= 1'), { status: 400 });
  it.quantity = Number(quantity);
  await cart.save();
  return cart;
};

exports.removeItem = async (userId, restaurantId, itemId) => {
  const cart = await ensureCart(userId, restaurantId);
  cart.items = cart.items.filter(i => String(i.itemId) !== String(itemId));
  await cart.save();
  return cart;
};

exports.clear = async (userId, restaurantId) => {
  const cart = await ensureCart(userId, restaurantId);
  cart.items = [];
  await cart.save();
  return cart;
};
