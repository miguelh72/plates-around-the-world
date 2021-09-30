const countryData = require('./../assets/country_data.json');

// TODO unit test countryUtils 

/* Optimization Objects */
const countryNameList = [];
const countryNamesObj = countryData.reduce((nameObj, country) => {
  nameObj[country.country.toLowerCase()] = country;
  countryNameList.push(country.country);
  return nameObj;
}, Object.create(null));

/* Functions */
function isValidCountry(name) {
  return (name.toLowerCase() in countryNamesObj);
}

function getAllCountryNames() {
  return [...countryNameList];
}

function getMatchingCountryNames(filter) {
  const rule = new RegExp('^' + filter, 'i');
  return getAllCountryNames().filter(name => name.match(rule));
}

function getCountryInfo(name) {
  return countryNamesObj[name.toLowerCase()];
}

module.exports = { isValidCountry, getAllCountryNames, getMatchingCountryNames, getCountryInfo };
