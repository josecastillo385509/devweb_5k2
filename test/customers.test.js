// Los clientes viven en MongoDB: se usa un doble en memoria (no se requiere MongoDB para las pruebas)
jest.mock('../models/documents', () => require('./helpers/fake-documents'));

const { describeCrud } = require('./helpers/crud-suite');
const { Customer, resetDocuments } = require('./helpers/fake-documents');

describeCrud('customers', {
  seed: async (users) => {
    resetDocuments();
    return (await Customer.create({ userID: users.user.id, email: 'user@stride.co' }))._id;
  },
  createBody: { userID: 1, email: 'nuevo@stride.co' },
});
