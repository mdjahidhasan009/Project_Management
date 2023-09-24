import React, {useEffect, useState} from 'react';
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../../hooks/http-hook";
import { useForm } from "../../../hooks/form-hook";
import { addBug, editBug } from "../../../actions/project-action";
import { VALIDATOR_REQUIRE } from "../../../utils/validators";
// import { initAllModal } from "../../../utils/helper";
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
    const [ showAddNewBugModal, setShowAddNewBugModal ] = useState(false);
    const [ showEditBugModal, setShowEditBugModal ] = useState(false);

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
        event.preventDefault();

        await addBug(formState.inputs.bugText.value, projectId, sendRequest);
        await setAddBugData();

        setShowAddNewBugModal(false);
    }

    const editBugHandler = async (event) => {
        event.preventDefault();

        await editBug(project._id, bugId, formState.inputs.bugEditText.value, sendRequest);
        await setAddBugData();

        setShowEditBugModal(false);
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

        setShowEditBugModal(true)
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
        // initAllModal();
        // eslint-disable-next-line
    }, []);

    return (
            <div className="bg-[#1f2937] lg:p-8 md:p-6 p-4 rounded-2xl flex flex-col lg:gap-8 md:gap-6 gap-4">
                {/*Add bug modal structure*/}
                {showAddNewBugModal ? (
                    <>
                        <div
                            className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative lg:w-[40vw] md:w-3/5 w-full lg:my-6 md:my-5 my-4 mx-4 max-w-5xl">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-default outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 className="text-2xl text-orange-500 font-semibold uppercase">
                                            Add New Bug
                                        </h3>
                                    </div>
                                    <div className="relative p-6 flex-auto">
                                        <Input
                                            element="input"
                                            placeholder="Enter A Bug"
                                            elementTitle="bugText"
                                            type="text"
                                            validators={[VALIDATOR_REQUIRE()]}
                                            errorText="Please enter bug text."
                                            styleClass="w-full h-10 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-2 pr-12 text-gray-700 text-sm shadow-sm mb-4"
                                            onInput={inputHandler}
                                        />

                                        <div className="flex items-center justify-end gap-4">
                                            <button
                                                className="text-red-500 bg-[#1f2937] hover:bg-red-500 hover:text-white-light rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => setShowAddNewBugModal(false)}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                className="modal-close waves-effect btn-flat bg-[#1f2937] hover:bg-orange-500 rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                disabled={!formState.isValid}
                                                onClick={addBugHandler}
                                            >
                                                Add Bug
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}

                {/*Edit bug modal structure*/}
                {showEditBugModal ? (
                    <>
                        <div
                            className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative lg:w-[40vw] md:w-3/5 w-full lg:my-6 md:my-5 my-4 mx-4 max-w-5xl">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-default outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 className="text-2xl text-orange-500 font-semibold uppercase">
                                            Edit Bug
                                        </h3>
                                    </div>
                                    <div className="relative p-6 flex-auto">
                                        <Input
                                            element="input"
                                            placeholder="Enter A Bug"
                                            elementTitle="bugEditText"
                                            type="text"
                                            validators={[VALIDATOR_REQUIRE()]}
                                            errorText="Please enter bug text."
                                            styleClass="w-full h-10 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-2 pr-12 text-gray-700 text-sm shadow-sm mb-4"
                                            onInput={inputHandler}
                                            initialValue={editBugText}
                                            initialValidity={true}
                                        />

                                        <div className="flex items-center justify-end gap-4">
                                            <button
                                                className="text-red-500 bg-[#1f2937] hover:bg-red-500 hover:text-white-light rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => setShowEditBugModal(false)}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                className="modal-close waves-effect btn-flat bg-[#1f2937] hover:bg-orange-500 rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                disabled={!formState.isValid}
                                                onClick={editBugHandler}
                                            >
                                                Edit Bug
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
                    {(isMemberOfThisProject || isCreatedByUser) && (
                        //Add bug button of add bug modal
                        <button
                            type="button"
                            onClick={() => setShowAddNewBugModal(true)}
                            className="flex items-center justify-center gap-4 w-52 h-10 bg-default hover:bg-orange-500 text-white-light rounded-2xl px-4 py-2"
                        >
                            <i className="fas fa-plus-circle" />
                            ADD BUG
                        </button>
                    )}

                    {bugs?.length === 0 && <h5 className="center-align">Great News, no bug in this project yet!!</h5>}
                    {hasNotFixedBug && <h5 className="text-2xl text-orange-500">Not Fixed Bug List</h5>}
                    <div className="flex flex-col gap-8">
                        {bugs && bugs?.map(bug => (
                            <NotFixedBugRow
                                key={bug._id}
                                bug={bug}
                                projectId={projectId}
                                handleClickOnEdit={handleClickOnEdit}
                            />
                        ))
                        }
                    </div>
                    {hasFixedBug && <h5 className="text-2xl text-orange-500">Fixed Bug List</h5>}
                    <div className="flex flex-col gap-8">
                        {bugs && bugs?.map(bug => (
                            <FixedBugRow
                                key={bug._id}
                                bug={bug}
                                projectId={projectId}
                            />
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
