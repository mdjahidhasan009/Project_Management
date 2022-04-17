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
import './stylesheets/ProjectsScreen.css';

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
        <div className="main projects">

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


            <div className="row white">
                {/*Project type selection(as all, active or finished)*/}
                <div className="divider" />
                <div className="row projects__navigation_row">
                    <div className={`project-type-div ${selectedProjectType === 'all' && 'selected'}`}>
                        <button className="project-type-btn"
                                onClick={ ()=> {setSelectedProjectType('all')}}
                        >
                            <span> All</span>
                            <span className="numberCircle">{projects.length}</span>
                        </button>
                    </div>
                    <div className={`project-type-div ${selectedProjectType === 'incomplete' && 'selected'}`}>
                        <button className="project-type-btn"
                                onClick={ ()=> {setSelectedProjectType('incomplete')}}
                        >
                            <span> Active</span>
                            <span className="numberCircle">{inCompletedProjectCount}</span>
                        </button>
                    </div>
                    <div className={`project-type-div ${selectedProjectType === 'completed' && 'selected'}`}>
                        <button className="project-type-btn"
                                onClick={ ()=> {setSelectedProjectType('completed')}}
                        >
                            <span> Finished</span>
                            <span className="numberCircle">{completedProjectCount}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/*Modal Trigger(Add project modal)*/}
            <button data-target="add-project-modal" className="btn modal-trigger projects__addProject">
                <i className="material-icons add_project_btn">add_circle_outline</i>
                ADD NEW PROJECT
            </button>

            {/*ProjectScreen List*/}
            <div className="row projects__showAllProjects">
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
