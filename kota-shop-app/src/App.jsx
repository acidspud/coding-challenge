import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { Provider } from 'react-redux'
import cookie from '@/helpers/cookie'
import Loading from '@/components/loading'
import store from '@/helpers/store'
import Menu from '@/components/menu'
import Footer from '@/components/footer'
const Home = lazy(() => import('@/screens/home'))
const Login = lazy(() => import('@/screens/login'))

const PrivateRouteProps = {
    children: PropTypes.node.isRequired,
}

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = () => {
        const accessToken = cookie.load('jwt')
        return accessToken ? true : false
    }
    const location = useLocation()

    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return <>{children}</>
}

ProtectedRoute.propTypes = PrivateRouteProps

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Menu />
                <Suspense fallback={<Loading />}>
                    <Routes>
                        <Route exact path="/login" element={<Login />} />
                        <Route
                            exact
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Suspense>
                <Footer />
            </Router>
        </Provider>
    )
}

export default App
