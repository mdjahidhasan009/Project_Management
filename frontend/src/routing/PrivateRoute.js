import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {useSelector} from 'react-redux';


//Unauthorized(not logged in) user can not visit this route
const PrivateRoute = ({ component: Component, selectedItem, ...rest }) => {
    const authSlice = useSelector(state => state.auth);
    const auth = authSlice.auth || {};

    return (
        <Route
            {...rest}//passing component related props
            render={(props) => !auth.isAuthenticated && !auth.loading ? ( //this is RouteComponentProps passed by react-router-dom
                  <Redirect to="/"/>
                ) : (
                    <>
                      <Component selectedItem={selectedItem} {...props}  />
                    </>

                )
            }
        />
    )
}

// PrivateRoute.propTypes = {
//     auth: PropTypes.object.isRequired
// }

// const mapStateToProps = state => ({
//     auth: state.auth
// });

export default PrivateRoute;
// export default connect(mapStateToProps)(PrivateRoute);
