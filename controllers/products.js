// CREATE
function create(req, res) {
    res.status(201).json({
        message: req.__('products.created'),
        data: {}
    });
}

// READ
function list(req, res) {
    res.json({
        message: req.__('products.list'),
        data: []
    });
}

function find(req, res) {
    if (req.params.id === '999') {
        return res.status(404).json({
            message: req.__('products.notFound')
        });
    }
    res.json({
        message: req.__('products.find'),
        data: {}
    });
}

// UPDATE
function update(req, res) {
    if (req.params.id === '999') {
        return res.status(404).json({
            message: req.__('products.notFound')
        });
    }
    res.json({
        message: req.__('products.updated'),
        data: {}
    });
}

// DELETE
function destroy(req, res) {
    if (req.params.id === '999') {
        return res.status(404).json({
            message: req.__('products.notFound')
        });
    }
    res.json({
        message: req.__('products.deleted'),
        data: {}
    });
}

module.exports = { create, list, find, update, destroy };
