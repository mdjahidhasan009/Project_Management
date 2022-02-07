import {
  ADD_PROJECT, GET_PROJECTS
} from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_PROJECT:
      return [...state, payload];
    case GET_PROJECTS:
      return  payload;
    default:
      return state;
  }
}
