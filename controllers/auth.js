const config = require('config');
const { User } = require('../models/relationals');
const { verifyPassword } = require('../utils/password');
const jwt = require('jsonwebtoken');

feat/automatized-jest-supertest
//const INVALIDCREDENTIALS = { message: "Invalid credentials" };

// Firma el JWT con la configuración de .env. El payload solo lleva el id del usuario (sub).
function signToken(user){

// Firma el JWT con la configuración. El payload solo lleva el id del usuario (sub).
function signToken(user) {
 main
    const jwtOptions = {
        expiresIn: config.get('jwt.expiresIn'),
        issuer: config.get('jwt.issuer'),
        audience: config.get('jwt.audience'),
        algorithm: config.get('jwt.algorithm'),
    };

    return jwt.sign({ sub: String(user.id) }, config.get('jwt.secret'), jwtOptions);
}

// LOGIN
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
            return res.status(400).json({ message: req.__('auth.requiredCredentials') });
        }

        const user = await User.findOne({ where: { email } });
 feat/automatized-jest-supertest
        if(!user || !user.active) return res.status(401).json({ message: req.__('auth.invalidCredentials') });

        const valid = await verifyPassword(password, user.password_hash);
        if(!valid) return res.status(401).json({ message: req.__('auth.invalidCredentials') });

        if (!user || !user.active) {
            return res.status(401).json({ message: req.__('auth.invalidCredentials') });
        }

        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ message: req.__('auth.invalidCredentials') });
        }
main

        res.json({
            message: req.__('auth.loginSuccess'),
            data: {
                token: signToken(user),
                tokenType: 'Bearer',
                expiresIn: config.get('jwt.expiresIn'),
            }
        });
    } catch (err) {
        next(err);
    }
}

// ME
// req.user lo deja el middleware authenticate; User.toJSON() oculta password_hash y salt_key
function me(req, res) {
    res.json(req.user);
}

module.exports = { login, me };
