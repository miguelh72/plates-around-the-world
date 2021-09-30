const countryUtils = require('./../utils/countryUtils');

/**
 * Middleware: Load information about a country. If successful, `res.locals.info` will be set to the font-end schema country info.
 */
async function getCountryInfo(req, res, next) {
  const { country_name } = req.params;
  if (!countryUtils.isValidCountry(country_name)) return next({
    status: 400,
    response: { error: 'Not a valid country name.' }
  })

  res.locals.info = countryUtils.getCountryInfo(country_name)
  return next();
}

module.exports = { getCountryInfo };
