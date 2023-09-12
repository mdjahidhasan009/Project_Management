import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { PropTypes } from 'prop-types';

import { useForm } from "../hooks/form-hook";
import { useHttpClient } from "../hooks/http-hook";
import { addProject, getAllProjects } from "../actions/projects-action";
import { VALIDATOR_REQUIRE } from "../utils/validators";
import Input from "../components/shared/FormElements/Input";
import ProjectItem from "../components/ProjectCard.js";
import { initAllModal } from "../utils/helper";

const ProjectsScreen = ({ addProject, getAllProjects, projects }) => {
    const { sendRequest } = useHttpClient();
    const [ selectedProjectType, setSelectedProjectType ] = useState('all');
    const [ completedProjectCount, setCompletedProjectCount] = useState(0);
    const [ inCompletedProjectCount, setInCompletedProjectCount] = useState(0);

    useEffect( () => {
        getAllProjects(sendRequest);
        initAllModal();
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
        <div className="w-full bg-default text-white-light flex flex-col gap-8">
            {/*Modal Structure(Add project modal)*/}
            <div id="add-project-modal" className="modal">
                <div className="modal-content">
                    <h5>Add New Project</h5>
                    <Input
                        element="input"
                        elementTitle="projectName"
                        type="text"
                        placeholder="Enter ProjectScreen Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter project name."
                        onInput={inputHandler}
                    />
                    <Input
                        element="input"
                        elementTitle="projectCategory"
                        type="text"
                        placeholder="Enter ProjectScreen Category(Web/Mobile/ML/AI etc)"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter project category."
                        onInput={inputHandler}
                    />
                    <Input
                        element="input"
                        elementTitle="projectDescription"
                        type="text"
                        placeholder="Enter ProjectScreen Short Description"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter short project description."
                        onInput={inputHandler}
                    />
                    <Input
                        element="input"
                        elementTitle="projectDeadline"
                        type="date"
                        label="ProjectScreen Deadline"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter project deadline."
                        onInput={inputHandler}
                    />
                </div>
                <div className="modal-footer">
                    <button disabled={!formState.isValid} onClick={addProjectHandler}
                            className="modal-close waves-effect waves-green btn-flat"
                    >
                        Add New Project
                    </button>
                </div>
            </div>

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

                    <h1 className="text-5xl font-bold">{projects.length}</h1>
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

                    <h1 className="text-5xl font-bold">{inCompletedProjectCount}</h1>
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

                    <h1 className="text-5xl font-bold">{completedProjectCount}</h1>
                </button>
            </section>

            {/*Modal Trigger(Add project modal)*/}
            <button data-target="add-project-modal" className="flex items-center justify-between w-52 h-10 bg-[#1f2937] text-white-light rounded-2xl px-4 py-2">
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
                ADD NEW PROJECT
            </button>

            {/*ProjectScreen List*/}
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 px-4">
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
