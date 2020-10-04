import React from "react";
import { connect } from "react-redux";

import { getProjectById, getNotAssignedMember } from "../../actions/project-action";
import './ProjectSummary.css';

const ProjectSummary = ({ project, projectId, selectedItem }) => {
    return (
        <div className="row white project-summary">
            <h4>{project && project.name}</h4>
            <h6>{project && project.description}</h6>
            <div className="divider" />

            {/*Project Summary Row*/}
            <div className="row project-summary__navigation">
                <div className={`project__navigation-button ${selectedItem === 'overview' && 'selected'}`}>
                    <a href={`/project/${projectId}`}>
                            <span className="iconCircle">
                                <i className="fas fa-info" />
                            </span>
                        <span>Overview</span>
                    </a>
                </div>
                <div className={`project__navigation-button ${selectedItem === 'activities' && 'selected'}`}>
                    <a href={`/activities/${projectId}`}>
                            <span className="iconCircle">
                                <i className="fas fa-clipboard-list" />
                            </span>
                        <span>Activities</span>
                    </a>
                </div>
                <div className={`project__navigation-button ${selectedItem === 'discussion' && 'selected'}`}>
                    <a href={`/discussion/${projectId}`}>
                            <span className="iconCircle">
                                <i className="fas fa-comments" />
                            </span>
                        <span>Discussion</span>
                        <span className="numberCircle">{project && project?.discussion?.length || 0}</span>
                    </a>
                </div>
                <div className={`project__navigation-button ${selectedItem === 'todolist' && 'selected'}`}>
                    <a href={`/todolist/${projectId}`}>
                            <span className="iconCircle">
                                <i className="fas fa-check-circle" />
                            </span>
                        <span>To-Do-List</span>
                        <span className="numberCircle">{project && project?.todos?.length || 0}</span>
                    </a>
                </div>
                <div className={`project__navigation-button ${selectedItem === 'bugs' && 'selected'}`}>
                    <a href={`/bugs/${projectId}`}>
                            <span className="iconCircle">
                                <i className="fas fa-bug" />
                            </span>
                        <span>Bugs</span>
                        <span className="numberCircle">{project && project?.bugs?.length || 0}</span>
                    </a>
                </div>
                <div className={`project__navigation-button ${selectedItem === 'details' && 'selected'}`}>
                    <a href={`/details/${projectId}`}>
                            <span className="iconCircle">
                                <i className="fas fa-cog" />
                            </span>
                        <span>Details</span>
                        <span className="numberCircle">30</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project
})

export default connect(mapStateToProps, { getProjectById, getNotAssignedMember })(ProjectSummary);
