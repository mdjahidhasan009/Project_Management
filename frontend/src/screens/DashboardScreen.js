import React, { useEffect } from 'react';
import { connect } from 'react-redux';

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

    const summaryCardDetails = [
        { title: 'Remaining Todo', count: todoBugCountSummary?.todoNotDone },
        { title: 'Remaining Bug', count: todoBugCountSummary?.notFixedBug },
        { title: 'Finished Todo', count: todoBugCountSummary?.todoDone },
        { title: 'Fixed Bug', count: todoBugCountSummary?.fixedBug },
    ];

    useEffect(() => {
        if(user) getAllProjects(sendRequest);
        // eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        if(projects.length > 0 && user) prepareTodoAndBugForPreview(user.username, projects);
        // eslint-disable-next-line
    }, [projects, user]);

    return (
        <section className="w-full bg-default text-white-light min-h-screen flex flex-col lg:gap-28 md:gap-14 gap-10 lg:p-8 md:p-6 p-4">
            <div className="mx-auto max-w-screen-xl">
                <dl className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 gap-4">
                    {summaryCardDetails?.map((item, index) => (
                        <div key={index} className="flex flex-col gap-2 rounded-lg bg-[#1f2937] lg:px-4 md:px-3 px-2 lg:py-8 md:py-6 py-4 text-center">
                            <dt className="order-last lg:text-lg md:text-lg text-md font-medium text-white-light">
                                {item.title}
                            </dt>
                            <dd className="lg:text-4xl md:text-3xl text-3xl font-extrabold text-orange-500">
                                {item.count}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>

            {/* Chart for showing fixed bug and finished todo */}
            <div>
                <ChartItem chartData={chartData} />
            </div>

            {(activitySummary && activitySummary.notCompletedActivity?.length > 0) && (
                <div className="lg:rounded-2xl md:rounded-xl rounded-lg bg-[#1f2937]">
                    {/* Remaining Tasks */}
                    <h5 className="lg:my-12 md:my-8 my-4 lg:text-3xl md:text-2xl text-xl font-semibold text-orange-500 underline text-center">Remaining Tasks</h5>

                    {activitySummary?.notCompletedActivity.map((project, index) => (
                        <div key={index} className="lg:mx-8 md:mx-6 mx-4 bg-default lg:rounded-2xl md:rounded-xl rounded-lg lg:mb-6 md:mb-4 mb-2 lg:px-8 md:px-6 px-4 lg:py-4 md:py-3 py-2">
                            <h6 className="lg:text-2xl md:text-xl text-lg font-semibold lg:mb-8 md:mb-6 mb-4">Project name: {project?.projectName}</h6>
                            <div className="flex lg:flex-row md:flex-row flex-col justify-between gap-8">
                                {project.notCompletedTodo.length > 0 && (
                                    <div className="lg:w-[30vw] md:w-[30vw] w-full">
                                        <div className="bg-orange-500 lg:rounded-[4px] md:rounded-[3px] rounded-[2px] lg:mb-4 md:mb-3 mb-2 lg:px-8 md:px-6 px-4 py-1 font-semibold">
                                            Todo have to complete
                                        </div>
                                        <div className="lg:ml-8 md:ml-6 ml-4">
                                            {project.notCompletedTodo.map((todo, index) => (
                                                <ol key={index}>
                                                    <li className="overflow-hidden text-ellipsis mb-2">
                                                        {todo?.text?.length > 55 ? todo?.text?.substring(0, 55) + '...' : todo?.text}
                                                    </li>
                                                </ol>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {project.notFixedBug.length > 0 && (
                                    <div className="lg:w-[30vw] md:w-[30vw] w-full">
                                        <div className="bg-red-500 lg:rounded-[4px] md:rounded-[3px] rounded-[2px] lg:mb-4 md:mb-3 mb-2 lg:px-8 md:px-6 px-4 py-1 font-semibold">
                                            Bug have to fix
                                        </div>
                                        <div className="lg:ml-8 md:ml-6 ml-4">
                                            {project.notFixedBug.map((bug, index) => (
                                                <ol key={index}>
                                                    <li className="overflow-hidden text-ellipsis mb-2">
                                                        {bug?.text?.length > 55 ? bug?.text?.substring(0, 55) + '...' : bug?.text}
                                                    </li>
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

            {/* Finished Work */}
            {(activitySummary && activitySummary.completedActivity.length > 0) && (
                <div className="lg:rounded-2xl md:rounded-xl rounded-lg bg-[#1f2937]">
                    {/* Remaining Tasks */}
                    <h5 className="lg:my-12 md:my-8 my-4 lg:text-3xl md:text-2xl text-xl font-semibold text-orange-500 underline text-center">Completed Tasks</h5>

                    {activitySummary?.completedActivity.map((project, index) => (
                        <div key={index} className="lg:mx-8 md:mx-6 mx-4 bg-default lg:rounded-2xl md:rounded-xl rounded-lg lg:mb-6 md:mb-4 mb-2 lg:px-8 md:px-6 px-4 lg:py-4 md:py-3 py-2">
                            <h6 className="lg:text-2xl md:text-xl text-lg font-semibold lg:mb-8 md:mb-6 mb-4">Project name: {project?.projectName}</h6>
                            <div className="flex lg:flex-row md:flex-row flex-col justify-between gap-8">
                                {project.completedTodo.length > 0 && (
                                    <div className="lg:w-[30vw] md:w-[30vw] w-full">
                                        <div className="bg-orange-500 lg:rounded-[4px] md:rounded-[3px] rounded-[2px] lg:mb-4 md:mb-3 mb-2 lg:px-8 md:px-6 px-4 py-1 font-semibold">
                                            Todo done
                                        </div>
                                        <div className="lg:ml-8 md:ml-6 ml-4">
                                            {project.completedTodo.map((todo, index) => (
                                                <ol key={index}>
                                                    <li className="overflow-hidden text-ellipsis mb-2">
                                                        {todo?.text?.length > 55 ? todo?.text?.substring(0, 55) + '...' : todo?.text}
                                                    </li>
                                                </ol>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {project.fixedBug.length > 0 && (
                                    <div className="lg:w-[30vw] md:w-[30vw] w-full">
                                        <div className="bg-red-500 lg:rounded-[4px] md:rounded-[3px] rounded-[2px] lg:mb-4 md:mb-3 mb-2 lg:px-8 md:px-6 px-4 py-1 font-semibold">
                                            Bug fixed
                                        </div>
                                        <div className="lg:ml-8 md:ml-6 ml-4">
                                            {project.fixedBug.map((bug, index) => (
                                                <ol key={index}>
                                                    <li className="overflow-hidden text-ellipsis mb-2">
                                                        {bug?.text?.length > 55 ? bug?.text?.substring(0, 55) + '...' : bug?.text}
                                                    </li>
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
