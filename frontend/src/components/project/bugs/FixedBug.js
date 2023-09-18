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
                <div className="bg-default flex items-center justify-between gap-8 p-8 rounded-2xl" onClick={handleIsFixed}>
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
                </div>
            )}
        </>
    )
}

const mapStateToProps = state => ({
    noImage: state.auth.noImage
});

export default connect(mapStateToProps, { toggleIsFixed })(FixedBug);
