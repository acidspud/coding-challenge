import { createLogger } from "redux-logger";
import promiseMiddleware from "redux-promise";
import thunk from "redux-thunk";
import { applyMiddleware, createStore, compose } from "redux";
import reducers from "../reducers";

const logger = createLogger({ collapsed: true });

const createStoreWithMiddleware = applyMiddleware(
  thunk,
  logger,
  promiseMiddleware
)(createStore);

const enhancers = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

export default createStoreWithMiddleware(reducers, enhancers);
