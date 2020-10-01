import React, {useEffect, useState} from 'react';
import { Chart } from "react-google-charts";
import { connect } from "react-redux";
import M from 'materialize-css';
import MemberRow from './MemberRow';

import './Overview.css';
import {useHttpClient} from "../../hooks/http-hook";
import {assignAnMemberToAProject, toggleIsProjectIsFinished, getProjectById} from '../../actions/project-action';

const Overview = ({ project, assignAnMemberToAProject, chartData, isMemberOfThisProject, isCreatedByUser, getProjectById, toggleIsProjectIsFinished }) => {
    const { isLoading, error, sendRequest , clearError} = useHttpClient();
    const [ addMember, setAddMember ] = useState('');

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
        console.log('after')
    }

    const handleSetAddMember = async (event) => {
        await setAddMember(event.target.value);
    }

    const handleAddMember = async () => {
        try {
            await assignAnMemberToAProject(project._id, addMember ,sendRequest);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="row overview">

            {/* Modal Structure */}
            <div id="modal2" className="modal">
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

            <div className=" row project__showSummary">
                <div className={(isCreatedByUser || isMemberOfThisProject) ? "col s12 m12 l10 chart" : "col s12 m12 l12 chart"}>
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
                        <div className="row add_member_row">
                            <div className="col s12">
                                <button data-target="modal2" className="light-blue lighten-1 modal-trigger">
                                    <i className="fas fa-plus-circle" />    ADD MEMBER
                                </button>
                            </div>
                        </div>
                    )}
                    {project && (project.members.length > 0) && (
                        <div className="member_list white row">
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
            {isCreatedByUser && (
                <button className="project_done green accent-4" onClick={handleIsDoneClick}>Mark Project as
                    {project?.isDone
                        ? ' Not Done'
                        : ' Done'
                    }
                </button>
            )}
        </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project,
    chartData: state.project.chartData,
    isCreatedByUser: state.project.isCreatedByUser,
    isMemberOfThisProject: state.project.isMemberOfThisProject
});

export default connect(mapStateToProps,
    { assignAnMemberToAProject,
        toggleIsProjectIsFinished,
        getProjectById
    })(Overview);
