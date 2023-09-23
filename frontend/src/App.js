import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth-action';
import { useHttpClient } from './hooks/http-hook';
import HomeScreen from './screens/HomeScreen';
import Routes from './routing/Routes';
import NotFoundScreen from './screens/NotFoundScreen';
import LoginScreen from "./screens/auth/LoginScreen";
import Navbar from "./components/shared/nav/nav";
import GetStartedScreen from "./screens/auth/GetStartedScreen";

const App = () => {
    const { sendRequest } = useHttpClient();
    const hideNavbarRoutes = ["/", "/login", "/get-started", "*"];
    const displayNavbar = <Navbar>
        <Switch>
            <Route exact component={Routes} />
        </Switch>
    </Navbar>

    useEffect(() => {
        store.dispatch(loadUser(sendRequest));
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Route
                        render={({ location }) => (
                            !hideNavbarRoutes?.includes(location.pathname) && displayNavbar
                        )}
                    />
                    <Switch>
                        <Route exact path="/" component={HomeScreen} />
                        <Route exact path="/login" component={LoginScreen} />
                        <Route exact path="/get-started" component={GetStartedScreen} />
                        <Route path="*" component={NotFoundScreen} />
                    </Switch>
                </Fragment>
            </Router>
        </Provider>
    );
};

export default App;
