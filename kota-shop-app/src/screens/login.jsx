import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cookie from 'react-cookies'
import { login, signup } from '@/actions/session'
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
        <div className="flex justify-center items-center mt-[70px] min-h-[calc(100vh-140px)] bg-background p-4">
            <div className="flex flex-col items-center p-8 rounded-lg bg-surface shadow-lg w-full max-w-md gap-4">
                <input
                    id="email"
                    type="text"
                    placeholder="Email"
                    onChange={handleChange}
                    value={user.email}
                    className="border border-border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={user.password}
                    className="border border-border rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
                <div className="flex flex-col gap-4 w-full justify-center">
                    <button
                        className="bg-primary text-white border-none rounded-md p-3 px-6 cursor-pointer w-full hover:bg-primary-light transition-colors duration-200"
                        type="button"
                        onClick={() => dispatch(login(user))}
                    >
                    Login
                    </button>
                    <button
                        className="bg-secondary text-white border-none rounded-md p-3 px-6 cursor-pointer w-full hover:bg-secondary transition-colors duration-200"
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
