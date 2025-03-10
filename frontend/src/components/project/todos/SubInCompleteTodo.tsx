import React, { useEffect, useState } from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';

import { deleteSubTodo, toggleSubTodoIsDone } from "../../../redux/thunks/project-thunks";
import { useHttpClient } from "../../../hooks/http-hook";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";

type TSubInCompleteTodoProps = {
    subTodo: any,
    projectId: string,
    todoId: string,
    handleClickOnEditSubTodo: (todoId: string, subTodoId: string, text: string) => void,
}

const SubInCompleteTodo = ({ subTodo, projectId, todoId,
                                handleClickOnEditSubTodo }: TSubInCompleteTodoProps) => {
    const { sendRequest } = useHttpClient();
    const authSlice = useAppSelector(state => state.auth);

    const username = authSlice?.user?.username;
    const dispatch = useAppDispatch();
    // const [ isMobile, setIsMobile ] = useState(false);
    let clicked = false; //is clicked on edit or delete

    const handleSubTodoDone = () => {
        let isDone = 'true';
        if(subTodo.done) isDone = 'false';
        if(!clicked) {
            dispatch(toggleSubTodoIsDone({
                projectId: projectId,
                todoId: todoId,
                subTodoId: subTodo._id,
                isDone: isDone,
                method: sendRequest
            }));
        }
        clicked = false;
    }

    const handleEdit = () => {
        clicked = true;
        handleClickOnEditSubTodo(todoId, subTodo._id, subTodo.text);
    }

    const handleDelete = () => {
        clicked = true;
        if(window.confirm('Do you want to delete this sub todo?')) {
            dispatch(deleteSubTodo({
                projectId: projectId,
                todoId: todoId,
                subTodoId: subTodo._id,
                method: sendRequest
            }));
      }
    }

    // useEffect(() => {
    //     if (/Mobi/.test(navigator.userAgent))
    //         setIsMobile(true);
    // }, [])

  return (
      <>
        {/*Sub Todo*/}
          <div
              onClick={handleSubTodoDone}
              key={subTodo._id}
              className="bg-default flex lg:flex-row md:flex-row flex-col items-center justify-between lg:gap-6 md:gap-4 gap-2 lg:p-6 md:p-4 p-2 lg:rounded-2xl md:rounded-xl rounded-lg cursor-pointer"
          >
              <div className="lg:w-2/12 md:w-3/12 w-full flex lg:justify-start md:justify-start justify-center">
                  <img
                      src={subTodo.user?.profileImage?.imageUrl}
                      alt=""
                      className="w-40 h-32 rounded-full object-cover"
                  />
              </div>
              <div className="group lg:w-10/12 md:w-9/12 w-full">
                  <p className="text-justify">{subTodo.text}</p>
                  <div className="lg:mt-6 md:mt-4 mt-2 flex lg:flex-row md:flex-row flex-col-reverse items-center justify-between gap-4">
                      {/*If current user add this bug then edit and delete will be appeared while hover*/}
                      {username && (username === subTodo.user.username) && (
                          <div className="flex items-center gap-4">
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
      </>
  )
}


export default SubInCompleteTodo;
