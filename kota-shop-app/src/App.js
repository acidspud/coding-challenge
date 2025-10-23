import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import cookie from "react-cookies";
import Loading from "./components/loading";
import store from "./helpers/store";
import Menu from "./components/menu";
import Footer from "./components/footer";
const Home = lazy(() => import("./screens/home"));
const Login = lazy(() => import("./screens/login"));

// function isAuthenticated() {
//   const accessToken = cookie.load("jwt");
//   return accessToken ? true : false;
// }
interface PrivateRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = () => {
    const accessToken = cookie.load("jwt");
    return accessToken ? true : false;
  };
  const location = useLocation();

  if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Menu />
      <Suspense fallback={<Loading />}>
        <Provider store={store}>
            <Routes>
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Provider>
      </Suspense>
      <Footer />
    </Router>

  );
}

export default App;