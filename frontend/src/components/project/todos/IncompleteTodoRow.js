import React from 'react';
import { connect } from 'react-redux';

import {toggleIsDone, deleteTodo} from "../../../actions/project-action";
import {useHttpClient} from "../../../hooks/http-hook";

const IncompleteTodoRow = ({ todo, projectId, toggleIsDone, username, deleteTodo, handleClickOnEdit }) => {
    const { sendRequest } = useHttpClient();
    let clicked = false;

    const handleTodoDone = async () => {
        if(!clicked) {
            await toggleIsDone(projectId, todo._id, 'true', sendRequest);
        }
        clicked = false;
    }

    const handleEdit = () => {
        clicked = true;
        handleClickOnEdit(todo._id, todo.text);
    }

    const handleDelete = async () => {
        clicked = true;
        await deleteTodo(projectId, todo._id, sendRequest);
    }

    return (
        <>
             {!todo.done && (
             <div className="white col s12 incomplete-todo showEditDeleteOnHover" onClick={handleTodoDone}>
                     <p className="incomplete-todo__text">{todo.text}</p>
                     <img
                         src={todo.user?.profileImage?.imageUrl}
                         alt=" "
                        className="avatar "
                     />
                 {username && (username === todo.user.username) && (
                     <>
                         <p className="edit" onClick={handleEdit}>Edit</p>
                         <p className="delete" onClick={handleDelete}>Delete</p>
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
