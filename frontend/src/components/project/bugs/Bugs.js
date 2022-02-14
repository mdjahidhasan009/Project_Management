import React, {useEffect, useState} from 'react';
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../../hooks/http-hook";
import { useForm } from "../../../hooks/form-hook";
import { addBug, editBug } from "../../../actions/project-action";
import { VALIDATOR_REQUIRE } from "../../../utils/validators";
import { initAllModal, initModalAndOpen } from "../../../utils/helper";
import Input from "../../shared/FormElements/Input";
import NotFixedBugRow from "./NotFixedBug";
import FixedBugRow from "./FixedBug";

const Bugs = ({ project, bugs, addBug, editBug, isMemberOfThisProject, isCreatedByUser }) => {
    const { sendRequest } = useHttpClient();
    const projectId = useParams().projectId;
    const [ editBugText, setEditBugText ] = useState('');
    const [ bugId, setBugId ] = useState();
    const [ hasNotFixedBug, setHasNotFixedBug ] = useState(false);
    const [ hasFixedBug, setHasFixedBug ] = useState(false);

    const [ formState, inputHandler, setFormData ] = useForm(
        {
            bugText: {
                value: '',
                isValid: false
            }
        },
        false
    );

    //initialization(bugText is ''
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
        await addBug(formState.inputs.bugText.value, projectId, sendRequest);
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

    //bugId, bugText will be passed from NotFixedBug.js as it was called from there.
    const handleClickOnEdit = async (bugId, bugText) => {
        await setEditBugData(bugText);
        await setBugId(bugId);
        document.getElementById("bugEditText").value = bugText;
        initModalAndOpen('#edit-bug-modal');
        document.getElementById("bugEditText").value = bugText;
    }

    const doesHaveCompletedOrNotFixedBugs = () => {
        let flagHasFixedBug = false, flagHasNotFixedBug = false;
        bugs && bugs.map(item => {
            if(!flagHasFixedBug && item.fixed) flagHasFixedBug = true;
            if(!flagHasNotFixedBug && !item.fixed) flagHasNotFixedBug = true;
        })
        setHasNotFixedBug(flagHasNotFixedBug);
        setHasFixedBug(flagHasFixedBug);
    }

    useEffect(() => {
        doesHaveCompletedOrNotFixedBugs();
    }, [bugs]);

    useEffect( () => {
        initAllModal();
        // eslint-disable-next-line
    }, []);

    return (
            <div className="row bugs">
                {/*Add bug modal structure*/}
                <div id="add-bug-modal" className="modal">
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
                        <button disabled={!formState.isValid} onClick={addBugHandler}
                                className="modal-close btn-flat"
                        >
                            Add New Bug
                        </button>
                    </div>
                </div>

                {/*Edit bug modal structure*/}
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
                <>
                    {(isMemberOfThisProject || isCreatedByUser) && (
                        //Add bug button of add bug modal
                        <button data-target="add-bug-modal" className="light-blue lighten-1 modal-trigger add-btn">
                            <i className="fas fa-plus-circle" />      ADD NEW BUG
                        </button>
                    )}

                    {bugs?.length === 0 && <h5 className="center-align">Great News, no bug in this project yet!!</h5>}
                    {hasNotFixedBug && <h5>Not Fixed Bug List</h5>}
                    <div className=" ">
                        {bugs && bugs.map(bug => (
                            <NotFixedBugRow key={bug._id} bug={bug} projectId={projectId} handleClickOnEdit={handleClickOnEdit}/>
                        ))
                        }
                    </div>
                    {hasFixedBug && <h5>Fixed Bug List</h5>}
                    <div className=" ">
                        {bugs && bugs.map(bug => (
                            <FixedBugRow key={bug._id} bug={bug} projectId={projectId}/>
                        ))
                        }
                    </div>
                </>
            </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project,
    bugs: state.project?.project?.bugs,
    isMemberOfThisProject: state.project.isMemberOfThisProject,
    isCreatedByUser: state.project.isCreatedByUser
});

export default connect(mapStateToProps, { addBug, editBug })(Bugs);
