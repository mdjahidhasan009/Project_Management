import React, { useEffect, FC } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { loadUser } from './redux/thunks/auth-thunks';
import { useHttpClient } from './hooks/http-hook';
import HomeScreen from './screens/HomeScreen';
import AppRoutes from './routing/Routes';
import LoginScreen from "./screens/auth/LoginScreen";
import Navbar from "./components/shared/nav/nav";
import GetStartedScreen from "./screens/auth/GetStartedScreen";
import { useLocation } from 'react-router-dom';

// This component is for the navbar logic
const NavbarWrapper: FC = () => {
    const { sendRequest } = useHttpClient();
    const location = useLocation();
    const hideNavbarRoutes: string[] = ["/", "/auth/login", "/auth/get-started"];

    useEffect(() => {
        store.dispatch(loadUser({ method: sendRequest }));
    }, [sendRequest]);

    if (hideNavbarRoutes.includes(location.pathname)) {
        return null;
    }

    return (
        <Navbar>
            <AppRoutes />
        </Navbar>
    );
};

const App: FC = () => {
    return (
        <Provider store={store}>
            <Router>
                <NavbarWrapper />
                <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/auth/login" element={<LoginScreen />} />
                    <Route path="/auth/get-started" element={<GetStartedScreen />} />
                </Routes>
            </Router>
        </Provider>
    );
};

export default App;