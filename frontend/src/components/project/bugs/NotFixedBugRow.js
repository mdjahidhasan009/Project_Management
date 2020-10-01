import React from 'react';

import './NotFixedBugRow.css';
import {useHttpClient} from "../../../hooks/http-hook";
import {connect} from "react-redux";
import { toggleIsFixed, deleteBug} from "../../../actions/project-action";

const NotFixedBugRow = ({username, bug, projectId, toggleIsFixed, deleteBug, handleClickOnEdit }) => {
    const { isLoading, error, sendRequest , clearError} = useHttpClient();
    let clicked = false;

    const handleIsFixed = async () => {
        if(!clicked) {
            await toggleIsFixed(projectId, bug._id, 'true', sendRequest);
        }
        clicked = false;
    }

    const handleEditClick = () => {
        clicked = true;
        handleClickOnEdit(bug._id, bug.text);
    }

    const handleDeleteClick = async () => {
        clicked = true;
        await deleteBug(projectId, bug._id, sendRequest);
    }

    return (
        <>
            {!bug.fixed && (
                <div className="white col s12 not_fixed_bug_row" onClick={handleIsFixed}>
                    <p className="not_fixed_bug">{bug.text}</p>
                    <img
                        src={bug.user?.profileImage?.imageUrl}
                        alt=" "
                        className="avatar"
                    />
                    {username && (username === bug.user.username) && (
                        <>
                            <p id="edit" onClick={handleEditClick}>Edit</p>
                            <p id="delete" onClick={handleDeleteClick}>Delete</p>
                        </>
                    )}
                </div>
            )}
        </>
    )
}

const mapStateToProps = state => ({
    username: state.auth.user.username
})

export default connect(mapStateToProps, { toggleIsFixed, deleteBug })(NotFixedBugRow);
