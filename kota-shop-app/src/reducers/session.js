import { LOGGED_IN_USER, LOGOUT } from "../actions/actionTypes";

export const sessionReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case LOGGED_IN_USER:
      return payload;
    case LOGOUT:
      return state;
    default: {
      return state;
    }
  }
};
