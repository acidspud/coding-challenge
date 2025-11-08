import { axiosInstance } from '@/helpers/configured_axios'
import { LOGGED_IN_USER, LOGOUT } from '@/actions/actionTypes'
import cookie from '@/helpers/cookie'

export const setJWT = token => {
    cookie.save('jwt', token)
}

export const login = user => {
    return dispatch => {
        axiosInstance
            .post('auth/signin', {
                email: user.email,
                password: user.password
            })
            .then(response => {
                const { data } = response.data

                setJWT(data.access_token)
                axiosInstance.defaults.headers.common.Authorization = `Authorization ${
                    data.access_token
                }`

                dispatch(loggedInUser({
                    email: user.email,
                    token: response.data.data.access_token
                }))
            })
            .catch(err => {
                const { details } = err.response.data

                if (details) {
                    alert(details)
                } else {
                    alert(
                        `Oops, Something went wrong. heres the details:\n\n${err}`
                    )
                }
            })
    }
}

export const signup = user => {
    return dispatch => {
        axiosInstance
            .post('auth/signup', {
                email: user.email,
                password: user.password
            })
            .then(response => {
                if (response.data.message === 'Signup successfully') {
                    dispatch(login({
                        email: user.email,
                        password: user.password
                    }))
                }
            })
            .catch(err => {
                const { details } = err.response.data
                alert(
                    `Oops, Something went wrong. heres the details:.\n\n${details}`
                )
            })
    }
}

export const logout = () => {
    cookie.remove('jwt')

    return {
        type: LOGOUT,
        payload: {}
    }
}

export const loggedInUser = (user) => {

    return {
        type: LOGGED_IN_USER,
        payload: user
    }
}
