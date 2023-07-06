import { axiosInstance } from "../helpers/configured_axios";
import { FETCH_TODO_LIST } from "./actionTypes";

export const fetchItemList = () => {
  const request = axiosInstance.get("/items");

  return {
    type: FETCH_TODO_LIST,
    payload: request
  };
};

export const addItem = item => {
  return dispatch => {
    debugger;
    axiosInstance.post("/items", { name: item }).then(() => {
      dispatch(fetchItemList());
    });
  };
};

export const deleteItem = item => {
  return dispatch => {
    axiosInstance.delete(`/items/${item}`).then(() => {
      dispatch(fetchItemList());
    });
  };
};
