import React from 'react'
import { useHistory } from 'react-router-dom';

import './MemberItem.css';

const MemberItem = ({ user }) => {
    let history = useHistory();
    let clickedOnEmail = false;

    const openMemberDetails = async () => {
        if(!clickedOnEmail) await history.push('/member/' + user.username);
        clickedOnEmail = false;
    }

    const toggleIsClickedOnEmail = () => {
        clickedOnEmail = !clickedOnEmail;
    }

    return (
        <div className="col s12 m6 l4 card_item member_item">
            <div className="card white">
                <div className="card-content" onClick={openMemberDetails}>
                    <img className="profile_avatar"
                         src={user?.profileImage?.imageUrl}
                         alt="no image"
                    />
                    <span className="card-title">{user.name}</span>
                    <h6 className="card-username" onClick={toggleIsClickedOnEmail}>{user.email}</h6>
                    <p className="card-role">{user.role}</p>
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

export default MemberItem;
