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

/**
 * Middleware: Load information about a set number of random countries. If successful, `res.locals.info` will be set to an array of font-end schema country info.
 */
async function getRandomCountriesInfo(req, res, next) {
  let { count } = req.query;
  if (!count || isNaN(+count)) return next({
    status: 400,
    response: { error: 'Specify a query parameter count with the number of countries to be returned.' }
  })
  count = +count;

  const allCountries = countryUtils.getAllCountryNames();
  if (count > allCountries.length) count = allCountries.length;

  res.locals.info = allCountries
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
    .map(name => {
      return countryUtils.getCountryInfo(name)
    });

  return next();
}

module.exports = { getCountryInfo, getRandomCountriesInfo };
