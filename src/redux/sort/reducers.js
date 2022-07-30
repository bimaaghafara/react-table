import { SORT } from "./actionTypes";

const initialState = {
  key: '',
  value: '',
};

export const sortReducer = (state = initialState, action) => {
  switch (action.type) {
    case SORT.SET:
      return { ...state, ...action.payload }
    default:
      return state;
  }
}