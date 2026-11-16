const config = require('config');
const mongoose = require('mongoose');

function connectMongo() {
    const uri = config.get('database.mongo.uri');
    return mongoose.connect(uri);
}

module.exports = connectMongo;
