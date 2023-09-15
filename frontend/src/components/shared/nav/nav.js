import React, { useEffect, useState } from "react";
import {Link, useLocation} from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { logout } from "../../../actions/auth-action";
import M from "materialize-css";

const Navbar = ({ auth: { isAuthenticated, user }, logout, history, children }) => {
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

    //Link for user at sidebar
    const authSidebarLinks = (
        <li>
            <Link className="waves-effect" to="#" onClick={handleLogout}
            >
                Logout
            </Link>
        </li>
    )

    const guestSidebarLinks = (
        <React.Fragment>
            <li><Link className="waves-effect authentication" to="/">Sign In / Up</Link></li>
        </React.Fragment>
    )

    return (
        <section className="bg-[#1f2937]">
            {/*Top Navbar*/}
            <div className="navbar-fixed h-14 flex items-center pl-8 text-2xl font-semibold text-white-light">
                    <Link to="/" className="brand-logo uppercase"><span className="text-orange-500">Project</span> Tracker</Link>
            </div>

            <div className="flex">
                {/* Side Navbar */}
                <ul className="bg-[#1f2937] text-white-light min-h-screen px-4 py-14" id="slide-out">
                    <li className="mb-6">
                        {user && (
                            <>
                                <Link to="/profile">
                                    <img className="w-40 rounded-full" src={profileImage} alt={user.name + '\s profile picture'}/>
                                </Link>
                                <Link to="/profile"> {user ? user.name : 'Login First'} </Link>
                                <Link to="/profile"> {user ? user.username : ''} </Link>
                                <Link to="/profile"> {user ? user.email : ''} </Link>
                            </>
                        )}
                    </li>
                    {isAuthenticated && (
                        <>
                            <li className={currentPath === "/dashboard" ? "active" : ""}>
                                <Link to="/dashboard">Dashboard</Link>
                            </li>
                            <li className={currentPath === "/edit-profile" ? "active" : ""}>
                                <Link to="/edit-profile">Edit Profile</Link>
                            </li>
                            <li className={currentPath === "/profile" ? "active" : ""}>
                                <Link to="/profile">Profile</Link>
                            </li>
                            <li className={currentPath === "/members" ? "active" : ""}>
                                <Link to="/members">Members</Link>
                            </li>
                            <li className={currentPath === "/projects" ? "active" : ""}>
                                <Link to="/projects">Projects</Link>
                            </li>
                            <li>
                                <div className="divider"/></li>
                        </>
                    )}
                    {isAuthenticated ? authSidebarLinks : guestSidebarLinks }
                </ul>

                {children}
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
