const { Customer, Order } = require('../models/documents');

// CREATE
async function create(req, res, next) {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({
      message: 'Order created successfully',
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

// READ
async function list(req, res, next) {
  try {
    const orders = await Order.find().populate('customerId');
    res.status(200).json({
      message: 'Orders list retrieved successfully',
      data: orders,
    });
  } catch (err) {
    next(err);
  }
}

// Órdenes del usuario autenticado: las de los clientes cuyo userID es req.user.id
async function mine(req, res, next) {
  try {
    const customers = await Customer.find({ userID: req.user.id });
    const orders = await Order.find({ customerId: { $in: customers.map((c) => c._id) } }).populate('customerId');
    res.status(200).json({
      message: 'Own orders list retrieved successfully',
      data: orders,
    });
  } catch (err) {
    next(err);
  }
}

async function find(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate('customerId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({
      message: `Order ${req.params.id} retrieved successfully`,
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

// UPDATE
async function update(req, res, next) {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({
      message: `Order ${req.params.id} updated successfully`,
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

// DELETE
async function destroy(req, res, next) {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({
      message: `Order ${req.params.id} deleted successfully`,
      data: { id: order._id },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, mine, find, update, destroy };
