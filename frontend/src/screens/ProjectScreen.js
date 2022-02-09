import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { useParams } from 'react-router-dom';

import ProjectSummaryRow from "../components/project/projectSummary/ProjectSummary";
import Overview from "../components/project/overview/Overview";
import Discussion from "../components/project/discussion/Discussions";
import Activities from "../components/project/activities/Activities";
import EditProjectDetails from "../components/project/edit-project-details/EditProjectDetails";
import Todos from "../components/project/todos/Todos";
import Bugs from "../components/project/bugs/Bugs";
import { useHttpClient } from "../hooks/http-hook";
import {
    getProjectById, getNotAssignedMember, prepareWorkDonePreview, getIsMemberAndCreatorOfProject
} from "../actions/project-action";

const ProjectScreen = ({ project, getProjectById ,selectedItem, getNotAssignedMember, prepareWorkDonePreview,
                     getIsMemberAndCreatorOfProject
}) => {
    const { sendRequest } = useHttpClient();
    const projectId = useParams().projectId;

    useEffect(() => {
        getProjectById(projectId, sendRequest);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(!project) {
            getIsMemberAndCreatorOfProject(projectId, sendRequest);
            getNotAssignedMember(projectId, sendRequest);
            prepareWorkDonePreview(projectId, sendRequest);
        }
        // eslint-disable-next-line
    }, [project])

    return (
        <div className="main">
            <>
                <ProjectSummaryRow projectId={projectId} selectedItem={selectedItem} />
                {selectedItem === 'overview' && <Overview />}
                {selectedItem === 'activities' && <Activities />}
                {selectedItem === 'discussion' && <Discussion />}
                {selectedItem === 'todolist' && <Todos />}
                {selectedItem === 'bugs' && <Bugs />}
                {selectedItem === 'edit-project' && <EditProjectDetails />}
            </>
        </div>
    );
};

const mapStateToProps = state => ({
    auth: state.auth,
    project: state.project.project
})

export default connect(mapStateToProps,
    { getProjectById, getNotAssignedMember, prepareWorkDonePreview, getIsMemberAndCreatorOfProject})
    (ProjectScreen);

//Checking isAuthenticated here casing delay html preparing and for this index.html does not get any modal for initialization
//So I put authentication check in projectSummary and and also other file(Overview, bug etc)
