const express = require('express');
const router = express.Router();

const controller = require('../controllers/index');

/* GET home page. */
router.get('/', function(req, res, _next) {
  const title = req.__ ? req.__('views.homeTitle') : 'Home';
  res.render('index', { title });
});

router.get('/health', controller.healthCheck);

module.exports = router;
