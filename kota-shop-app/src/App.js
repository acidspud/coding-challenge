import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import cookie from "react-cookies";
import Loading from "./components/loading";
import store from "./helpers/store";
import Menu from "./components/menu";
import Footer from "./components/footer";
const Home = lazy(() => import("./screens/home"));
const Login = lazy(() => import("./screens/login"));

function isAuthenticated() {
  const accessToken = cookie.load("jwt");
  return accessToken ? true : false;
}

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Menu />
      <Suspense fallback={<Loading />}>
        <Provider store={store}>
            <Switch>
              <Route exact path="/login" component={Login} />
              <ProtectedRoute exact path="/" component={Home} />
              <Redirect to="/" />
            </Switch>
        </Provider>
      </Suspense>
      <Footer />
    </Router>

  );
}

export default App;