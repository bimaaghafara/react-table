import { combineReducers } from "redux";
import { FILTERS, TABLE } from "./actionTypes";

const initialStateFilters = {
  search: '',
  gender: 'all',
};

const filtersReducer = (state = initialStateFilters, action) => {
  switch (action.type) {
    case FILTERS.SET:
      return { ...state, ...action.payload }
    case FILTERS.RESET:
      return initialStateFilters;
    default:
      return state;
  }
}

const initialStateTable = {
  rows: [],
  paginations: {
    page: 0,
    pageSize: 10,
    rowCount: 999
  }
};

const tableReducer = (state = initialStateTable, action) => {
  switch (action.type) {
    case TABLE.SET_ROWS:
      return { ...state, rows: action.payload }
    case TABLE.SET_PAGINATIONS:
      return { ...state, paginations: {
        ...state.paginations,
        ...action.payload
      }}
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  filtersReducer, tableReducer
});

export default rootReducer;