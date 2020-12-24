import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { useParams } from 'react-router-dom';

import ProjectSummaryRow from "./projectSummary/ProjectSummary";
import Overview from "./overview/Overview";
import Discussion from "./discussion/Discussion";
import Activities from "./activities/ActivitiesScreen";
import EditProjectDetails from "./edit-project-details/EditProjectDetails";
import Todos from "./todos/Todos";
import Bugs from "./bugs/Bugs";
import { useHttpClient } from "../../hooks/http-hook";
import {
    getProjectById, getNotAssignedMember, prepareActivity, prepareWorkDonePreview, getIsMemberAndCreatorOfProject
} from "../../actions/project-action";

const ProjectScreen = ({ getProjectById ,selectedItem, getNotAssignedMember, prepareActivity, prepareWorkDonePreview,
                     getIsMemberAndCreatorOfProject
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
            <>
                <ProjectSummaryRow projectId={projectId} selectedItem={selectedItem} />
                {selectedItem === 'overview' && <Overview />}
                {selectedItem === 'activities' && <Activities />}
                {selectedItem === 'edit-project' && <EditProjectDetails />}
                {selectedItem === 'todolist' && <Todos />}
                {selectedItem === 'bugs' && <Bugs />}
                {selectedItem === 'discussion' && <Discussion />}
            </>
        </div>
    );
};

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { getProjectById, getNotAssignedMember, prepareActivity, prepareWorkDonePreview,
    getIsMemberAndCreatorOfProject
})(ProjectScreen);

//Checking isAuthenticated here casing delay html preparing and for this index.html does not get any modal for initialization
//So I put authentication check in projectSummary and and also other file(Overview, bug etc)
