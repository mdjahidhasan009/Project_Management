import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { logout } from "../../../actions/auth-action";
import M from "materialize-css";
import "./nav.css";

const Navbar = ({ auth: { isAuthenticated, user }, logout, history }) => {
    const [ profileImage, setProfileImage ] = useState("");
    const [ currentPath, setCurrentPath ] = useState("");
    const location = useLocation();

    useEffect(() => {
        if(user?.profileImage?.imageUrl) {
            setProfileImage(user.profileImage.imageUrl);
        }
        let elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems);
    }, [user]);

    useEffect(() => {
        setCurrentPath(location.pathname);
    }, [location]);



    const handleLogout = async () => {
        setProfileImage('');
        await logout();
    }

    //NavLink for user at sidebar
    const authSidebarLinks = (
        <li>
            <NavLink className="waves-effect" to="#" onClick={handleLogout}
            >
                Logout
            </NavLink>
        </li>
    )

    const guestSidebarLinks = (
        <React.Fragment>
            <li><NavLink className="waves-effect authentication" to="/">Sign In / Up</NavLink></li>
        </React.Fragment>
    )

    return (
        <section>
            {/*Top Navbar*/}
            <div className="navbar-fixed">
                <nav className="light-blue" role="navigation">
                    <div className="nav-wrapper">
                        <NavLink id="logo-container" to="/" className="brand-logo">Project Tracker</NavLink>
                        <NavLink to="#" data-target="slide-out" className="sidenav-trigger">
                            <i className="material-icons">menu</i>
                        </NavLink>
                    </div>
                </nav>
            </div>

            {/* Side Navbar */}
            <ul className="sidenav sidenav-fixed" id="slide-out">
                <li>
                    <div className="user-view light-blue lighten-2">
                        <NavLink to="/profile">
                            <img className="image_navbar" src={profileImage}/>
                        </NavLink>
                        <NavLink to="/profile">
                            <span className="black-text name">{user ? user.name : 'Login First'}</span>
                        </NavLink>
                        <NavLink to="/profile">
                            <span className="black-text name">{user ? user.username : ''}</span>
                        </NavLink>
                        <NavLink to="/profile">
                            <span className="black-text email">{user ? user.email : ''}</span>
                        </NavLink>
                    </div>
                </li>
                {isAuthenticated && (
                    <>
                        <li className={currentPath === "/dashboard" ? "active" : ""}>
                            <NavLink to="/dashboard">Dashboard</NavLink>
                        </li>
                        <li className={currentPath === "/edit-profile" ? "active" : ""}>
                            <NavLink to="/edit-profile">Edit Profile</NavLink>
                        </li>
                        <li className={currentPath === "/profile" ? "active" : ""}>
                            <NavLink to="/profile">Profile</NavLink>
                        </li>
                        <li className={currentPath === "/members" ? "active" : ""}>
                            <NavLink to="/members">Members</NavLink>
                        </li>
                        <li className={currentPath === "/projects" ? "active" : ""}>
                            <NavLink to="/projects">Projects</NavLink>
                        </li>
                        <li>
                            <div className="divider"/></li>
                    </>
                )}
                {isAuthenticated ? authSidebarLinks : guestSidebarLinks }
            </ul>
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
