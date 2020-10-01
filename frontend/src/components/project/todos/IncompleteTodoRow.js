import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {toggleIsDone, deleteTodo} from "../../../actions/project-action";

import './IncompleteTodoRow.css';
import {useHttpClient} from "../../../hooks/http-hook";

const IncompleteTodoRow = ({ todo, projectId, toggleIsDone, username, deleteTodo, handleClickOnEdit }) => {
    const { isLoading, error, sendRequest , clearError} = useHttpClient();
    let clicked = false;

    const handleTodoDone = async () => {
        if(!clicked) {
            await toggleIsDone(projectId, todo._id, 'true', sendRequest);
        }
        clicked = false;
    }

    const handleEditClick = () => {
        clicked = true;
        handleClickOnEdit(todo._id, todo.text);
    }

    const handleDeleteClick = async () => {
        clicked = true;
        await deleteTodo(projectId, todo._id, sendRequest);
    }

    return (
        <>
             {!todo.done && (
             <div className="white col s12 incomplete_todo_row" onClick={handleTodoDone}>
                     <p className="incomplete_todo">{todo.text}</p>
                     <img
                         src={todo.user?.profileImage?.imageUrl}
                         alt=" "
                        className="avatar "
                     />
                 {username && (username === todo.user.username) && (
                     <>
                         <p id="edit" onClick={handleEditClick}>Edit</p>
                         <p id="delete" onClick={handleDeleteClick}>Delete</p>
                     </>
                 )}
             </div>
             )}
        </>
    )
}

const mapStateToProps = state => ({
    username: state.auth?.user?.username
})

export default connect(mapStateToProps, { toggleIsDone, deleteTodo })(IncompleteTodoRow);
