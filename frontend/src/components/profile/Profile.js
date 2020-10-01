import React, {Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Spinner from '../layout/Spinner';
// import { Link } from 'react-router-dom';

// import { getProfileById } from "../../actions/profile";
import ProfileTop from './ProfileTop';
import {useHttpClient} from "../../hooks/http-hook";
import {getUserByUserName} from "../../actions/auth-action";
// import ProfileAbout from './ProfileAbout';
// import ProfileExperience from './ProfileExperience';
// import ProfileEducation from "./ProfileEduction";
// import ProfileGithub from "./ProfileGithub";

const Profile = ({ user, match, getUserByUserName }) => {
    const { isLoading, error, sendRequest , clearError} = useHttpClient();
    let retrievedUser = null;
    const [loadSelectedUser, setLoadSelectedUser] = useState(null);
    // useEffect( async () => {
    //     await loadUser();
    //     console.log();
    // }, []);
    if(match.params && match.params.username) {

    }
    loadUser();
    const loadUser = async () => {
        if(match.params && match.params.username) {
            let selectedUser = getUserByUserName(match.params.username, sendRequest);
            setLoadSelectedUser(selectedUser);
        }
    }


    return (
        <div className="main">
            {(match.params && match.params.username)
                ? (<ProfileTop user={loadSelectedUser} />)
                : (<ProfileTop user={user} />)
            }

        </div>
        // <Fragment>
        //     {profile === null  || loading ? (
        //         <Spinner />
        //     ) : (
        //         <Fragment>
        //             <Link to="/profiles" className="btn btn-light">
        //                 Back To Profiles
        //             </Link>
        //             {auth.isAuthenticated &&
        //             auth.loading === false &&
        //             auth.user._id === profile.user._id && (
        //                 <Link to="/edit-profile" className="btn btn-dark">
        //                     Edit Profile
        //                 </Link>
        //             )}
        //             <div className="profile-grid my-1">
        //                 {console.log(typeof profile.skills)}
        //                 <ProfileTop profile={profile} />
        //                 <ProfileAbout profile={profile} />
        //                 <div className='profile-exp bg-white p-2'>
        //                     <h2 className="text-primary">Experience</h2>
        //                     {profile.experience.length > 0 ? (<Fragment>
        //                         {profile.experience.map(exp => (
        //                             <ProfileExperience key={exp._id} experience={exp} />
        //                         ))}
        //                     </Fragment>) : (
        //                         <h4>No Experience</h4>
        //                     )}
        //                 </div>
        //                 <div className='profile-edu bg-white p-2'>
        //                     <h2 className="text-primary">Education</h2>
        //                     {profile.education.length > 0 ? (<Fragment>
        //                         {profile.education.map(edu => (
        //                             <ProfileEducation key={edu._id} education={edu} />
        //                         ))}
        //                     </Fragment>) : (
        //                         <h4>No School of education</h4>
        //                     )}
        //                 </div>
        //             </div>
        //             {profile.githubusername && (
        //                 <ProfileGithub username={profile.githubusername}/>
        //             )}
        //         </Fragment>
        //     )}
        // </Fragment>

    )
}

// Profile.propTypes = {
//     getProfileById: PropTypes.func.isRequired,
//     profile: PropTypes.object.isRequired,
//     auth: PropTypes.object.isRequired
// }

const mapStateToProps = state => ({
    // profile: state.profile,
    // auth: state.auth,
    user: state.auth.user
})

export default connect(mapStateToProps, { getUserByUserName })(Profile);
