import React, { useEffect, useState } from 'react';

import './../sass/Search.scss';

import Splash from '../components/Splash';

export default function Search({
  searchTerm,
  navigateToCountry
}) {
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    // load full list of country names with small flags url
    fetch('/api/countries')
      .then(response => response.json())
      .then(data => {
        // sort data alphabetically
        data.sort((a, b) => a[0].localeCompare(b[0]))
        setCountryList(data);
      })
  }, [searchTerm]);

  // Use search term to filter country list
  const filteredList = countryList.filter(([name]) => {
    const rule = new RegExp('^' + searchTerm, 'i');
    return name.split(' ').some(word => word.match(rule));
  });

  return (
    <div id='search'>
      <h2>Countries</h2>
      {countryList.length === 0 && <Splash />}
      {countryList.length > 0 && filteredList.map((country, i) =>
        <div key={i} className='list-item' onClick={() => navigateToCountry(country[0])} >
          <img src={country[1]} alt={`${country[0]}'s national flag`} />
          <p>{country[0]}</p>
        </div>
      )}
    </div>
  );
}
