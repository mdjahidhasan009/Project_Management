import React from 'react';
import { connect } from 'react-redux';

import { toggleIsDone } from "../../../actions/project-action";
import {useHttpClient} from "../../../hooks/http-hook";

const CompletedTodoRow = ({ todo, projectId, toggleIsDone }) => {
    const { sendRequest } = useHttpClient();

    const handleToggleIsDone = async () => {
        await toggleIsDone(projectId, todo._id, 'false', sendRequest);
    }
    return (
        <>
             {todo.done && (
             <div className="white col s12 completed-todo" onClick={handleToggleIsDone}>
                     <p className="completed-todo__text">{todo.text}</p>
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
