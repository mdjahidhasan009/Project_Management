import React from 'react';
import { connect } from "react-redux";

import {useHttpClient} from "../../../hooks/http-hook";
import { toggleIsFixed, deleteBug} from "../../../actions/project-action";

const NotFixedBugRow = ({username, bug, projectId, toggleIsFixed, deleteBug, handleClickOnEdit, noImage }) => {
    const { sendRequest } = useHttpClient();
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
                <div className="white col s12 not-fixed-bug showEditDeleteOnHover" onClick={handleIsFixed}>
                    <p className="not-fixed-bug__text">{bug.text}</p>
                    <img
                        src = {
                            bug.user?.profileImage?.imageUrl === undefined
                                ? noImage
                                : bug.user?.profileImage?.imageUrl
                        }
                        alt=" "
                        className="avatar"
                    />
                    {/*If current user add this bug then edit and delete will be appears while hover*/}
                    {username && (username === bug.user.username) && (
                        <>
                            <p className="edit" onClick={handleEditClick}>Edit</p>
                            <p className="delete" onClick={handleDeleteClick}>Delete</p>
                        </>
                    )}
                </div>
            )}
        </>
    )
}

const mapStateToProps = state => ({
    username: state?.auth?.user?.username,
    noImage: state.auth.noImage
})

export default connect(mapStateToProps, { toggleIsFixed, deleteBug })(NotFixedBugRow);
