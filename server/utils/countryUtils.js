const countryData = require('./../assets/country_data.json');

/* Optimization Objects */
const countryNamesObj = countryData.reduce((nameObj, country) => {
  nameObj[country.country] = true;
  return nameObj;
});

function isValidCountry(name) {
  return countryNamesObj[name];
}

module.exports = { isValidCountry };
