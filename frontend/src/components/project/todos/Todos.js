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
import { initModalAndOpen } from "../../../utils/helper";

const Todos = ({ addTodo, addSubTodo, addTodoToJunior, project, editTodo, editSubTodo, isMemberOfThisProject, isCreatedByUser, isAuthenticated, currentUser }) => {
    const { sendRequest } = useHttpClient();
    const projectId = useParams().projectId;
    const [ editTodoText, setEditTodoText ] = useState('');
    const [ subTodoEditText, setSubTodoEditText ] = useState('');
    const [ todoId, setTodoId ] = useState();
    const [ subTodoId, setSubTodoId ] = useState();
    const [ assignMember, setAssignMember ] = useState('');
    const [ juniorMembers, setJuniorMembers ] = useState([]);

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
    const initAddTodoData = () => {
        setFormData(
            {
                todoText: {
                    value: '',
                    isValid: false
                }
            },
            false
        );
        document.getElementById("todoText").value = '';
    }

    const addTodoHandler = (event) => {
        event.preventDefault();
        try {
            if(!assignMember)
                addTodo(formState.inputs.todoText.value, projectId, sendRequest);
            else addTodoToJunior(formState.inputs.todoText.value, projectId, assignMember, sendRequest);
            initAddTodoData();
        } catch (error) {
            console.error(error);
        }
    }

    const addSubTodoHandler = (event) => {
        event.preventDefault();
        try {
            addSubTodo(formState.inputs.subTodoText.value, projectId, todoId, sendRequest);
            initAddTodoData();
        } catch(error) {
            console.error(error);
        }
    }

    const editTodoHandler = (event) => {
        editTodo(project._id, todoId, formState.inputs.todoEditText.value, sendRequest);
        initAddTodoData();
    }

    const editSubTodoHandler = (event) => {
        editSubTodo(project._id, todoId, subTodoId, formState.inputs.subTodoEditText.value, sendRequest);
        initAddTodoData();
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

    const setEditSubTodoData = (subTodoText) => {
        // await initAddTodoData();
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
    };

    const setSubTodoData = async () => {
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
    };

    const handleClickOnEdit = (todoId, todoText) => {
        setEditTodoData(todoText);
        setTodoId(todoId);
        document.getElementById("todoEditText").value = todoText;
        initModalAndOpen('#edit-todo-modal');
    }

    const handleClickOnEditSubTodo = (todoId, subTodoId, subTodoText) => {
        setEditSubTodoData(subTodoText);
        setTodoId(todoId);
        setSubTodoId(subTodoId);
        document.getElementById("subTodoEditText").value = subTodoText;
        initModalAndOpen("#edit-sub-todo-modal")
    }

    const handleClickOnAddSubTodo = (todoId) => {
        setSubTodoData();
        setTodoId(todoId);
        document.getElementById("subTodoText").value = '';
        initModalAndOpen('#add-sub-todo-modal');
    }

    //get selected member username
    const handleSetAddMember = async (event) => {
        await setAssignMember(event.target.value);
    }

    useEffect(() => {
        //as there are three modal all those element todoText, subTodoText, todoTextEdit all are got added in formState
        //which cause always false for overall form validation at start
        initAddTodoData();
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        let selectList = document.getElementById("member_list");
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
    }, [project?.members && currentUser]);

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
                        <select id="member_list" value={assignMember} onChange={handleSetAddMember}>
                            <option selected defaultValue = '' />
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

                    <h5>Incomplete ToDo List</h5>
                    <div className="todo__details">
                        {project && project.todos && project?.todos.map(todo => (
                            <IncompleteTodoRow key={todo._id} todo={todo} projectId={projectId}
                                handleClickOnEdit={handleClickOnEdit}
                                handleClickOnAddSubTodo={handleClickOnAddSubTodo}
                                handleClickOnEditSubTodo={handleClickOnEditSubTodo}
                            />
                        ))
                        }
                    </div>

                    <h5>Completed ToDo List</h5>
                    <div>
                        {project && project.todos && project?.todos.map(todo => (
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
    isMemberOfThisProject: state.project.isMemberOfThisProject,
    isCreatedByUser: state.project.isCreatedByUser,
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth?.user
});

export default connect(mapStateToProps, { addTodo, editTodo, editSubTodo, addSubTodo, addTodoToJunior })(Todos);
