const mongoose = require('mongoose');

// Conexión a mongodb a partir de Mongoose (MONGO_URI se puede sobreescribir en .env / docker compose)
function connectMongo(){
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/stride_co";
    return mongoose.connect(uri);
}

module.exports = connectMongo;
