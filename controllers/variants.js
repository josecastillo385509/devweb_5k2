// Controlador de variants (respuestas mock: aún sin base de datos)

// CREATE
function create(req, res) {
  res.status(201).json({
    message: req.__('variants.created'),
    data: {},
  });
}

// READ
function list(req, res) {
  res.status(200).json({
    message: req.__('variants.list'),
    data: [],
  });
}

function find(req, res) {
  if (req.params.id === '999') {
    return res.status(404).json({
      message: req.__('variants.notFound'),
    });
  }
  res.status(200).json({
    message: req.__('variants.find'),
    data: {},
  });
}

// UPDATE
function update(req, res) {
  if (req.params.id === '999') {
    return res.status(404).json({
      message: req.__('variants.notFound'),
    });
  }
  res.status(200).json({
    message: req.__('variants.updated'),
    data: {},
  });
}

// DELETE
function destroy(req, res) {
  if (req.params.id === '999') {
    return res.status(404).json({
      message: req.__('variants.notFound'),
    });
  }
  res.status(200).json({
    message: req.__('variants.deleted'),
    data: {},
  });
}

module.exports = { create, list, find, update, destroy };
