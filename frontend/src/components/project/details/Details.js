import React, {useEffect} from 'react';
import { connect } from 'react-redux';

import {useForm} from "../../../hooks/form-hook";
import {editProjectDetails} from "../../../actions/project-action";
import {useHttpClient} from "../../../hooks/http-hook";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../../utils/validators";
import Input from "../../shared/FormElements/Input";
import './Details.css';

const Details = ({ project, editProjectDetails }) => {
    const { sendRequest } = useHttpClient();
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
        await editProjectDetails(formState.inputs.projectName.value, formState.inputs.projectDetails.value,
            formState.inputs.projectCategory.value, formState.inputs.projectDeadline.value, project._id, sendRequest);
    }

    return (
            <div className="row white">

                {project && (
                    <div className="project_details">
                        <Input
                            label="Project Name"
                            element="input"
                            placeholder="Project Name"
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
                            placeholder="Project Details"
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
                            placeholder="Project Category"
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
                        <a className="waves-effect waves-light blue btn" onClick={saveProjectDetails}>Save Project Details</a>
                    </div>
                )}
            </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project
})

export default connect(mapStateToProps, { editProjectDetails })(Details);
