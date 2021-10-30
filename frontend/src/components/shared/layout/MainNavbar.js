import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { logout } from '../../../actions/auth-action'
import M from "materialize-css";
import './MainNavbar.css';

const Navbar = ({ auth: { isAuthenticated, user }, logout }) => {
    const [ profileImage, setProfileImage ] = useState("");
    const [ currentPath, setCurrentPath ] = useState("");
    useEffect(() => {
        if(user?.profileImage?.imageUrl) {
            setProfileImage(user.profileImage.imageUrl);
        }
        let elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems);
        setCurrentPath(window.location.pathname);
    }, [user]);

    const handleLogout = async () => {
        setProfileImage('');
        await logout();
    }

    //Link for user at sidebar
    const authSidebarLinks = (
        <li>
            <a className="waves-effect" href="#">
                <button id="sidebar__button" onClick={handleLogout}>Logout</button>
            </a>
        </li>
    )

    const guestSidebarLinks = (
        <React.Fragment>
            <li><a className="waves-effect authentication" href="/">Sign In / Up</a></li>
        </React.Fragment>
    )

    //Link for user navbar
    const authNavbarLinks = (
        <li>
            <a className="waves-effect" href="#">
                <button id="navbar__button" onClick={handleLogout}>Logout</button>
            </a>
        </li>
    )

    const guestNavbarLinks = (
        <React.Fragment>
            <li><a href="/">Sign In / Up</a></li>
        </React.Fragment>
    )

    return (
        <section>
            {/*Top Navbar*/}
            <div className="navbar-fixed">
                <nav className="light-blue lighten-1" role="navigation">
                    <div className="nav-wrapper">
                        <a id="logo-container" href="/" className="brand-logo">Project Tracker</a>
                        <a href="#" data-target="slide-out" className="sidenav-trigger">
                            <i className="material-icons">menu</i>
                        </a>
                    </div>
                </nav>
            </div>

            {/* Side Navbar */}
            <div className="scrollable2_sidenav2">
                <ul id="slide-out" className="sidenav sidenav-fixed">
                    <li>
                        <div className="user-view light-blue lighten-2">
                            <a href="/profile"><img className="image_navbar" src={profileImage}/></a>
                            <a href="/profile"><span className="black-text name">
                                {user ? user.name : 'Login First'}</span>
                            </a>
                            <a href="/profile"><span className="black-text name">{user ? user.username : ''}</span></a>
                            <a href="/profile"><span className="black-text email">{user ? user.email : ''}</span></a>
                        </div>
                    </li>
                    {isAuthenticated && (
                        <>
                            <li className={currentPath === "/dashboard" ? "active" : ""}>
                                <a href="/dashboard">Dashboard</a>
                            </li>
                            <li className={currentPath === "/edit-profile" ? "active" : ""}>
                                <a href="/edit-profile">Edit Profile</a>
                            </li>
                            <li className={currentPath === "/profile" ? "active" : ""}>
                                <a href="/profile">Profile</a>
                            </li>
                            <li className={currentPath === "/members" ? "active" : ""}>
                                <a href="/members">Members</a>
                            </li>
                            <li className={currentPath === "/projects" ? "active" : ""}>
                                <a href="/projects">Projects</a>
                            </li>
                            <li>
                                <div className="divider"/></li>
                        </>
                    )}
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
