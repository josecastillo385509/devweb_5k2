// Controlador de users (respuestas mock: aún sin base de datos)

// CREATE
function create(req, res) {
  res.status(201).json({
    message: 'User created successfully',
    data: {},
  });
}

// READ
function list(req, res) {
  res.status(200).json({
    message: 'Users list retrieved successfully',
    data: [],
  });
}

function find(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `User ${id} retrieved successfully`,
    data: {},
  });
}

// UPDATE
function update(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `User ${id} updated successfully`,
    data: {},
  });
}

// DELETE
function destroy(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `User ${id} deleted successfully`,
    data: {},
  });
}

module.exports = { create, list, find, update, destroy };
