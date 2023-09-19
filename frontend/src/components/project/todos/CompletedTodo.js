import React from 'react';
import { connect } from 'react-redux';

import { toggleIsDone } from "../../../actions/project-action";
import {useHttpClient} from "../../../hooks/http-hook";

const CompletedTodo = ({ todo, projectId, toggleIsDone }) => {
    const { sendRequest } = useHttpClient();

    const handleToggleIsDone = () => {
        toggleIsDone(projectId, todo?._id, 'false', sendRequest);
    }
    return (
        <>
             {todo?.done && (
             <>
                 <div className="bg-default flex items-center justify-between gap-8 p-8 rounded-2xl cursor-pointer" onClick={handleToggleIsDone}>
                     <p className="w-9/12">{todo?.text}</p>
                     <div className="lg:w-2/12 md:w-3/12 w-full flex lg:justify-start md:justify-start justify-center">
                         <img
                             src={todo?.user?.profileImage?.imageUrl}
                             alt=""
                             className="w-40 h-32 rounded-full object-cover"
                         />
                     </div>
                 </div>

                 {todo?.subTodos?.length > 0 && todo?.subTodos.map(subTodo => (
                     <div className="bg-default flex items-center justify-between gap-8 p-8 rounded-2xl" onClick={handleToggleIsDone}>
                         <p className="w-9/12">{subTodo?.text}</p>
                         <div className="lg:w-2/12 md:w-3/12 w-full flex lg:justify-start md:justify-start justify-center">
                             <img
                                 src={subTodo?.user?.profileImage?.imageUrl}
                                 alt=""
                                 className="w-40 h-32 rounded-full object-cover"
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
