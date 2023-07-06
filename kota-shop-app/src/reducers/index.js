import { combineReducers } from "redux";
import { sessionReducer } from "./session";
import { itemListReducer } from "./item";

const rootReducer = combineReducers({
  session: sessionReducer,
  itemList: itemListReducer
});

export default rootReducer;
