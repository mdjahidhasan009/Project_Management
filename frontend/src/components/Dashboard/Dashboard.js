import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Chart } from "react-google-charts";

import { getAllProjects, prepareTodoAndBugForPreview } from "../../actions/project-action";
import { useHttpClient } from "../../hooks/http-hook";
import './Dashboard.css';

const Dashboard = ({ projects, auth, getAllProjects, prepareTodoAndBugForPreview }) => {
    const { sendRequest } = useHttpClient();
    const { user, chartData, todoBugSummary, activitySummary, isAuthenticated } = auth;

    useEffect(() => {
        getAllProjects(sendRequest);
    }, []);

    useEffect(() => {
        if(projects && user) prepareTodoAndBugForPreview(user.username, projects);
    }, [projects, user]);

    return (
        <div className="main dashboard">
            {isAuthenticated && (
                <>
                    {/*Work summary such as remaining todo, not fixed bug, finished todo, fixed bug count*/}
                    <div className="row dashboard__work-summary">
                        <div className="col s6 m3 l3">
                            <div className="card blue-grey darken-1">
                                <div className="card-content white-text">
                                    <span className="card-title center">{todoBugSummary && todoBugSummary.todoNotDone}</span>
                                    <p className="center">Remaining</p>
                                    <p className="center">Todo</p>
                                </div>
                            </div>
                        </div>

                        <div className="col s6 m3 l3">
                            <div className="card blue-grey darken-1">
                                <div className="card-content white-text">
                                    <span className="card-title center">{todoBugSummary && todoBugSummary.notFixedBug}</span>
                                    <p className="center">Remaining</p>
                                    <p className="center">Bug</p>
                                </div>
                            </div>
                        </div>

                        <div className="col s6 m3 l3">
                            <div className="card blue-grey darken-1">
                                <div className="card-content white-text">
                                    <span className="card-title center">{todoBugSummary && todoBugSummary.todoDone}</span>
                                    <p className="center">Finished</p>
                                    <p className="center">Todo</p>
                                </div>
                            </div>
                        </div>

                        <div className="col s6 m3 l3">
                            <div className="card blue-grey darken-1">
                                <div className="card-content white-text">
                                    <span className="card-title center">{todoBugSummary && todoBugSummary.fixedBug}</span>
                                    <p className="center">Fixed</p>
                                    <p className="center">Bug</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*Chart for showing fixed bug and finished todo*/}
                    <div className="row s12 dashboard__chart">
                        {chartData && (
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
                        )}
                    </div>

                    {(activitySummary && activitySummary.notCompletedActivity.length > 0) && (
                        <div className="row white dashboard__work-summary">

                            {/*Work not finished*/}
                            <h5>Active Projects</h5>
                            {activitySummary.notCompletedActivity.map(project => (
                                <div className="project_summary">
                                    <h6 className="project_summary__project-name white-text">Project name : {project.projectName}</h6>
                                    <div className="row">
                                        <div className="col s12 m6 l6">
                                            {(project.notCompletedTodo.length > 0) && (
                                                <table>
                                                    <thead className="grey darken-1">
                                                    <tr>
                                                        <th>Todo have to complete</th>
                                                    </tr>
                                                    </thead>

                                                    <tbody>
                                                    {project.notCompletedTodo.map(todo => (
                                                        <tr key={todo._id}>
                                                            <td key={todo._id}>{todo.text}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            )}

                                        </div>
                                        <div className="col s12 m6 l6">
                                            {(project.notFixedBug.length > 0) && (
                                                <table>
                                                    <thead className="red lighten-1">
                                                    <tr>
                                                        <th>Bug have to fix</th>
                                                    </tr>
                                                    </thead>

                                                    <tbody>
                                                    {project.notFixedBug.map(bug => (
                                                        <tr key={bug._id}>
                                                            <td key={bug._id}>{bug.text}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                    {/*Finished Work*/}
                    {(activitySummary && activitySummary.completedActivity.length > 0) && (
                        <div className="row white dashboard__work-summary">
                            <h5>Completed Projects</h5>
                            {activitySummary.completedActivity.map(project => (
                                <div className="project_summary">
                                    <h6 className="project_summary__project-name white-text">Project Name : {project.projectName}</h6>
                                    <div className="row">
                                        <div className="col s12 m6 l6">
                                            {(project.completedTodo.length > 0) && (
                                                <table>
                                                    <thead className="grey darken-1">
                                                    <tr>
                                                        <th>Todo done</th>
                                                    </tr>
                                                    </thead>

                                                    <tbody>
                                                    {project.completedTodo.map(todo => (
                                                        <tr key={todo._id}>
                                                            <td key={todo._id}>{todo.text}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            )}

                                        </div>
                                        <div className="col s12 m6 l6">
                                            {(project.fixedBug.length > 0) && (
                                                <table>
                                                    <thead className="red lighten-1">
                                                    <tr>
                                                        <th>Bug fixed</th>
                                                    </tr>
                                                    </thead>

                                                    <tbody>
                                                    {project.fixedBug.map(bug => (
                                                        <tr key={bug._id}>
                                                            <td key={bug._id}>{bug.text}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    projects: state.project.projects,
    auth: state.auth
})

export default connect(mapStateToProps, { getAllProjects, prepareTodoAndBugForPreview })(Dashboard);
