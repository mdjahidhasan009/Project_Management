import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { useForm } from "../../../hooks/form-hook";
import { editProjectDetails, getProjectById } from "../../../actions/project-action";
import { useHttpClient } from "../../../hooks/http-hook";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../../utils/validators";
import Input from "../../shared/FormElements/Input";
import './EditProjectDetails.css';

const EditProjectDetails = ({ project, editProjectDetails, isAuthenticated, getProjectById }) => {
    const { sendRequest } = useHttpClient();
    const [ loading, setIsLoading ] = useState(false);
    const [ formState, inputHandler, setFormData ] = useForm(
        {
            projectName: {
                value: '',
                isValid: false,
            },
            projectDetails: {
                value: '',
                isValid: false
            },
            projectCategory: {
                value: '',
                isValid: false,
            },
            projectDeadline: {
                value: '',
                isValid: false
            }
        },
        false
    );

    useEffect(  () => {
        if(project) {
            setFormData(
                {
                    projectName: {
                        value: project.name,
                        isValid: true,
                    },
                    projectDetails: {
                        value: project.description,
                        isValid: true
                    },
                    projectCategory: {
                        value: project.category,
                        isValid: true,
                    },
                    projectDeadline: {
                        value: project.deadline,
                        isValid: true
                    }
                },
                true
            )
        }
    }, [project]);

    const saveProjectDetails = async() => {
        setIsLoading(true);
        await editProjectDetails(formState.inputs.projectName.value, formState.inputs.projectDetails.value,
            formState.inputs.projectCategory.value, formState.inputs.projectDeadline.value, project._id, sendRequest);
        await getProjectById(project._id, sendRequest);
        setIsLoading(false);
    }

    return (
            <div className="row white">

                {project && isAuthenticated && (
                    <div className="project_details">
                        <Input
                            label="Project Name"
                            element="input"
                            placeholder="ProjectScreen Name"
                            elementTitle="projectName"
                            type="text"
                            validators={[VALIDATOR_MINLENGTH(5)]}
                            errorText="Please enter at least 5 character."
                            onInput={inputHandler}
                            initialValue={project.name}
                            initialValidity={true}
                        />
                        <Input
                            label="Project Details"
                            element="textarea"
                            placeholder="ProjectScreen Details"
                            elementTitle="projectDetails"
                            type="text"
                            validators={[VALIDATOR_MINLENGTH(5)]}
                            errorText="Please enter at least 5 character."
                            onInput={inputHandler}
                            initialValue={project.description}
                            initialValidity={true}
                        />
                        <Input
                            label="Project Category"
                            element="input"
                            placeholder="ProjectScreen Category"
                            elementTitle="projectCategory"
                            type="text"
                            validators={[VALIDATOR_MINLENGTH(2)]}
                            errorText="Please enter at least 2 character."
                            onInput={inputHandler}
                            initialValue={project.category}
                            initialValidity={true}
                        />
                        <Input
                            element="input"
                            elementTitle="projectDeadline"
                            type="date"
                            label="Project Deadline"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter project deadline."
                            onInput={inputHandler}
                            initialValue={project.deadline}
                            initialValidity={true}
                        />
                        <a className="waves-effect btn"
                           onClick={saveProjectDetails}>
                           {loading && <i className="fas fa-spinner fa-pulse" />}
                           {loading && ' Saving Project Details'}
                           {!loading && 'Save Project Details'}
                        </a>
                    </div>
                )}
            </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project,
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { editProjectDetails, getProjectById })(EditProjectDetails);
