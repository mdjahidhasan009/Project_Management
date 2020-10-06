import {
    ADD_PROJECT,
    EDIT_PROJECT,
    GET_PROJECTS,
    GET_PROJECT,
    ADD_DISCUSSION,
    ADD_TODO,
    ADD_BUG,
    UPDATE_TODO,
    UPDATE_BUG,
    ADD_NOT_ASSIGNED_MEMBER,
    ADD_MEMBER_AT_PROJECT,
    ACTIVITY_PREPARED,
    ADD_WORK_PREVIEW,
    ADD_IS_MEMBER_AND_CREATOR,
    DELETE_BUG,
    DELETE_TODO,
    DELETE_MEMBER_FROM_PROJECT,
    PREPARE_DATA_FOR_DASHBOARD,
    UPDATE_DISCUSSION,
    DELETE_DISCUSSION
} from "./types";
import M from "materialize-css";

//Add new project
export const addProject = (projectName, projectCategory, projectDescription,projectDeadline, method) => async dispatch =>{
    try {
         const responseData = await method(
             process.env.REACT_APP_ASSET_URL +'/api/project',
             'POST',
             JSON.stringify({
                 name: projectName,
                 category: projectCategory,
                 description: projectDescription,
                 deadline: projectDeadline
             }),
             {
                 'Content-Type': 'application/json',
                 Authorization: 'Bearer ' + localStorage.token
             }
         )
        M.toast({html: 'New Project Added', classes: 'green'});
        dispatch({
            type: ADD_PROJECT,
            payload: responseData
        })
    } catch(error) {
        console.error(error);
    }
}

//Edit project EditProjectDetails(name, edit-project-details, category, deadline)
export const editProjectDetails = (projectName, projectDetails, projectCategory, projectDeadline, projectId, method) => async dispatch => {
    try{
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/' + projectId,
            'PUT',
            JSON.stringify({
                name: projectName,
                category: projectCategory,
                description: projectDetails,
                deadline: projectDeadline
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }

        );
        M.toast({html: 'Project Details Updated', classes: 'green'});
    } catch (error) {
        console.error(error);
    }
}


//Toggle is project done or not
export const toggleIsProjectIsFinished = (isDone, projectId, method) => async dispatch => {
    try {
        await method(
            process.env.REACT_APP_ASSET_URL + '/api/project/isDone/' + projectId,
            'PUT',
            JSON.stringify({
                isDone
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'Project Updated', classes: 'green'});
    } catch (error) {
        console.error(error);
    }
}

//Delete an project
export const deleteProject = (projectId, method) => async dispatch => {
    try {
        await method(
            process.env.REACT_APP_ASSET_URL + '/api/project/' + projectId,
            'DELETE',
            null,
            {
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'Project Deleted', classes: 'green'});
    } catch (error) {
        console.error(error);
    }
}

//Get all projects
export const getAllProjects = (method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project',
            'GET',
            null,
            {
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        dispatch({
            type: GET_PROJECTS,
            payload: responseData
        });
    } catch (error) {
        console.error(error);
    }
}

//Add a discussion in a project
export const addDiscussion = (discussionText, projectId ,method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/discussion/' + projectId,
            'POST',
            JSON.stringify({
                discussion: discussionText
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'New Discussion Added', classes: 'green'});
        dispatch({
            type: ADD_DISCUSSION,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Edit an discussion
export const editDiscussion = (projectId, discussionId, discussionEditText, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/discussion/' + projectId + '/' + discussionId,
            'PUT',
            JSON.stringify({
                discussionEditText
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'Discussion Updated', classes: 'green'});
        dispatch({
            type: UPDATE_DISCUSSION,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Delete a discussion from a project
export const deleteDiscussion = (projectId, discussionId, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/discussion/' + projectId + '/' + discussionId,
            'DELETE',
            null,
            {
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'Discussion Deleted Successfully', classes: 'green'});
        dispatch({
            type: DELETE_DISCUSSION,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Add a todo in a project
export const addTodo = (todoText, projectId ,method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/todos/' + projectId,
            'POST',
            JSON.stringify({
                todo: todoText
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'New Todo Added', classes: 'green'});
        dispatch({
            type: ADD_TODO,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Mark any todo as done or not done(toggle is done)
export const toggleIsDone = (projectId, todoId, isDone, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/todos/' + projectId + '/' + todoId,
            'POST',
            JSON.stringify({
                isDone: isDone
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'Todo Updated', classes: 'green'});
        dispatch({
            type: UPDATE_TODO,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Edit an todo
export const editTodo = (projectId, todoId, todoEditText, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/todos/' + projectId + '/' + todoId,
            'PUT',
            JSON.stringify({
                todoEditText
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'Todo Updated', classes: 'green'});
        dispatch({
            type: UPDATE_TODO,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Delete a todo from a project
export const deleteTodo = (projectId, todoId, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/todos/' + projectId + '/' + todoId,
            'DELETE',
            null,
            {
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'Todo Deleted', classes: 'green'});
        dispatch({
            type: DELETE_TODO,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Mark any bug as fixed or not fixed(toggle isFixed of an bug)
export const toggleIsFixed = (projectId, bugId, isFixed, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/bugs/' + projectId + '/' + bugId,
            'POST',
            JSON.stringify({
                isFixed: isFixed
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'Bug Updated', classes: 'green'});
        dispatch({
            type: UPDATE_BUG,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Edit an bug
export const editBug = (projectId, bugId, bugEditText, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/bugs/' + projectId + '/' + bugId,
            'PUT',
            JSON.stringify({
                bugEditText
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'Bug Updated', classes: 'green'});
        dispatch({
            type: UPDATE_BUG,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Add a bug in a project
export const addBug = (bugText, projectId ,method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/bugs/' + projectId,
            'POST',
            JSON.stringify({
                bug: bugText
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'New Bug Added', classes: 'green'});
        dispatch({
            type: ADD_BUG,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Delete a bug from a project
export const deleteBug = (projectId, bugId, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/bugs/' + projectId + '/' + bugId,
            'DELETE',
            null,
            {
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'Bug Deleted', classes: 'green'});
        dispatch({
            type: DELETE_BUG,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}


//Get all project data
export const getProjectById = (projectId, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/project/' + projectId,
            'GET',
            null,
            {
                'Authorization': 'Bearer ' + localStorage.token
            }
        );
        dispatch({
            type: GET_PROJECT,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Get all non assigned member of particular project
export const getNotAssignedMember = (projectId, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/user/project/' + projectId,
            'GET',
            null,
            {
                'Authorization': 'Bearer ' + localStorage.token
            }
        );
        dispatch({
            type: ADD_NOT_ASSIGNED_MEMBER,
            payload: responseData
        });
        return responseData;
    } catch (error) {
        console.error(error);
    }
}

//Assign / add new member to a project
export const assignAnMemberToAProject = (projectId, username,  method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/project/' + projectId,
            'POST',
            JSON.stringify({
                username
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'New Member Added', classes: 'green'});
        dispatch({
            type: ADD_MEMBER_AT_PROJECT,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Delete / remove an member from project
export const deleteMemberFromProject = (projectId, username,  method) => async dispatch => {
    console.log(projectId, username)
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/project/' + projectId,
            'DELETE',
            JSON.stringify({
                username
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'Member Deleted', classes: 'green'});
        dispatch({
            type: DELETE_MEMBER_FROM_PROJECT,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Get in member of current project and is current user created this project
export const getIsMemberAndCreatorOfProject = (projectId, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/project/memberorcreator/' + projectId,
            'GET',
            null,
            {
                'Authorization': 'Bearer ' + localStorage.token
            }
        )
        dispatch({
            type: ADD_IS_MEMBER_AND_CREATOR,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Prepare project activities
export const prepareActivity = (projectId, method) => async dispatch => {
    let allActivities = []; //All activities as discussion, bug, todo (time, username, text, type)
    //types are todo, todo-done, bug, bug-fixed
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/project/' + projectId,
            'GET',
            null,
            {
                'Authorization': 'Bearer ' + localStorage.token
            }
        );
        if(responseData) {
            allActivities = responseData.discussion.map(discuss => {
                return {
                    time: discuss.time,
                    user: discuss.user.username,
                    text: discuss.text,
                    type: 'discuss'
                }
            })
            responseData.bugs.map(bug => {
                allActivities.push({
                    time: bug.time,
                    user: bug.user.username,
                    text: bug.text,
                    type: 'bug'
                })
                if(bug.fixedAt) {
                    allActivities.push({
                        time: bug.fixedAt,
                        user: bug.user.username,
                        text: bug.text,
                        type: 'bug-fixed'
                    })
                }
            });
            responseData.todos.map(todo => {
                allActivities.push({
                    time: todo.time,
                    user: todo.user.username,
                    text: todo.text,
                    type: 'todo'
                })
                if(todo.doneAt) {
                    allActivities.push({
                        time: todo.doneAt,
                        user: todo.user.username,
                        text: todo.text,
                        type: 'todo-done'
                    })
                }
            })
        }

        allActivities.sort(function(a,b){
            return new Date(b.time) - new Date(a.time);
        });
        const modifiedActivities = []; //Grouping discussion, bug, todo by date
        let currentDate = null, previousDate = null;
        let sameDateActivities = [];

        allActivities.map(activity => {
            currentDate = new Date(activity.time).getDate() + '/' + new Date(activity.time).getMonth() + '/' + new Date(activity.time).getFullYear();
            if(currentDate === previousDate) sameDateActivities.unshift(activity)
            else {
                previousDate = currentDate;
                modifiedActivities.unshift(sameDateActivities);
                sameDateActivities = [];
                sameDateActivities.unshift(activity);
            }
        })
        if(sameDateActivities.length > 0)
            modifiedActivities.unshift(sameDateActivities);
        let lastArray = []; //As we using unshift most recent date will be at last reversing this and add to lastArray
       for(let i = 0; i < modifiedActivities.length - 1; i++) {
           lastArray.unshift(modifiedActivities[i]);
       }
        dispatch({
            type: ACTIVITY_PREPARED,
            payload: lastArray
        })
    } catch (error) {
        console.error(error);
    }
}

//Work done(todo done and bug fixed) preview for project overview page
export const prepareWorkDonePreview = (projectId, method) => async dispatch => {
    try {
        let allActivities = [];
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/project/' + projectId,
            'GET',
            null,
            {
                'Authorization': 'Bearer ' + localStorage.token
            }
        );
        if(responseData) {
            allActivities = responseData.discussion.map(discuss => {
                return {
                    time: discuss.time,
                    user: discuss.user.username,
                    text: discuss.text,
                    type: 'discuss'
                }
            })
            responseData.bugs.map(bug => {
                allActivities.push({
                    time: bug.time,
                    user: bug.user.username,
                    text: bug.text,
                    type: 'bug'
                })
                if(bug.fixedAt) {
                    allActivities.push({
                        time: bug.fixedAt,
                        user: bug.user.username,
                        text: bug.text,
                        type: 'bug-fixed'
                    })
                }
            });
            responseData.todos.map(todo => {
                allActivities.push({
                    time: todo.time,
                    user: todo.user.username,
                    text: todo.text,
                    type: 'todo'
                })
                if(todo.doneAt) {
                    allActivities.push({
                        time: todo.doneAt,
                        user: todo.user.username,
                        text: todo.text,
                        type: 'todo-done'
                    })
                }
            })
        }

        allActivities.sort(function(a,b){
            return new Date(b.time) - new Date(a.time);
        });

        const modifiedActivities = [];
        let currentDate = null, previousDate = null;
        let sameDateActivities = [];

        allActivities.map(activity => {
            currentDate = new Date(activity.time).getDate() + '/' + new Date(activity.time).getMonth() + '/' + new Date(activity.time).getFullYear();
            if(currentDate === previousDate) sameDateActivities.unshift(activity)
            else {
                previousDate = currentDate;
                modifiedActivities.unshift(sameDateActivities);
                sameDateActivities = [];
                sameDateActivities.unshift(activity);
            }
        })
        if(sameDateActivities.length > 0)
            modifiedActivities.unshift(sameDateActivities);
        let lastArray = [];
        for(let i = 0; i < modifiedActivities.length - 1; i++) {
            lastArray.unshift(modifiedActivities[i]);
        }

        let dataPreview = [
            ['x', 'Todo done', 'Bug fixed'],
            [0, 0, 0]
        ];
        let finalArray = [];

        let todo = 0, bug = 0, i = 0;
        let newDataPreview = [];
        if(lastArray) {
            lastArray.map(activity => {
                todo = 0
                bug = 0
                activity.map(singleActivity => {
                    if(singleActivity.type === 'todo-done') todo++;
                    else if(singleActivity.type === 'bug-fixed') bug++;
                    if(todo > 0 || bug > 0) {
                        i++;
                        newDataPreview.unshift([i, todo, bug]);
                    }
                });

            })
        }
        newDataPreview.reverse();
        finalArray = dataPreview.concat(newDataPreview);
        dispatch({
            type: ADD_WORK_PREVIEW,
            payload: finalArray
        })
    } catch (error) {
        console.error(error);
    }
}

//Prepare todo and bug summary of an user for showing in his/her dashboard
export const prepareTodoAndBugForPreview = (username, projects) => async dispatch => {
    let completedActivity = []; //all completedTodo and fixed bug(means work finished) of all projects of a member
    let notCompletedActivity = []; //all notCompletedTodo and notFixed bug(means remaining work) of all projects of a member
    let projectName = null;
    let completedTodo = []; //completed todo of a single project of a member
    let notCompletedTodo = []; //not completed todo of a single project of a member
    let notFixedBug = []; //not fixed bug of a single project of a member
    let fixedBug = []; //fixed bug of of a single project of a member
    let dataPreview = [
        ['x', 'Todo done', 'Bug fixed'],
        [0, 0, 0]
    ]; //For chart preview in dashboard
    let finishedActivity = []; //finished todo and fixed bug for chart
    let type = null, time = null;
    let completedTodoCount = 0, notCompletedTodoCount = 0, notFixedBugCount = 0, fixedBugCount = 0; //For top four card at dashboard
    try {
        projects.map(project => {
            projectName = project.name;
            completedTodo = [];
            notCompletedTodo = [];
            notFixedBug = [];
            fixedBug = [];
            if(project.todos) {
                project.todos.map(todo => {
                    if(todo.user.username === username) {
                        if(todo.doneAt) {
                            type = 'todo';
                            time = todo.doneAt;
                            finishedActivity.unshift({ type, time })
                            completedTodoCount++;
                            completedTodo.unshift(todo);
                        } else {
                            notCompletedTodoCount++;
                            notCompletedTodo.unshift(todo);
                        }
                    }
                })
            }
            if(project.bugs) {
                project.bugs.map(bug => {
                    if(bug.user.username === username) {
                        if(bug.fixedAt) {
                            type = 'bug';
                            time = bug.fixedAt;
                            finishedActivity.unshift({ type, time })
                            fixedBugCount++;
                            fixedBug.unshift(bug);
                        } else {
                            notFixedBugCount++;
                            notFixedBug.unshift(bug);
                        }
                    }
                })
            }
            completedTodo = completedTodo.reverse();
            notCompletedTodo = notCompletedTodo.reverse();
            fixedBug = fixedBug.reverse();
            notFixedBug = notFixedBug.reverse();
            if((completedTodo.length > 0) || (fixedBug.length > 0))
                completedActivity.unshift( { projectName, completedTodo, fixedBug } );
            if((notCompletedTodo.length > 0) || (notFixedBug.length > 0))
                notCompletedActivity.unshift( { projectName, notCompletedTodo, notFixedBug } );
        })
        finishedActivity.sort(function(a,b){
            return new Date(b.time) - new Date(a.time);
        });
        let todo = 0, bug = 0, i = 0;
        let activityForChart = [];
        if(finishedActivity.length > 0) {
            let currentDate = new Date(finishedActivity[0].time).getDate() + '/' + new Date(finishedActivity[0].time).getMonth() + '/' + new Date(finishedActivity[0].time).getFullYear();
            let previousDate = new Date(finishedActivity[0].time).getDate() + '/' + new Date(finishedActivity[0].time).getMonth() + '/' + new Date(finishedActivity[0].time).getFullYear();
            finishedActivity.map(activity => {
                currentDate = new Date(activity.time).getDate() + '/' + new Date(activity.time).getMonth() + '/' + new Date(activity.time).getFullYear();
                if (currentDate !== previousDate) {
                    previousDate = currentDate;
                    if (todo > 0 || bug > 0) {
                        i++;
                        activityForChart.unshift([i, todo, bug]);
                        todo = 0
                        bug = 0
                    }
                }
                if (activity.type === 'todo') todo++;
                else if (activity.type === 'bug') bug++;
            })
            if(todo > 0 || bug > 0) {
                activityForChart.unshift([++i, todo, bug]);
            }
            activityForChart.reverse();
        }
        const finalActivity = dataPreview.concat(activityForChart);
        const todoBugSummary = {
            todoDone: completedTodoCount,
            todoNotDone: notCompletedTodoCount,
            fixedBug: fixedBugCount,
            notFixedBug: notFixedBugCount
        }
        dispatch({
            type: PREPARE_DATA_FOR_DASHBOARD,
            payload: { chartData: finalActivity, activitySummary: { completedActivity, notCompletedActivity }, todoBugSummary }
        })
    } catch (error) {
        console.log(error);
    }
}
