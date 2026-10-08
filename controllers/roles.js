// CREATE
function create(req, res) {
    res.status(201).json({
        message: "role created",
        data: {}
    });
}

// READ
function list(req, res) {
    res.json({
        message: "roles list",
        data: []
    });
}

function find(req, res) {
    res.json({
        message: "role by id",
        data: {}
    });
}

// UPDATE
function update(req, res) {
    res.json({
        message: "role updated",
        data: {}
    });
}

// DELETE
function destroy(req, res) {
    res.json({
        message: "role deleted",
        data: {}
    });
}

module.exports = { create, list, find, update, destroy };
