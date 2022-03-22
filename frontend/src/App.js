import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';
import { loadUser } from "./actions/auth-action";
import { useHttpClient } from "./hooks/http-hook";

import Navbar from './components/shared/nav/nav';
import Auth from './screens/auth/authScreen';
import Routes from "./routing/Routes";

const App = () => {
    const { sendRequest } = useHttpClient();

    useEffect(() => {
        store.dispatch(loadUser(sendRequest));//as till now store is not fully operational
        // eslint-disable-next-line
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Switch>
                        <Route exact path="/" component={ Auth }  />
                        <Route exact component= { Routes } />
                    </Switch>
                </Fragment>
            </Router>
        </Provider>
    );
}

export default App;
