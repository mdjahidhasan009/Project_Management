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
                <div className="white col s12 fixed-bug" onClick={handleIsFixed}>
                    <p className="fixed-bug__text">{bug.text}</p>
                    <img
                        src = {
                            bug.user?.profileImage?.imageUrl === undefined
                            ? noImage
                            : bug.user?.profileImage?.imageUrl
                        }
                        alt=" "
                        className="avatar"
                    />
                </div>
            )}
        </>
    )
}

const mapStateToProps = state => ({
    noImage: state.auth.noImage
});

export default connect(mapStateToProps, { toggleIsFixed })(FixedBug);
