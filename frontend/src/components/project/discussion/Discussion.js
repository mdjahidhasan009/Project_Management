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
        <div className={`row white discussion-row ${isMobile ? '' : 'showElementOnHover'}`} id="discussion-row">
            <div className="col s1 discussion-row__image">
                <img
                    src={discussion?.user?.profileImage?.imageUrl}
                    alt=" "
                    className="avatar "
                />
            </div>
            <div className="col s11 discussion-row__text">
                <p>{discussion.text}</p>
                <p>by
                    <a href={`/member/${discussion.user.username}`}> {discussion.user.username}</a>
                    {username && (username === discussion.user.username) && (
                        <>
                            <span id='edit' className={`edit ${isMobile ? 'showEdit' : ''}`} onClick={handleEditClick}>Edit</span>
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
