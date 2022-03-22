import React, { useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
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
import M from 'materialize-css';
import MemberRow from './Member';
import './Overview.css';
import {initAllModal} from "../../../utils/helper";
import ChartItem from "../../ChartItem";

const Overview = ({ project, assignAnMemberToAProject, chartData, isMemberOfThisProject, isCreatedByUser,
                      getProjectById, toggleIsProjectIsFinished, isAuthenticated, deleteProject, notAssignMembers,
                      getNotAssignedMember
}) => {
    const { sendRequest } = useHttpClient();
    const [ addMember, setAddMember ] = useState('');
    const history = useHistory();

    useEffect(() =>  {
        let selectList = document.getElementById("member_list");
        if (notAssignMembers) {
            notAssignMembers.map(member => {
                let selectObject = document.createElement("option");
                selectObject.text = member;
                selectObject.value = member;
                selectList.appendChild(selectObject);
            })
            M.FormSelect.init(selectList);
            initAllModal();
        }
        // eslint-disable-next-line
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
        let selectList = document.getElementById("member_list");
        if(selectList.options.length > 1) {
            let i, length = selectList.options.length - 1;
            for(i = length; i > 0; i--) {
                selectList.remove(i);
            }
        }
        await assignAnMemberToAProject(project._id, addMember ,sendRequest);
        await getNotAssignedMember(project._id, sendRequest);
    }

    const handleProjectDelete = async () => {
        if(window.confirm("Do you want to delete this project? There is no recovery method!!")) {
            await deleteProject(project._id, sendRequest);
            history.push('/projects');
        }
    }

    return (
        <div className="row overview">

            {/* Modal Structure of Add Member */}
            <div id="add-member-modal" className="modal">
                <div className="modal-content">
                    <h5>Add member to this project</h5>
                    <label>
                        Select an member
                        <select id="member_list" value={addMember} onChange={handleSetAddMember}>
                            <option selected defaultValue = '' />
                        </select>
                    </label>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect btn-flat"
                            onClick={handleAddMember}>Add Member</button>
                </div>
            </div>

            {isAuthenticated && (
                <>
                    <div className=" row overview__showChartAndMember">
                        <div className={
                            (isCreatedByUser || isMemberOfThisProject)
                                ? "col s12 m12 l10 chart"
                                : "col s12 m12 l12 chart"
                        }
                        >
                            {/*Todo done and bug fixed summary chart*/}
                            <ChartItem chartData={chartData} />
                        </div>


                        {(isCreatedByUser || isMemberOfThisProject) && (
                            <div className="col s5 m5 l2 member">
                                <div className="row member__add-member">
                                    <div className="col s12">
                                        <button data-target="add-member-modal"
                                                className="light-blue lighten-1 modal-trigger add-btn">
                                            <i className="fas fa-plus-circle" />    ADD MEMBER
                                        </button>
                                    </div>
                                </div>

                                {/*Member list of this project*/}
                                {project && (project.members.length > 0) && (
                                    <div className="member__team-member white row">
                                        <p>Team Members</p>
                                        <div className="divider"/>
                                        {project.members.map(member => (
                                            <MemberRow key={member._id} member={member}/>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/*Mark as done or not done button*/}
                    {isCreatedByUser && (
                        <>
                            <button className="overview__project-done green accent-4 add-btn" onClick={handleIsDoneClick}>Mark Project as
                                {project?.isDone
                                    ? ' Not Done'
                                    : ' Done'
                                }
                            </button>

                            <button className="overview__project-delete red lighten-1 add-btn" onClick={handleProjectDelete}
                            >Delete Project</button>
                        </>
                    )}
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
