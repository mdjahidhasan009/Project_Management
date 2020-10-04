import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { PropTypes } from 'prop-types';

import { useForm } from "../../hooks/form-hook";
import { useHttpClient } from "../../hooks/http-hook";
import { addProject, getAllProjects } from "../../actions/project-action";
import { VALIDATOR_REQUIRE } from "../../utils/validators";
import Input from "../shared/FormElements/Input";
import ProjectItem from "./ProjectItem";

import './Projects.css';

const Projects = ({ addProject, getAllProjects, projects }) => {
    const { sendRequest } = useHttpClient();
    const [ selectedProjectType, setSelectedProjectType ] = useState('all');
    const [ completedProjectCount, setCompletedProjectCount] = useState(0);
    const [ inCompletedProjectCount, setInCompletedProjectCount] = useState(0);

    useEffect( () => {
        getAllProjects(sendRequest);
    }, []);

    useEffect(() => {
        let done = 0, notDone = 0;
        if(projects) {
            projects.map(project => {
                if(project.isDone) done++;
                else notDone++;
            });
            setCompletedProjectCount(done);
            setInCompletedProjectCount(notDone);
        }
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

    const addProjectHandler = async (event) => {
        event.preventDefault();
        try {
            await addProject(formState.inputs.projectName.value, formState.inputs.projectCategory.value,
                formState.inputs.projectDescription.value, formState.inputs.projectDeadline.value,
                sendRequest
            );
        } catch (error) {

        }
    }

    return (
        <div className="main projects">
            <div className="row white">
                <h4>Project Management</h4>

                {/*Modal Structure(Add project modal)*/}
                <div id="add-project-modal" className="modal">
                    <div className="modal-content">
                        <h5>Add New Project</h5>
                        <Input
                            element="input"
                            elementTitle="projectName"
                            type="text"
                            placeholder="Enter Project Name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter project name."
                            onInput={inputHandler}
                        />
                        <Input
                            element="input"
                            elementTitle="projectCategory"
                            type="text"
                            placeholder="Enter Project Category(Web/Mobile/ML/AI etc)"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter project category."
                            onInput={inputHandler}
                        />
                        <Input
                            element="input"
                            elementTitle="projectDescription"
                            type="text"
                            placeholder="Enter Project Short Description"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter short project description."
                            onInput={inputHandler}
                        />
                        <Input
                            element="input"
                            elementTitle="projectDeadline"
                            type="date"
                            label="Project Deadline"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter project deadline."
                            onInput={inputHandler}
                        />
                    </div>
                    <div className="modal-footer">
                        <button disabled={!formState.isValid} onClick={addProjectHandler} className="modal-close waves-effect waves-green btn-flat">Add New Project</button>
                    </div>
                </div>

                {/*Project type selection(as all, active or finished)*/}
                <div className="divider" />
                <div className="row projects__navigation_row">
                    <div className={`project-type-div ${selectedProjectType === 'all' && 'selected'}`}>
                        <button className="project-type-btn"
                                onClick={ ()=> {setSelectedProjectType('all')}}
                        >
                            <span className="iconCircle">
                                <i className="fas fa-list-ol" />
                            </span>
                            <span> All</span>
                            <span className="numberCircle">{projects.length}</span>
                        </button>
                    </div>
                    <div className={`project-type-div ${selectedProjectType === 'incomplete' && 'selected'}`}>
                        <button className="project-type-btn"
                                onClick={ ()=> {setSelectedProjectType('incomplete')}}
                        >
                            <span className="iconCircle">
                                <i className="fas fa-clipboard-list" />
                            </span>
                            <span> Active</span>
                            <span className="numberCircle">{inCompletedProjectCount}</span>
                        </button>
                    </div>
                    <div className={`project-type-div ${selectedProjectType === 'completed' && 'selected'}`}>
                        <button className="project-type-btn"
                                onClick={ ()=> {setSelectedProjectType('completed')}}
                        >
                            <span className="iconCircle">
                                <i className="fas fa-list-alt" />
                            </span>
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

            {/*Project List*/}
            <div className="row projects__showAllProjects">
                {selectedProjectType === 'all' && projects && projects.map(project => (
                        <ProjectItem key={project._id} project={project} type={selectedProjectType}/>
                    ))
                }
                {selectedProjectType === 'completed' && projects && projects.map(project => (
                    project.isDone && (
                        <ProjectItem key={project._id} project={project} type={selectedProjectType}/>
                    )
                ))}
                {selectedProjectType === 'incomplete' && projects && projects.map(project => (
                    !project.isDone && (
                        <ProjectItem key={project._id} project={project} type={selectedProjectType}/>
                    )
                ))}
            </div>
        </div>
    )
}

Projects.propTypes = {
    addProject: PropTypes.func.isRequired,
    getAllProjects: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    projects: state.project.projects
});

export default connect(mapStateToProps, { addProject, getAllProjects })(Projects);
