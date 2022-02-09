import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { getProjectById, getNotAssignedMember } from "../../../actions/project-action";
import './ProjectSummary.css';


const ProjectSummary = ({ project, projectId, selectedItem, user, name, description, category, deadline }) => {

    return (
        <div className="row white project-summary">
        <>
            <h4>{name && name}</h4>
            <h6>{description && description}</h6>
            <h6>{category && category}</h6>
            <h6>{deadline && deadline}</h6>
            <div className="divider" />

            {/*Project Summary Row*/}
            <div className="row project-summary__navigation">
                <div className={`project__navigation-button ${selectedItem === 'overview' && 'selected'}`}>
                    <Link to={`/project/${projectId}`}>
                        <span className="iconCircle">
                            <i className="fas fa-info" />
                        </span>
                        <span>Overview</span>
                    </Link>
                </div>
                <div className={`project__navigation-button ${selectedItem === 'activities' && 'selected'}`}>
                    <Link to={`/activities/${projectId}`}>
                        <span className="iconCircle">
                            <i className="fas fa-clipboard-list" />
                        </span>
                        <span>Activities</span>
                    </Link>
                </div>
                <div className={`project__navigation-button ${selectedItem === 'discussion' && 'selected'}`}>
                    <Link to={`/discussion/${projectId}`}>
                        <span className="iconCircle">
                            <i className="fas fa-comments" />
                        </span>
                        <span>Discussion</span>
                        <span className="numberCircle">{(project && project?.discussion?.length) || 0}</span>
                    </Link>
                </div>
                <div className={`project__navigation-button ${selectedItem === 'todolist' && 'selected'}`}>
                    <Link to={`/todolist/${projectId}`}>
                        <span className="iconCircle">
                            <i className="fas fa-check-circle" />
                        </span>
                        <span>To-Do-List</span>
                        <span className="numberCircle">{(project && project?.todos?.length) || 0}</span>
                    </Link>
                </div>
                <div className={`project__navigation-button ${selectedItem === 'bugs' && 'selected'}`}>
                    <Link to={`/bugs/${projectId}`}>
                        <span className="iconCircle">
                            <i className="fas fa-bug" />
                        </span>
                        <span>Bugs</span>
                        <span className="numberCircle">{(project && project?.bugs?.length) || 0}</span>
                    </Link>
                </div>
                {project?.createdBy?.username === user?.username && (
                    <div className={`project__navigation-button ${selectedItem === 'edit-project' && 'selected'}`}>
                        <Link to={`/edit-project/${projectId}`}>
                        <span className="iconCircle">
                            <i className="fas fa-cog" />
                        </span>
                            <span>Edit</span>
                        </Link>
                    </div>
                )}
            </div>
        </>
        </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project,
    user: state.auth.user,
    name: state.project?.project?.name,
    description: state.project?.project?.description,
    category: state.project?.project?.category,
    deadline: state.project?.project?.deadline
});

export default connect(mapStateToProps, { getProjectById, getNotAssignedMember })(ProjectSummary);
