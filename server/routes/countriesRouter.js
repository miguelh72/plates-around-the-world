const express = require('express');

const { getAllCountryNames, getMatchingCountryNames } = require('./../utils/countryUtils');

const clientSessionController = require('../controllers/clientSessionController');
const memoryController = require('../controllers/memoryController');

const router = express.Router();

// Get list of countries with optional filter query param
// TODO cache endpoint 
router.get('/', (req, res) => {
  let { filter } = req.query;
  if (!filter) return res.json(getAllCountryNames());
  filter = filter.trim();
  return res.json(getMatchingCountryNames(filter));
});

// Get all memories matching that country name
router.get('/:country_name',
  clientSessionController.verifyClientSession,
  memoryController.getClientMemoryArrayForCountry,
  (req, res, next) => {
    if (!res.locals.session) return res.redirect('/');
    if (res.locals.memoryArray) return res.json(res.locals.memoryArray);
    return next({
      status: 500,
      response: { error: 'Unknown error: failed to load memories with valid session.' }
    });
  }
);

module.exports = router;