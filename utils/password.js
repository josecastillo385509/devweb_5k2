const config = require('config');
const bcrypt = require('bcrypt');

// Factor de costo de bcrypt leído desde config
function getSaltRounds() {
    return config.get('bcrypt.saltRounds');
}

// Genera un salt nuevo (saltKey) y el hash de la contraseña (securePassword).
// Ambos se guardan juntos en salt_key y password_hash.
async function hashPassword(password) {
    const saltKey = await bcrypt.genSalt(getSaltRounds());
    const securePassword = await bcrypt.hash(password, saltKey);
    return { securePassword, saltKey };
}

// Compara la contraseña recibida contra el hash almacenado (no se recalcula el hash)
async function verifyPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}

module.exports = { hashPassword, verifyPassword };
