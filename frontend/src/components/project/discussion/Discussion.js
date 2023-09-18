import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';

import { useHttpClient } from "../../../hooks/http-hook";
import { deleteDiscussion } from "../../../actions/project-action";
import './Discussion.css';

const Discussion = ({ discussion, username, handleClickOnEdit, projectId, deleteDiscussion }) => {
    const { sendRequest } = useHttpClient();
    const [ isMobile, setIsMobile ] = useState(false);

    const handleEditClick = async () => {
        await handleClickOnEdit(discussion._id, discussion.text);
    }

    const handleDeleteClick = async () => {
        if(window.confirm('Do you want to delete this discussion?')) {
            await deleteDiscussion(projectId, discussion._id, sendRequest);
        }
    }

    useEffect(() => {
        if (/Mobi/.test(navigator.userAgent))
            setIsMobile(true);
    }, [])

    return (
        <div className={`bg-default flex items-center justify-between gap-8 p-8 rounded-2xl cursor-pointer ${isMobile ? '' : 'showElementOnHover'}`} id="discussion-row">
            <div className="w-1/12">
                <img
                    src={discussion?.user?.profileImage?.imageUrl}
                    alt=" "
                    className="w-32 h-28 rounded-full object-cover"
                />
            </div>
            <div className="group w-11/12">
                <p>{discussion.text}</p>
                <p>by
                    <a className="text-orange-500" href={`/member/${discussion.user.username}`}> {discussion.user.username}</a>
                    {username && (username === discussion.user.username) && (
                        <>
                            <span id='edit' className="hidden group-hover:block" onClick={handleEditClick}>Edit</span>
                            <span id='delete' className={`delete ${isMobile ? 'showDelete' : ''}`} onClick={handleDeleteClick}>Delete</span>
                        </>
                    )}
                </p>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    username: state.auth?.user?.username
})

export default connect(mapStateToProps, { deleteDiscussion })(Discussion);
