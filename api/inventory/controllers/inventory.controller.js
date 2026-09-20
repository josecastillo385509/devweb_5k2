const mockInventory = [
  {
    id: 1,
    variant_id: 1,
    stock: 50,
    reserved: 5,
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    variant_id: 2,
    stock: 20,
    reserved: 2,
    updated_at: new Date().toISOString()
  }
];

const getAllInventory = (req, res) => {
  res.status(200).json({
    message: 'GET inventory',
    data: mockInventory
  });
};

const getInventoryById = (req, res) => {
  const { id } = req.params;
  const item = mockInventory.find((inv) => inv.id === parseInt(id, 10));

  if (!item) {
    return res.status(404).json({
      message: 'Registro de inventario no encontrado',
      data: null
    });
  }

  res.status(200).json({
    message: `GET inventory ${id}`,
    data: item
  });
};

const updateInventory = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    message: `PUT inventory ${id}`,
    data: {
      id: parseInt(id, 10),
      ...req.body,
      updated_at: new Date().toISOString()
    }
  });
};

module.exports = {
  getAllInventory,
  getInventoryById,
  updateInventory
};