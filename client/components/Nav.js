import React from 'react';

import './../sass/Nav.scss';

import homeIconUrl from './../assets/icons/outline_home_black_24dp.png';
import addIconUrl from './../assets/icons/outline_add_circle_outline_black_24dp.png';
import accountIconUrl from './../assets/icons/outline_account_box_black_24dp.png';
import searchIconUrl from './../assets/icons/outline_search_black_24dp.png';

export default function Nav({
  navigateToFeed,
  navigateToProfile
}) {
  return (
    <nav>
      <div className='nav-icon' onClick={navigateToFeed}>
        <img src={homeIconUrl} alt='home icon' />
      </div>
      <div className='nav-icon'>
        <img src={addIconUrl} alt='add memory icon' />
      </div>
      <div className='nav-icon' onClick={navigateToProfile}>
        <img src={accountIconUrl} alt='account icon' />
      </div>
      <div className='nav-icon'>
        <img src={searchIconUrl} alt='search icon' />
      </div>
    </nav>
  );
}
