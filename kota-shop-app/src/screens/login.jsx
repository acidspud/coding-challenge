import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cookie from 'react-cookies'
import { login, signup } from '../actions/session'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [user, setUser] = useState({
        email: 'test@gmail.com',
        password: '12345678',
    })

    const session = useSelector((state) => state.session)
    const dispatch = useDispatch()

    const navigate = useNavigate()

    useEffect(() => {
        if (session && cookie.load('jwt')) {
            navigate('/')
        }
    }, [session, navigate])

    const handleChange = (event) => {
        const { id, value } = event.target

        setUser({
            email: id === 'email' ? value : user.email,
            password: id === 'password' ? value : user.password,
        })
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-green-light-3 p-4">
            <div className="flex flex-col items-center p-8 rounded-lg bg-white shadow-[0px_4px_14px_3px_rgba(63,136,197,0.35)] w-full max-w-md gap-4">
                <input
                    id="email"
                    type="text"
                    placeholder="Email"
                    onChange={handleChange}
                    value={user.email}
                    className="border border-shadow-light rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={user.password}
                    className="border border-shadow-light rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-col gap-4 w-full justify-center">
                    <button
                        className="bg-blue text-white border-none rounded-md p-3 px-6 cursor-pointer w-full hover:bg-blue-dark transition-colors duration-200"
                        type="button"
                        onClick={() => dispatch(login(user))}
                    >
                    Login
                    </button>
                    <button
                        className="bg-blue text-white border-none rounded-md p-3 px-6 cursor-pointer w-full hover:bg-blue-dark transition-colors duration-200"
                        type="button"
                        onClick={() => dispatch(signup(user))}
                    >
                    Signup
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login
