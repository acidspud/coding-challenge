import React, { useState, useEffect } from "react";
import propTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import cookie from "react-cookies";
import { login, signup } from "../actions/session";

export default function Login({ history }) {
  const [user, setUser] = useState({
    email: 'test@gmail.com',
    password: '12345678'
  });

  const session = useSelector(state => state.session);
  const dispatch = useDispatch();
  
  useEffect(
    () => {
      if (session && cookie.load("jwt")) {
        history.push(`/`);
      }
    },
    [session, history]
  );

  const handleChange = (event) => {
    const {id, value} = event.target

    setUser({
      email: id === 'email'? value : user.email,
      password: id === 'password'? value : user.password
    });
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <input 
          id="email" 
          type="text"
          placeholder="Email" 
          onChange={handleChange} 
          value={user.email} 
        />
        <input 
          id="password"
          type="password"
          placeholder="Password" 
          onChange={handleChange} 
          value={user.password}
        />
        <div>
          <button
            type="button"
            onClick={() =>
              dispatch(
                login(user)
              )
            }
          >
            Login
          </button>
          <button
            type="button"
            onClick={() =>
              dispatch(
                signup(user)
              )
            }
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  history: propTypes.shape({
    push: propTypes.func.isRequired
  }).isRequired
};
