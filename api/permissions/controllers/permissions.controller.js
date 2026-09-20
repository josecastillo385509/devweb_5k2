// Controlador de permissions (respuestas mock: aún sin base de datos)

// CREATE
function create(req, res) {
  res.status(201).json({
    message: 'Permission created successfully',
    data: {},
  });
}

// READ
function list(req, res) {
  res.status(200).json({
    message: 'Permissions list retrieved successfully',
    data: [],
  });
}

function find(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `Permission ${id} retrieved successfully`,
    data: {},
  });
}

// UPDATE
function update(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `Permission ${id} updated successfully`,
    data: {},
  });
}

// DELETE
function destroy(req, res) {
  const { id } = req.params;
  res.status(200).json({
    message: `Permission ${id} deleted successfully`,
    data: {},
  });
}

module.exports = { create, list, find, update, destroy };
