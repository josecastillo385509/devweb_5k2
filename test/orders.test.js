// Las órdenes viven en MongoDB: se usa un doble en memoria (no se requiere MongoDB para las pruebas)
jest.mock('../models/documents', () => require('./helpers/fake-documents'));

const { describeCrud } = require('./helpers/crud-suite');
const { Customer, Order, resetDocuments } = require('./helpers/fake-documents');

describeCrud('orders', {
  seed: async (users) => {
    resetDocuments();
    const customer = await Customer.create({ userID: users.user.id, email: 'user@stride.co' });
    return (await Order.create({ customerId: customer._id, totals: { total: 100 } }))._id;
  },
});
