
// CREATE
function create(req, res, next){
    res.status(201).json({
        message: "user created",
        data: {}
    });
}

// READ
function list(req, res, next) {
    res.json({
        message: "users list",
        data: []
    });
}

function find(req, res, next) {
    res.json({
        message: "user by id",
        data: {}
    });
}

// UPDATE
function update(req, res, next){
    res.json({
        message: "user updated",
        data: {}
    });
}

// DELETE
function destroy(req, res, next){
    res.json({
        message: "user deleted",
        data: {}
    })
}

module.exports = {create, list, find, update, destroy};