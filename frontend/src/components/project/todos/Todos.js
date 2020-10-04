import React, { useState } from 'react';
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import { addTodo, editTodo } from "../../../actions/project-action";
import { useHttpClient } from "../../../hooks/http-hook";
import { useForm } from "../../../hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../../utils/validators";
import Input from "../../shared/FormElements/Input";
import IncompleteTodoRow from "./IncompleteTodoRow";
import CompletedTodoRow from "./CompletedTodoRow";
import M from "materialize-css";

const Todos = ({ addTodo, project, editTodo, isMemberOfThisProject, isCreatedByUser }) => {
    const { sendRequest } = useHttpClient();
    const projectId = useParams().projectId;
    const [ editTodoText, setEditTodoText ] = useState('');
    const [ todoId, setTodoId ] = useState();

    const [ formState, inputHandler, setFormData ] = useForm(
        {
            todoText: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const setAddTodoData = async () => {
        await setFormData(
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

    const addTodoHandler = async (event) => {
        event.preventDefault();
        try {
            await addTodo(formState.inputs.todoText.value, projectId, sendRequest);
        } catch (error) {
            console.log(error);
        }
        await setAddTodoData();
    }

    const editTodoHandler = async (event) => {
        await editTodo(project._id, todoId, formState.inputs.todoEditText.value, sendRequest);
        await setAddTodoData();
    }

    const setEditTodoData = async (todoText) => {
        await setEditTodoText(todoText);
        await setFormData(
            {
                todoEditText: {
                    value: todoText,
                    isValid: true
                }
            },
            true
        )
    }

    const handleClickOnEdit = async (todoId, todoText) => {
        await setEditTodoData(todoText);
        await setTodoId(todoId);
        document.getElementById("todoEditText").value = todoText;
        let Modalelem = document.querySelector('#edit-todo-modal');
        let instance = M.Modal.init(Modalelem);
        document.getElementById("todoEditText").value = todoText;
        instance.open();
    }

    return (
        <div className="row todos">

            {/*Add todo modal trigger button */}
            {(isMemberOfThisProject || isCreatedByUser) && (
                <button data-target="add-todo-modal" className="light-blue lighten-1 modal-trigger add-btn">
                    <i className="fas fa-plus-circle"/>      ADD NEW TODO
                </button>
            )}

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
                </div>
                <div className="modal-footer">
                    <button disabled={!formState.isValid} onClick={addTodoHandler} className="modal-close waves-effect waves-green btn-flat">Add New Todos</button>
                </div>
            </div>

            {/*Edit todo modal structure*/}
            <div id="edit-todo-modal" className="modal">
                <div className="modal-content">
                    <h5>Edit Bug</h5>
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
                            disabled={!formState.isValid}  className="modal-close btn-flat">Edit Todos</button>
                </div>
            </div>

            <h5>Incomplete ToDo List</h5>
            <div>
                {project && project.todos && project?.todos.map(todo => (
                    <IncompleteTodoRow key={todo._id} todo={todo} projectId={projectId} handleClickOnEdit={handleClickOnEdit}/>
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
        </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project,
    isMemberOfThisProject: state.project.isMemberOfThisProject,
    isCreatedByUser: state.project.isCreatedByUser

});

export default connect(mapStateToProps, { addTodo, editTodo })(Todos);
