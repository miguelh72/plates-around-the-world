import React from 'react';

import './../sass/Header.scss';

export default function Header({ navigateToFeed }) {
  return (
    <header onClick={navigateToFeed}>
      <h1 className='logo'>Plates Around The World</h1>
    </header>
  );
}
