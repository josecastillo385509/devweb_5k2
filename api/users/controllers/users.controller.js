// CREATE
function create(req, res) {
    res.status(201).json({
        message: "user created",
        data: {}
    });
}

// READ
function list(req, res) {
    res.json({
        message: "users list",
        data: []
    });
}

function find(req, res) {
    res.json({
        message: "user by id",
        data: {}
    });
}

// UPDATE
function update(req, res) {
    res.json({
        message: "user updated",
        data: {}
    });
}

// DELETE
function destroy(req, res) {
    res.json({
        message: "user deleted",
        data: {}
    });
}

module.exports = { create, list, find, update, destroy };
