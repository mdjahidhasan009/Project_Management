import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getProjectById, getNotAssignedMember } from "../../../actions/project-action";

const ProjectSummary = ({ project, projectId, selectedItem, user, name, description, category, deadline }) => {
    return (
        <div className="w-full lg:p-8 md:p-6 p-4 bg-[#1f2937] lg:rounded-2xl md:rounded-xl rounded-lg text-white-light flex flex-col lg:gap-8 md:gap-6 gap-4">
        <>
            <div className="text-lg font-normal flex flex-col gap-2">
                <h4 className="lg:text-3xl md:text-2xl text-xl text-orange-500 font-semibold mb-4">Name: {name && name}</h4>
                <h6>Description: {description && description}</h6>
                <h6>Category: {category && category}</h6>
                <h6>Deadline: {deadline && deadline}</h6>
                <div className="divider" />
            </div>

            {/*Project Summary Row*/}
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 lg:gap-4 md:gap-3 gap-2">
                <Link to={`/project/${projectId}`} className={`lg:w-48 md:w-40 w-36 lg:h-10 md:h-8 h-7 lg:rounded-[4px] md:rounded-[3px] rounded-[2px] bg-default hover:bg-orange-500 flex items-center justify-center lg:gap-4 md:gap-3 gap-2 ${selectedItem === 'overview' && 'selected'}`}>
                    <span className="iconCircle">
                        <i className="fas fa-info" />
                    </span>
                    <span>Overview</span>
                </Link>
                <Link to={`/activities/${projectId}`} className={`lg:w-48 md:w-40 w-36 lg:h-10 md:h-8 h-7 lg:rounded-[4px] md:rounded-[3px] rounded-[2px] bg-default hover:bg-orange-500 flex items-center justify-center lg:gap-4 md:gap-3 gap-2 ${selectedItem === 'activities' && 'selected'}`}>
                    <span className="iconCircle">
                        <i className="fas fa-clipboard-list" />
                    </span>
                    <span>Activities</span>
                </Link>
                <Link to={`/discussion/${projectId}`} className={`lg:w-48 md:w-40 w-36 lg:h-10 md:h-8 h-7 lg:rounded-[4px] md:rounded-[3px] rounded-[2px] bg-default hover:bg-orange-500 flex items-center justify-center lg:gap-4 md:gap-3 gap-2 ${selectedItem === 'discussion' && 'selected'}`}>
                     <span className="iconCircle">
                        <i className="fas fa-comments" />
                    </span>
                    <span>Discussion</span>
                    <span className="numberCircle">{(project && project?.discussion?.length) || 0}</span>
                </Link>
                <Link to={`/todolist/${projectId}`} className={`lg:w-48 md:w-40 w-36 lg:h-10 md:h-8 h-7 lg:rounded-[4px] md:rounded-[3px] rounded-[2px] bg-default hover:bg-orange-500 flex items-center justify-center lg:gap-4 md:gap-3 gap-2 ${selectedItem === 'todolist' && 'selected'}`}>
                    <span className="iconCircle">
                        <i className="fas fa-check-circle" />
                    </span>
                    <span>To-Do-List</span>
                    <span className="numberCircle">{(project && project?.todos?.length) || 0}</span>
                </Link>
                <Link to={`/bugs/${projectId}`} className={`lg:w-48 md:w-40 w-36 lg:h-10 md:h-8 h-7 lg:rounded-[4px] md:rounded-[3px] rounded-[2px] bg-default hover:bg-orange-500 flex items-center justify-center lg:gap-4 md:gap-3 gap-2 ${selectedItem === 'bugs' && 'selected'}`}>
                    <span className="iconCircle">
                        <i className="fas fa-bug" />
                    </span>
                    <span>Bugs</span>
                    <span className="numberCircle">{(project && project?.bugs?.length) || 0}</span>
                </Link>

                {project?.createdBy?.username === user?.username && (
                    <Link to={`/edit-project/${projectId}`} className={`lg:w-48 md:w-40 w-36 lg:h-10 md:h-8 h-7 lg:rounded-[4px] md:rounded-[3px] rounded-[2px] bg-default hover:bg-orange-500 flex items-center justify-center lg:gap-4 md:gap-3 gap-2 ${selectedItem === 'edit-project' && 'selected'}`}>
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
    project: state?.project?.project,
    user: state?.auth?.user,
    name: state?.project?.project?.name,
    description: state.project?.project?.description,
    category: state.project?.project?.category,
    deadline: state.project?.project?.deadline
});

export default connect(mapStateToProps, { getProjectById, getNotAssignedMember })(ProjectSummary);
