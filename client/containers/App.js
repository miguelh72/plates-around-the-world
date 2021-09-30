import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { initialLoad as memoriesInitialLoad } from './../redux/reducers/memoriesReducer';
import { initialLoad as userInitialLoad } from './../redux/reducers/userReducer';

import Splash from './../components/Splash';
import Header from './../components/Header';
import Feed from './../containers/Feed';
import CountryPage from './../containers/CountryPage';
import Nav from '../components/Nav';
import SearchNav from '../components/SearchNav';
import Profile from './Profile';
import Search from './Search';

export default function App() {
  /* Hooks */
  const [view, setView] = useState('feed');
  const [countryName, setCountryName] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const state = useSelector(state => state);
  const dispatch = useDispatch();

  useEffect(() => {
    // Load user info
    fetch('/api/user')
      .then(response => {
        // If user is not authenticated, redirect to landing page
        if (response.redirected) {
          window.location.replace(response.url);
        }

        return response.json();
      })
      .then(data => dispatch(userInitialLoad(data)));

    // Load memories
    fetch('/api/memory')
      .then(response => {
        // If user is not authenticated, redirect to landing page
        if (response.redirected) {
          window.location.replace(response.url);
        }

        return response.json();
      })
      .then(data => dispatch(memoriesInitialLoad(data)));
  }, []);

  /* Callbacks */
  const navigateToCountry = useCallback(name => {
    setCountryName(name);
    setView('country');
  }, []);

  const navigateToFeed = useCallback(() => {
    setView('feed');
  }, []);

  const navigateToProfile = useCallback(() => {
    setView('profile');
  }, []);

  const navigateToSearch = useCallback(() => {
    setView('search');
  }, []);

  /* Conditional rendering logic */
  const hasAppData = Object.keys(state.user).length > 0;

  if (view === 'country' && !countryName) throw new Error('You must set the country name before view can be displayed.');

  return (
    <>
      <Header navigateToFeed={navigateToFeed} />
      {!hasAppData && <Splash />}
      {hasAppData && view === 'feed' && <Feed navigateToCountry={navigateToCountry} />}
      {hasAppData && view === 'country' && <CountryPage name={countryName} />}
      {hasAppData && view === 'profile' && <Profile />}
      {hasAppData && view === 'search' && <Search searchTerm={searchTerm} />}
      {hasAppData && view === 'search' && <SearchNav
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        navigateToFeed={navigateToFeed}
        navigateToProfile={navigateToProfile}
      />}
      {hasAppData && view !== 'search' && <Nav
        navigateToFeed={navigateToFeed}
        navigateToProfile={navigateToProfile}
        navigateToSearch={navigateToSearch}
      />}
    </>
  );
}
