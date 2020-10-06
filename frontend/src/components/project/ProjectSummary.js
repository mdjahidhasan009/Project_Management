import React, {useEffect} from "react";
import { connect } from "react-redux";

import { getProjectById, getNotAssignedMember } from "../../actions/project-action";
import './ProjectSummary.css';

const ProjectSummary = ({ project, projectId, selectedItem, isAuthenticated, user }) => {
    useEffect(() => {
        console.log(project?.createdBy?.username)
        console.log(user?.username)
    }, [project, user])
    return (
        <div className="row white project-summary">
            {isAuthenticated && (
                <>
                    <h4>{project && project.name}</h4>
                    <h6>{project && project.description}</h6>
                    <h6>{project && project.category}</h6>
                    <h6>{project && project.deadline}</h6>
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
                        {project?.createdBy?.username === user?.username && (
                            <div className={`project__navigation-button ${selectedItem === 'edit-project' && 'selected'}`}>
                                <a href={`/edit-project/${projectId}`}>
                                <span className="iconCircle">
                                    <i className="fas fa-cog" />
                                </span>
                                    <span>Edit</span>
                                </a>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { getProjectById, getNotAssignedMember })(ProjectSummary);
