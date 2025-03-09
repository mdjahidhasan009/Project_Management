// import {
//     REGISTER_FAIL,
//     REGISTER_SUCCESS,
//     USER_LOADED,
//     AUTH_ERROR,
//     LOGIN_SUCCESS,
//     LOGIN_FAIL,
//     LOGOUT, PREPARE_DATA_FOR_DASHBOARD,
//     ALL_USER_LOADED,
//     LOADED_SELECTED_USER
// } from "../actions/types";
//
// const initialState = {
//     token: localStorage.getItem('token'),
//     isAuthenticated: false,
//     loading: true,
//     user: null,
//     chartData: null,
//     activitySummary: null,
//     todoBugSummary: null,
//     users: [],
//     selectedUser: null,
//     noImage: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
//     noMember: 'https://res.cloudinary.com/store-image/image/upload/v1601440064/muswbaylzg5sjxqv7cwb.jpg'
// }
//
// export default function (state = initialState, action) {
//     const { type, payload } = action;
//     switch (type) {
//         case REGISTER_SUCCESS:
//         case LOGIN_SUCCESS:
//             localStorage.setItem('token', payload);
//             return {
//                 ...state,
//                 token: payload,
//                 isAuthenticated: true,
//                 loading: false
//             }
//         case REGISTER_FAIL:
//         case AUTH_ERROR:
//         case LOGIN_FAIL:
//             return {
//                 ...state,
//                 token: null,
//                 isAuthenticated: false,
//                 loading: false,
//                 user: null,
//                 chartData: null,
//                 activitySummary: null,
//                 todoBugSummary: null,
//                 users: [],
//                 selectedUser: null,
//             }
//         case LOGOUT:
//             localStorage.removeItem('token');
//             return {
//                 ...state,
//                 token: null,
//                 isAuthenticated: false,
//                 loading: false,
//                 user: null,
//                 chartData: null,
//                 activitySummary: null,
//                 todoBugSummary: null,
//                 users: [],
//                 selectedUser: null,
//             }
//         case USER_LOADED:
//             return {
//                 ...state,
//                 isAuthenticated: true,
//                 loading: false,
//                 user: payload
//             }
//         case PREPARE_DATA_FOR_DASHBOARD:
//             return {
//                 ...state,
//                 chartData: payload.chartData,
//                 activitySummary: payload.activitySummary,
//                 todoBugCountSummary: payload.todoBugCountSummary,
//                 loading: false
//             }
//         case ALL_USER_LOADED:
//             return {
//                 ...state,
//                 users: payload            }
//         case LOADED_SELECTED_USER:
//             return {
//                 ...state,
//                 loadedUser: payload,
//                 loading: false
//             }
//         default:
//             return {
//                 ...state
//             }
//     }
// }


import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    loadUser,
    updateUser,
    register,
    login,
    getAllUser,
    getUserByUserName,
    uploadProfileImage
} from "../thunks/auth-thunks";

type User = {
    id: string;
    username: string;
    email: string;
};

type Project = {
    name: string;
    todos?: Todo[];
    bugs?: Bug[];
};

type Todo = {
    user: User;
    doneAt?: string;
};

type Bug = {
    user: User;
    fixedAt?: string;
};

type TAuthState = {
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    user: User | null;
    users: User[];
    selectedUser: User | null;
    chartData: any;
    activitySummary: any;
    todoBugSummary: any;
    noImage: string;
    noMember: string;
};

const initialState: TAuthState = {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: true,
    user: null, ////TODO: will not use null as default value
    users: [],
    selectedUser: null, ////TODO: will not use null as default value
    chartData: null,
    activitySummary: null,
    todoBugSummary: null,
    noImage: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    noMember: 'https://res.cloudinary.com/store-image/image/upload/v1601440064/muswbaylzg5sjxqv7cwb.jpg'
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        logout: () => {
            localStorage.removeItem("token");
            return initialState;
        },
        prepareTodoAndBugForPreview: (state: TAukthState, action) => {
        const { username, projects } = action.payload;

        let allCompletedActivity = [];
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
            return { ...state,
                chartData,
                activitySummary: { completedActivity: allCompletedActivity, notCompletedActivity: allNotCompletedActivity },
                todoBugCountSummary
            };
        } catch (error) {
            console.error(error);
        }}
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.isAuthenticated = true;
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<string>) => {
                localStorage.setItem("token", action.payload);
                state.token = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
                localStorage.setItem("token", action.payload);
                state.token = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.user = action.payload;
            })
            .addCase(uploadProfileImage.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(getAllUser.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.users = action.payload;
            })
            .addCase(getUserByUserName.fulfilled, (state, action: PayloadAction<User>) => {
                state.loadedUser = action.payload;
            })
            .addMatcher((action) => action.type.endsWith('/rejected'), (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.users = [];
                state.selectedUser = null;
            });
    }
});

export const { logout, prepareTodoAndBugForPreview } = authSlice.actions;
export default authSlice.reducer;
