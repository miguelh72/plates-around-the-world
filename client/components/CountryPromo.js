import React from 'react';

import './../sass/CountryPromo.scss';

export default function CountryPromo({
  country,
  descriptions,
  famousPlate,
  famousPlateUrl,
  flagLgUrl,
  population,
  verbose = false,
}) {

  return (
    <div className='country-promo'>
      <div className='header'>
        <div>
          <h2>{country}</h2>
          <p className='population'><strong>Population:</strong> {population}</p>
        </div>
        <img src={flagLgUrl} alt={`Country flag of ${country}`} />
      </div>
      <div className='info'>
        <p className='plate-suggestion'>Plate to try: <strong>{famousPlate}</strong></p>
        <img className='famous-plate' src={famousPlateUrl} alt={`Picture of ${country}'s ${famousPlate} plate.`} />
        {verbose && descriptions.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
      </div>
    </div>
  );
}
