import React from 'react';

import { getFacebookRedirectLink } from './../utils/oauth';

import facebookIconUrl from './../assets/icons/facebook.png';

export default function LandingPage() {
  return (
    <>
      <header>
        <h1 className='logo'>Plates Around The World</h1>
        <div id='plate-animation'></div>
      </header>
      <div className=''>
        <p>Keep track of the countries you have tried food from.</p>
        <p>Find new experiences and complete the passport challenge!</p>
      </div>
      <div id='login-panel'>
        <a href={getFacebookRedirectLink(
          process.env.NODE_ENV === 'development' ? 'https://localhost:8080/login/facebook' : 'https://localhost:3000/login/facebook'
        )}>
          <div id='facebook-button'>
            <img src={facebookIconUrl} />
            <p>Login in With Facebook</p>
          </div>
        </a>
      </div>
    </>
  );
}
