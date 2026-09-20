const mockVariants = [
  {
    id: 1,
    product_id: 10,
    sku: 'STRIDE-BLK-42',
    size: '42',
    color: 'Negro',
    active: true
  },
  {
    id: 2,
    product_id: 10,
    sku: 'STRkIDE-WHT-40',
    size: '40',
    color: 'Blanco',
    active: true
  }
];

const getAllVariants = (req, res) => {
  res.status(200).json({
    message: 'GET variants',
    data: mockVariants
  });
};

const getVariantById = (req, res) => {
  const { id } = req.params;
  const variant = mockVariants.find((v) => v.id === parseInt(id, 10));

  if (!variant) {
    return res.status(404).json({
      message: 'Variante no encontrada',
      data: null
    });
  }

  res.status(200).json({
    message: `GET variant ${id}`,
    data: variant
  });
};

const createVariant = (req, res) => {
  const newVariant = {
    id: mockVariants.length + 1,
    ...req.body,
    active: true
  };

  res.status(201).json({
    message: 'POST variant',
    data: newVariant
  });
};

const updateVariant = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    message: `PUT variant ${id}`,
    data: {
      id: parseInt(id, 10),
      ...req.body
    }
  });
};

const deleteVariant = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    message: `DELETE variant ${id}`,
    data: { id: parseInt(id, 10) }
  });
};

module.exports = {
  getAllVariants,
  getVariantById,
  createVariant,
  updateVariant,
  deleteVariant
};