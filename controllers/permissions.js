const { Permission } = require('../models/relationals');

// CREATE
async function create(req, res, next) {
    try {
        const permission = await Permission.create(req.body);
        res.status(201).json({ message: 'Permission created', data: permission });
    } catch(err) {
        next(err); // quizas?
    }
}

// READ
async function list(req, res, next) {
    try {
        const permissions = await Permission.findAll();
        res.json({ message: 'GET permissions', data: permissions});
    } catch (err) {
        next(err);
    }
}

async function find(req, res, next) {
    try {
        const permission = await Permission.findByPk(req.params.id);
        if(!permission) return res.status(404).json({ message: 'Permission not found' });
        res.json({ message: 'GET permission by id', data: permission});
    } catch(err) {
        next(err);
    }
}

// UPDATE
function update(req, res, next) {
    res.json({
        message: "permission updated",
        data: {}
    });
}

// DELETE
function destroy(req, res, next) {
    res.json({
        message: "permission deleted",
        data: {}
    });
}

module.exports = { create, list, find, update, destroy };
