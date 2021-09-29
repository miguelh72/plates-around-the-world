const countryData = require('./../assets/country_data.json');

// TODO unit test countryUtils 

/* Optimization Objects */
const countryNameList = [];
const countryNamesObj = countryData.reduce((nameObj, country) => {
  nameObj[country.country.toLocaleLowerCase()] = true;
  countryNameList.push(country.country);
  return nameObj;
}, Object.create(null));

/* Functions */
function isValidCountry(name) {
  return countryNamesObj[name.toLocaleLowerCase()];
}

function getAllCountryNames() {
  return [...countryNameList];
}

function getMatchingCountryNames(filter) {
  const rule = new RegExp('^' + filter, 'i');
  return getAllCountryNames().filter(name => name.match(rule));
}

module.exports = { isValidCountry, getAllCountryNames, getMatchingCountryNames };
