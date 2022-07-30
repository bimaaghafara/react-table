import { combineReducers } from "redux";
import { filtersReducer } from './filters/reducers';
import { paginationReducer } from './pagination/reducers';
import { tableReducer } from './table/reducers';

const rootReducer = combineReducers({
  filtersReducer,
  paginationReducer,
  tableReducer
});

export default rootReducer;