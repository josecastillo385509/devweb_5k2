require('dotenv').config({ quiet: true });
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const rolesRouter = require('./routes/roles');
const permissionsRouter = require('./routes/permissions');
const productsRouter = require('./routes/products');
const variantsRouter = require('./routes/variants');
const inventoryRouter = require('./routes/inventory');
const customersRouter = require('./routes/customers');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth'); 

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// logging de solicitudes HTTP
const logDir = path.join(__dirname, 'logs');
fs.mkdirSync(logDir, {recursive: true});
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), {flags: 'a'});

app.use(logger('dev', { skip: function() { return process.env.NODE_ENV === 'test'; } }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/permissions', permissionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/variants', variantsRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// errores de autenticación de express-jwt (token inexistente, inválido o expirado)
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next(err);
});

app.use(function(err, req, res, _next) {
  res.status(err.status || 500);
  res.json({ message: err.message });
});

module.exports = app;