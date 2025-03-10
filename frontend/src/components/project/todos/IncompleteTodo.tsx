import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';

import { toggleIsDone, deleteTodo } from "../../../redux/thunks/project-thunks";
import { useHttpClient } from "../../../hooks/http-hook";
import SubInCompleteTodoRow from "./SubInCompleteTodo";
import {TTodo} from "../../../redux/slices/project-slice";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";

type TIncompleteTodoProps = {
    todo: TTodo,
    projectId: string,
    handleClickOnEdit: (todoId: string, text: string) => void,
    handleClickOnAddSubTodo: (todoId: string) => void,
    handleClickOnEditSubTodo: (todoId: string, subTodoId: string, text: string) => void,
}

const IncompleteTodo = ({ todo, projectId,
                               handleClickOnEdit, handleClickOnAddSubTodo, handleClickOnEditSubTodo }: TIncompleteTodoProps) => {
    const { sendRequest } = useHttpClient();
    const dispatch = useAppDispatch();
    const authSlice = useAppSelector(state => state.auth);

    const username = authSlice?.user?.username;

    const [ isMobile, setIsMobile ] = useState(false);
    let clicked = false; //is clicked on edit or delete

    const handleTodoDone = () => {
        if(!clicked) {
            dispatch(toggleIsDone({
                projectId: projectId,
                todoId: todo._id,
                isDone: 'true',
                method: sendRequest
            }));
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
            dispatch(deleteTodo({
                projectId: projectId,
                todoId: todo._id,
                method: sendRequest
            }));
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
                 <div
                     onClick={handleTodoDone}
                     className={`bg-default flex lg:flex-row md:flex-row flex-col items-center justify-between lg:gap-8 md:gap-6 gap-4 lg:p-8 md:p-6 p-4 lg:rounded-2xl md:rounded-xl rounded-lg cursor-pointer ${isMobile ? '' : 'showElementOnHover'}`}
                     id="discussion-row"
                 >
                     <div className="lg:w-2/12 md:w-3/12 w-full flex lg:justify-start md:justify-start justify-center">
                         <img
                             src={todo.user?.profileImage?.imageUrl}
                             alt=""
                             className="w-40 h-32 rounded-full object-cover"
                         />
                     </div>
                     <div className="group lg:w-10/12 md:w-9/12 w-full">
                         <p className="text-justify">{todo.text}</p>
                         <div className="lg:mt-6 md:mt-4 mt-2 flex lg:flex-row md:flex-row flex-col-reverse items-center justify-between gap-4">
                             {/*If current user add this bug then edit and delete will be appeared while hover*/}
                             {username && (username === todo.user.username) && (
                                 <div className="flex items-center gap-4">
                                     <button
                                         id='edit'
                                         className="flex items-center justify-center gap-3 w-36 h-8 bg-[#1f2937] hover:bg-orange-500 text-white-light font-semibold rounded-2xl"
                                         onClick={handleAddSubTodo}
                                     >
                                         Add Sub Todo
                                     </button>

                                     <button
                                         id='edit'
                                         className="flex items-center justify-center gap-3 w-20 h-8 bg-[#1f2937] hover:bg-orange-500 text-white-light font-semibold rounded-2xl"
                                         onClick={handleEdit}
                                     >
                                         Edit
                                     </button>

                                     <button
                                         id='delete'
                                         className="flex items-center justify-center gap-3 w-20 h-8 bg-[#1f2937] hover:bg-red-500 text-white-light font-semibold rounded-2xl"
                                         onClick={handleDelete}
                                     >
                                         Delete
                                     </button>
                                 </div>
                             )}
                         </div>
                     </div>
                 </div>

                 {/*Sub Todo*/}
                 {todo?.subTodos && todo?.subTodos?.length > 0 && todo?.subTodos?.map(subTodo => (
                     <SubInCompleteTodoRow projectId={projectId} todoId={todo?._id} subTodo={subTodo} key={subTodo?._id}
                                           handleClickOnEditSubTodo={handleClickOnEditSubTodo}
                     />
                 ))}
             </>
             )}
        </>
    )
}

export default IncompleteTodo;
