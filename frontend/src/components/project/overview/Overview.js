import React, { useEffect, useState } from 'react';
import { Chart } from "react-google-charts";
import { connect } from "react-redux";
import { useHistory } from 'react-router-dom';


import {useHttpClient} from "../../../hooks/http-hook";
import {
    assignAnMemberToAProject,
    toggleIsProjectIsFinished,
    getProjectById,
    deleteProject
} from '../../../actions/project-action';
import M from 'materialize-css';
import MemberRow from './MemberRow';
import './Overview.css';

const Overview = ({ project, assignAnMemberToAProject, chartData, isMemberOfThisProject, isCreatedByUser,
                      getProjectById, toggleIsProjectIsFinished, isAuthenticated, deleteProject
}) => {
    const { sendRequest } = useHttpClient();
    const [ addMember, setAddMember ] = useState('');
    const history = useHistory();

    useEffect(() =>  {
        let selectList = document.getElementById("member_list");
        if (project && project.notAssignMembers) {
            project.notAssignMembers.map(member => {
                let selectObject = document.createElement("option");
                selectObject.text = member;
                selectObject.value = member;
                selectList.appendChild(selectObject);
            })
            M.FormSelect.init(selectList);
        }
    }, [project, isCreatedByUser, isMemberOfThisProject]);

    const handleIsDoneClick = async () => {
        await toggleIsProjectIsFinished(!project.isDone , project._id, sendRequest);
        await getProjectById(project._id, sendRequest);
    }

    const handleSetAddMember = async (event) => {
        await setAddMember(event.target.value);
    }

    const handleAddMember = async () => {
        await assignAnMemberToAProject(project._id, addMember ,sendRequest);
    }

    const handleProjectDelete = async () => {
        await deleteProject(project._id, sendRequest);
        history.push('/projects');
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
                    <button className="modal-close waves-effect waves-green btn-flat"
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
                            <Chart
                                width={'100%'}
                                height={'400px'}
                                chartType="LineChart"
                                loader={<div>Loading Chart</div>}
                                data={chartData}
                                options={{
                                    hAxis: {
                                        title: 'Todo done and bug fixed',
                                    },
                                    vAxis: {
                                        title: 'Time',
                                    },
                                    series: {
                                        1: { curveType: 'function' },
                                    },
                                }}
                                rootProps={{ 'data-testid': '2' }}
                            />
                        </div>


                        {(isCreatedByUser || isMemberOfThisProject) && (
                            <div className="col s5 m5 l2 member">
                                {isCreatedByUser && (
                                    <div className="row member__add-member">
                                        <div className="col s12">
                                            <button data-target="add-member-modal" className="light-blue lighten-1 modal-trigger add-btn">
                                                <i className="fas fa-plus-circle" />    ADD MEMBER
                                            </button>
                                        </div>
                                    </div>
                                )}

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
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { assignAnMemberToAProject, toggleIsProjectIsFinished, getProjectById,
    deleteProject})(Overview);
