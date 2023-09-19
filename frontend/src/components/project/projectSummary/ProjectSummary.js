import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { getProjectById, getNotAssignedMember } from "../../../actions/project-action";


const ProjectSummary = ({ project, projectId, selectedItem, user, name, description, category, deadline }) => {

    return (
        <div className="w-full p-8 bg-[#1f2937] rounded-2xl text-white-light flex flex-col gap-8">
        <>
            <div className="text-lg font-normal flex flex-col gap-2">
                <h4 className="text-3xl text-orange-500 font-semibold mb-4">Name: {name && name}</h4>
                <h6>Description: {description && description}</h6>
                <h6>Category: {category && category}</h6>
                <h6>Deadline: {deadline && deadline}</h6>
                <div className="divider" />
            </div>

            {/*Project Summary Row*/}
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
                <Link to={`/project/${projectId}`} className={`w-48 h-10 rounded-[4px] bg-default hover:bg-orange-500 flex items-center justify-center gap-4 ${selectedItem === 'overview' && 'selected'}`}>
                    <span className="iconCircle">
                        <i className="fas fa-info" />
                    </span>
                    <span>Overview</span>
                </Link>
                <Link to={`/activities/${projectId}`} className={`w-48 h-10 rounded-[4px] bg-default hover:bg-orange-500 flex items-center justify-center gap-4 ${selectedItem === 'activities' && 'selected'}`}>
                    <span className="iconCircle">
                        <i className="fas fa-clipboard-list" />
                    </span>
                    <span>Activities</span>
                </Link>
                <Link to={`/discussion/${projectId}`} className={`w-48 h-10 rounded-[4px] bg-default hover:bg-orange-500 flex items-center justify-center gap-4 ${selectedItem === 'discussion' && 'selected'}`}>
                     <span className="iconCircle">
                        <i className="fas fa-comments" />
                    </span>
                    <span>Discussion</span>
                    <span className="numberCircle">{(project && project?.discussion?.length) || 0}</span>
                </Link>
                <Link to={`/todolist/${projectId}`} className={`w-48 h-10 rounded-[4px] bg-default hover:bg-orange-500 flex items-center justify-center gap-4 ${selectedItem === 'todolist' && 'selected'}`}>
                    <span className="iconCircle">
                        <i className="fas fa-check-circle" />
                    </span>
                    <span>To-Do-List</span>
                    <span className="numberCircle">{(project && project?.todos?.length) || 0}</span>
                </Link>
                <Link to={`/bugs/${projectId}`} className={`w-48 h-10 rounded-[4px] bg-default hover:bg-orange-500 flex items-center justify-center gap-4 ${selectedItem === 'bugs' && 'selected'}`}>
                    <span className="iconCircle">
                        <i className="fas fa-bug" />
                    </span>
                    <span>Bugs</span>
                    <span className="numberCircle">{(project && project?.bugs?.length) || 0}</span>
                </Link>
                {project?.createdBy?.username === user?.username && (
                    <Link to={`/edit-project/${projectId}`} className={`w-48 h-10 rounded-[4px] bg-default hover:bg-orange-500 flex items-center justify-center gap-4 ${selectedItem === 'edit-project' && 'selected'}`}>
                        <span className="iconCircle">
                            <i className="fas fa-cog" />
                        </span>
                        <span>Edit</span>
                    </Link>
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
