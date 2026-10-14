const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const saltKey = await bcrypt.genSalt(10);
    const securePassword = bcrypt.hash(password,saltKey);
    return { securePassword,saltKey };
}

function verifyPassword(password , passwordHash){
    return bcrypt.compare(password ,passwordHash)    
};

module.exports = { hashPassword , verifyPassword };