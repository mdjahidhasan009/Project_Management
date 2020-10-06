import React from 'react';
import { connect } from 'react-redux';

import {useHttpClient} from "../../../hooks/http-hook";
import {deleteDiscussion} from "../../../actions/project-action";
import './DiscussionRow.css';

const DiscussionRow = ({ discussion, username, handleClickOnEdit, projectId, deleteDiscussion }) => {
    const { sendRequest } = useHttpClient();

    const handleEditClick = () => {
        handleClickOnEdit(discussion._id, discussion.text);
    }

    const handleDeleteClick = async () => {
        await deleteDiscussion(projectId, discussion._id, sendRequest);
    }
    return (
        <div className="row white discussion-row showEditDeleteOnHover">
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
                            <span className="edit" onClick={handleEditClick}>Edit</span>
                            <span className="delete" onClick={handleDeleteClick}>Delete</span>
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

export default connect(mapStateToProps, { deleteDiscussion })(DiscussionRow);
