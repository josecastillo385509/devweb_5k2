// Controlador de roles (respuestas mock: aún sin base de datos)

// CREATE
function create(req, res) {
  res.status(201).json({
    message: 'Role created successfully',
    data: {},
  });
}

// READ
function list(req, res) {
  res.status(200).json({
    message: 'Roles list retrieved successfully',
    data: [],
  });
}

function find(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `Role ${id} retrieved successfully`,
    data: {},
  });
}

// UPDATE
function update(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `Role ${id} updated successfully`,
    data: {},
  });
}

// DELETE
function destroy(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `Role ${id} deleted successfully`,
    data: {},
  });
}

module.exports = { create, list, find, update, destroy };
