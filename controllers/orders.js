const { Order } = require('../models/documents');

// CREATE
async function create(req, res) {
  const order = await Order.create(req.body);
  res.status(201).json({
    message: 'Order created successfully',
    data: order,
  });
}

// READ
async function list(req, res) {
  const orders = await Order.find().populate('customerId');
  res.status(200).json({
    message: 'Orders list retrieved successfully',
    data: orders,
  });
}

async function find(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `Order ${id} retrieved successfully`,
    data: {},
  });
}

// UPDATE
async function update(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `Order ${id} updated successfully`,
    data: {},
  });
}

// DELETE
async function destroy(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `Order ${id} deleted successfully`,
    data: {},
  });
}

module.exports = { create, list, find, update, destroy };