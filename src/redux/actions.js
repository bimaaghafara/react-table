import { FILTERS, TABLE } from './actionTypes';

export const setFilters = (payload) => ({
  type: FILTERS.SET,
  payload
});

export const resetFilters = () => ({
  type: FILTERS.RESET,
});

export const setRows = (payload) => ({
  type: TABLE.SET_ROWS,
  payload
});

export const setPaginations = (payload) => ({
  type: TABLE.SET_PAGINATIONS,
  payload
});