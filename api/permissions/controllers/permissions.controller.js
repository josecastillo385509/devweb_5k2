// CREATE
function create(req, res) {
    res.status(201).json({
        message: "permission created",
        data: {}
    });
}

// READ
function list(req, res) {
    res.json({
        message: "permissions list",
        data: []
    });
}

function find(req, res) {
    res.json({
        message: "permission by id",
        data: {}
    });
}

// UPDATE
function update(req, res) {
    res.json({
        message: "permission updated",
        data: {}
    });
}

// DELETE
function destroy(req, res) {
    res.json({
        message: "permission deleted",
        data: {}
    });
}

module.exports = { create, list, find, update, destroy };
