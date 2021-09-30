const express = require('express');

const infoController = require('../controllers/infoController');

const router = express.Router();

// TODO memory cache this route 
router.get('/:country_name',
  infoController.getCountryInfo,
  (req, res, next) => {
    if (res.locals.info) return res.json(res.locals.info);
    return next({
      response: { error: 'Unknown error: failed to load country info' }
    });
  }
);

module.exports = router;
