const User = require('../models/relationals/Users');

// CREATE
async function create(req, res) {
    const name = body.req.name;
    const lastName = body.req.lastName;
    const email = body.req.email;
    const user = await User.create({first_name:name, last_name:lastName, email:email});
    res.status(201).json({
        message: 'user created',
        data: user
    });
}

// READ
async function list(req, res) {
    const users = await User.findAll();
    res.json({
        message: "users list",
        data: users
    });
}

async function find(req, res) {
    const id = req.params.id;
    const user = await User.findByPk(id);
    res.json({
        message: "user by id",
        data: user
    });
}

// UPDATE
async function update(req, res) {
    const id = req.params.id;
    const user = await User.findByPk(id);
    const name = body.req.name;
    const lastName = body.req.lastName;
    const email = body.req.email;
    if(!user) res.status(404).json({ message: 'User not found'});
    let changes = {};
    changes.first_name = name ? name : user.first_name
    changes.last_name = lastName ? lastName : user.last_name
    changes.email = email ? email : user.email

    await user.update(changes);

    res.json({
        message: "user updated",
        data: user
    });
}

// DELETE
async function destroy(req, res) {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if(!user) res.status(404).json({ message: 'User not found'});
    await user.destroy();
    res.json({
        message: "user deleted",
        data: user
    });
}

module.exports = { create, list, find, update, destroy };
