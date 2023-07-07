import { axiosInstance } from "../helpers/configured_axios";
import { FETCH_ITEM_LIST } from "./actionTypes";

export const fetchItemList = () => {
  const payload = axiosInstance.get("/items").then(
      response => {
        return response.data.data || []
      }
  );

  return {
    type: FETCH_ITEM_LIST,
    payload,
  };
};

export const addItem = item => {
  return dispatch => {
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
