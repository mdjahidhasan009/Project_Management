import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { addDiscussion, editDiscussion } from "../../../actions/project-action";
import DiscussionRow from "./DiscussionRow";
import Input from "../../shared/FormElements/Input";
import { VALIDATOR_REQUIRE } from "../../../utils/validators";
import M from "materialize-css";
import {initModalAndOpen} from "../../../utils/helper";

const Discussion = ({ project, addDiscussion, editDiscussion, isMemberOfThisProject, isCreatedByUser, isAuthenticated }) => {
    const { sendRequest } = useHttpClient();
    const projectId = useParams().projectId;
    const [ editDiscussionText, setEditDiscussionText ] = useState('');
    const [ discussionId, setDiscussionId ] = useState();

    const [ formState, inputHandler, setFormData ] = useForm(
        {
            discussionText: {
                value: '',
                isValid: false
            }
        },
        false
    );

    //initialization(set discussionText to '' and validation to false)
    const setAddDiscussionData = async () => {
        await setFormData(
            {
                discussionText: {
                    value: '',
                    isValid: false
                }
            },
            false
        );
        document.getElementById("discussionText").value = '';
    }

    const addDiscussionHandler = async (event) => {
        event.preventDefault();
        try {
            await addDiscussion(formState.inputs.discussionText.value, projectId, sendRequest);
            await setAddDiscussionData();
        } catch (error) {
            console.error(error);
        }
    }

    const editDiscussionHandler = async (event) => {
        await editDiscussion(project._id, discussionId, formState.inputs.discussionEditText.value, sendRequest);
        await setAddDiscussionData();
    }

    const initEditDiscussionData = async (discussionText) => {
        await setEditDiscussionText(discussionText);
        await setFormData(
            {
                discussionEditText: {
                    value: discussionText,
                    isValid: true
                }
            },
            true
        )
    }

    const handleClickOnEdit = async (discussionId, discussionText) => {
        await initEditDiscussionData(discussionText);
        await setDiscussionId(discussionId);
        document.getElementById("discussionEditText").value = discussionText;
        initModalAndOpen('#edit-discussion-modal')
    }

    return (
        <div className="row discussion">
            {/*Add discussion Modal Structure*/}
            <div id="add-discussion-modal" className="modal">
                <div className="modal-content">
                    <h5>Add New Discussion</h5>
                    <Input
                        element="input"
                        elementTitle="discussionText"
                        type="text"
                        placeholder="Enter Discussion"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter discussion text."
                        onInput={inputHandler}
                    />
                </div>
                <div className="modal-footer">
                    <button disabled={!formState.isValid} onClick={addDiscussionHandler} className="modal-close waves-effect waves-light btn-flat">Add New Project</button>
                </div>
            </div>

            {/*Edit Discussion Modal*/}
            <div id="edit-discussion-modal" className="modal">
                <div className="modal-content">
                    <h5>Edit Discussion</h5>
                    <Input
                        element="input"
                        elementTitle="discussionEditText"
                        type="text"
                        placeholder="Enter a discussion"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter discussion text."
                        onInput={inputHandler}
                        initialValue={editDiscussionText}
                        initialValidity={true}
                    />
                </div>
                <div className="modal-footer">
                    <button onClick={editDiscussionHandler}
                            disabled={!formState.isValid}  className="modal-close waves-effect waves-light btn-flat">Edit Discussion</button>
                </div>
            </div>

            <>
                {/*Add Discussion Modal Button*/}
                {(isMemberOfThisProject || isCreatedByUser) && (
                    <button data-target="add-discussion-modal" className="light-blue lighten-1 modal-trigger add-btn">
                    <i className="fas fa-plus-circle" />      ADD NEW DISCUSSION
                    </button>
                )}

                <h5>Discussion List</h5>
                {project && project.discussion && project.discussion.map(discussion => (
                    <DiscussionRow key={discussion._id}
                        discussion={discussion}
                        handleClickOnEdit={handleClickOnEdit}
                        projectId={projectId}
                />
                ))}
            </>
        </div>
    );
};

const mapStateToProps = state => ({
    project: state.project.project,
    isMemberOfThisProject: state.project.isMemberOfThisProject,
    isCreatedByUser: state.project.isCreatedByUser,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { addDiscussion, editDiscussion })(Discussion);
