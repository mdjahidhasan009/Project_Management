import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { useParams } from 'react-router-dom';

import ProjectSummaryRow from "./ProjectSummary";
import Overview from "./overview/Overview";
import Discussion from "./discussion/Discussion";
import Activities from "./activities/Activities";
import Details from "./details/Details";
import Todos from "./todos/Todos";
import Bugs from "./bugs/Bugs";
import { useHttpClient } from "../../hooks/http-hook";
import {
    getProjectById, getNotAssignedMember, prepareActivity, prepareWorkDonePreview, getIsMemberAndCreatorOfProject
} from "../../actions/project-action";


const Project = ({ getProjectById ,selectedItem, getNotAssignedMember, prepareActivity, prepareWorkDonePreview,
                     getIsMemberAndCreatorOfProject, project
}) => {
    const { sendRequest } = useHttpClient();
    const projectId = useParams().projectId;

    useEffect(() => {
        getIsMemberAndCreatorOfProject(projectId, sendRequest);
        getProjectById(projectId, sendRequest);
        getNotAssignedMember(projectId, sendRequest);
        prepareActivity(projectId, sendRequest);
        prepareWorkDonePreview(projectId, sendRequest);
    }, []);

    return (
        <div className="main">
            <ProjectSummaryRow projectId={projectId} selectedItem={selectedItem} />
            {selectedItem === 'overview' && <Overview />}
            {selectedItem === 'activities' && <Activities />}
            {selectedItem === 'details' && <Details />}
            {selectedItem === 'todolist' && <Todos />}
            {selectedItem === 'bugs' && <Bugs />}
            {selectedItem === 'discussion' && <Discussion />}
        </div>
    )
}

export default connect(null, { getProjectById, getNotAssignedMember, prepareActivity, prepareWorkDonePreview,
    getIsMemberAndCreatorOfProject
})(Project);
