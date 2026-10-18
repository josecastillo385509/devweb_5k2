const { Permission } = require('../models/relationals');

// CREATE
async function create(req, res, next) {
    const key = req.body.key;
    const description = req.body.description;
    const permission = await Permission.create({ key, description });
    res.status(201).json({
        message: "permission created",
        data: permission
    });
}

// READ
async function list(req, res, next) {
    const permissions = await Permission.findAll();
    res.json({
        message: "permissions list",
        data: permissions
    });
}

async function find(req, res, next) {
    const id = req.params.id;
    const permission = await Permission.findByPk(id);
    res.json({
        message: "permission by id",
        data: permission
    });
}

// UPDATE
async function update(req, res, next) {
    const id = req.params.id;
    const permission = await Permission.findByPk(id);
    if(!permission) res.status(404).json({ message: "permission not found" });
    const key = req.body.key;
    const description = req.body.description;
    let changes = {};
    changes.key = key ? key : permission.key;
    changes.description = description ? description : permission.description;
    await permission.update(changes);
    res.json({
        message: "permission updated",
        data: permission
    });
}

// DELETE
async function destroy(req, res, next) {
    const id = req.params.id;
    const permission = await Permission.findByPk(id);
    if(!permission) res.status(404).json({ message: "permission not found "});
    await permission.destroy();
    res.json({
        message: "permission deleted",
        data: permission
    });
}

module.exports = { create, list, find, update, destroy };
