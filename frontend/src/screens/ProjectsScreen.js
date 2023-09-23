import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { PropTypes } from 'prop-types';
import { useForm } from "../hooks/form-hook";
import { useHttpClient } from "../hooks/http-hook";
import { addProject, getAllProjects } from "../actions/projects-action";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../utils/validators";
import Input from "../components/shared/FormElements/Input";
import ProjectItem from "../components/ProjectCard.js";

const ProjectsScreen = ({ addProject, getAllProjects, projects }) => {
    const { sendRequest } = useHttpClient();
    const [ selectedProjectType, setSelectedProjectType ] = useState('all');
    const [ completedProjectCount, setCompletedProjectCount] = useState(0);
    const [ inCompletedProjectCount, setInCompletedProjectCount] = useState(0);
    const [ showAddNewProjectModal, setShowAddNewProjectModal] = useState(false);

    const inputElements = [
        { elementTitle: 'projectName', type: 'text', placeholder: 'Enter ProjectScreen Name', validators: [VALIDATOR_REQUIRE()], errorText: 'Please enter project name.' },
        { elementTitle: 'projectDescription', type: 'text', placeholder: 'Enter ProjectScreen Short Description', validators: [VALIDATOR_REQUIRE()], errorText: 'Please enter short project description.' },
        { elementTitle: 'projectDeadline', placeholder: 'ProjectScreen Deadline', type: 'date', validators: [VALIDATOR_MINLENGTH(6)], errorText: 'Please enter project deadline.' },
    ];

    useEffect( () => {
        getAllProjects(sendRequest);
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
    }, [projects]);

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
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col lg:gap-8 md:gap-6 gap-4">
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
                                    <div className="flex flex-col lg:gap-4 md:gap-3 gap-2">
                                        {inputElements?.map((inputProps, elementTitle) => (
                                            <Input
                                                key={elementTitle}
                                                element="input"
                                                {...inputProps}
                                                styleClass="w-full lg:h-10 md:h-8 h-6 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                                onInput={inputHandler}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-end lg:gap-4 md:gap-3 gap-2 lg:mt-8 md:mt-6 mt-4">
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
            <section className="flex lg:items-center md:items-center items-start lg:justify-center md:justify-center justify-start">
                <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 lg:gap-8 md:gap-6 gap-4">
                    <button
                        className={`flex items-center justify-between lg:gap-4 md:gap-3 gap-2 lg:w-48 md:w-40 w-32 lg:h-20 md:h-20 h-16 bg-[#1f2937] lg:rounded-2xl md:rounded-xl rounded-lg lg:px-4 md:px-3 px-2 py-2 ${selectedProjectType === 'all' && 'selected'}`}
                        onClick={ ()=> {setSelectedProjectType('all')}}
                    >
                        <h4 className="lg:text-3xl md:text-2xl text-lg font-medium">All</h4>

                        <h1 className="lg:text-5xl md:text-4xl text-4xl font-bold text-orange-500">{projects.length}</h1>
                    </button>

                    <button
                        className={`flex items-center justify-between lg:gap-4 md:gap-3 gap-2 lg:w-48 md:w-40 w-32 lg:h-20 md:h-20 h-16 bg-[#1f2937] lg:rounded-2xl md:rounded-xl rounded-lg lg:px-4 md:px-3 px-2 py-2 ${selectedProjectType === 'incomplete' && 'selected'}`}
                        onClick={ ()=> {setSelectedProjectType('incomplete')}}
                    >
                        <h4 className="lg:text-3xl md:text-2xl text-lg font-medium">Active</h4>

                        <h1 className="lg:text-5xl md:text-4xl text-4xl font-bold text-orange-500">{inCompletedProjectCount}</h1>
                    </button>

                    <button
                        className={`flex items-center justify-between lg:gap-4 md:gap-3 gap-2 lg:w-48 md:w-40 w-32 lg:h-20 md:h-20 h-16 bg-[#1f2937] lg:rounded-2xl md:rounded-xl rounded-lg lg:px-4 md:px-3 px-2 py-2 ${selectedProjectType === 'completed' && 'selected'}`}
                        onClick={ ()=> {setSelectedProjectType('completed')}}
                    >
                        <h4 className="lg:text-3xl md:text-2xl text-lg font-medium">Finished</h4>

                        <h1 className="lg:text-5xl md:text-4xl text-4xl font-bold text-orange-500">{completedProjectCount}</h1>
                    </button>
                </div>
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
