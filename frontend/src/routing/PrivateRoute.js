import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


//Unauthorized(not logged in) user can not visit this route
// {...rest=>, component=>component which will be render,
// {...props}=>are things are like exact, params, history,path(passed props) etc}
const PrivateRoute = ({ component: Component, auth, selectedItem, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => !auth.isAuthenticated && !auth.loading ? (
                <Redirect to="/"/>
            ) : (
                <Component selectedItem={selectedItem} {...props}  />
            )
            }
        />
    )
}

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
