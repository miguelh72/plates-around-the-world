import { createReducer, createAction } from "@reduxjs/toolkit";

export const initialLoad = createAction('user/INITIAL_LOAD');
export const changeName = createAction('user/CHANGE_NAME');

const initialState = {};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(initialLoad, (state, action) => {
      return action.payload;
    })
    .addCase(changeName, (state, action) => {
      state.name = action.payload;
    })
  /*.addCase('TOGGLE_TODO', (state, action) => {
    const todo = state[action.payload.index]
    // "mutate" the object by overwriting a field
    todo.completed = !todo.completed
  })*/
})
