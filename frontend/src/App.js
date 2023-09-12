import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth-action';
import { useHttpClient } from './hooks/http-hook';
import Auth from './screens/auth/authScreen';
import HomeScreen from './screens/HomeScreen';
import Routes from './routing/Routes';
import NotFoundScreen from './screens/NotFoundScreen';
import Login from "./screens/auth/Login";

const App = () => {
    const { sendRequest } = useHttpClient();

    useEffect(() => {
        store.dispatch(loadUser(sendRequest));
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Switch>
                        <Route exact path="/" component={HomeScreen} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/auth" component={Auth} />
                        <Route exact component={Routes} />
                        <Route path="*" component={NotFoundScreen} />
                    </Switch>
                </Fragment>
            </Router>
        </Provider>
    );
};

export default App;
