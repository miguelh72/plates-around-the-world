import React, { useEffect, useState } from 'react';

import { getFacebookRedirectLink } from '../utils/oauth';

import facebookIconUrl from './../assets/icons/facebook.png';
import plateIconUrl from './../assets/icons/plate-white.png';

export default function LandingPage() {
  const [flagUrls, setFlagUrls] = useState([]);

  useEffect(() => {
    // TODO cache this in local storage 
    fetch('/api/countries/flags')
      .then(response => response.json())
      .then(urlArray => {
        console.log({ urlArray });
        setFlagUrls(urlArray);
      })
  }, []);

  return (
    <>
      <header>
        <h1 className='logo'>Plates Around The World</h1>
        <div id='plate-animation'>
          <div id='flag-wheel'>
            <div className='mover'>
              {/* fill this with whatever you want to be moving above plate */}
              {flagUrls.map((url, i) => <img key={i} className='flag-large' src={url} />)}
            </div>
          </div>
          <img id='plate-icon' src={plateIconUrl} alt='plate icon' />
        </div>
      </header>
      <div id='login-panel'>
        <a id='facebook-button'
          href={getFacebookRedirectLink(
            process.env.NODE_ENV === 'development' ? 'https://localhost:8080/login/facebook' : 'https://localhost:3000/login/facebook'
          )}
        >
          <div >
            <img src={facebookIconUrl} />
            <p>Login in With Facebook</p>
          </div>
        </a>
      </div>
      <div id='feature'>
        <p>Keep track of the countries you have tried food from.</p>
        <p>Find new experiences and complete the <strong>#passportchallenge</strong>!</p>
      </div>
    </>
  );
}
