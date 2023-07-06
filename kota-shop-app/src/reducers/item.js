import { FETCH_TODO_LIST } from "../actions/actionTypes";

export function itemListReducer(state = [], action) {

  switch (action.type) {
    case FETCH_TODO_LIST: {
      const value = action.payload.data.data
      return value ? value : [];
    }
    default: {
      return state;
    }
  }
}
