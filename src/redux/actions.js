import { FILTERS } from './actionTypes';

export const setFilters = (payload) => ({
  type: FILTERS.SET,
  payload
});

export const resetFilters = () => ({
  type: FILTERS.RESET,
});