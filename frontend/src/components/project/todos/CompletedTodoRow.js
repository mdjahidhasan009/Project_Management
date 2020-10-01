import React from 'react';
import {connect} from 'react-redux';
import { toggleIsDone } from "../../../actions/project-action";

import './CompletedTodoRow.css';
import {useHttpClient} from "../../../hooks/http-hook";

const CompletedTodoRow = ({ todo, projectId, toggleIsDone }) => {
    const { isLoading, error, sendRequest , clearError} = useHttpClient();

    const handleTodoDone = async () => {
        await toggleIsDone(projectId, todo._id, 'false', sendRequest);
    }
    return (
        <>
             {todo.done && (
             <div className="white col s12 completed_todo_row" onClick={handleTodoDone}>
                     <p className="completed_todo">{todo.text}</p>
                     <img
                         src={todo.user?.profileImage?.imageUrl}
                         alt=" "
                        className="avatar "
                     />
             </div>
             )}
        </>
    )
}

export default connect(null, { toggleIsDone })(CompletedTodoRow);
