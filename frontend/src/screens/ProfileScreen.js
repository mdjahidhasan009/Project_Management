import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getUserByUserName } from "../actions/auth-action";
import { useHttpClient } from "../hooks/http-hook";
import { getUserRoleString } from "../utils/helper";
import defaultUserImage from "../assets/images/default_user.jpg";
import {Link} from "react-router-dom";

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
        <section className="bg-[#1f2937] text-white-light lg:rounded-xl md:rounded-lg rounded-md lg:p-8 md:p-6 p-4 flex lg:flex-row md:flex-row flex-col lg:items-start md:items-center items-center gap-8">
            <div className="border-2 rounded-full border-orange-500 p-2 max-w-max">
                <img
                    alt={user?.name + 's profile picture'}
                    src={loadedUser?.profileImage?.imageUrl || defaultUserImage}
                    className="w-full h-60 rounded-full max-w-96 object-cover shadow-sm"
                />
            </div>

            <div>
                <strong className="rounded border border-orange-500 bg-orange-500 px-3 py-1.5 text-sm font-medium text-white-light">
                    {userRole}
                </strong>

                <h3 className="mt-4 text-lg font-medium sm:text-xl">
                    <Link to="/edit-profile" className="hover:underline">
                        {loadedUser?.name || 'Name not found!'}
                    </Link>
                </h3>

                <p className="mt-1 text-sm text-white-light">
                    {loadedUser?.bio || (user && user?.bio) ? (
                        <div className="row profile-bio">
                            <p>{loadedUser?.bio || user?.bio}</p>
                        </div>
                    ) : null}
                </p>

                <div className="my-8">
                    {loadedUser?.skills && loadedUser?.skills.length > 0 && (
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
                    )}
                </div>

                <dl className="mt-6 flex gap-4 sm:gap-6">
                    {user && user?.social && user?.social?.linkedIn && (
                        <a href={user?.social?.linkedIn} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin lg:text-3xl md:text-2xl text-xl" />
                        </a>
                    )}
                    {user && user?.email && (
                        <a href={'mailto:' + user?.email}>
                            <i className="fas fa-envelope lg:text-3xl md:text-2xl text-xl" />
                        </a>
                    )}
                    {user && user?.social && user?.social?.github && (
                        <a href={user?.social?.github} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-github lg:text-3xl md:text-2xl text-xl" />
                        </a>
                    )}
                    {user && user?.social && user?.social?.stackoverflow && (
                        <a href={user?.social?.stackoverflow} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-stack-overflow lg:text-3xl md:text-2xl text-xl" />
                        </a>
                    )}
                    {user && user?.social && user?.social?.twitter && (
                        <a href={user?.social?.twitter} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter lg:text-3xl md:text-2xl text-xl" />
                        </a>
                    )}
                    {user && user?.social && user?.social?.facebook && (
                        <a href={user?.social?.facebook} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook lg:text-3xl md:text-2xl text-xl" />
                        </a>
                    )}
                    {user && user?.social && user?.social?.youtube && (
                        <a href={user?.social?.youtube} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-youtube lg:text-3xl md:text-2xl text-xl" />
                        </a>
                    )}
                    {user && user?.social && user?.social?.instagram && (
                        <a href={user?.social?.instagram} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram lg:text-3xl md:text-2xl text-xl" />
                        </a>
                    )}
                </dl>
            </div>
        </section>
    );
};

const mapStateToProps = state => ({
    auth: state.auth,
    loadedUser: state.auth.loadedUser
})

export default connect(mapStateToProps, { getUserByUserName })(ProfileScreen);
