const countryData = require('./../assets/country_data.json');

// TODO unit test countryUtils 

/* Optimization Objects */
// TODO fix test to check for name-sm-flag pairs 
const countryNameSmFlagPairList = [];
const countryNamesObj = countryData.reduce((nameObj, country) => {
  nameObj[country.country.toLowerCase()] = country;
  countryNameSmFlagPairList.push([country.country, country.flagSmUrl]);
  return nameObj;
}, Object.create(null));

/* Functions */
function isValidCountry(name) {
  return (name.toLowerCase() in countryNamesObj);
}

function getAllCountryNames() {
  return [...countryNameSmFlagPairList];
}

function getMatchingCountryNames(filter) {
  const rule = new RegExp('^' + filter, 'i');
  return getAllCountryNames().filter(name => name.match(rule));
}

function getCountryInfo(name) {
  return countryNamesObj[name.toLowerCase()];
}

function getAllCountryFlagUrlsLarge() {
  return countryData.map(country => country.flagLgUrl);
}

module.exports = {
  isValidCountry,
  getAllCountryNames,
  getMatchingCountryNames,
  getCountryInfo,
  getAllCountryFlagUrlsLarge
};
