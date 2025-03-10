import React, {ReactNode, useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import { logout } from "../../../redux/slices/auth-slice";
import {TUser} from "../../../redux/thunks/auth-thunks";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";

type TProfileImage = {
    imageUrl: string;
    publicId?: string;
}

type TAuthState = {
    isAuthenticated: boolean;
    user: TUser | null;
    // Add other auth state properties as needed
}

type TNavbarProps = {
    children: ReactNode;
}

const Navbar: React.FC<TNavbarProps> = ({ children }) => {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const authSlice = useAppSelector(state => state.auth);

    const isAuthenticated = authSlice.isAuthenticated || false;
    const user = authSlice.user || null;
    const [ profileImage, setProfileImage ] = useState("");
    const [ currentPath, setCurrentPath ] = useState("");

    const activeClass = "bg-orange-500 h-8 p-4 rounded-[4px] flex items-center justify-start"
    const normalClass = "hover:bg-orange-500 cursor-pointer w-full h-8 p-4 rounded-[4px] flex items-center justify-start"

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
        dispatch(logout());
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
                            <Link to="/dashboard" className={currentPath === "/dashboard" ? activeClass : normalClass}>Dashboard</Link>
                            <Link to="/edit-profile" className={currentPath === "/edit-profile" ? activeClass : normalClass}>Edit Profile</Link>
                            <Link to="/profile" className={currentPath === "/profile" ? activeClass : normalClass}>Profile</Link>
                            <Link to="/members" className={currentPath === "/members" ? activeClass : normalClass}>Members</Link>
                            <Link to="/projects" className={currentPath === "/projects" ? activeClass : normalClass}>Projects</Link>
                        </>
                    )}
                    {isAuthenticated ? authSidebarLinks : guestSidebarLinks }
                </ul>

                <div className="w-full min-h-screen bg-default text-white-light lg:p-8 md:p-6 p-4">
                    {children}
                </div>
            </div>
        </section>
    );
};

// Navbar.propTypes = {
    // logout: PropTypes.func.isRequired,
    // auth: PropTypes.object.isRequired
// };

// const mapStateToProps = state => ({
//     auth: state.auth
// });
//
// export default connect(mapStateToProps, { logout })(Navbar);

export default Navbar;