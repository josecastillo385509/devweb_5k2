const { Permission } = require('../models/relationals');

// CREATE
async function create(req, res) {
    const key = req.body.key;
    const description = req.body.description;
    const permission = await Permission.create({ key, description });
    res.status(201).json({
        message: req.__('permissions.created'),
        data: permission
    });
}

// READ
async function list(req, res) {
    const permissions = await Permission.findAll();
    res.json({
        message: req.__('permissions.list'),
        data: permissions
    });
}

async function find(req, res) {
    const id = req.params.id;
    const permission = await Permission.findByPk(id);
    if (!permission) return res.status(404).json({ message: req.__('permissions.notFound') });
    res.json({
        message: req.__('permissions.find'),
        data: permission
    });
}

// UPDATE
async function update(req, res) {
    const id = req.params.id;
    const permission = await Permission.findByPk(id);
 feat/automatized-jest-supertest
    if(!permission) return res.status(404).json({ message: "permission not found" });

    if(!permission) return res.status(404).json({ message: req.__('permissions.notFound') });
main
    const key = req.body.key;
    const description = req.body.description;
    let changes = {};
    changes.key = key ? key : permission.key;
    changes.description = description ? description : permission.description;
    await permission.update(changes);
    res.json({
        message: req.__('permissions.updated'),
        data: permission
    });
}

// DELETE
async function destroy(req, res) {
    const id = req.params.id;
    const permission = await Permission.findByPk(id);
feat/automatized-jest-supertest
    if(!permission) return res.status(404).json({ message: "permission not found "});

    if(!permission) return res.status(404).json({ message: req.__('permissions.notFound') });
main
    await permission.destroy();
    res.json({
        message: req.__('permissions.deleted'),
        data: permission
    });
}

module.exports = { create, list, find, update, destroy };
