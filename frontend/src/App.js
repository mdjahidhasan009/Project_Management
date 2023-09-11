import React, { Fragment, useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch, NavLink, Redirect} from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';
import { loadUser } from "./actions/auth-action";
import { useHttpClient } from "./hooks/http-hook";

import Auth from './screens/auth/authScreen';
import Home from './pages/home'
import Navbar from "./components/shared/nav/nav";
import Routes from "./routing/Routes";
import NotFound from "./pages/NotFound";

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
                            location.pathname !== "/" && location.pathname !== "/404" && <Navbar />
                        )}
                    />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/auth" component={Auth} />
                        <Route path="/routes" component={Routes} />
                        {/* Redirect to NotFound for any unknown route */}
                        <Redirect to="/404" />
                    </Switch>
                    <Route path="/404" component={NotFound} />
                </Fragment>
            </Router>
        </Provider>
    );
}

export default App;
