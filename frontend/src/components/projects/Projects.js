import React, {useEffect, useState} from 'react';

import ProjectItem from "./projectItem";

import './Projects.css';
import {VALIDATOR_REQUIRE} from "../../utils/validators";
import Input from "../shared/FormElements/Input";
import { useForm } from "../../hooks/form-hook";
import { useHttpClient } from "../../hooks/http-hook";
import { addProject, getAllProjects } from "../../actions/project-action";
import {connect} from "react-redux";
import { PropTypes } from 'prop-types';
import Alert from "../layout/Alert";
import { setAlert } from "../../actions/alert-action";

const Projects = ({ addProject, getAllProjects, projects, setAlert }) => {
    const { isLoading, error, sendRequest , clearError} = useHttpClient();
    const [ selectedProjectType, setSelectedProjectType ] = useState('all');
    const [ completedProjectCount, setCompletedProjectCount] = useState(0);
    const [ inCompletedProjectCount, setInCompletedProjectCount] = useState(0);
    useEffect( () => {
        getAllProjects(sendRequest);
        console.log(projects);
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

    useEffect(() => {
        if(error) {
            setAlert(error, 'danger');
            clearError();
        }
    }, [error]);

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
            <Alert />
            <div className="row white">
                <h4>Project Manager</h4>
                {/*Modal Trigger*/}
                <button data-target="modal1" className="btn modal-trigger projects__addProject">
                    <i className="material-icons add_project_btn">add_circle_outline</i>
                    ADD NEW PROJECT
                </button>
                {/*Modal Structure*/}
                <div id="modal1" className="modal">
                    <div className="modal-content">
                        <h5>Add New Project</h5>
                        {/*<p>A bunch of text7</p>*/}
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

                <div className="divider" />
                <div className="row projects__summary_row">
                    <div className={`projects__threeButton ${selectedProjectType === 'all' && 'selected'}`}>
                        <button className="numberCircle__button"
                                onClick={ ()=> {setSelectedProjectType('all')}}
                        >
                            <span className="numberIcon">
                                <i className="fas fa-list-ol" />
                            </span>
                            <span> All</span>
                            <span className="numberCircle">{projects.length}</span>
                        </button>
                    </div>
                    <div className={`projects__threeButton ${selectedProjectType === 'incomplete' && 'selected'}`}>
                        <button className="numberCircle__button"
                                onClick={ ()=> {setSelectedProjectType('incomplete')}}
                        >
                            <span className="numberIcon">
                                <i className="fas fa-clipboard-list" />
                            </span>
                            <span> Active</span>
                            <span className="numberCircle">{inCompletedProjectCount}</span>
                        </button>
                    </div>
                    <div className={`projects__threeButton ${selectedProjectType === 'completed' && 'selected'}`}>
                        <button className="numberCircle__button"
                                onClick={ ()=> {setSelectedProjectType('completed')}}
                        >
                            <span className="numberIcon">
                                <i className="fas fa-list-alt" />
                            </span>
                            <span> Finished</span>
                            <span className="numberCircle">{completedProjectCount}</span>
                        </button>
                    </div>
                </div>
            </div>

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
    projects: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    projects: state.project.projects
});

export default connect(mapStateToProps, { addProject, getAllProjects, setAlert })(Projects);
