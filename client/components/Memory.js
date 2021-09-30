import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { changeRating } from './../redux/reducers/memoriesReducer';

import './../sass/Memory.scss';

import editIconUrl from './../assets/icons/outline_edit_black_24dp.png';

import Rating from './Rating';

export default function Memory({
  context,
  country_name,
  memory_id,
  owner_id,
  owner_name,
  rating
}) {
  let { date, restaurant_address, restaurant_name } = context;
  date = new Date(date);

  const dispatch = useDispatch();

  const setRating = useCallback(newRating => {
    const changeMemoriesObj = {
      memory_id,
      country_name,
      rating: newRating
    };

    // dispatch action to change rating
    dispatch(changeRating(changeMemoriesObj));

    // send updated memory to server
    fetch('/api/memory/' + memory_id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(changeMemoriesObj)
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
    })
  }, [memory_id, country_name]);

  return (
    <div className='memory'>
      <div className='header'>
        <div>
          <h2>Memory</h2>
          <img
            className='edit-icon'
            src={editIconUrl}
            alt='edit memory'
          />
        </div>
        <p className='date'>{date.toLocaleDateString()} {date.toLocaleTimeString()}</p>
      </div>
      <div className='details'>
        <div>
          <h3 className='restaurant-name'>{restaurant_name}</h3>
          <Rating rating={rating} setRating={setRating} />
        </div>
        <p className='restaurant-address'>{restaurant_address}</p>
      </div>
    </div>
  );
}
