import axios from "axios";
import cookie from "react-cookies";

export const baseURL = "http://localhost:8080/api/v1/";

const axiosConfig = {
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
};

export const axiosInstance = axios.create(axiosConfig);

const jwt = cookie.load("jwt");
if (jwt) {
  axiosInstance.defaults.headers.common.Authorization = `Authorization ${jwt}`;
}
