import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';

import { useHttpClient } from "../../../hooks/http-hook";
import { deleteDiscussion } from "../../../actions/project-action";

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
        <div className={`bg-default flex lg:flex-row md:flex-row flex-col items-center justify-between lg:gap-8 md:gap-6 gap-4 lg:p-8 md:p-6 p-4 lg:rounded-2xl md:rounded-xl rounded-lg cursor-pointer ${isMobile ? '' : 'showElementOnHover'}`} id="discussion-row">
            <div className="lg:w-2/12 md:w-3/12 w-full flex lg:justify-start md:justify-start justify-center">
                <img
                    src={discussion?.user?.profileImage?.imageUrl}
                    alt=" "
                    className="w-40 h-32 rounded-full object-cover"
                />
            </div>
            <div className="group lg:w-10/12 md:w-9/12 w-full">
                <p className="text-justify">{discussion?.text}</p>
                <div className="lg:mt-6 md:mt-4 mt-2 flex lg:flex-row md:flex-row flex-col-reverse items-center justify-between gap-4">
                    {username && (username === discussion?.user?.username) && (
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

                    <span>
                        - <a className="text-orange-400 hover:text-orange-500" href={`/member/${discussion.user.username}`}> {discussion.user.username}</a>
                    </span>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    username: state.auth?.user?.username
})

export default connect(mapStateToProps, { deleteDiscussion })(Discussion);
