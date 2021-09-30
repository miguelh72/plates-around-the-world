import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { addMemory } from './../redux/reducers/memoriesReducer';

import './../sass/Add.scss';

import Rating from '../components/Rating';

export default function Add({
  country_name,
  navigateToCountry
}) {

  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const dispatch = useDispatch();

  const handleSubmission = useCallback(() => {
    // TODO validate 
    const memoryObj = {
      "country_name": country_name,
      "rating": rating,
      "context": {
        "restaurant_name": name,
        "restaurant_address": address,
      }
    }
    // send request for server to store
    fetch('/api/memory/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(memoryObj),
    }).then(response => {
      // If user is not authenticated, redirect to landing page
      if (response.redirected) {
        window.location.replace(response.url);
      }

      if (response.status !== 200) {
        // STRETCH client-side remote error logging 
        console.error('Bad response from server while updating name: ')
        console.error({ response });
      }

      return response.json();
    }).then(data => {
      console.log({ data }); // FIX RM 
      // update app state
      dispatch(addMemory(data));
      // move to country page
      navigateToCountry(country_name);
    })
  });

  /*
  {
    "memory_id": "6154cf49164c26105a8e8cc5",
    "owner_name": "Miguel A. Hernandez",
    "owner_id": "4283744385006083",
    "result": "4283744385006083",
    "context": {
        "restaurant_name": "British Pub 2",
        "restaurant_address": "",
        "user_tags": [],
        "date": "2021-09-29T20:40:41.338Z"
    },
    "country_name": "England",
    "rating": 1
  }
  */

  return (
    <div id='add'>
      <h2>Add memory for {country_name}</h2>
      <Rating rating={rating} setRating={setRating} />
      <p>Restaurant Name</p>
      <input
        id='restaurant-name'
        type='text'
        placeholder='Restaurant name'
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Restaurant Address</p>
      <input
        id='restaurant-address'
        type='text'
        placeholder='Restaurant address'
        value={address}
        onChange={e => setAddress(e.target.value)}
      />
      <button type='submit' onClick={handleSubmission}>Save</button>
    </div>
  );
}
