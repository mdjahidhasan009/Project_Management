import React, { useEffect, useState } from "react";
import {Link, useLocation} from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { logout } from "../../../actions/auth-action";

const Navbar = ({ auth: { isAuthenticated, user }, logout, history, children }) => {
    const [ profileImage, setProfileImage ] = useState("");
    const [ currentPath, setCurrentPath ] = useState("");
    const location = useLocation();
    const activeClass = "bg-orange-500 h-10 p-4 rounded-[4px] flex items-center justify-start"
    const normalClass = "hover:bg-orange-500 cursor-pointer w-full h-10 p-4 rounded-[4px] flex items-center justify-start"

    useEffect(() => {
        if(user?.profileImage?.imageUrl) {
            setProfileImage(user.profileImage.imageUrl);
        }
        let elems = document.querySelectorAll('.sidenav');
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
            <Link className={normalClass} to="/" onClick={handleLogout}>
                Logout
            </Link>
        </li>
    )

    const guestSidebarLinks = (
        <li>
            <Link className={normalClass} to="/">Sign In / Up</Link>
        </li>
    )

    return (
        <section className="bg-[#1f2937]">
            {/*Top Navbar*/}
            <div className="navbar-fixed h-14 flex items-center pl-8 text-2xl font-semibold text-white-light">
                <Link to="/" className="brand-logo uppercase"><span className="text-orange-500">Project</span> Tracker</Link>
            </div>

            <div className="flex">
                {/* Side Navbar */}
                <ul className="bg-[#1f2937] text-white-light text-lg min-h-screen px-4 py-14 lg:block md:hidden hidden">
                    <>
                        {user && (
                            <>
                                <li
                                    className="w-full flex lg:justify-start md:justify-start justify-center mb-6 p-4"
                                >
                                    <img
                                        className="w-60 h-full rounded-full object-cover"
                                        src={profileImage}
                                        alt={user.name + '\s profile picture'}
                                    />
                                </li>
                                <li className="px-4 text-xl text-orange-500"> <Link to="/profile"> {user ? user.name : 'Login First'} </Link> </li>
                                <li className="px-4 my-2 text-sm"> <Link to="/profile"> {user ? user.username : ''} </Link> </li>
                                <li className="mb-8 px-4 text-sm"> <Link to="/profile"> {user ? user.email : ''} </Link> </li>
                            </>
                        )}
                    </>
                    {isAuthenticated && (
                        <>
                            <li className={currentPath === "/dashboard" ? activeClass : normalClass}>
                                <Link to="/dashboard">Dashboard</Link>
                            </li>
                            <li className={currentPath === "/edit-profile" ? activeClass : normalClass}>
                                <Link to="/edit-profile">Edit Profile</Link>
                            </li>
                            <li className={currentPath === "/profile" ? activeClass : normalClass}>
                                <Link to="/profile">Profile</Link>
                            </li>
                            <li className={currentPath === "/members" ? activeClass : normalClass}>
                                <Link to="/members">Members</Link>
                            </li>
                            <li className={currentPath === "/projects" ? activeClass : normalClass}>
                                <Link to="/projects">Projects</Link>
                            </li>
                            <li>
                                <div className="divider"/>
                            </li>
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
