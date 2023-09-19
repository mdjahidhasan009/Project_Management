import React from 'react'
import { connect } from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import { PropTypes } from "prop-types";

const ProjectCard = ({ project, noImage, noMember }) => {
    let history = useHistory();

    const openProject = async () => {
        await history.push('/project/' + project._id);
    };

    return (
        <Link
            onClick={openProject}
            to="#"
            className="relative bg-[#1f2937] block overflow-hidden rounded-lg p-4 sm:p-6 lg:p-8"
        >
            <div>
                <h3 className="text-lg font-bold text-orange-500 sm:text-xl overflow-hidden text-ellipsis"> {project?.name} </h3>

                <p className="mt-1 text-xs font-medium text-white-light"> {project?.createdBy?.username} </p>
            </div>

            <div className="mt-4">
                <p className="max-w-[40ch] text-sm text-white-light"> {project.description} </p>
            </div>

            <dl className="mt-6 flex items-center justify-self-auto gap-4 sm:gap-6">
                <div className="flex flex-col-reverse items-center justify-center">
                    <dt className="text-sm font-medium text-white-light">Deadline</dt>
                    <dd className="text-xs text-white-light"> {project?.deadline} </dd>
                </div>

                <div className="flex flex-col-reverse items-center justify-center">
                    <dt className="text-sm font-medium text-white-light">Discussion</dt>
                    <dd className="text-xs text-white-light"> { project?.discussion?.length } </dd>
                </div>

                <div className="flex flex-col-reverse items-center justify-center">
                    <dt className="text-sm font-medium text-white-light"> { project?.bugs?.length > 1 ? ' Bugs' : ' Bug' } </dt>
                    <dd className="text-xs text-white-light"> { project?.bugs?.length } </dd>
                </div>

                <div className="flex flex-col-reverse items-center justify-center">
                    <dt className="text-sm font-medium text-white-light"> { project?.todos?.length > 1 ? ' Todos' : ' Todo' } </dt>
                    <dd className="text-xs text-white-light"> { project?.todos?.length } </dd>
                </div>

                <div className="flex flex-col-reverse items-center justify-center">
                    <dt className="text-sm font-medium text-white-light"> { project?.members?.length > 1 ? ' Members' : ' Member' } </dt>
                    <dd className="text-xs text-white-light"> { project?.members?.length } </dd>
                </div>
            </dl>

            <div className="flex items-center justify-between mt-7 w-full">
                <ul className="flex items-center w-3/4">
                    {project?.members?.length > 0 && project?.members?.slice(0, 5).map(userItem => (
                        <li key={userItem?.user?.username+project._id} className="m-[-8px]">
                            {userItem.user && userItem.user.profileImage &&
                                <img src={userItem?.user?.profileImage?.imageUrl} alt=" " className="rounded-full w-12 h-12"/>
                            }
                            {userItem.user && !userItem?.user?.profileImage &&
                                <img src={noImage} alt=" " className="rounded-full w-12 h-12"/>
                            }
                        </li>
                    ))}

                    {project?.members?.length === 0 && (
                        <li key="no_member" className="collection-item avatar">
                            <img src={noMember} alt=" " className="rounded-full w-12 h-12"/>
                        </li>
                    )}
                </ul>

                <strong
                    className="-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl bg-orange-500 px-3 py-1.5 text-white"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                    </svg>

                    <span className="text-[10px] font-medium sm:text-xs"> { project?.category } </span>
                </strong>
            </div>
        </Link>
    )
}

ProjectCard.propTypes = {
    project: PropTypes.object.isRequired,
    noImage: PropTypes.string.isRequired,
    noMember: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    noImage: state.auth.noImage,
    noMember: state.auth.noMember
})

export default connect(mapStateToProps)(ProjectCard);
