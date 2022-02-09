import React from 'react';
import { connect } from 'react-redux';

import { toggleIsDone } from "../../../actions/project-action";
import {useHttpClient} from "../../../hooks/http-hook";

const CompletedTodo = ({ todo, projectId, toggleIsDone }) => {
    const { sendRequest } = useHttpClient();

    const handleToggleIsDone = () => {
        toggleIsDone(projectId, todo._id, 'false', sendRequest);
    }
    return (
        <>
             {todo.done && (
             <>
                 <div className="white col s12 completed-todo" onClick={handleToggleIsDone}>
                         <p className="completed-todo__text">{todo.text}</p>
                         <img
                             src={todo.user?.profileImage?.imageUrl}
                             alt=" "
                            className="avatar "
                         />
                 </div>

                 {todo?.subTodos.length > 0 && todo.subTodos.map(subTodo => (
                     <div className="subTodo" key={subTodo._id}>
                         <div className={`white subTodo col s12 completed-todo`}>
                             {/*<p className="incomplete-todo__text">{subTodo.text}</p>*/}
                             <p className={subTodo.done
                                 ? "completed-todo__text" : "incomplete-todo__text"}
                             >
                                 {subTodo.text}
                             </p>
                             <img
                                 src={subTodo.user?.profileImage?.imageUrl}
                                 alt=" "
                                 className="avatar "
                             />
                         </div>
                     </div>
                 ))}
             </>
             )}
        </>
    )
}

export default connect(null, { toggleIsDone })(CompletedTodo);
