import React, { useEffect, useState } from 'react';

import './../sass/Feed.scss';

import Splash from './../components/Splash';
import CountryPromo from './../components/CountryPromo';

export default function Feed({
  navigateToCountry
}) {
  const [promoCountries, setPromoCountries] = useState([]);

  useEffect(() => {
    // Load some random countries to suggest in feed
    fetch('/api/info?count=5')
      .then(response => response.json()) // TODO handle retries
      .then(data => {
        setPromoCountries(data);
      })
  }, []);

  return (
    <>
      {promoCountries.length === 0
        ? <Splash />
        // STRETCH add recent memories from people you follow 
        : (
          <div id='feed'>
            {promoCountries.map((country, i) => (
              <div key={i} onClick={() => navigateToCountry(country.country)}>
                <CountryPromo {...country} />
              </div>
            ))}
          </div>
        )
      }
    </>
  );
}
