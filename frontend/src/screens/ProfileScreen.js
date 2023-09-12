import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getUserByUserName } from "../actions/auth-action";
import { useHttpClient } from "../hooks/http-hook";
import { getUserRoleString } from "../utils/helper";
import defaultUserImage from "../assets/images/default_user.jpg";

const ProfileScreen = ({ match, loadedUser, getUserByUserName, auth: { user } }) => {
    const { sendRequest } = useHttpClient();
    const [ userRole, setUserRole ] = useState('');
    useEffect(() => {
        if(match?.params && match?.params.username) {
            getUserByUserName(match?.params?.username, sendRequest);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(loadedUser && loadedUser?.role) setUserRole(getUserRoleString(loadedUser?.role));
        else if(user && user?.role) setUserRole(getUserRoleString(user?.role));
        // eslint-disable-next-line
    }, [loadedUser]);
    return (
        <section className="bg-default min-h-screen px-12 py-20">
            <div className="bg-[#1f2937] text-white-light rounded-xl p-4 ring ring-indigo-50 sm:p-6 lg:p-8 flex items-start sm:gap-8">
                <div
                    className="border-2 rounded-full border-orange-500 p-2"
                    aria-hidden="true"
                >
                    <img
                        alt={user?.name + 's profile picture'}
                        src={loadedUser?.profileImage?.imageUrl ? loadedUser?.profileImage?.imageUrl : defaultUserImage}
                        className="w-96 h-60 rounded-full max-w-96 object-cover shadow-sm"
                    />
                </div>

                <div>
                    <strong
                        className="rounded border border-orange-500 bg-orange-500 px-3 py-1.5 text-[12?px] font-medium text-white-light"
                    >
                        {userRole}
                    </strong>

                    <h3 className="mt-4 text-lg font-medium sm:text-xl">
                        <a href="" className="hover:underline"> {loadedUser?.name ? loadedUser?.name : 'Name not found!'} </a>
                    </h3>

                    <p className="mt-1 text-sm text-white-light">
                        {loadedUser
                            ? (loadedUser?.bio && (
                                <div className="row profile-bio">
                                    <p>{loadedUser?.bio}</p>
                                </div>
                            ))
                            : (user && user?.bio && (
                                <div className="row profile-bio">
                                    <p>{user?.bio}</p>
                                </div>
                            ))
                        }
                    </p>

                    <div className="my-8">
                        {loadedUser
                            ? (loadedUser?.skills && loadedUser?.skills?.length > 0 && (
                                <>
                                    <h4 className="font-medium text-l mb-1">Skills</h4>

                                    <div className="flex items-center gap-4">
                                        {loadedUser?.skills.map((skill, index) => (
                                            <div key={index} className="skill">
                                                <i className="fas fa-check" /> {skill}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ))
                            : (user && user?.skills && user?.skills?.length > 0 && (
                                <>
                                    <h4 className="font-medium text-l mb-1">Skills</h4>

                                    <div className="flex items-center gap-4">
                                        {user?.skills.map((skill, index) => (
                                            <div key={index} className="skill">
                                                <i className="fas fa-check" /> {skill}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ))
                        }
                    </div>

                    <dl className="mt-6 flex gap-4 sm:gap-6">
                        {user && user?.social && user?.social?.linkedIn && (
                            <a href={user?.social?.linkedIn} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-linkedin fa-2x" />
                            </a>
                        )}
                        {user && user?.email && (
                            <a href={'mailto:' + user?.email}>
                                <i className="fas fa-envelope fa-2x" />
                            </a>
                        )}
                        {user && user?.social && user?.social?.github && (
                            <a href={user?.social?.github} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-github fa-2x" />
                            </a>
                        )}
                        {user && user?.social && user?.social?.stackoverflow && (
                            <a href={user?.social?.stackoverflow} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-stack-overflow fa-2x" />
                            </a>
                        )}
                        {user && user?.social && user?.social?.twitter && (
                            <a href={user?.social?.twitter} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-twitter fa-2x" />
                            </a>
                        )}
                        {user && user?.social && user?.social?.facebook && (
                            <a href={user?.social?.facebook} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-facebook fa-2x"/>
                            </a>
                        )}
                        {user && user?.social && user?.social?.youtube && (
                            <a href={user?.social?.youtube} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-youtube fa-2x" />
                            </a>
                        )}
                        {user && user?.social && user?.social?.instagram && (
                            <a href={user?.social?.instagram} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram fa-2x" />
                            </a>
                        )}
                    </dl>
                </div>
            </div>
        </section>
    );
};

const mapStateToProps = state => ({
    auth: state.auth,
    loadedUser: state.auth.loadedUser
})

export default connect(mapStateToProps, { getUserByUserName })(ProfileScreen);
