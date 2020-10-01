import React from 'react';

import './FixedBugRow.css';
import {useHttpClient} from "../../../hooks/http-hook";
import {connect} from "react-redux";
import {toggleIsFixed} from "../../../actions/project-action";

const FixedBugRow = ({ bug, projectId, toggleIsFixed }) => {
    const { isLoading, error, sendRequest , clearError} = useHttpClient();

    const handleIsFixed = async () => {
        await toggleIsFixed(projectId, bug._id, 'false', sendRequest);
    }

    return (
        <>
            {bug.fixed && (
                <div className="white col s12 fixed_bug_row" onClick={handleIsFixed}>
                    <p className="fixed_bug">{bug.text}</p>
                    <img
                        src={bug.user?.profileImage?.imageUrl}
                        alt=" "
                        className="avatar"
                    />
                </div>
            )}
        </>
    )
}

export default connect(null, { toggleIsFixed })(FixedBugRow);
