import { TABLE } from './actionTypes';

export const setRows = (payload) => ({
  type: TABLE.SET_ROWS,
  payload
});

export const setRowCount = (payload) => ({
  type: TABLE.SET_ROW_COUNT,
  payload
});