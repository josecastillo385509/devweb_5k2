const Role = require('../models/relationals/Role');
const Permission = require('../models/relationals/Permission');

// CREATE
async function create(req, res) {
    try {
        const role = await Role.create(req.body);
        if(req.body.permissionIds) role.setPermissions(req.body.permissionIds);
        res.status(201).json({
            message: "role created",
            data: role
        });
    } catch(err) {
        next(err);
    }
}

// READ
async function list(req, res) {
    const roles = await Role.findAll({ include: { model: Permission, as: 'permissions' } });
    res.json({
        message: "roles list",
        data: roles
    });
}

async function find(req, res) {
    const role = await Role.findByPk(req.params.id, { include: { model: Permission, as: 'permissions '}});
    res.json({
        message: "role by id",
        data: role
    });
}

// UPDATE
async function update(req, res) {
    try {
        const role = await Role.findByPk(req.params.id);
        if(req.body.permissionIds) role.setPermissions(req.body.permissionIds);
        if(!role) return res.status(404).json({
            message: "role not found"
        });
        await role.update(req.body);
        if(req.body.permissionIds) role.setPermissions(req.body.permissionIds);
        res.json({
            message: "role updated",
            data: role
        });
    } catch(err) {
        next(err);
    }
    /*
    */
}

// DELETE
async function destroy(req, res) {
    const id = req.params.id;
    const role = await Role.findByPk(id);
    if(!role) res.status(404).json({
        message: "role not found"
    });
    await role.destroy();
    res.json({
        message: "role deleted",
        data: role
    });
}

module.exports = { create, list, find, update, destroy };
