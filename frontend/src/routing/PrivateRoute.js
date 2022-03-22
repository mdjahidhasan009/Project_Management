import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


//Unauthorized(not logged in) user can not visit this route
const PrivateRoute = ({ component: Component, auth, selectedItem, ...rest }) => {
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

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
