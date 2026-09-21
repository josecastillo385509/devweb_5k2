// CREATE
function create(req, res) {
    res.status(201).json({
        message: "product created",
        data: {}
    });
}

// READ
function list(req, res) {
    res.json({
        message: "products list",
        data: []
    });
}

function find(req, res) {
    res.json({
        message: "product by id",
        data: {}
    });
}

// UPDATE
function update(req, res) {
    res.json({
        message: "product updated",
        data: {}
    });
}

// DELETE
function destroy(req, res) {
    res.json({
        message: "product deleted",
        data: {}
    });
}

module.exports = { create, list, find, update, destroy };
