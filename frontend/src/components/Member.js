import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom';
import {getUserRoleString} from "../utils/helper";
import defaultUserImage from "../assets/images/default_user.jpg";

const Member = ({ user }) => {
    let history = useHistory();
    let clickedOnEmail = false;
    let [ userRole, setUserRole ] = useState('');

    const openMemberDetails = async () => {
        if(!clickedOnEmail) await history.push('/member/' + user.username);
        clickedOnEmail = false;
    }

    useEffect( () => {
        setUserRole(getUserRoleString(user.role));
        // eslint-disable-next-line
    }, [user.role]);

    return (
        <div onClick={openMemberDetails} className="relative bg-[#1f2937] block overflow-hidden rounded-lg p-4 sm:p-6 lg:p-6 cursor-pointer" title={'Click to see ' + user.name + '\'s details'}>
            <div className="sm:flex sm:justify-between sm:gap-4">
                <div>
                    <h3 className="text-lg font-bold text-orange-500 sm:text-xl"> {user.name} </h3>

                    <p className="mt-1 text-xs font-medium text-white-light">{userRole ? userRole : 'Not Defined'}</p>
                </div>

                <div className="hidden sm:block sm:shrink-0">
                    <img
                        alt={user.name + 's profile picture'}
                        src={user?.profileImage?.imageUrl ? user?.profileImage?.imageUrl : defaultUserImage}
                        className="h-16 w-16 rounded-lg object-cover shadow-sm"
                    />
                </div>
            </div>

            <div className="mt-4">
                <p className="max-w-[40ch] text-sm text-white-light">
                    {user?.bio ? user?.bio : 'Member did not added his bio.'}
                </p>
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
                        <i className="fab fa-facebook lg:text-3xl md:text-2xl text-xl"/>
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
    )
}

export default Member;
