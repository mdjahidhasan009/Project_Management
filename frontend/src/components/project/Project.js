import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ProjectSummaryRow from "./ProjectSummaryRow";

import './Project.css';
import {useHttpClient} from "../../hooks/http-hook";
import { getProjectById, getNotAssignedMember, prepareActivity, prepareWorkDonePreview, getIsMemberAndCreatorOfProject } from "../../actions/project-action";
import { connect } from "react-redux";
import Overview from "./Overview";
import Discussion from "./Discussion";
import Activities from "./Activities";
import Details from "./Details";
import ToDoLists from "./todos/ToDoLists";
import Bugs from "./bugs/Bugs";

const Project = ({ project, getProjectById ,selectedItem, getNotAssignedMember, prepareActivity, prepareWorkDonePreview, getIsMemberAndCreatorOfProject }) => {
    const { isLoading, error, sendRequest , clearError} = useHttpClient();
    const projectId = useParams().projectId;

    useEffect(() => {
        // console.log(projectId);
        getIsMemberAndCreatorOfProject(projectId, sendRequest);
        getProjectById(projectId, sendRequest);
        getNotAssignedMember(projectId, sendRequest);
        prepareActivity(projectId, sendRequest);
        prepareWorkDonePreview(projectId, sendRequest);
        // console.log(selectedItem)
    }, []);

    return (
        <div className="main project">
            <ProjectSummaryRow projectId={projectId} selectedItem={selectedItem} />
            {selectedItem === 'overview' && <Overview />}
            {selectedItem === 'activities' && <Activities />}
            {selectedItem === 'details' && <Details />}
            {selectedItem === 'todolist' && <ToDoLists />}
            {selectedItem === 'bugs' && <Bugs />}
            {selectedItem === 'discussion' && <Discussion />}
        </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project
});

// export default connect(null, { getProjectById })(Project);
export default connect(mapStateToProps, { getProjectById, getNotAssignedMember, prepareActivity, prepareWorkDonePreview, getIsMemberAndCreatorOfProject })(Project);
