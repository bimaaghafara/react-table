import { FILTERS } from "./actionTypes";

const initialState = {
  search: '',
  gender: 'all',
};

export const filtersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FILTERS.SET:
      return { ...state, ...action.payload }
    case FILTERS.RESET:
      return initialState;
    default:
      return state;
  }
}