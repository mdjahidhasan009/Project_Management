import React, {useEffect} from "react";

import './ProjectSummaryRow.css';
import {connect} from "react-redux";
import { getProjectById, getNotAssignedMember } from "../../actions/project-action";
import {useHttpClient} from "../../hooks/http-hook";

const ProjectSummaryRow = ({ project, projectId, selectedItem }) => {
    const { isLoading, error, sendRequest , clearError} = useHttpClient();

    useEffect(() => {

    }, [])

    return (
        <div className="row white">
            <h4>{project && project.name}</h4>
            <h6>{project && project.description}</h6>
            <div className="divider" />
            <div className="row project_navigationRow">
                {/*<div className="projects__threeButton">*/}
                <div className={`project__navigationButton ${selectedItem === 'overview' && 'selected'}`}>
                    <a href={`/project/${projectId}`}>
                            <span className="numberIcon">
                                <i className="fas fa-info" />
                            </span>
                        <span>Overview</span>
                    </a>
                </div>
                <div className={`project__navigationButton ${selectedItem === 'activities' && 'selected'}`}>
                    <a href={`/activities/${projectId}`}>
                            <span className="numberIcon">
                                <i className="fas fa-clipboard-list" />
                            </span>
                        <span>Activities</span>
                    </a>
                </div>
                <div className={`project__navigationButton ${selectedItem === 'discussion' && 'selected'}`}>
                    <a href={`/discussion/${projectId}`}>
                            <span className="numberIcon">
                                <i className="fas fa-comments" />
                            </span>
                        <span>Discussion</span>
                        <span className="numberCircle">{project && project?.discussion?.length || 0}</span>
                    </a>
                </div>
                <div className={`project__navigationButton ${selectedItem === 'todolist' && 'selected'}`}>
                    <a href={`/todolist/${projectId}`}>
                            <span className="numberIcon">
                                <i className="fas fa-check-circle" />
                            </span>
                        <span>To-Do-List</span>
                        <span className="numberCircle">{project && project?.todos?.length || 0}</span>
                    </a>
                </div>
                <div className={`project__navigationButton ${selectedItem === 'bugs' && 'selected'}`}>
                    <a href={`/bugs/${projectId}`}>
                            <span className="numberIcon">
                                <i className="fas fa-bug" />
                            </span>
                        <span>Bugs</span>
                        <span className="numberCircle">{project && project?.bugs?.length || 0}</span>
                    </a>
                </div>
                {/*<div className={`project__navigationButton ${selectedItem === 'milestone' && 'selected'}`}>*/}
                {/*    <a href={`/milestone/${projectId}`}>*/}
                {/*            <span className="numberIcon">*/}
                {/*                <i className="fas fa-list-alt" />*/}
                {/*            </span>*/}
                {/*        <span> Milestones</span>*/}
                {/*        <span className="numberCircle">30</span>*/}
                {/*    </a>*/}
                {/*</div>*/}
                <div className={`project__navigationButton ${selectedItem === 'details' && 'selected'}`}>
                    <a href={`/details/${projectId}`}>
                            <span className="numberIcon">
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
});

export default connect(mapStateToProps, { getProjectById, getNotAssignedMember })(ProjectSummaryRow);
