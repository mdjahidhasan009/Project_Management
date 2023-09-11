import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';
import { loadUser } from "./actions/auth-action";
import { useHttpClient } from "./hooks/http-hook";

import Auth from './screens/auth/authScreen';
import Home from './pages/home'
import Routes from "./routing/Routes";
import Navbar from "./components/shared/nav/nav";

const App = () => {
    const { sendRequest } = useHttpClient();

    useEffect(() => {
        store.dispatch(loadUser(sendRequest));
        // eslint-disable-next-line
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Route
                        render={({ location }) => (
                            location.pathname !== "/" && <Navbar />
                        )}
                    />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route component={Routes} />
                    </Switch>
                </Fragment>
            </Router>
        </Provider>
    );
}

export default App;
