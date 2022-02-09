import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom';
import {getUserRoleString} from "../utils/helper";

import './stylesheets/Member.css';

const Member = ({ user }) => {
    let history = useHistory();
    let clickedOnEmail = false;
    let [ userRole, setUserRole ] = useState('');

    const openMemberDetails = async () => {
        if(!clickedOnEmail) await history.push('/member/' + user.username);
        clickedOnEmail = false;
    }

    const toggleIsClickedOnEmail = () => {
        clickedOnEmail = !clickedOnEmail;
    }

    useEffect( () => {
        setUserRole(getUserRoleString(user.role));
        // eslint-disable-next-line
    }, [user.role]);

    return (
        <div className="col s12 m6 l4 member_item">
            <div className="card white">
                <div className="card-content" onClick={openMemberDetails}>
                    <img className="profile_avatar"
                         src={user?.profileImage?.imageUrl}
                         alt="no image"
                    />
                    <p className="card-title">{user.name}</p>
                    <p className="card-username" onClick={toggleIsClickedOnEmail}>{user.email}</p>
                    <p className="card-role">{userRole}</p>
                    <div className="social-links">
                        {user && user.social && user.social.twitter && (
                            <a href={user.social.twitter} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-twitter fa-2x" />
                            </a>
                        )}
                        {user && user.social && user.social.github && (
                            <a href={user.social.github} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-github fa-2x" />
                            </a>
                        )}
                        {user && user.social && user.social.facebook && (
                            <a href={user.social.facebook} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-facebook fa-2x"/>
                            </a>
                        )}
                        {user && user.social && user.social.linkedIn && (
                            <a href={user.social.linkedIn} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-linkedin fa-2x" />
                            </a>
                        )}
                        {user && user.social && user.social.stackoverflow && (
                            <a href={user.social.stackoverflow} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-stack-overflow fa-2x" />
                            </a>
                        )}
                        {user && user.social && user.social.youtube && (
                            <a href={user.social.youtube} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-youtube fa-2x" />
                            </a>
                        )}
                        {user && user.social && user.social.instagram && (
                            <a href={user.social.instagram} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram fa-2x" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Member;
