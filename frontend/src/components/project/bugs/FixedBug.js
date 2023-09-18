import React from 'react';
import { connect } from "react-redux";

import { useHttpClient } from "../../../hooks/http-hook";
import { toggleIsFixed } from "../../../actions/project-action";

const FixedBug = ({ bug, projectId, toggleIsFixed, noImage }) => {
    const { sendRequest } = useHttpClient();

    const handleIsFixed = async () => {
        await toggleIsFixed(projectId, bug._id, 'false', sendRequest);
    }

    return (
        <>
            {bug.fixed && (
                <div
                    onClick={handleIsFixed}
                    className="bg-default flex lg:flex-row md:flex-row flex-col items-center justify-between lg:gap-8 md:gap-6 gap-4 lg:p-8 md:p-6 p-4 lg:rounded-2xl md:rounded-xl rounded-lg cursor-pointer"
                    id="discussion-row"
                >
                    <div className="lg:w-2/12 md:w-3/12 w-full flex lg:justify-start md:justify-start justify-center">
                        <img
                            src = {
                                bug.user?.profileImage?.imageUrl === undefined
                                    ? noImage
                                    : bug.user?.profileImage?.imageUrl
                            }
                            alt=" "
                            className="w-40 h-32 rounded-full object-cover"
                        />
                    </div>
                    <div className="group lg:w-10/12 md:w-9/12 w-full">
                        <p className="text-justify">{bug.text}</p>
                    </div>
                </div>
            )}
        </>
    )
}

const mapStateToProps = state => ({
    noImage: state.auth.noImage
});

export default connect(mapStateToProps, { toggleIsFixed })(FixedBug);
