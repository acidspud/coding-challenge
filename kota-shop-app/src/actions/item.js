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
  // Convert price to cent
  item.price = item.price * 100
  return dispatch => {
    axiosInstance.post("/items", item).then(() => {
      dispatch(fetchItemList());
    });
  };
};

export const deleteItem = id => {
  return dispatch => {
    axiosInstance.delete(`/items/${id}`).then(() => {
      dispatch(fetchItemList());
    });
  };
};
