// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';
// import {useSelector} from 'react-redux';
//
//
// //Unauthorized(not logged in) user can not visit this route
// const PrivateRoute = ({ component: Component, selectedItem, ...rest }) => {
//     const authSlice = useSelector(state => state.auth);
//     const auth = authSlice || {};
//
//     return (
//         <Route
//             {...rest}//passing component related props
//             render={(props) => !auth.isAuthenticated && !auth.loading ? ( //this is RouteComponentProps passed by react-router-dom
//                   <Redirect to="/"/>
//                 ) : (
//                     <>
//                       <Component selectedItem={selectedItem} {...props}  />
//                     </>
//
//                 )
//             }
//         />
//     )
// }
//
// // PrivateRoute.propTypes = {
// //     auth: PropTypes.object.isRequired
// // }
//
// // const mapStateToProps = state => ({
// //     auth: state.auth
// // });
//
// export default PrivateRoute;
// // export default connect(mapStateToProps)(PrivateRoute);

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Upgraded PrivateRoute for React Router v6
const PrivateRoute = ({ children, ...rest }) => {
    const authSlice = useSelector(state => state.auth);
    const auth = authSlice || {};
    const location = useLocation();

    // Redirect to home if not authenticated
    if (!auth.isAuthenticated && !auth.loading) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    // Pass all remaining props to children if it's a valid React element
    if (React.isValidElement(children)) {
        return React.cloneElement(children, { ...rest });
    }

    // Otherwise just render children
    return children;
};

export default PrivateRoute;