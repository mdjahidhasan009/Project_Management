import React, { useEffect, useState } from 'react';
import {connect, useDispatch, useSelector} from "react-redux";

import { useHttpClient } from "../../../hooks/http-hook";
import { toggleIsFixed, deleteBug} from "../../../redux/thunks/project-thunks";

const NotFixedBug = ({ bug, projectId, handleClickOnEdit }) => {
    const { sendRequest } = useHttpClient();
    const dispatch = useDispatch();
    const authSlice = useSelector(state => state.auth);
    const username = authSlice.user.username || "";
    const noImage = authSlice.noImage || "";

    const [ isMobile, setIsMobile ] = useState(false);
    let clicked = false;

    const handleIsFixed = async () => {
        if(!clicked) {
            dispatch(toggleIsFixed({ projectId: projectId, bugId: bug._id, isFixed: 'true', method: sendRequest }));
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
            dispatch(deleteBug({ projectId: projectId, bugId: bug._id, method: sendRequest }));
        }
    }

    useEffect(() => {
        if (/Mobi/.test(navigator.userAgent))
            setIsMobile(true);
    }, [])

    return (
        <>
            {!bug.fixed && (
                <div
                    onClick={handleIsFixed}
                    className={`bg-default flex lg:flex-row md:flex-row flex-col items-center justify-between lg:gap-8 md:gap-6 gap-4 lg:p-8 md:p-6 p-4 lg:rounded-2xl md:rounded-xl rounded-lg cursor-pointer ${isMobile ? '' : 'showElementOnHover'}`}
                    id="discussion-row"
                >
                    <div className="lg:w-2/12 md:w-3/12 w-full flex lg:justify-start md:justify-start justify-center">
                        <img
                            src = {
                                bug?.user?.profileImage?.imageUrl === undefined
                                    ? noImage
                                    : bug?.user?.profileImage?.imageUrl
                            }
                            alt=" "
                            className="w-40 h-32 rounded-full object-cover"
                        />
                    </div>
                    <div className="group lg:w-10/12 md:w-9/12 w-full">
                        <p className="text-justify">{bug?.text}</p>
                        <div className="lg:mt-6 md:mt-4 mt-2 flex lg:flex-row md:flex-row flex-col-reverse items-center justify-between gap-4">
                            {/*If current user add this bug then edit and delete will be appears while hover*/}
                            {username && (username === bug?.user?.username) && (
                                <div className="flex items-center gap-4">
                                    <button
                                        id='edit'
                                        className="w-20 h-8 bg-[#1f2937] hover:bg-orange-500 text-white-light font-semibold rounded-2xl"
                                        onClick={handleEditClick}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        id='delete'
                                        className="w-20 h-8 bg-red-400 hover:bg-red-500 text-white-light font-semibold rounded-2xl"
                                        onClick={handleDeleteClick}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// const mapStateToProps = state => ({
//     username: state?.auth?.user?.username,
//     noImage: state.auth.noImage
// })

export default NotFixedBug;
// export default connect(mapStateToProps, { toggleIsFixed, deleteBug })(NotFixedBug);
