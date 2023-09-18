import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { toggleIsDone, deleteTodo } from "../../../actions/project-action";
import { useHttpClient } from "../../../hooks/http-hook";
import SubInCompleteTodoRow from "./SubInCompleteTodo";

const IncompleteTodo = ({ todo, projectId, toggleIsDone, username, deleteTodo,
                               handleClickOnEdit, handleClickOnAddSubTodo, handleClickOnEditSubTodo }) => {
    const { sendRequest } = useHttpClient();
    const [ isMobile, setIsMobile ] = useState(false);
    let clicked = false; //is clicked on edit or delete

    const handleTodoDone = () => {
        if(!clicked) {
            toggleIsDone(projectId, todo._id, 'true', sendRequest);
        }
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

    const handleDelete = () => {
        clicked = true;
        if(window.confirm('Do you want to delete this todo?')) {
            deleteTodo(projectId, todo._id, sendRequest);
        }
    }

    useEffect(() => {
        if (/Mobi/.test(navigator.userAgent))
            setIsMobile(true);
        // eslint-disable-next-line
    }, [])

    return (
        <>
             {!todo.done && (
             <>
                 <div className={`bg-default flex items-center justify-between gap-8 p-8 rounded-2xl ${isMobile ? '' : 'showElementOnHover'}`}
                      onClick={handleTodoDone}
                 >
                     <p className="w-9/12">{todo.text}</p>
                     <div className="w-1/12">
                         <img
                             src={todo.user?.profileImage?.imageUrl}
                             alt=" "
                             className="w-60 rounded-full object-contain"
                         />
                     </div>
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
                 {todo?.subTodos?.length > 0 && todo?.subTodos?.map(subTodo => (
                     <SubInCompleteTodoRow projectId={projectId} todoId={todo?._id} subTodo={subTodo} key={subTodo?._id}
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

export default connect(mapStateToProps, { toggleIsDone, deleteTodo })(IncompleteTodo);
