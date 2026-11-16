const { Customer } = require('../models/documents');

// CREATE
async function create(req, res) {
  const customer = await Customer.create(req.body);
  res.status(201).json({
    message: req.__('customers.created'),
    data: customer
  });
}

// READ
async function list(req, res) {
  const customers = await Customer.find();
  res.status(200).json({
    message: req.__('customers.list'),
    data: customers
  });
}

async function find(req, res) {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ message: req.__('customers.notFound') });
  res.status(200).json({
    message: req.__('customers.find'),
    data: customer
  });
}

// Clientes del usuario autenticado (Customer.userID === req.user.id)
async function mine(req, res) {
  const customers = await Customer.find({ userID: req.user.id });
  res.status(200).json({
    message: req.__('customers.mine'),
    data: customers
  });
}

// UPDATE
async function update(req, res) {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if(!customer) return res.status(404).json({ message: req.__('customers.notFound') });
  res.status(200).json({
    message: req.__('customers.updated'),
    data: customer
  });
}

// DELETE
async function destroy(req, res) {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if(!customer) return res.status(404).json({ message: req.__('customers.notFound') });
  res.status(200).json({
    message: req.__('customers.deleted'),
    data: { id: customer._id }
  });
}

module.exports = { create, list, mine, find, update, destroy };
