const mockOrders = [
  {
    _id: '64b1f8e2c9a1d2e3f4a5b999',
    customerId: '64b1f8e2c9a1d2e3f4a5b6c1',
    salesPersonId: 2,
    paymentMethod: 'credit_card',
    totals: {
      subtotal: 2500.00,
      shipping: 150.00,
      discount: 0.00,
      total: 2650.00
    },
    shippingAddress: {
      street: 'Av. Universidad',
      number: '1234',
      city: 'Chihuahua',
      state: 'Chihuahua',
      postalCode: '31000',
      country: 'México'
    },
    items: [
      {
        productId: 10,
        quantity: 2,
        unitPrice: 1250.00
      }
    ],
    statusHistory: [
      {
        status: 'pending',
        changedById: 2,
        changedAt: new Date().toISOString(),
        note: 'Orden creada por cliente'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const getAllOrders = (req, res) => {
  res.status(200).json({
    message: 'GET orders',
    data: mockOrders
  });
};

const getOrderById = (req, res) => {
  const { id } = req.params;
  const order = mockOrders.find((o) => o._id === id);

  if (!order) {
    return res.status(404).json({
      message: 'Orden no encontrada',
      data: null
    });
  }

  res.status(200).json({
    message: `GET order ${id}`,
    data: order
  });
};

const createOrder = (req, res) => {
  const newOrder = {
    _id: '64b1f8e2c9a1d2e3f4a5b888',
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  res.status(201).json({
    message: 'POST order',
    data: newOrder
  });
};

const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    message: `PUT (Update Status) order ${id}`,
    data: {
      _id: id,
      status: req.body.status,
      updatedAt: new Date().toISOString()
    }
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
};