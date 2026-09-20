// Controlador de orders (respuestas mock: aún sin base de datos)

// CREATE
function create(req, res) {
  res.status(201).json({
    message: 'Order created successfully',
    data: {},
  });
}

// READ
function list(req, res) {
  res.status(200).json({
    message: 'Orders list retrieved successfully',
    data: [],
  });
}

function find(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `Order ${id} retrieved successfully`,
    data: {},
  });
}

// UPDATE
function update(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `Order ${id} updated successfully`,
    data: {},
  });
}

// DELETE
function destroy(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `Order ${id} deleted successfully`,
    data: {},
  });
}

module.exports = { create, list, find, update, destroy };