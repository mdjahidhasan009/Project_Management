import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';
import { loadUser } from './actions/auth-action';
import { useHttpClient } from './hooks/http-hook';

import Auth from './screens/auth/authScreen';
import HomeScreen from './screens/HomeScreen';
import Navbar from './components/shared/nav/nav';
import Routes from './routing/Routes';
import NotFoundScreen from './screens/NotFoundScreen';
import Login from "./screens/auth/Login";

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
                    {/*<Route*/}
                    {/*    render={({ location }) => {*/}
                    {/*        // Conditionally render Navbar on specific routes*/}
                    {/*        if (location.pathname.includes('/routes')) {*/}
                    {/*            return <Navbar />;*/}
                    {/*        } else {*/}
                    {/*            return null; // Hide Navbar on other routes*/}
                    {/*        }*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <Switch>
                        <Route exact path="/" component={HomeScreen} />
                        <Route exact path="/login" component={Login} />
                        <Route path="/auth" component={Auth} />
                        <Route path="/routes" component={Routes} />
                        <Route path="*" component={NotFoundScreen} />
                    </Switch>
                </Fragment>
            </Router>
        </Provider>
    );
};

export default App;
