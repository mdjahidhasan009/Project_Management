import {
    GET_PROJECT,                ADD_DISCUSSION,
    ADD_TODO,                   ADD_BUG,
    UPDATE_TODO,                UPDATE_BUG,
    ADD_NOT_ASSIGNED_MEMBER,    ADD_MEMBER_AT_PROJECT,
    ACTIVITY_PREPARED,          ADD_WORK_PREVIEW,
    ADD_IS_MEMBER_AND_CREATOR,  DELETE_BUG,
    DELETE_TODO,                DELETE_MEMBER_FROM_PROJECT,
    PREPARE_DATA_FOR_DASHBOARD, UPDATE_DISCUSSION,
    DELETE_DISCUSSION
} from "./types";
import { prepareActivityHelper } from "../utils/helper";
import M from "materialize-css";

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
        M.toast({ html: 'Project Details Updated', classes: 'green' });
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
        M.toast({ html: 'Project Deleted', classes: 'green' });
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
        M.toast({ html: 'New Discussion Added', classes: 'green' });
        dispatch({
            type: ADD_DISCUSSION,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Edit a discussion
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

//Add a todo to junior
export const addTodoToJunior = (todoText, projectId, username, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/assignTodo/todos/' + projectId + '/' + username,
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
    } catch(error) {
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
        M.toast({ html: 'New Todo Added', classes: 'green' });
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
            process.env.REACT_APP_ASSET_URL +'/api/project/toggle/todos/' + projectId + '/' + todoId,
            'PUT',
            JSON.stringify({
                isDone: isDone
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        if(responseData) {
            M.toast({html: 'Todo Updated', classes: 'green'});
            dispatch({
                type: UPDATE_TODO,
                payload: responseData
            })
        }
    } catch (error) {
        // console.error(error);
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


//Add a sub todo in a project
export const addSubTodo = (todoText, projectId, todoId, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/todos/' + projectId + '/todoId/' + todoId,
            'POST',
            JSON.stringify({
                todo: todoText,
                todoId: todoId
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'New Sub Todo Added', classes: 'green'});
        dispatch({
            type: UPDATE_TODO,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Mark any sub todo as done or not done(toggle is done)
export const toggleSubTodoIsDone = (projectId, todoId, subTodoId, isDone, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/toggle/todos/' + projectId + '/' + todoId + '/' + subTodoId,
            'PUT',
            JSON.stringify({
                isDone: isDone
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        if(responseData) {
            M.toast({html: 'Sub Todo Updated', classes: 'green'});
            dispatch({
                type: UPDATE_TODO,
                payload: responseData
            })
        }
    } catch (error) {
        // console.error(error);
    }
}

//Edit an todo
export const editSubTodo = (projectId, todoId, subTodoId, subTodoEditText, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/todos/' + projectId + '/' + todoId + '/' + subTodoId,
            'PUT',
            JSON.stringify({
                subTodoEditText
            }),
            {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'Sub Todo Updated', classes: 'green'});
        dispatch({
            type: UPDATE_TODO,
            payload: responseData
        })
    } catch (error) {
        console.error(error);
    }
}

//Delete a sub todo from a project
export const deleteSubTodo = (projectId, todoId, subTodoId, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/project/todos/' + projectId + '/' + todoId + '/' + subTodoId,
            'DELETE',
            null,
            {
                Authorization: 'Bearer ' + localStorage.token
            }
        );
        M.toast({html: 'Sub Todo Deleted', classes: 'green'});
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
        if(responseData) {
            M.toast({ html: 'Bug Updated', classes: 'green' });
            dispatch({
                type: UPDATE_BUG,
                payload: responseData
            })
        }
    } catch (error) {
        // console.error(error);
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
    } catch (error) {
        console.error(error);
    }
}

//Assign / add new member to a project
export const assignAMemberToAProject = (projectId, username, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/project/member/' + projectId,
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
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/project/member/' + projectId,
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
export const prepareActivity = (project) => async dispatch => {
    let preparedActivities = []; //All activities as discussion, bug, todo (time, username, text, type)
    //types are todo, todo-done, bug, bug-fixed
    try {
        preparedActivities = prepareActivityHelper(project);
        dispatch({
            type: ACTIVITY_PREPARED,
            payload: preparedActivities
        })
    } catch (error) {
        console.error(error);
    }
}

//Work done(todo done and bug fixed) preview for project overview page
export const prepareWorkDonePreview = (projectId, method) => async dispatch => {
    try {
        let preparedActivities = [];
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/project/' + projectId,
            'GET',
            null,
            {
                'Authorization': 'Bearer ' + localStorage.token
            }
        );
        preparedActivities = prepareActivityHelper(responseData);
        let finalArrayForChart = [];

        let todo = 0, bug = 0, i = 0;
        let newDataPreview = [];
        let preparedActivitiesReverse = preparedActivities.reverse(); //as in activities recent come first we need old to recent
        if(preparedActivitiesReverse) {
            preparedActivitiesReverse.map(activity => {
                todo = 0;
                bug = 0;
                activity.map(singleActivity => {
                    if(singleActivity.type === 'todo-done') todo++;
                    else if(singleActivity.type === 'bug-fixed') bug++;
                });
                if(todo > 0 || bug > 0) {
                    i++;
                    newDataPreview.push([i, todo, bug]);
                }
            })
        }
        finalArrayForChart = [
            ['x', 'Todo done', 'Bug fixed'],
            [0, 0, 0]
        ].concat(newDataPreview);
        dispatch({
            type: ADD_WORK_PREVIEW,
            payload: finalArrayForChart
        })
    } catch (error) {
        console.error(error);
    }
}

//Prepare todo and bug summary of an user for showing in his/her dashboard
export const prepareTodoAndBugForPreview = (username, projects) => async dispatch => {
    //all completedTodoOfAProject and fixed bug(means work finished) of all projects of a member
    let allCompletedActivity = [];
    //all notCompletedTodoOfAProject and notFixed bug(means remaining work) of all projects of a member
    let allNotCompletedActivity = [];
    let projectName = null;
    let completedTodoOfAProject = []; //completed todo of a single project of a member
    let notCompletedTodoOfAProject = []; //not completed todo of a single project of a member
    let notFixedBugOfAProject = []; //not fixed bug of a single project of a member
    let fixedBugOfAProject = []; //fixed bug of a single project of a member
    let finishedActivity = []; //finished todo and fixed bug for chart
    let type = null, time = null;
    //For top four card at dashboard
    let completedTodoCount = 0, notCompletedTodoCount = 0, notFixedBugCount = 0, fixedBugCount = 0;
    try {
        projects.map(project => {
            projectName = project.name;
            completedTodoOfAProject = [];
            notCompletedTodoOfAProject = [];
            notFixedBugOfAProject = [];
            fixedBugOfAProject = [];
            if(project.todos) {
                project.todos.map(todo => {
                    if(todo.user.username === username) {
                        if(todo.doneAt) {
                            type = 'todo-done';
                            time = todo.doneAt;
                            finishedActivity.push({ type, time })
                            completedTodoCount++;
                            completedTodoOfAProject.push(todo);
                        } else {
                            notCompletedTodoCount++;
                            notCompletedTodoOfAProject.push(todo);
                        }
                    }
                })
            }
            if(project.bugs) {
                project.bugs.map(bug => {
                    if(bug.user.username === username) {
                        if(bug.fixedAt) {
                            type = 'bug-fixed';
                            time = bug.fixedAt;
                            finishedActivity.push({ type, time });
                            fixedBugCount++;
                            fixedBugOfAProject.push(bug);
                        } else {
                            notFixedBugCount++;
                            notFixedBugOfAProject.push(bug);
                        }
                    }
                })
            }
            if((completedTodoOfAProject.length > 0) || (fixedBugOfAProject.length > 0))
                allCompletedActivity.push(
                    { projectName, completedTodo: completedTodoOfAProject, fixedBug: fixedBugOfAProject } );
            if((notCompletedTodoOfAProject.length > 0) || (notFixedBugOfAProject.length > 0))
                allNotCompletedActivity.push(
                    { projectName, notCompletedTodo: notCompletedTodoOfAProject, notFixedBug: notFixedBugOfAProject } );
        })

        finishedActivity.sort(function(a,b){
            return new Date(a.time) - new Date(b.time);
        });
        let todo = 0, bug = 0, i = 0;
        let activityForChart = [];
        if(finishedActivity.length > 0) {
            //First date of finished activity
            let firstDate = new Date(finishedActivity[0].time);
            firstDate = firstDate.getFullYear() + "/" + (firstDate.getMonth() + 1) + "/" + firstDate.getDate();
            let currentDate = firstDate, previousDate = firstDate;

            finishedActivity.map(activity => {
                currentDate = new Date(activity.time);
                currentDate = currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate();
                if (currentDate !== previousDate) {
                    previousDate = currentDate;
                    if (todo > 0 || bug > 0) {
                        i++;
                        activityForChart.push([i, todo, bug]);
                        todo = 0
                        bug = 0
                    }
                }
                if (activity.type === 'todo-done') todo++;
                else if (activity.type === 'bug-fixed') bug++;
            })
            //for last element
            if(todo > 0 || bug > 0) {
                activityForChart.push([++i, todo, bug]);
            }
        }
        const chartData = [
            ['x', 'Todo done', 'Bug fixed'],
            [0, 0, 0]
        ].concat(activityForChart);
        //Count of how many todos are completed or incomplete and bug fixed or not fixed yet.
        const todoBugCountSummary = {
            todoDone: completedTodoCount,
            todoNotDone: notCompletedTodoCount,
            fixedBug: fixedBugCount,
            notFixedBug: notFixedBugCount
        }
        dispatch({
            type: PREPARE_DATA_FOR_DASHBOARD,
            payload: { chartData, activitySummary: { completedActivity: allCompletedActivity, notCompletedActivity: allNotCompletedActivity }, todoBugCountSummary }
        })
    } catch (error) {
        console.error(error);
    }
}
