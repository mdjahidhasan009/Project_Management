import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { toggleIsDone, deleteTodo } from "../../../actions/project-action";
import { useHttpClient } from "../../../hooks/http-hook";

const IncompleteTodoRow = ({ todo, projectId, toggleIsDone, username, deleteTodo, handleClickOnEdit }) => {
    const { sendRequest } = useHttpClient();
    const [ isMobile, setIsMobile ] = useState(false);
    let clicked = false; //is clicked on edit or delete

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
             <div className={`white col s12 incomplete-todo ${isMobile ? '' : 'showEditDeleteOnHover'}`} onClick={handleTodoDone}>
                     <p className="incomplete-todo__text">{todo.text}</p>
                     <img
                         src={todo.user?.profileImage?.imageUrl}
                         alt=" "
                        className="avatar "
                     />
                 {username && (username === todo.user.username) && (
                     <>
                         <p id='edit' className={`edit ${isMobile ? 'showEdit' : ''}`} onClick={handleEdit}>Edit</p>
                         <p id='delete' className={`delete ${isMobile ? 'showDelete' : ''}`} onClick={handleDelete}>Delete</p>
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
