import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { logout } from '../../actions/auth-action';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {

    //Link for user at sidebar
    const authSidebarLinks = (
        <li><a className="waves-effect" href="#!">Logout</a></li>
    )

    const guestSidebarLinks = (
        <React.Fragment>
            <li><a className="waves-effect" href="#!">Log In</a></li>
            <li><a className="waves-effect" href="#!">Sign Up</a></li>
        </React.Fragment>
    )

    //Link for user navbar
    const authNavbarLinks = (
        <li><a href="#">Logout</a></li>
    )

    const guestNavbarLinks = (
        <React.Fragment>
            <li><a href="#">Login</a></li>
            <li><a href="#">Register</a></li>
        </React.Fragment>
    )

    return (
        <section>
            <div className="navbar-fixed">
                <nav className="light-blue lighten-1" role="navigation">
                    <div className="nav-wrapper">
                        <a id="logo-container" href="#" className="brand-logo">Logo</a>
                        <a href="#" data-target="slide-out" className="sidenav-trigger">
                            <i className="material-icons">menu</i>
                        </a>
                        <ul className="right hide-on-med-and-down">
                            {isAuthenticated ? authNavbarLinks : guestNavbarLinks}
                            <li><a href="#">About</a></li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/*             <!-- Fixed Sidenav  --> */}
            <div className="scrollable2_sidenav2">
                <ul id="slide-out" className="sidenav sidenav-fixed">
                    <li>
                        <div className="user-view">
                            <a href="#user"><img className="circle" src="#"></img></a>
                            <a href="#name"><span className="black-text name">John Doe</span></a>
                            <a href="#email"><span className="black-text email">jdandturk@gmail.com</span></a>
                        </div>
                    </li>
                    <li><a href="#!">Dashboard</a></li>
                    <li><a href="#!">Email</a></li>
                    <li><a href="#!">Chat</a></li>
                    <li><a href="#!">Project</a></li>
                    <li><a href="#!">Client</a></li>
                    <li><a href="#!">Team</a></li>
                    <li><div className="divider"></div></li>
                    {isAuthenticated ? authSidebarLinks : guestSidebarLinks }
                </ul>
            </div>
        </section>
    );
};

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout})(Navbar);
