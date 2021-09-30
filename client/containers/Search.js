import React, { useEffect, useState } from 'react';

import './../sass/Search.scss';

import Splash from '../components/Splash';

export default function Search({
  searchTerm
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

  }, [searchTerm]);

  return (
    <div id='search'>
      <h2>Countries</h2>
      {isLoading && <Splash />}
      {!isLoading && <h3>{searchTerm}</h3>}
    </div>
  );
}
