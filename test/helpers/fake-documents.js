// Doble en memoria de models/documents (MongoDB) para las pruebas: soporta solo lo que usa la API.
// Se activa en cada prueba con:
//   jest.mock('../models/documents', () => require('./helpers/fake-documents'));

let counter = 0;
function newId() {
  counter += 1;
  return counter.toString(16).padStart(24, '0'); // ObjectId válido de 24 caracteres hexadecimales
}

// Consulta "thenable" con .populate() / .select(), como las de Mongoose
function query(resolve) {
  let populate = null;
  const q = {
    populate(path) { populate = path; return q; },
    select() { return q; },
    then(onOk, onErr) { return Promise.resolve().then(() => resolve(populate)).then(onOk, onErr); },
  };
  return q;
}

function matches(doc, filter = {}) {
  return Object.entries(filter).every(([key, expected]) => {
    if (expected && Array.isArray(expected.$in)) return expected.$in.map(String).includes(String(doc[key]));
    return String(doc[key]) === String(expected);
  });
}

function createCollection(refs = {}) {
  const docs = [];
  const withRefs = (doc, populate) => {
    if (!doc || !populate || !refs[populate]) return doc;
    return { ...doc, [populate]: refs[populate]().find((d) => d._id === doc[populate]) || null };
  };
  return {
    _docs: docs,
    _reset() { docs.length = 0; },
    async create(body) { const doc = { ...body, _id: newId() }; docs.push(doc); return doc; },
    find(filter) { return query((p) => docs.filter((d) => matches(d, filter)).map((d) => withRefs(d, p))); },
    findOne(filter) { return query((p) => withRefs(docs.find((d) => matches(d, filter)) || null, p)); },
    findById(id) { return query((p) => withRefs(docs.find((d) => d._id === String(id)) || null, p)); },
    async findByIdAndUpdate(id, body) {
      const doc = docs.find((d) => d._id === String(id));
      if (!doc) return null;
      Object.assign(doc, body);
      return doc;
    },
    async findByIdAndDelete(id) {
      const index = docs.findIndex((d) => d._id === String(id));
      return index === -1 ? null : docs.splice(index, 1)[0];
    },
  };
}

const Customer = createCollection();
const Order = createCollection({ customerId: () => Customer._docs });

module.exports = {
  Customer,
  Order,
  resetDocuments() { Customer._reset(); Order._reset(); },
};
