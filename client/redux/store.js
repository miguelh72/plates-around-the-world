import { configureStore } from '@reduxjs/toolkit';

import userReducer from './reducers/userReducer';
import memoriesReducer from './reducers/memoriesReducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    memories: memoriesReducer
  }
});

export default store;
