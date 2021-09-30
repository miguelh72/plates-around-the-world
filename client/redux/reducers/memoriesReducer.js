import { createReducer, createAction } from "@reduxjs/toolkit";

export const initialLoad = createAction('memories/INITIAL_LOAD');
export const changeRating = createAction('memories/CHANGE_RATING');
export const addMemory = createAction('memories/ADD_MEMORY');

const initialState = {};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(initialLoad, (state, action) => {
      // "mutate" the array by calling push()
      return action.payload;
    })
    .addCase(changeRating, (state, action) => {
      const { country_name, rating, memory_id } = action.payload;
      for (const memory of state[country_name]) {
        if (memory.memory_id === memory_id) {
          memory.rating = rating;
          break;
        }
      }
    })
    .addCase(addMemory, (state, action) => {
      if (!state[action.payload.country_name]) state[action.payload.country_name] = [];
      state[action.payload.country_name].push(action.payload);
    })
})
