import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import {toggleIsDone, deleteTodo, toggleSubTodoIsDone} from "../../../actions/project-action";
import { useHttpClient } from "../../../hooks/http-hook";
import SubInCompleteTodoRow from "./SubInCompleteTodoRow";

const IncompleteTodoRow = ({ todo, projectId, toggleIsDone, toggleSubTodoIsDone, username, deleteTodo,
                               handleClickOnEdit, handleClickOnAddSubTodo, handleClickOnEditSubTodo }) => {
    const { sendRequest } = useHttpClient();
    const [ isMobile, setIsMobile ] = useState(false);
    let clicked = false; //is clicked on edit or delete

    const handleTodoDone = async () => {
        if(!clicked) {
            await toggleIsDone(projectId, todo._id, 'true', sendRequest);
        }
        clicked = false;
    }

    const handleSubTodoDone = async (subTodoId) => {
        if(!clicked) await toggleSubTodoIsDone(projectId, todo._id, subTodoId, 'true', sendRequest);
        clicked = false;
    }

    const handleEdit = () => {
        clicked = true;
        handleClickOnEdit(todo._id, todo.text);
    }

    const handleAddSubTodo = () => {
        clicked = true;
        handleClickOnAddSubTodo(todo._id);
    }

    const handleDelete = async () => {
        clicked = true;
        if(window.confirm('Do you want to delete this todo?')) {
            await deleteTodo(projectId, todo._id, sendRequest);
        }
    }

    useEffect(() => {
        if (/Mobi/.test(navigator.userAgent))
            setIsMobile(true);
    }, [])

    return (
        <>
             {!todo.done && (
             <>
                 <div className={`white col s12 incomplete-todo ${isMobile ? '' : 'showElementOnHover'}`}
                      onClick={handleTodoDone}
                 >
                     <p className="incomplete-todo__text">{todo.text}</p>
                     <img
                         src={todo.user?.profileImage?.imageUrl}
                         alt=" "
                         className="avatar "
                     />
                     {username && (username === todo.user.username) && (
                         <>
                             <p className={`edit ${isMobile ? 'showEdit' : ''}`} onClick={handleEdit}>Edit</p>
                             <p className={`edit ${isMobile ? 'showEdit' : ''}`} onClick={handleAddSubTodo}>Add SubTodo</p>
                             <p className={`delete ${isMobile ? 'showDelete' : ''}`}
                                onClick={handleDelete}
                             >Delete</p>
                         </>
                     )}
                 </div>

                 {/*Sub Todo*/}
                 {todo?.subTodos.length > 0 && todo.subTodos.map(subTodo => (
                     <SubInCompleteTodoRow projectId={projectId} todoId={todo._id} subTodo={subTodo} key={subTodo._id}
                         handleClickOnEditSubTodo={handleClickOnEditSubTodo}
                     />
                 ))}
             </>
             )}
        </>
    )
}

const mapStateToProps = state => ({
    username: state.auth?.user?.username
})

export default connect(mapStateToProps, { toggleIsDone, toggleSubTodoIsDone, deleteTodo })(IncompleteTodoRow);
