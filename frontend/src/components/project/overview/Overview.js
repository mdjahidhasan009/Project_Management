import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { useHistory } from 'react-router-dom';

import {useHttpClient} from "../../../hooks/http-hook";
import {
    assignAMemberToAProject,
    toggleIsProjectIsFinished,
    getProjectById,
    deleteProject,
    getNotAssignedMember
} from '../../../actions/project-action';
import MemberRow from './Member';
import './Overview.css';
import ChartItem from "../../ChartItem";

const Overview = ({ project, assignAnMemberToAProject, chartData, isMemberOfThisProject, isCreatedByUser,
                      getProjectById, toggleIsProjectIsFinished, isAuthenticated, deleteProject, notAssignMembers,
                      getNotAssignedMember
}) => {
    const { sendRequest } = useHttpClient();
    const [selectOptions, setSelectOptions] = useState([]);
    const [ addMember, setAddMember ] = useState('');
    const [showModal, setShowModal] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (notAssignMembers) {
            const options = notAssignMembers?.map((member) => ({
                text: member,
                value: member,
            }));
            setSelectOptions(options);
        }
    }, [notAssignMembers]);

    const handleIsDoneClick = async () => {
        if(window.confirm("Do you want to mark this project as " + (project?.isDone ? "Not Done?" : "Done?"))) {
            await toggleIsProjectIsFinished(!project.isDone , project._id, sendRequest);
            await getProjectById(project._id, sendRequest);
        }
    }

    //get selected member username
    const handleSetAddMember =  (event) => {
        setAddMember(event.target.value);
    }

    const handleAddMember = async () => {
        setSelectOptions([]);

        await assignAnMemberToAProject(project?._id, addMember, sendRequest);
        await getNotAssignedMember(project?._id, sendRequest);

        setShowModal(false)
    }

    const handleProjectDelete = async () => {
        if(window.confirm("Do you want to delete this project? There is no recovery method!!")) {
            await deleteProject(project?._id, sendRequest);
            history.push('/projects');
        }
    }

    return (
        <div className="bg-[#1f2937] p-8 rounded-2xl flex justify-between gap-8">

            {/* Modal Structure of Add Member */}
            {showModal ? (
                <>
                    <div
                        className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-[40vw] my-6 mx-auto max-w-5xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-default outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-2xl text-orange-500 font-semibold uppercase">
                                        Add member to this project
                                    </h3>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    <select
                                        className="w-96 h-10 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-2 pr-12 text-gray-700 text-sm shadow-sm"
                                        id="member_list"
                                        value={addMember}
                                        onChange={handleSetAddMember}
                                    >
                                        <option value="">Select a member</option>
                                        {selectOptions.map((option, index) => (
                                            <option key={index} value={option.value}>
                                                {option.text}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="flex items-center justify-end gap-4">
                                        <button
                                            className="text-red-500 bg-[#1f2937] hover:bg-red-500 hover:text-white-light rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="modal-close waves-effect btn-flat bg-[#1f2937] hover:bg-orange-500 rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={handleAddMember}
                                        >
                                            Add Member
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            {isAuthenticated && (
                <>
                    <div className="w-full flex justify-between gap-8">
                        <div className={
                            (isCreatedByUser || isMemberOfThisProject)
                                ? "col s12 m12 l10 chart w-10/12"
                                : "col s12 m12 l12 chart w-10/12"
                        }
                        >
                            <ChartItem chartData={chartData} />

                            {/*Mark as done or not done button*/}
                            {isCreatedByUser && (
                                <div className="flex items-center justify-center gap-4 mt-8">
                                    <button
                                        className="w-48 h-10 rounded-[4px] bg-default hover:bg-orange-500 flex items-center justify-center gap-4"
                                        onClick={handleIsDoneClick}
                                    >
                                        Mark Project as
                                        {project?.isDone
                                            ? ' Not Done'
                                            : ' Done'
                                        }
                                    </button>

                                    <button
                                        className="w-48 h-10 rounded-[4px] bg-default hover:bg-red-500 flex items-center justify-center gap-4"
                                        onClick={handleProjectDelete}
                                    >
                                        Delete Project
                                    </button>
                                </div>
                            )}
                            {/*Todo done and bug fixed summary chart*/}
                        </div>


                        {(isCreatedByUser || isMemberOfThisProject) && (
                            <div className="flex flex-col items-start gap-4 w-2/12">
                                <div className="row member__add-member">
                                    <div className="row member__add-member">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(true)}
                                            className="flex items-center justify-center gap-4 w-52 h-10 bg-default hover:bg-orange-500 text-white-light rounded-2xl px-4 py-2"
                                        >
                                            <i className="fas fa-plus-circle" />
                                            ADD MEMBER
                                        </button>
                                    </div>
                                </div>

                                {/*Member list of this project*/}
                                {project && (project?.members?.length > 0) && (
                                    <div className="overflow-y-auto">
                                        <p className="text-2xl text-orange-500 mb-4">Team Members</p>
                                        <div className="divider"/>
                                        <div className="flex flex-col gap-2">
                                            {project?.members?.map(member => (
                                                <MemberRow key={member?._id} member={member}/>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    project: state.project.project,
    chartData: state.project.chartData,
    isCreatedByUser: state.project.isCreatedByUser,
    isMemberOfThisProject: state.project.isMemberOfThisProject,
    isAuthenticated: state.auth.isAuthenticated,
    notAssignMembers: state.project?.notAssignMembers
});

export default connect(mapStateToProps, { assignAnMemberToAProject: assignAMemberToAProject, toggleIsProjectIsFinished, getProjectById,
    deleteProject, getNotAssignedMember })(Overview);
