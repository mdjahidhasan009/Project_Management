import React, {Fragment, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { logout } from '../../actions/auth-action'
import './MainNavbar.css';

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout }) => {
    const [ profileImage, setProfileImage ] = useState("");
    useEffect(() => {
        if(user?.profileImage?.imageUrl) {
            setProfileImage(user.profileImage.imageUrl);
        }
    }, [user])

    //Link for user at sidebar

    const authSidebarLinks = (
        <li>
            <a className="waves-effect" href="#">
                <button id="sidebar__button" onClick={logout}>Logout</button>
            </a>
        </li>
    )

    const guestSidebarLinks = (
        <React.Fragment>
            <li><a className="waves-effect" href="/authenticate">Sign In / Up</a></li>
        </React.Fragment>
    )

    //Link for user navbar
    const authNavbarLinks = (
        <li>
            <a className="waves-effect" href="#">
                <button id="navbar__button" onClick={logout}>Logout</button>
            </a>
        </li>
    )

    const guestNavbarLinks = (
        <React.Fragment>
            <li><a href="/authenticate">Sign In / Up</a></li>
        </React.Fragment>
    )

    return (
        <section>
            <div className="navbar-fixed">
                <nav className="light-blue lighten-1" role="navigation">
                    <div className="nav-wrapper">
                        <a id="logo-container" href="/" className="brand-logo">Logo</a>
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
                        <div className="user-view blue lighten-3">
                            <a href="#user"><img className="image_navbar" src={profileImage}/></a>
                            <a href="#name"><span className="black-text name">{user ? user.name : 'Login First'}</span></a>
                            <a href="#email"><span className="black-text email">{user ? user.email : ''}</span></a>
                        </div>
                    </li>
                    <li><a href="/">Dashboard</a></li>
                    <li><a href="/edit-profile">Edit Profile</a></li>
                    <li><a href="/profile">Profile</a></li>
                    <li><a href="/members">Members</a></li>
                    {/*<li><a href="#!">Chat</a></li>*/}
                    <li><a href="/projects">Projects</a></li>
                    {/*<li><a href="#!">Client</a></li>*/}
                    {/*<li><a href="#!">Team</a></li>*/}
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

export default connect(mapStateToProps, { logout })(Navbar);
