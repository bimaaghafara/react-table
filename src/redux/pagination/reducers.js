import { PAGINATION } from "./actionTypes";

const initialState = {
  page: 0,
  pageSize: 10,
};

export const paginationReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAGINATION.SET:
      return { ...state, ...action.payload }
    default:
      return state;
  }
}