import { combineReducers } from "redux";
import { FILTERS } from "./actionTypes";

const initialStateFilters = {
  search: '',
  gender: 'all',
};

const FiltersReducer = (state = initialStateFilters, action) => {
  switch (action.type) {
    case FILTERS.SET:
      state = { ...state, ...action.payload }
      return state;
    case FILTERS.RESET:
      return initialStateFilters;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  FiltersReducer,
});

export default rootReducer;