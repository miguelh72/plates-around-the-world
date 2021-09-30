import { createReducer, createAction } from "@reduxjs/toolkit";

export const initialLoad = createAction('user/INITIAL_LOAD');

const initialState = {};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(initialLoad, (state, action) => {
      // "mutate" the array by calling push()
      return action.payload;
    })
  /*.addCase('TOGGLE_TODO', (state, action) => {
    const todo = state[action.payload.index]
    // "mutate" the object by overwriting a field
    todo.completed = !todo.completed
  })*/
})
