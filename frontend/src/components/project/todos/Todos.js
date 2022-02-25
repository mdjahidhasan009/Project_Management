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
        document.getElementById("todoText").value = "";
    }

    const handleOnClickEditTodo = async (todoId, todoText) => {
        await setEditTodoData(todoText);
        await setTodoId(todoId);
        document.getElementById("todoEditText").value = todoText;
        initModalAndOpen('#edit-todo-modal');
    }

    const editTodoHandler = async (event) => {
        await editTodo(project._id, todoId, formState.inputs.todoEditText.value, sendRequest);
        await initAddTodoData();
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
        document.getElementById("subTodoText").value = "";
        setAssignMember("");
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
    }

    const editSubTodoHandler = async (event) => {
        await editSubTodo(project._id, todoId, subTodoId, formState.inputs.subTodoEditText.value, sendRequest);
        await initAddTodoData();
        await initSubTodoData();
    }

    const handleOnClickEditSubTodo = async (todoId, subTodoId, subTodoText) => {
        await setEditSubTodoData(subTodoText);
        await setTodoId(todoId);
        await setSubTodoId(subTodoId);
        document.getElementById("subTodoEditText").value = subTodoText;
        initModalAndOpen("#edit-sub-todo-modal")
    }

    const handleOnClickAddSubTodo = async (todoId) => {
        await initSubTodoData();
        await setTodoId(todoId);
        document.getElementById("subTodoText").value = '';
        initModalAndOpen('#add-sub-todo-modal');
    }

    const prepareJuniorMemberList = () => {
        let selectList = document.getElementById("member_list");
        selectList.innerHTML = `<option selected defaultValue = ''>Select one member</option>`;
        if(project?.members) {
            project.members.map(member => {
                if(parseInt(currentUser.role) <= member.user.role && currentUser.username !== member.user.username) {
                    juniorMembers.push(member.user.username);
                    let selectObject = document.createElement("option");
                    selectObject.text = member.user.username;
                    selectObject.value = member.user.username;
                    selectList.appendChild(selectObject);
                }
            })
            setJuniorMembers([juniorMembers]);
            M.FormSelect.init(selectList);
        }
    }

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
        <div className="row todos">

            {/*Add todo modal structure*/}
            <div id="add-todo-modal" className="modal">
                <div className="modal-content">
                    <h5>Add New Todos</h5>
                    <Input
                        element="input"
                        elementTitle="todoText"
                        type="text"
                        placeholder="Enter A Todos"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter todo text."
                        onInput={inputHandler}
                    />

                    <label>
                        Select an member to assign todo
                        <select id="member_list" value={assignMember} onChange={(e)=> setAssignMember(e.target.value)}>
                            <option selected defaultValue = ''>Select one member</option>
                        </select>
                    </label>

                </div>
                <div className="modal-footer">
                    <button disabled={!formState.isValid} onClick={addTodoHandler}
                            className="modal-close waves-effect btn-flat"
                    >
                        Add New Todos
                    </button>
                </div>
            </div>

            {/*Add sub todo modal structure*/}
            <div id="add-sub-todo-modal" className="modal">
                <div className="modal-content">
                    <h5>Add New Sub Todos</h5>
                    <Input
                        element="input"
                        elementTitle="subTodoText"
                        type="text"
                        placeholder="Enter Sub Todos Text"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter sub todo text."
                        onInput={inputHandler}
                    />
                </div>
                <div className="modal-footer">
                    <button disabled={!formState.isValid} onClick={addSubTodoHandler}
                            className="modal-close waves-effect btn-flat"
                    >
                        Add New Sub Todos
                    </button>
                </div>
            </div>

            {/*Edit todo modal structure*/}
            <div id="edit-todo-modal" className="modal">
                <div className="modal-content">
                    <h5>Edit Todo</h5>
                    <Input
                        element="input"
                        elementTitle="todoEditText"
                        type="text"
                        placeholder="Enter A Todos"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter todo text."
                        onInput={inputHandler}
                        initialValue={editTodoText}
                        initialValidity={true}
                    />
                </div>
                <div className="modal-footer">
                    <button onClick={editTodoHandler}
                        disabled={!formState.isValid}
                        className="modal-close waves-effect waves-light btn-flat"
                    >
                        Edit Todos
                    </button>
                </div>
            </div>

            {/*Edit todo modal structure*/}
            <div id="edit-sub-todo-modal" className="modal">
                <div className="modal-content">
                    <h5>Edit Sub Todo</h5>
                    <Input
                        element="input"
                        elementTitle="subTodoEditText"
                        type="text"
                        placeholder="Enter A Todos"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter sub todo text."
                        onInput={inputHandler}
                        initialValue={subTodoEditText}
                        initialValidity={true}
                    />
                </div>
                <div className="modal-footer">
                    <button onClick={editSubTodoHandler}
                            disabled={!formState.isValid}
                            className="modal-close waves-effect waves-light btn-flat"
                    >
                        Edit Sub Todos
                    </button>
                </div>
            </div>

            {isAuthenticated && (
                <>
                    {/*Add todo modal trigger button */}
                    {(isMemberOfThisProject || isCreatedByUser) && (
                        <button data-target="add-todo-modal" className="light-blue lighten-1 modal-trigger add-btn">
                            <i className="fas fa-plus-circle"/>      ADD NEW TODO
                        </button>
                    )}
                    {project?.todos?.length === 0 && <h5 className="center-align">No Todo added yet!!</h5>}
                    {hasUncompletedTodos && <h5>Incomplete Todos</h5>}
                    <div className="todo__details">
                        {todos && todos.map(todo => (
                            <IncompleteTodoRow key={todo._id} todo={todo} projectId={projectId}
                                handleClickOnEdit={handleOnClickEditTodo}
                                handleClickOnAddSubTodo={handleOnClickAddSubTodo}
                                handleClickOnEditSubTodo={handleOnClickEditSubTodo}
                            />
                        ))
                        }
                    </div>

                    {hasCompletedTodos && <h5>Completed Todos</h5>}
                    <div>
                        {todos && todos.map(todo => (
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
