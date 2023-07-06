import { axiosInstance } from "../helpers/configured_axios";
import { LOGGED_IN_USER, LOGOUT } from "./actionTypes";
import cookie from "react-cookies";

export const setJWT = token => {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);
  cookie.save("jwt", token, { expires });
};

export const login = user => {
  return dispatch => {
    axiosInstance
      .post("auth/signin", {
        email: user.email,
        password: user.password
      })
      .then(response => {
        // We meet again data.data :)
        setJWT(response.data.data.access_token);
        axiosInstance.defaults.headers.common.Authorization = `Authorization ${
          response.data.data.access_token
        }`;
        
        dispatch(loggedInUser({
          email: user.email,
          token: response.data.data.access_token
        }));
      })
      .catch(err => {
        alert(
          `Server not available. Please make sure it is running.\n\n${err}`
        );
      });
  };
};

export const logout = () => {
  cookie.remove("jwt");

  return {
    type: LOGOUT,
    payload: {}
  };
};

export const loggedInUser = (user) => {

  return {
    type: LOGGED_IN_USER,
    payload: user
  };
};
