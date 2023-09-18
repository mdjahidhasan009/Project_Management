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
                 <div className="bg-default flex items-center justify-between gap-8 p-8 rounded-2xl" onClick={handleToggleIsDone}>
                         <p className="w-9/12">{todo.text}</p>
                     <div className="w-1/12">
                         <img
                             src={todo.user?.profileImage?.imageUrl}
                             alt=" "
                             className="w-60 rounded-full object-contain"
                         />
                     </div>
                 </div>

                 {todo?.subTodos.length > 0 && todo.subTodos.map(subTodo => (
                     <div className="" key={subTodo._id}>
                         <div className={`bg-default flex items-center justify-between gap-8 p-8 rounded-2xl`}>
                             {/*<p className="incomplete-todo__text">{subTodo.text}</p>*/}
                             <p className={'w-9/12' + subTodo.done
                                 ? "completed-todo__text" : "incomplete-todo__text"}
                             >
                                 {subTodo.text}
                             </p>
                             <div className="w-1/12">
                                 <img
                                     src={subTodo.user?.profileImage?.imageUrl}
                                     alt=" "
                                     className="w-60 rounded-full object-contain"
                                 />
                             </div>
                         </div>
                     </div>
                 ))}
             </>
             )}
        </>
    )
}

export default connect(null, { toggleIsDone })(CompletedTodo);
