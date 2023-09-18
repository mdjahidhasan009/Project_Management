import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";

import { useHttpClient } from "../../../hooks/http-hook";
import { toggleIsFixed, deleteBug} from "../../../actions/project-action";

const NotFixedBug = ({username, bug, projectId, toggleIsFixed, deleteBug, handleClickOnEdit, noImage }) => {
    const { sendRequest } = useHttpClient();
    const [ isMobile, setIsMobile ] = useState(false);
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
        if(window.confirm('Do you want to delete this todo?')) {
            deleteBug(projectId, bug._id, sendRequest);
        }
    }

    useEffect(() => {
        if (/Mobi/.test(navigator.userAgent))
            setIsMobile(true);
    }, [])

    return (
        <>
            {!bug.fixed && (
                <div className={`bg-default flex items-center justify-between gap-8 p-8 rounded-2xl ${isMobile ? '' : 'showElementOnHover'}`} onClick={handleIsFixed}>
                    <p className="w-9/12">{bug.text}</p>
                    <div className="w-1/12">
                        <img
                            src = {
                                bug.user?.profileImage?.imageUrl === undefined
                                    ? noImage
                                    : bug.user?.profileImage?.imageUrl
                            }
                            alt=" "
                            className="w-60 rounded-full object-contain"
                        />
                    </div>
                    {/*If current user add this bug then edit and delete will be appears while hover*/}
                    {username && (username === bug.user.username) && (
                        <>
                            <p id='edit' className={`edit ${isMobile ? 'showEdit' : ''}`} onClick={handleEditClick}>Edit</p>
                            <p id='delete' className={`delete ${isMobile ? 'showDelete' : ''}`} onClick={handleDeleteClick}>Delete</p>
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

export default connect(mapStateToProps, { toggleIsFixed, deleteBug })(NotFixedBug);
