import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import './../sass/CountryPage.scss';

import Splash from '../components/Splash';
import CountryPromo from '../components/CountryPromo';
import Memory from '../components/Memory';

export default function CountryPage({ name }) {
  const [countryInfo, setCountryInfo] = useState(undefined);
  const countryMemories = useSelector(state => {
    return state.memories[name] ? state.memories[name] : [];
  });

  useEffect(() => {
    // Load some random countries to suggest in feed
    fetch('/api/info/' + name)
      .then(response => response.json()) // TODO handle retries
      .then(data => {
        setCountryInfo(data);
      })
  }, []);

  return (
    <div id='country-page'>
      {!countryInfo && <Splash />}
      {countryInfo && <CountryPromo {...countryInfo} verbose={true} />}
      {countryMemories.length > 0 && countryMemories.map((memory, i) => <Memory key={i} {...memory} />)}
    </div>
  );
}
