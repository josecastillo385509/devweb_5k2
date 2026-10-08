// Validadores del parámetro de ruta :id.
// Se usan con router.param('id', ...) para no repetir la validación en cada controlador.

// Recursos del modelo relacional (SQL): id entero positivo.
const NUMERIC_ID = /^[1-9]\d*$/;
// Recursos del modelo documental (MongoDB): ObjectId de 24 caracteres hexadecimales.
const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

function buildValidator(pattern, expected) {
  return function validateId(req, res, next, id) {
    if (!pattern.test(id)) {
      return res.status(400).json({
        message: `Invalid id "${id}": expected ${expected}`,
        data: {},
      });
    }
    return next();
  };
}

module.exports = {
  validateNumericId: buildValidator(NUMERIC_ID, 'a positive integer'),
  validateObjectId: buildValidator(OBJECT_ID, 'a 24-character hexadecimal ObjectId'),
};
