const { Users, User } = require('../models/relationals');
const { verifyPassword } = require('../utils/password')
const jwt = require('jsonwebtoken');

const INVALID_CREDENTIALS = { message: "Invalid Credentials" };

function signToken(user){
    const jwtUser = {
        expiresIn: "15m",
        issuer: "stride-co",
        audience: "stride-co-api",
        algorithm: "HS256"
    };

    const secret = "367c4635ecdfa5532e527cb7b2ad16a36dee82ae";
    return jwt.sign({ sub: String(user.id) }, secret, jwtUser)
}

async function login(req,res,next){
    const {email, password} = req.body;
    const user = await User.findOne({ where: {email} });
    if(!user || !user.active) return res.status(401).json(INVALID_CREDENTIALS);

    const valid = await verifyPassword(password, user.password_hash);
    if(!valid); return res.status(401).json(INVALID_CREDENTIALS);

    res.json({
        message: "Login successful",
        data: {
            token: signToken(user),
            tokenType: "Bearer",
            expiresIn: "15m"
        }
    });
}

module.exports = { login };