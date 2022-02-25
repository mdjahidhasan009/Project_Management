import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Chart } from "react-google-charts";

import { prepareTodoAndBugForPreview } from "../actions/project-action";
import { getAllProjects } from "../actions/projects-action";
import { loadUser } from "../actions/auth-action";
import { useHttpClient } from "../hooks/http-hook";
import './stylesheets/DashboardScreen.css';
import ChartItem from "../components/ChartItem";

const DashboardScreen = ({ projects, auth, getAllProjects, prepareTodoAndBugForPreview }) => {
    const { sendRequest } = useHttpClient();
    const { user,
        chartData, //for showing chart of finished todos and fixed bugs of a member
        todoBugCountSummary, //Count of how many todos are completed or incomplete and bug fixed or not fixed yet.
        activitySummary, // All completed or incomplete todos and fixed or not fixed bugs of a member
    } = auth;

    useEffect(() => {
        if(user) getAllProjects(sendRequest);
        // eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        if(projects.length > 0 && user) prepareTodoAndBugForPreview(user.username, projects);
        // eslint-disable-next-line
    }, [projects, user]);

    return (
        <div className="main dashboard">
            {/*Work summary such as remaining todo, not fixed bug, finished todo, fixed bug count*/}
            <div className="row dashboard__work-summary">
                <div className="col s6 m3 l3">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title center">{todoBugCountSummary && todoBugCountSummary.todoNotDone}</span>
                            <p className="center">Remaining</p>
                            <p className="center">Todo</p>
                        </div>
                    </div>
                </div>

                <div className="col s6 m3 l3">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title center">{todoBugCountSummary && todoBugCountSummary.notFixedBug}</span>
                            <p className="center">Remaining</p>
                            <p className="center">Bug</p>
                        </div>
                    </div>
                </div>

                <div className="col s6 m3 l3">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title center">{todoBugCountSummary && todoBugCountSummary.todoDone}</span>
                            <p className="center">Finished</p>
                            <p className="center">Todo</p>
                        </div>
                    </div>
                </div>

                <div className="col s6 m3 l3">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title center">{todoBugCountSummary && todoBugCountSummary.fixedBug}</span>
                            <p className="center">Fixed</p>
                            <p className="center">Bug</p>
                        </div>
                    </div>
                </div>
            </div>

            {/*Chart for showing fixed bug and finished todo*/}
            <div className="row s12 dashboard__chart">
                <ChartItem chartData={chartData}/>
            </div>

            {(activitySummary && activitySummary.notCompletedActivity.length > 0) && (
                <div className="row white dashboard__work-summary">

                    {/*Work not finished*/}
                    <h5>Remaining Tasks</h5>
                    {activitySummary.notCompletedActivity.map(project => (
                        <div className="project_summary" key={project.projectName}>
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
                    <h5>Completed Tasks</h5>
                    {activitySummary.completedActivity.map(project => (
                        <div className="project_summary" key={project.projectName}>
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
        </div>
    );
};

const mapStateToProps = state => ({
    projects: state.projects,
    auth: state.auth
})

export default connect(mapStateToProps, { getAllProjects, prepareTodoAndBugForPreview, loadUser })(DashboardScreen);
