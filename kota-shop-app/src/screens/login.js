import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import cookie from "react-cookies";
import { login, signup } from "../actions/session";
import { useNavigate } from "react-router-dom";

function Login() {
  const [user, setUser] = useState({
    email: 'test@gmail.com',
    password: '12345678'
  });

  const session = useSelector(state => state.session);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(
    () => {
      if (session && cookie.load("jwt")) {
        navigate(`/`);
      }
    },
    [session, navigate]
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


export default Login;
