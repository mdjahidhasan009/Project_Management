import React, { useState } from 'react';

import './Bugs.css';
import {connect} from "react-redux";
import {addBug, editBug} from "../../../actions/project-action";
import {useHttpClient} from "../../../hooks/http-hook";
import {useParams} from "react-router-dom";
import {useForm} from "../../../hooks/form-hook";
import Input from "../../shared/FormElements/Input";
import {VALIDATOR_REQUIRE} from "../../../utils/validators";
import NotFixedBugRow from "./NotFixedBugRow";
import FixedBugRow from "./FixedBugRow";
import M from 'materialize-css';

const Bugs = ({ project, addBug, editBug, isMemberOfThisProject, isCreatedByUser }) => {
    const { isLoading, error, sendRequest , clearError} = useHttpClient();
    const projectId = useParams().projectId;
    const [ editBugText, setEditBugText ] = useState('');
    const [ bugId, setBugId ] = useState();

    const [ formState, inputHandler, setFormData ] = useForm(
        {
            bugText: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const setAddBugData = async () => {
        await setFormData(
            {
                bugText: {
                    value: '',
                    isValid: false
                }
            },
            false
        );
        document.getElementById("bugText").value = '';
    }

    const addBugHandler = async (event) => {
        try {
            await addBug(formState.inputs.bugText.value, projectId, sendRequest);
        } catch (error) {
            console.error(error);
        }
        await setAddBugData();
    }

    const editBugHandler = async (event) => {
        await editBug(project._id, bugId, formState.inputs.bugEditText.value, sendRequest);
        await setAddBugData();
    }

    const setEditBugData = async (bugText) => {
        await setEditBugText(bugText);
        await setFormData(
            {
                bugEditText: {
                    value: bugText,
                    isValid: true
                }
            },
            true
        )
    }

    const handleClickOnEdit = async (bugId, bugText) => {
        await setEditBugData(bugText);
        await setBugId(bugId);
        document.getElementById("bugEditText").value = bugText;
        let Modalelem = document.querySelector('#edit-bug-modal');
        let instance = M.Modal.init(Modalelem);
        document.getElementById("bugEditText").value = bugText;
        instance.open();
    }

    return (
            <div className="row">
                {(isMemberOfThisProject || isCreatedByUser) && (
                    <>
                        <button data-target="modal2" className="light-blue lighten-1 modal-trigger">
                            <i className="fas fa-plus-circle"></i>      ADD NEW BUG
                        </button>
                        <div id="modal2" className="modal">
                            <div className="modal-content">
                                <h5>Add New Bug</h5>
                                <Input
                                    element="input"
                                    elementTitle="bugText"
                                    type="text"
                                    placeholder="Enter A Bug"
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText="Please enter todo text."
                                    onInput={inputHandler}
                                />
                            </div>
                            <div className="modal-footer">
                                <button disabled={!formState.isValid} onClick={addBugHandler} className="modal-close btn-flat">Add New Bug</button>
                            </div>
                        </div>

                        <div id="edit-bug-modal" className="modal">
                            <div className="modal-content">
                                <h5>Edit Bug</h5>
                                <Input
                                    element="input"
                                    elementTitle="bugEditText"
                                    type="text"
                                    placeholder="Enter A Bug"
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText="Please enter bug text."
                                    onInput={inputHandler}
                                    initialValue={editBugText}
                                    initialValidity={true}
                                />
                            </div>
                            <div className="modal-footer">
                                <button onClick={editBugHandler}
                                        disabled={!formState.isValid}  className="modal-close btn-flat">Edit Bug</button>
                            </div>
                        </div>
                    </>
                )}

                <h5>Not Fixed Bug List</h5>
                <div className="row main_row">
                    {project && project.bugs.map(bug => (
                        <NotFixedBugRow key={bug._id} bug={bug} projectId={projectId} handleClickOnEdit={handleClickOnEdit}/>
                        ))
                    }
                </div>
                <h5>Fixed Bug List</h5>
                <div className="row main_row">
                    {project && project.bugs.map(bug => (
                        <FixedBugRow key={bug._id} bug={bug} projectId={projectId}/>
                        ))
                    }
                </div>
            </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project,
    isMemberOfThisProject: state.project.isMemberOfThisProject,
    isCreatedByUser: state.project.isCreatedByUser

});

export default connect(mapStateToProps, { addBug, editBug })(Bugs);
