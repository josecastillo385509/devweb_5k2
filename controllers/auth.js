const { User } = require('../models/relationals');
const { verifyPassword } = require('../utils/password');
const jwt = require('jsonwebtoken');

const INVALID_CREDENTIALS = { message: "Invalid credentials" };

// Firma el JWT con la configuración de .env. El payload solo lleva el id del usuario (sub).
function signToken(user){
    const jwtOptions = {
        expiresIn: process.env.JWT_EXPIRES_IN,
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        algorithm: "HS256"
    };

    return jwt.sign({ sub: String(user.id) }, process.env.JWT_SECRET, jwtOptions);
}

// LOGIN
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if(typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
            return res.status(400).json({ message: "email and password are required" });
        }

        const user = await User.findOne({ where: { email } });
        if(!user || !user.active) return res.status(401).json(INVALID_CREDENTIALS);

        const valid = await verifyPassword(password, user.password_hash);
        if(!valid) return res.status(401).json(INVALID_CREDENTIALS);

        res.json({
            message: "Login successful",
            data: {
                token: signToken(user),
                tokenType: "Bearer",
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        });
    } catch(err) {
        next(err);
    }
}

// ME
// req.user lo deja el middleware authenticate; User.toJSON() oculta password_hash y salt_key
function me(req, res) {
    res.json(req.user);
}

module.exports = { login, me };
