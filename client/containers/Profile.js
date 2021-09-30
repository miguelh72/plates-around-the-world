import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changeName } from './../redux/reducers/userReducer';

import './../sass/Profile.scss';
import editIconUrl from './../assets/icons/outline_edit_black_24dp.png';

import Splash from '../components/Splash';

export default function Profile() {

  const { name, picture_url, user_id } = useSelector(state => {
    return state.user;
  });
  const dispatch = useDispatch();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameFieldValue, setNameFieldValue] = useState(name);
  const [nameFieldValueError, setNameFieldValueError] = useState(undefined);

  const onNameFieldValueChange = useCallback(e => {
    setNameFieldValue(e.target.value);
  }, []);

  const handleNameChange = useCallback(() => {
    // validate name
    const newName = nameFieldValue.trim();
    if (newName.length === 0 || !newName.match(/^((?!\d)[\w .]\1)*$/i)) {
      return setNameFieldValueError('Name must include only word characters without numbers.');
    }

    // handle app state change
    dispatch(changeName(newName));

    // update server
    fetch('/api/user/' + user_id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName })
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
    });

    setIsEditingName(false);
    setNameFieldValueError(undefined);
  }, [nameFieldValue, user_id]);

  return (
    <div id='profile'>
      {!name && <Splash />}
      {name && (
        <>
          <img src={picture_url} alt={`${name}'s Facebook profile picture.`} />
          <div>
            <h2>Profile</h2>
            {!isEditingName && <div className='name'>
              <h3>{name}</h3>
              <img
                className='edit-icon'
                src={editIconUrl}
                alt='edit name'
                onClick={() => setIsEditingName(true)}
              />
            </div>}
            {isEditingName && <div className='edit'>
              {nameFieldValueError && <p className='error'>{nameFieldValueError}</p>}
              <input
                type="box"
                placeholder="Name"
                value={nameFieldValue}
                onChange={onNameFieldValueChange}
              />
              <button onClick={handleNameChange}>Save</button>
            </div>}
          </div>
        </>
      )}
    </div>
  );
}
