import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Chart } from "react-google-charts";

import { prepareTodoAndBugForPreview } from "../actions/project-action";
import { getAllProjects } from "../actions/projects-action";
import { loadUser } from "../actions/auth-action";
import { useHttpClient } from "../hooks/http-hook";
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
        <section className="w-full bg-default text-white-light min-h-screen flex flex-col gap-28 px-4">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-10">
                <dl className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
                    <div className="flex flex-col rounded-lg bg-[#1f2937] px-4 py-8 text-center">
                        <dt className="order-last text-lg font-medium text-white-light">
                            Remaining Todo
                        </dt>

                        <dd className="text-4xl font-extrabold text-white-light md:text-5xl">
                            {todoBugCountSummary && todoBugCountSummary.todoNotDone}
                        </dd>
                    </div>

                    <div className="flex flex-col rounded-lg bg-[#1f2937] px-4 py-8 text-center">
                        <dt className="order-last text-lg font-medium text-white-light">
                            Remaining Bug
                        </dt>

                        <dd className="text-4xl font-extrabold text-white-light md:text-5xl">{todoBugCountSummary && todoBugCountSummary.notFixedBug}</dd>
                    </div>

                    <div className="flex flex-col rounded-lg bg-[#1f2937] px-4 py-8 text-center">
                        <dt className="order-last text-lg font-medium text-white-light">
                            Finished Todo
                        </dt>

                        <dd className="text-4xl font-extrabold text-white-light md:text-5xl">{todoBugCountSummary && todoBugCountSummary.todoDone}</dd>
                    </div>

                    <div className="flex flex-col rounded-lg bg-[#1f2937] px-4 py-8 text-center">
                        <dt className="order-last text-lg font-medium text-white-light">
                            Fixed Bug
                        </dt>

                        <dd className="text-4xl font-extrabold text-white-light md:text-5xl">{todoBugCountSummary && todoBugCountSummary.fixedBug}</dd>
                    </div>
                </dl>
            </div>

            {/*Chart for showing fixed bug and finished todo*/}
            <div>
                <ChartItem chartData={chartData}/>
            </div>

            {(activitySummary && activitySummary.notCompletedActivity?.length > 0) && (
                <div className="rounded-2xl bg-[#1f2937]">
                    {/*Remaining Tasks*/}
                    <h5 className="my-12 text-3xl font-semibold text-orange-500 underline text-center">Remaining Tasks</h5>

                    {activitySummary?.notCompletedActivity.map(project => (
                        <div className="mx-8 bg-default rounded-2xl mb-6 px-8 py-4" key={project?.projectName}>
                            <h6 className="text-2xl font-semibold mb-8">Project name : {project?.projectName}</h6>

                            <div className="flex justify-between gap-8">
                                {(project?.notCompletedTodo?.length > 0) && (
                                    <div className="w-[30vw]">
                                        <div className="bg-orange-500 rounded-xl mb-4 px-8 py-1 font-semibold">
                                            Todo have to complete
                                        </div>

                                        <div className="ml-8">
                                            {project?.notCompletedTodo?.map(todo => (
                                                <ol key={todo?._id}>
                                                    <li key={todo?._id} className="overflow-hidden text-ellipsis mb-2">{todo?.text?.length > 55 ? todo?.text?.substring(0, 55) + '...' : todo?.text}</li>
                                                </ol>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(project.notFixedBug.length > 0) && (
                                    <div className="w-[30vw]">
                                        <div className="bg-red-500 rounded-xl mb-4 px-8 py-1 font-semibold">
                                            Bug have to fix
                                        </div>

                                        <div className="ml-8">
                                            {project.notFixedBug.map(bug => (
                                                <ol key={bug._id}>
                                                    <li key={bug._id} className="overflow-hidden text-ellipsis mb-2">{bug?.text?.length > 55 ? bug?.text?.substring(0, 55) + '...' : bug?.text}</li>
                                                </ol>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/*Finished Work*/}
            {(activitySummary && activitySummary.completedActivity.length > 0) && (
                <div className="rounded-2xl bg-[#1f2937]">
                    {/*Remaining Tasks*/}
                    <h5 className="my-12 text-3xl font-semibold text-orange-500 underline text-center">Completed Tasks</h5>

                    {activitySummary?.completedActivity.map(project => (
                        <div className="mx-8 bg-default rounded-2xl mb-6 px-8 py-4" key={project?.projectName}>
                            <h6 className="text-2xl font-semibold mb-8">Project name : {project?.projectName}</h6>

                            <div className="flex justify-between gap-8">
                                {(project?.completedTodo?.length > 0) && (
                                    <div className="w-[30vw]">
                                        <div className="bg-orange-500 rounded-xl mb-4 px-8 py-1 font-semibold">
                                            Todo done
                                        </div>

                                        <div className="ml-8">
                                            {project?.completedTodo?.map(todo => (
                                                <ol key={todo?._id}>
                                                    <li key={todo?._id} className="overflow-hidden text-ellipsis mb-2">{todo?.text?.length > 55 ? todo?.text?.substring(0, 55) + '...' : todo?.text}</li>
                                                </ol>
                                            ))}
                                        </div>
                                    </div>
                                )}


                                {(project.fixedBug.length > 0) && (
                                    <div className="w-[30vw]">
                                        <div className="bg-red-500 rounded-xl mb-4 px-8 py-1 font-semibold">
                                            Bug fixed
                                        </div>

                                        <div className="ml-8">
                                            {project.fixedBug.map(bug => (
                                                <ol key={bug._id}>
                                                    <li key={bug._id} className="overflow-hidden text-ellipsis mb-2">{bug?.text?.length > 55 ? bug?.text?.substring(0, 55) + '...' : bug?.text}</li>
                                                </ol>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

const mapStateToProps = state => ({
    projects: state.projects,
    auth: state.auth
})

export default connect(mapStateToProps, { getAllProjects, prepareTodoAndBugForPreview, loadUser })(DashboardScreen);
