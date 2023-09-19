import React, {useEffect, useState} from 'react';
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import {addTodo, editTodo, addSubTodo, editSubTodo, addTodoToJunior} from "../../../actions/project-action";
import { useHttpClient } from "../../../hooks/http-hook";
import { useForm } from "../../../hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../../utils/validators";
import Input from "../../shared/FormElements/Input";
import IncompleteTodoRow from "./IncompleteTodo";
import CompletedTodoRow from "./CompletedTodo";
import M from "materialize-css";
import { initAllModal, initModalAndOpen } from "../../../utils/helper";

const Todos = ({ addTodo, addSubTodo, addTodoToJunior, project, todos, editTodo, editSubTodo, isMemberOfThisProject, isCreatedByUser, isAuthenticated, currentUser }) => {
    const { sendRequest } = useHttpClient();
    const projectId = useParams().projectId;
    const [ editTodoText, setEditTodoText ] = useState('');
    const [ subTodoEditText, setSubTodoEditText ] = useState('');
    const [ todoId, setTodoId ] = useState();
    const [ subTodoId, setSubTodoId ] = useState();
    const [ assignMember, setAssignMember ] = useState('');
    const [ juniorMembers, setJuniorMembers ] = useState([]);
    const [ hasCompletedTodos, setHasCompletedTodos ] = useState(false);
    const [ hasUncompletedTodos, setHasUncompletedTodos] = useState(false);
    const [showAddToDoModal, setShowAddToDoModal] = useState(false);
    const [showAddSubToDoModal, setShowAddSubToDoModal] = useState(false);
    const [showEditToDoModal, setShowEditToDoModal] = useState(false);
    const [showEditSubToDoModal, setShowEditSubToDoModal] = useState(false);
    const [selectOptions, setSelectOptions] = useState([]);

    const [ formState, inputHandler, setFormData ] = useForm(
        {
            todoText: {
                value: '',
                isValid: false
            }
        },
        false
    );

    //initialization:(set todoText='' and validation=false)
    const initAddTodoData = async () => {
        await setFormData(
            {
                todoText: {
                    value: '',
                    isValid: false
                }
            },
            false
        );
    }

    const setEditTodoData = (todoText) => {
        // await initAddTodoData();
        setEditTodoText(todoText);
        setFormData(
            {
                todoEditText: {
                    value: todoText,
                    isValid: true
                }
            },
            true
        )
    }

    const addTodoHandler = async (event) => {
        event.preventDefault();
        if(!assignMember) await addTodo(formState.inputs.todoText.value, projectId, sendRequest);
        else await addTodoToJunior(formState.inputs.todoText.value, projectId, assignMember, sendRequest);
        await initAddTodoData();
        await setAssignMember("");
        await prepareJuniorMemberList();

        setShowAddToDoModal(false);
    }

    const handleOnClickEditTodo = async (todoId, todoText) => {
        await setEditTodoData(todoText);
        await setTodoId(todoId);

        setShowEditToDoModal(true);
    }

    const editTodoHandler = async (event) => {
        await editTodo(project._id, todoId, formState.inputs.todoEditText.value, sendRequest);
        await initAddTodoData();

        setShowEditToDoModal(false);
    }

    const initSubTodoData = async () => {
        await initAddTodoData();
        await setFormData(
            {
                subTodoText: {
                    value: '',
                    isValid: false
                }
            },
            false
        )

        setShowAddSubToDoModal(true);
    };

    const setEditSubTodoData = (subTodoText) => {
        setSubTodoEditText(subTodoText);
        setFormData(
            {
                subTodoText: {
                    value: subTodoText,
                    isValid: true
                }
            },
            true
        )
    }

    const addSubTodoHandler = async (event) => {
        event.preventDefault();
        await addSubTodo(formState.inputs.subTodoText.value, projectId, todoId, sendRequest);
        await initAddTodoData();

        setShowAddSubToDoModal(false);
    }

    const editSubTodoHandler = async (event) => {
        await editSubTodo(project._id, todoId, subTodoId, formState.inputs.subTodoEditText.value, sendRequest);
        await initAddTodoData();
        await initSubTodoData();

        setShowEditSubToDoModal(true);
    }

    const handleOnClickEditSubTodo = async (todoId, subTodoId, subTodoText) => {
        await setEditSubTodoData(subTodoText);
        await setTodoId(todoId);
        await setSubTodoId(subTodoId);

        setShowEditSubToDoModal(true);
    }

    const handleOnClickAddSubTodo = async (todoId) => {
        await initSubTodoData();
        await setTodoId(todoId);
    }

    const prepareJuniorMemberList = () => {
        const newSelectOptions = [];

        if (project?.members) {
            project?.members?.forEach((member) => {
                if (parseInt(currentUser?.role) <= member?.user?.role && currentUser?.username !== member?.user?.username) {
                    newSelectOptions.push({
                        value: member?.user?.username,
                        text: member?.user?.username,
                    });
                }
            });

            setSelectOptions(newSelectOptions);
        }
    };


    const doesHaveCompletedOrUncompletedTodos = () => {
        let flagHasCompletedTodo = false, flagHasUncompletedTodo = false;
        todos && todos.map(item => {
            if(!flagHasCompletedTodo && item.done) flagHasCompletedTodo = true;
            if(!flagHasUncompletedTodo && !item.done) flagHasUncompletedTodo = true;
        })
        setHasUncompletedTodos(flagHasUncompletedTodo);
        setHasCompletedTodos(flagHasCompletedTodo);
    }

    useEffect(() => {
        doesHaveCompletedOrUncompletedTodos();
    }, [todos]);

    useEffect(() => {
        //as there are three modal all those elements todoText, subTodoText, todoTextEdit all are got added in formState
        //which cause always false for overall form validation at start
        prepareJuniorMemberList();
        initAddTodoData();
        initAllModal();
        // eslint-disable-next-line
    }, [project?.members, currentUser])

    return (
        <div className="bg-[#1f2937] p-8 rounded-2xl flex flex-col">

            {/*Add todo modal structure*/}
            {showAddToDoModal ? (
                <>
                    <div
                        className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-[40vw] my-6 mx-auto max-w-5xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-default outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-2xl text-orange-500 font-semibold uppercase">
                                        Add New Todos
                                    </h3>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    <Input
                                        element="input"
                                        placeholder="Enter A Todos"
                                        elementTitle="todoText"
                                        type="text"
                                        validators={[VALIDATOR_REQUIRE()]}
                                        errorText="Please enter todo text."
                                        styleClass="w-96 h-10 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-2 pr-12 text-gray-700 text-sm shadow-sm mb-4"
                                        onInput={inputHandler}
                                    />

                                    <select
                                        className="w-96 h-10 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-2 pr-12 text-gray-700 text-sm shadow-sm"
                                        id="member_list"
                                        value={assignMember}
                                        onChange={(e) => setAssignMember(e.target.value)}
                                    >
                                        <option value="">Select one member</option>
                                        {selectOptions.map((option, index) => (
                                            <option key={index} value={option.value}>
                                                {option.text}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="flex items-center justify-end gap-4 mt-6">
                                        <button
                                            className="text-red-500 bg-[#1f2937] hover:bg-red-500 hover:text-white-light rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowAddToDoModal(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="modal-close waves-effect btn-flat bg-[#1f2937] hover:bg-orange-500 rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            disabled={!formState.isValid}
                                            onClick={addTodoHandler}
                                        >
                                            Add Todos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            {/*Add sub todo modal structure*/}
            {showAddSubToDoModal ? (
                <>
                    <div
                        className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-[40vw] my-6 mx-auto max-w-5xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-default outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-2xl text-orange-500 font-semibold uppercase">
                                        Add Sub Todos
                                    </h3>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    <Input
                                        element="input"
                                        placeholder="Enter Sub Todos Text"
                                        elementTitle="subTodoText"
                                        type="text"
                                        validators={[VALIDATOR_REQUIRE()]}
                                        errorText="Please enter sub todo text."
                                        styleClass="w-96 h-10 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-2 pr-12 text-gray-700 text-sm shadow-sm"
                                        onInput={inputHandler}
                                    />

                                    <div className="flex items-center justify-end gap-4 mt-6">
                                        <button
                                            className="text-red-500 bg-[#1f2937] hover:bg-red-500 hover:text-white-light rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowAddSubToDoModal(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="modal-close waves-effect btn-flat bg-[#1f2937] hover:bg-orange-500 rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            disabled={!formState.isValid}
                                            onClick={addSubTodoHandler}
                                        >
                                            Add Sub Todos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            {/*Edit todo modal structure*/}
            {showEditToDoModal ? (
                <>
                    <div
                        className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-[40vw] my-6 mx-auto max-w-5xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-default outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-2xl text-orange-500 font-semibold uppercase">
                                        Edit Todos
                                    </h3>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    <Input
                                        element="input"
                                        placeholder="Enter A Todos"
                                        elementTitle="todoEditText"
                                        type="text"
                                        validators={[VALIDATOR_REQUIRE()]}
                                        errorText="Please enter todo text."
                                        styleClass="w-96 h-10 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-2 pr-12 text-gray-700 text-sm shadow-sm"
                                        onInput={inputHandler}
                                        initialValue={editTodoText}
                                        initialValidity={true}
                                    />

                                    <div className="flex items-center justify-end gap-4 mt-6">
                                        <button
                                            className="text-red-500 bg-[#1f2937] hover:bg-red-500 hover:text-white-light rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowEditToDoModal(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="modal-close waves-effect btn-flat bg-[#1f2937] hover:bg-orange-500 rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            disabled={!formState.isValid}
                                            onClick={editTodoHandler}
                                        >
                                            Edit Todos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            {/*Edit todo modal structure*/}
            {showEditSubToDoModal ? (
                <>
                    <div
                        className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-[40vw] my-6 mx-auto max-w-5xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-default outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-2xl text-orange-500 font-semibold uppercase">
                                        Edit Sub Todo
                                    </h3>
                                </div>
                                <div className="relative p-6 flex-auto">
                                    <Input
                                        element="input"
                                        placeholder="Enter A Sub Todos"
                                        elementTitle="subTodoEditText"
                                        type="text"
                                        validators={[VALIDATOR_REQUIRE()]}
                                        errorText="Please enter sub todo text."
                                        styleClass="w-96 h-10 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-2 pr-12 text-gray-700 text-sm shadow-sm"
                                        onInput={inputHandler}
                                        initialValue={subTodoEditText}
                                        initialValidity={true}
                                    />

                                    <div className="flex items-center justify-end gap-4 mt-6">
                                        <button
                                            className="text-red-500 bg-[#1f2937] hover:bg-red-500 hover:text-white-light rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowEditSubToDoModal(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="modal-close waves-effect btn-flat bg-[#1f2937] hover:bg-orange-500 rounded-[4px] font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            disabled={!formState.isValid}
                                            onClick={editSubTodoHandler}
                                        >
                                            Edit Sub Todos
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            {isAuthenticated && (
                <>
                    {/*Add todo modal trigger button */}
                    {(isMemberOfThisProject || isCreatedByUser) && (
                        <button
                            type="button"
                            onClick={() => setShowAddToDoModal(true)}
                            className="flex items-center justify-center gap-4 w-52 h-10 bg-default hover:bg-orange-500 text-white-light rounded-2xl px-4 py-2"
                        >
                            <i className="fas fa-plus-circle" />
                            ADD TODO
                        </button>
                    )}

                    {project?.todos?.length === 0 && <h5 className="center-align">No Todo added yet!!</h5>}

                    {hasUncompletedTodos && <h5 className="text-2xl text-orange-500 mt-16 mb-8">Incomplete Todos</h5>}

                    <div className="flex flex-col gap-8">
                        {todos && todos?.map(todo => (
                            <IncompleteTodoRow key={todo._id} todo={todo} projectId={projectId}
                                handleClickOnAddSubTodo={handleOnClickAddSubTodo}
                                handleClickOnEdit={handleOnClickEditTodo}
                                handleClickOnEditSubTodo={handleOnClickEditSubTodo}
                            />
                        ))
                        }
                    </div>

                    {hasCompletedTodos && <h5 className="text-2xl text-orange-500 mt-16 mb-8">Completed Todos</h5>}
                    <div className="flex flex-col gap-8">
                        {todos && todos?.map(todo => (
                            <CompletedTodoRow key={todo._id} todo={todo} projectId={projectId}/>
                            ))
                        }
                    </div>
                </>
            )}
        </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project,
    todos: state.project?.project?.todos,
    isMemberOfThisProject: state.project.isMemberOfThisProject,
    isCreatedByUser: state.project.isCreatedByUser,
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth?.user
});

export default connect(mapStateToProps, { addTodo, editTodo, editSubTodo, addSubTodo, addTodoToJunior })(Todos);
