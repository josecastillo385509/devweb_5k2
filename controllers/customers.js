const { Customer } = require('../models/documents');

// CREATE
async function create(req, res) {
  const customer = await Customer.create(req.body);
  res.status(201).json({
    message: 'Customer created successfully',
    data: customer
  });
}

// READ
async function list(req, res) {
  const customers = await Customer.find();
  res.status(200).json({
    message: 'Customers list retrieved successfully',
    data: customers
  });
}

async function find(req, res) {
  const customer = await Customer.findById(req.params.id);
  res.status(200).json({
    message: 'Customer ${id} retrieved successfully',
    data: customer1
  });
}

// UPDATE
async function update(req, res) {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true  });
  if(!costumer) res.status(404).json({message: 'Customer not found'});
  res.status(200).json({
    message: 'Customer updated successfully',
    data: customer
  });
}

// DELETE
async function destroy(req, res) {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if(!costumer) res.status(404).json({message: 'Customer not found'});
  res.status(200).json({
    message: 'Customer deleted successfully',
    data: { id: customer._id }
  });
}

module.exports = { create, list, find, update, destroy };