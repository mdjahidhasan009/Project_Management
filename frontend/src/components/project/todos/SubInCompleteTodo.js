import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { deleteSubTodo, toggleSubTodoIsDone } from "../../../actions/project-action";
import { useHttpClient } from "../../../hooks/http-hook";

const SubInCompleteTodo = ({ subTodo, projectId, todoId, toggleSubTodoIsDone, username, deleteSubTodo,
                                handleClickOnEditSubTodo }) => {
    const { sendRequest } = useHttpClient();
    const [ isMobile, setIsMobile ] = useState(false);
    let clicked = false; //is clicked on edit or delete

    const handleSubTodoDone = () => {
        let isDone = 'true';
        if(subTodo.done) isDone = 'false';
        if(!clicked) toggleSubTodoIsDone(projectId, todoId, subTodo._id, isDone, sendRequest);
        clicked = false;
    }

    const handleEdit = () => {
        clicked = true;
        handleClickOnEditSubTodo(todoId, subTodo._id, subTodo.text);
    }

    const handleDelete = () => {
        clicked = true;
        if(window.confirm('Do you want to delete this sub todo?')) {
            deleteSubTodo(projectId, todoId, subTodo._id, sendRequest);
      }
    }

    useEffect(() => {
        if (/Mobi/.test(navigator.userAgent))
            setIsMobile(true);
    }, [])

  return (
      <>
        {/*Sub Todo*/}
            <div className="subTodo" key={subTodo._id}>
              <div className={`white subTodo col s12 
                   incomplete-todo 
                   ${isMobile ? '' : 'showElementOnHover'}`
              }
                  onClick={handleSubTodoDone}
              >
                <p className={subTodo.done ? "completed-todo__text" : "incomplete-todo__text"}>{subTodo.text}</p>
                <img
                    src={subTodo.user?.profileImage?.imageUrl}
                    alt=" "
                    className="avatar "
                />
                {username && (username === subTodo.user.username) && (
                    <>
                      <p className={`edit ${isMobile ? 'showEdit' : ''}`} onClick={handleEdit}>Edit</p>
                      <p className={`delete ${isMobile ? 'showDelete' : ''}`}
                         onClick={handleDelete}
                      >Delete</p>
                    </>
                )}
              </div>
            </div>
      </>
  )
}

const mapStateToProps = state => ({
  username: state.auth?.user?.username
})

export default connect(mapStateToProps, { toggleSubTodoIsDone, deleteSubTodo })(SubInCompleteTodo);
