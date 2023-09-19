import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { PropTypes } from 'prop-types';

import { useForm } from "../hooks/form-hook";
import { useHttpClient } from "../hooks/http-hook";
import { addProject, getAllProjects } from "../actions/projects-action";
import { VALIDATOR_REQUIRE } from "../utils/validators";
import Input from "../components/shared/FormElements/Input";
import ProjectItem from "../components/ProjectCard.js";
// import { initAllModal } from "../utils/helper";

const ProjectsScreen = ({ addProject, getAllProjects, projects }) => {
    const { sendRequest } = useHttpClient();
    const [ selectedProjectType, setSelectedProjectType ] = useState('all');
    const [ completedProjectCount, setCompletedProjectCount] = useState(0);
    const [ inCompletedProjectCount, setInCompletedProjectCount] = useState(0);
    const [ showAddNewProjectModal, setShowAddNewProjectModal] = useState(false);

    useEffect( () => {
        getAllProjects(sendRequest);
        // initAllModal();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        let done = 0, notDone = 0;
        if(projects?.length > 0) {
            projects.map(project => {
                if(project.isDone) done++;
                else notDone++;
            });
            setCompletedProjectCount(done);
            setInCompletedProjectCount(notDone);
        }
        // eslint-disable-next-line
    }, [projects])

    const [ formState, inputHandler ] = useForm(
        {
            projectName: {
                value: '',
                isValid: false
            },
            projectCategory: {
                value: '',
                isValid: false
            },
            projectDescription: {
                value: '',
                isValid: false
            },
            projectDeadline: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const addProjectHandler = (event) => {
        event.preventDefault();
        try {
             addProject(formState.inputs.projectName.value, formState.inputs.projectCategory.value,
                formState.inputs.projectDescription.value, formState.inputs.projectDeadline.value,
                sendRequest
            );
        } catch (error) {}
    }

    return (
        <div className="w-full bg-default text-white-light flex flex-col gap-8 p-8">
            {/*Modal Structure(Add project modal)*/}
            {showAddNewProjectModal ? (
                <>
                    <div
                        className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-[40vw] my-6 mx-auto max-w-5xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-default outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-2xl text-orange-500 font-semibold uppercase">
                                        Add New Project
                                    </h3>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    <Input
                                        element="input"
                                        placeholder="Enter ProjectScreen Name"
                                        elementTitle="projectName"
                                        type="text"
                                        validators={[VALIDATOR_REQUIRE()]}
                                        errorText="Please enter project name."
                                        styleClass="w-96 h-10 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-2 pr-12 text-gray-700 text-sm shadow-sm mb-4"
                                        onInput={inputHandler}
                                    />
                                    <Input
                                        element="input"
                                        placeholder="Enter ProjectScreen Short Description"
                                        elementTitle="projectDescription"
                                        type="text"
                                        validators={[VALIDATOR_REQUIRE()]}
                                        errorText="Please enter short project description."
                                        styleClass="w-96 h-10 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-2 pr-12 text-gray-700 text-sm shadow-sm mb-4"
                                        onInput={inputHandler}
                                    />
                                    <Input
                                        element="input"
                                        placeholder="ProjectScreen Deadline"
                                        elementTitle="projectDeadline"
                                        type="date"
                                        validators={[VALIDATOR_REQUIRE()]}
                                        errorText="Please enter project deadline."
                                        styleClass="w-96 h-10 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-2 pr-12 text-gray-700 text-sm shadow-sm mb-4"
                                        onInput={inputHandler}
                                    />

                                    <div className="flex items-center justify-end gap-4">
                                        <button
                                            className="text-red-500 bg-[#1f2937] hover:bg-red-500 hover:text-white-light rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowAddNewProjectModal(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="modal-close waves-effect btn-flat bg-[#1f2937] hover:bg-orange-500 rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            disabled={!formState.isValid}
                                            onClick={addProjectHandler}
                                        >
                                            Add Project
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            {/*Project type selection (as all, active or finished)*/}
            <section className="flex items-center justify-center gap-12 text-white-light">
                <button
                    className={`flex items-center justify-between gap-4 w-48 h-20 bg-[#1f2937] rounded-2xl px-4 py-2 ${selectedProjectType === 'all' && 'selected'}`}
                    onClick={ ()=> {setSelectedProjectType('all')}}
                >
                    <div className="flex flex-col gap-2">
                        <h4 className="text-3xl font-medium">All</h4>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="w-5 h-5"
                            viewBox="0 0 16 16"
                        >
                          <path
                              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                          />
                        </svg>
                    </div>

                    <h1 className="text-5xl font-bold text-orange-500">{projects.length}</h1>
                </button>

                <button
                    className={`flex items-center justify-between gap-4 w-48 h-20 bg-[#1f2937] rounded-2xl px-4 py-2 ${selectedProjectType === 'incomplete' && 'selected'}`}
                    onClick={ ()=> {setSelectedProjectType('incomplete')}}
                >
                    <div className="flex flex-col gap-2">
                        <h4 className="text-3xl font-medium">Active</h4>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="w-5 h-5"
                            viewBox="0 0 16 16"
                        >
                          <path
                              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                          />
                        </svg>
                    </div>

                    <h1 className="text-5xl font-bold text-orange-500">{inCompletedProjectCount}</h1>
                </button>

                <button
                    className={`flex items-center justify-between gap-4 w-48 h-20 bg-[#1f2937] rounded-2xl px-4 py-2 ${selectedProjectType === 'completed' && 'selected'}`}
                    onClick={ ()=> {setSelectedProjectType('completed')}}
                >
                    <div className="flex flex-col gap-2">
                        <h4 className="text-3xl font-medium">Finished</h4>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="w-5 h-5"
                            viewBox="0 0 16 16"
                        >
                          <path
                              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                          />
                        </svg>
                    </div>

                    <h1 className="text-5xl font-bold text-orange-500">{completedProjectCount}</h1>
                </button>
            </section>

            {/*Modal Trigger(Add project modal)*/}
            <button
                type="button"
                onClick={() => setShowAddNewProjectModal(true)}
                className="flex items-center justify-center gap-4 w-52 h-10 bg-[#1f2937] hover:bg-orange-500 text-white-light rounded-2xl px-4 py-2"
            >
                <i className="fas fa-plus-circle" />
                ADD NEW PROJECT
            </button>

            {/*ProjectScreen List*/}
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
                {selectedProjectType === 'all' && projects.length > 0 && projects.map(project => (
                    <ProjectItem key={project._id} project={project} type={selectedProjectType}/>
                ))
                }
                {selectedProjectType === 'completed' && projects.length > 0 && projects.map(project => (
                    project.isDone && (
                        <ProjectItem key={project._id} project={project} type={selectedProjectType}/>
                    )
                ))}
                {selectedProjectType === 'incomplete' && projects.length > 0 && projects.map(project => (
                    !project.isDone && (
                        <ProjectItem key={project._id} project={project} type={selectedProjectType}/>
                    )
                ))}
            </div>
        </div>
    );
};

ProjectsScreen.propTypes = {
    addProject: PropTypes.func.isRequired,
    getAllProjects: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    projects: state.projects
});

export default connect(mapStateToProps, { addProject, getAllProjects })(ProjectsScreen);
