// import React, { Fragment, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
// import { Provider } from 'react-redux';
// import store from './redux/store';
// import { loadUser } from './redux/thunks/auth-thunks';
// import { useHttpClient } from './hooks/http-hook';
// import HomeScreen from './screens/HomeScreen';
// import Routes from './routing/Routes';
// import LoginScreen from "./screens/auth/LoginScreen";
// import Navbar from "./components/shared/nav/nav";
// import GetStartedScreen from "./screens/auth/GetStartedScreen";
//
// const App = () => {
//     const { sendRequest } = useHttpClient();
//
//     const hideNavbarRoutes = ["/", "/auth/login", "/auth/get-started", "*"];
//
//     useEffect(() => {
//         store.dispatch(loadUser({ method: sendRequest }));
//     }, []);
//
//     const displayNavbar = <Navbar>
//         <Switch>
//             <Route exact component={Routes} />
//         </Switch>
//     </Navbar>
//
//
//     return (
//         <Provider store={store}>
//             <Router>
//                 <Fragment>
//                     <Route
//                         render={({ location }) => (
//                             !hideNavbarRoutes?.includes(location.pathname) && displayNavbar
//                         )}
//                     />
//                     <Switch>
//                         <Route exact path="/" component={HomeScreen} />
//                         <Route exact path="/auth/login" component={LoginScreen} />
//                         <Route exact path="/auth/get-started" component={GetStartedScreen} />
//                     </Switch>
//                 </Fragment>
//             </Router>
//         </Provider>
//     );
// };
//
// export default App;

import React, { useEffect } from 'react';
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
const NavbarWrapper = () => {
    const { sendRequest } = useHttpClient();
    const location = useLocation();
    const hideNavbarRoutes = ["/", "/auth/login", "/auth/get-started"];

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

const App = () => {
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