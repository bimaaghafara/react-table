import { combineReducers } from "redux";
import { filtersReducer } from './filters/reducers';
import { paginationReducer } from './pagination/reducers';
import { sortReducer } from './sort/reducers';
import { tableReducer } from './table/reducers';

const rootReducer = combineReducers({
  filtersReducer,
  paginationReducer,
  sortReducer,
  tableReducer
});

export default rootReducer;