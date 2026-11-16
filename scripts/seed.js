#!/usr/bin/env node
// Uso:  npm run seed
//
// 1. Crea las tablas si no existen (igual que bin/www).
// 2. Carga roles, permisos y la matriz (role_permissions) en MySQL.
// 3. Crea usuarios de demostración (SEED_DEMO_USERS=false para omitirlos).
// 4. Crea clientes y órdenes de demostración en MongoDB (SEED_MONGO=false para omitirlos).
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const connectMongo = require('../config/mongoose');
const { seedRbac, seedDemoUsers, sequelize } = require('../db/seeds/rbac');
const { permissions, rolePermissions } = require('../db/seeds/rbac-matrix');

async function seedMongoDemo(users) {
  await connectMongo();
  const { Customer, Order } = require('../models/documents');

  // Un cliente por cada usuario "user" y una orden por cliente
  for (const email of ['user@stride.co', 'user2@stride.co']) {
    const user = users[email];
    let customer = await Customer.findOne({ userID: user.id });
    if (!customer) customer = await Customer.create({ userID: user.id, email, phone: '614-000-0000', addresses: [] });
    const order = await Order.findOne({ customerId: customer._id });
    if (!order) {
      await Order.create({ customerId: customer._id, totals: { subtotal: 900, shipping: 100, discount: 0, total: 1000 } });
    }
  }
}

async function main() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  await seedRbac();
  console.log(`RBAC: ${Object.keys(rolePermissions).length} roles, ${permissions.length} permisos`);
  for (const [role, keys] of Object.entries(rolePermissions)) console.log(`  ${role}: ${keys.length} permisos`);

  if (process.env.SEED_DEMO_USERS !== 'false') {
    const password = process.env.SEED_PASSWORD || 'Passw0rd!';
    const users = await seedDemoUsers(password);
    console.log(`Usuarios de demostración listos (contraseña: ${password === 'Passw0rd!' ? 'Passw0rd!' : 'SEED_PASSWORD'})`);

    if (process.env.SEED_MONGO !== 'false') {
      await seedMongoDemo(users);
      console.log('Clientes y órdenes de demostración listos en MongoDB');
    }
  }
}

main()
  .then(async () => {
    await sequelize.close();
    await mongoose.disconnect();
  })
  .catch(async (err) => {
    console.error('Seed falló:', err.message);
    await sequelize.close().catch(() => {});
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });
