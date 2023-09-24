import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';

import { useForm } from "../../../hooks/form-hook";
import { useHttpClient } from "../../../hooks/http-hook";
import { addDiscussion, editDiscussion } from "../../../actions/project-action";
import DiscussionRow from "./Discussion";
import Input from "../../shared/FormElements/Input";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../../utils/validators";
// import {initAllModal, initModalAndOpen} from "../../../utils/helper";

const Discussions = ({ project, addDiscussion, editDiscussion, isMemberOfThisProject, isCreatedByUser }) => {
    const { sendRequest } = useHttpClient();
    const projectId = useParams().projectId;
    const [ editDiscussionText, setEditDiscussionText ] = useState('');
    const [ discussionId, setDiscussionId ] = useState();
    const [showAddDiscussionModal, setShowAddDiscussionModal] = useState(false);
    const [showEditDiscussionModal, setShowEditDiscussionModal] = useState(false);

    const [ formState, inputHandler, setFormData ] = useForm(
        {
            discussionText: {
                value: '',
                isValid: false
            }
        },
        false
    );

    useEffect(() => {
        // initAllModal();
        // eslint-disable-next-line
    }, []);

    //initialization (set discussionText to '' and validation to false)
    const setAddDiscussionData = () => {
        setFormData(
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

        setShowEditDiscussionModal(true);
    }

    return (
        <div className="bg-[#1f2937] lg:p-8 md:p-6 p-4 lg:rounded-2xl md:rounded-xl rounded-lg">
            {/*Add discussion Modal Structure*/}
            {showAddDiscussionModal ? (
                <>
                    <div
                        className="flex items-center justify-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative lg:w-[40vw] md:w-3/5 w-full lg:my-6 md:my-5 my-4 mx-4 max-w-5xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col lg:justify-start md:justify-start justify-center w-full bg-default outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-2xl text-orange-500 font-semibold uppercase">
                                        Add New Discussions
                                    </h3>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    <Input
                                        element="input"
                                        placeholder="Enter Discussions"
                                        elementTitle="discussionText"
                                        type="text"
                                        validators={[VALIDATOR_REQUIRE()]}
                                        errorText="Please enter discussion text."
                                        styleClass="w-full h-10 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-2 pr-12 text-gray-700 text-sm shadow-sm"
                                        onInput={inputHandler}
                                    />

                                    <div className="flex items-center justify-end gap-4 mt-6">
                                        <button
                                            className="text-red-500 bg-[#1f2937] hover:bg-red-500 hover:text-white-light rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowAddDiscussionModal(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="modal-close waves-effect btn-flat bg-[#1f2937] hover:bg-orange-500 rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            disabled={!formState.isValid}
                                            onClick={addDiscussionHandler}
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

            {/*Edit Discussions Modal*/}
            {showEditDiscussionModal ? (
                <>
                    <div
                        className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative lg:w-[40vw] md:w-3/5 w-full m-4 lg:my-6 md:my-5 my-4 mx-auto max-w-5xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-default outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-2xl text-orange-500 font-semibold uppercase">
                                        Edit Discussions
                                    </h3>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    <Input
                                        element="input"
                                        placeholder="Enter a discussion"
                                        elementTitle="discussionEditText"
                                        type="text"
                                        validators={[VALIDATOR_REQUIRE()]}
                                        errorText="Please enter discussion text"
                                        styleClass="w-full h-10 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-2 pr-12 text-gray-700 text-sm shadow-sm"
                                        onInput={inputHandler}
                                        initialValue={editDiscussionText}
                                        initialValidity={true}
                                    />

                                    <div className="flex items-center justify-end gap-4 mt-6">
                                        <button
                                            className="text-red-500 bg-[#1f2937] hover:bg-red-500 hover:text-white-light rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowEditDiscussionModal(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="modal-close waves-effect btn-flat bg-[#1f2937] hover:bg-orange-500 rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            disabled={!formState.isValid}
                                            onClick={editDiscussionHandler}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            <>
                {/*Add Discussions Modal Button*/}
                {(isMemberOfThisProject || isCreatedByUser) && (
                    <button
                        type="button"
                        onClick={() => setShowAddDiscussionModal(true)}
                        className="flex items-center justify-center gap-4 w-52 h-10 bg-default hover:bg-orange-500 text-white-light rounded-2xl px-4 py-2"
                    >
                        <i className="fas fa-plus-circle" />
                        ADD DISCUSSION
                    </button>
                )}

                {project && project.discussion.length > 0
                    ?   <>
                            <h5 className="text-2xl text-orange-500 mt-16 mb-8">Discussion List</h5>
                            <div className="flex flex-col gap-8">
                                {project.discussion.map(discussion => (
                                    <DiscussionRow
                                        key={discussion._id}
                                        discussion={discussion}
                                        handleClickOnEdit={handleClickOnEdit}
                                        projectId={projectId}
                                    />
                                ))}
                            </div>
                        </>
                    :   <h5 className="center-align">No Discussion Yet!!</h5>
                }
            </>
        </div>
    );
};

const mapStateToProps = state => ({
    project: state.project.project,
    isMemberOfThisProject: state.project.isMemberOfThisProject,
    isCreatedByUser: state.project.isCreatedByUser,
});

export default connect(mapStateToProps, { addDiscussion, editDiscussion })(Discussions);
