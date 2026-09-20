const mockCustomers = [
  {
    _id: '64b1f8e2c9a1d2e3f4a5b6c1',
    userId: 101,
    phone: '+526141234567',
    email: 'cliente1@stride.com',
    addresses: [
      {
        type: 'shipping',
        street: 'Av. Universidad',
        number: '1234',
        city: 'Chihuahua',
        state: 'Chihuahua',
        postalCode: '31000',
        country: 'México'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const getAllCustomers = (req, res) => {
  res.status(200).json({
    message: 'GET customers',
    data: mockCustomers
  });
};

const getCustomerById = (req, res) => {
  const { id } = req.params;
  const customer = mockCustomers.find((c) => c._id === id);

  if (!customer) {
    return res.status(404).json({
      message: 'Cliente no encontrado',
      data: null
    });
  }

  res.status(200).json({
    message: `GET customer ${id}`,
    data: customer
  });
};

const createCustomer = (req, res) => {
  const newCustomer = {
    _id: '64b1f8e2c9a1d2e3f4a5b6c2',
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.status(201).json({
    message: 'POST customer',
    data: newCustomer
  });
};

const updateCustomer = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    message: `PUT customer ${id}`,
    data: {
      _id: id,
      ...req.body,
      updatedAt: new Date().toISOString()
    }
  });
};

const deleteCustomer = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    message: `DELETE customer ${id}`,
    data: { _id: id }
  });
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};