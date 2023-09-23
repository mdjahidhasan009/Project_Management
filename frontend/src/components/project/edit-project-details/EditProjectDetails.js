import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { useForm } from "../../../hooks/form-hook";
import { editProjectDetails, getProjectById } from "../../../actions/project-action";
import { useHttpClient } from "../../../hooks/http-hook";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../../utils/validators";
import Input from "../../shared/FormElements/Input";

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
            <div className="bg-[#1f2937] lg:p-8 md:p-6 p-4 lg:rounded-2xl md:rounded-xl rounded-lg">
                {project && isAuthenticated && (
                    <div className="flex flex-col justify-evenly gap-5 lg:w-4/6 md:5/6 w-full">
                        <div className="w-full flex lg:flex-row md:flex-row flex-col lg:items-center md:items-center items-start gap-4 justify-between">
                            <h3>Project Name</h3>

                            <Input
                                element="input"
                                placeholder="ProjectScreen Name"
                                elementTitle="projectName"
                                type="text"
                                validators={[VALIDATOR_MINLENGTH(5)]}
                                errorText="Please enter at least 5 character."
                                styleClass="lg:w-96 md:w-96 w-full lg:h-10 md:h-8 h-6 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={project.name}
                                initialValidity={true}
                            />
                        </div>
                        <div className="w-full flex lg:flex-row md:flex-row flex-col lg:items-center md:items-center items-start gap-4 justify-between">
                            <h3>Project Details</h3>

                            <Input
                                element="textarea"
                                placeholder="ProjectScreen Details"
                                elementTitle="projectDetails"
                                type="text"
                                validators={[VALIDATOR_MINLENGTH(5)]}
                                errorText="Please enter at least 5 character."
                                styleClass="lg:w-96 md:w-96 w-full h-32 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={project.description}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex lg:flex-row md:flex-row flex-col lg:items-center md:items-center items-start gap-4 justify-between">
                            <h3>Project Category</h3>

                            <Input
                                element="input"
                                placeholder="ProjectScreen Category"
                                elementTitle="projectCategory"
                                type="text"
                                validators={[VALIDATOR_MINLENGTH(2)]}
                                errorText="Please enter at least 2 character."
                                styleClass="lg:w-96 md:w-96 w-full lg:h-10 md:h-8 h-6 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={project.category}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex lg:flex-row md:flex-row flex-col lg:items-center md:items-center items-start gap-4 justify-between">
                            <h3>Project Deadline</h3>

                            <Input
                                element="input"
                                elementTitle="projectDeadline"
                                type="date"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter project deadline."
                                styleClass="lg:w-96 md:w-96 w-full lg:h-10 md:h-8 h-6 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={project.deadline}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={saveProjectDetails}
                                disabled={!formState.isValid}
                                className="mt-10 flex items-center justify-center gap-4 lg:w-60 md:w-50 w-48 lg:h-10 md:h-8 h-7 bg-default hover:bg-orange-500 text-white-light rounded-2xl px-4 py-2"
                            >
                                {loading && <i className="fas fa-spinner fa-pulse" />}
                                {loading && ' Saving Project Details'}
                                {!loading && 'Save Project Details'}
                            </button>
                        </div>
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
