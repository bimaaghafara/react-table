import { TABLE } from "./actionTypes";

const initialState = {
  rows: [],
  rowCount: 999,
};

export const tableReducer = (state = initialState, action) => {
  switch (action.type) {
    case TABLE.SET_ROWS:
      return { ...state, rows: action.payload }
    case TABLE.SET_ROW_COUNT:
      return { ...state, rowCount: action.payload }
    default:
      return state;
  }
}