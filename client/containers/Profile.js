import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './../sass/Profile.scss';
import editIconUrl from './../assets/icons/outline_edit_black_24dp.png';

import Splash from '../components/Splash';

export default function Profile() {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameFieldValue, setNameFieldValue] = useState('');

  const { name, picture_url } = useSelector(state => {
    return state.user;
  });
  const dispatch = useDispatch;

  const onNameFieldValueChange = useCallback(e => {
    setNameFieldValue(e.target.value);
  }, []);

  const handleNameChange = useCallback(() => {
    console.log('name tried to be changed');
    // TODO validate 
    // TODO trigger action 
  }, []);

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
