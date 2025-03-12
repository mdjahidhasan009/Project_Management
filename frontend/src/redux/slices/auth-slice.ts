import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    loadUser,
    updateUser,
    register,
    login,
    getAllUser,
    getUserByUserName,
    uploadProfileImage, TUser, TSelectedUser
} from "../thunks/auth-thunks";
import {initialUserData, TActivityType, TBaseActivity, TBug, TProject, TTodo} from "./project-slice";

export type TOtherAllUsers = {
    name: string,
    username: string,
    email: string,
}

// Chart data type
export type TChartData = Array<Array<string | number>>;

// Types for activity summary
type TCompletedActivity = Array<{
    projectName: string;
    completedTodo: Array<Partial<TTodo>>;
    fixedBug: Array<Partial<TBug>>;
}>;

type TFinishedActivities = Array<{
    type: TActivityType;
    time: string;
}>;

type TNotCompletedActivity = Array<{
    projectName: string;
    notCompletedTodo: Array<Partial<TTodo>>;
    notFixedBug: Array<Partial<TBug>>;
}>;

type TActivitySummary = {
    completedActivity: TCompletedActivity;
    notCompletedActivity: TNotCompletedActivity;
};

// Type for todo/bug count summary
type TTodoBugCountSummary = {
    todoDone: number;
    todoNotDone: number;
    fixedBug: number;
    notFixedBug: number;
};

type TAuthState = {
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    user: TUser;
    users: TOtherAllUsers[];
    selectedUser: TSelectedUser;
    chartData: TChartData;
    activitySummary: TActivitySummary;
    todoBugCountSummary: TTodoBugCountSummary;
    noImage: string;
    noMember: string;
    loadedUser: TUser;
};

const initialSelectedUser: TSelectedUser = {
    bio: '',
    email: '',
    name: '',
    profileImage: {
        imageUrl: '',
        publicId: '',
    },
    role: '',
    skills: [],
    social: {
        facebook: '',
        github: '',
        instagram: '',
        linkedIn: '',
        stackoverflow: '',
        twitter: '',
        youtube: '',
    },
    username: '',
    _id: ''
}

export const initialAuthData: TAuthState = {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: true,
    user: initialUserData,
    users: [],
    selectedUser: initialSelectedUser,
    chartData: [],
    activitySummary: {
        completedActivity: [],
        notCompletedActivity: []
    },
    todoBugCountSummary : {
        todoDone: 0,
        todoNotDone: 0,
        fixedBug: 0,
        notFixedBug: 0
    },
    loadedUser: initialUserData,
    noImage: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    noMember: 'https://res.cloudinary.com/store-image/image/upload/v1601440064/muswbaylzg5sjxqv7cwb.jpg'
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initialAuthData,
    reducers: {
        logout: () => {
            localStorage.removeItem("token");
            return initialAuthData;
        },
        prepareTodoAndBugForPreview: (state: TAuthState, action: PayloadAction<{username: string, projects: TProject[]}>) => {
        const { username, projects } = action.payload;

        let allCompletedActivity: TCompletedActivity = [];
        let allNotCompletedActivity: TNotCompletedActivity = [];
        let projectName = null;
        let completedTodoOfAProject: Array<Partial<TTodo>> = []; //completed todo of a single project of a member
        let notCompletedTodoOfAProject: Array<Partial<TTodo>> = []; //not completed todo of a single project of a member
        let notFixedBugOfAProject: Array<Partial<TBug>> = []; //not fixed bug of a single project of a member
        let fixedBugOfAProject: Array<Partial<TBug>> = []; //fixed bug of a single project of a member
        let finishedActivities: TFinishedActivities = []; //finished todo and fixed bug for chart
        let type: string = "", time: string = "";
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
                                type = "todo-done";
                                time = todo.doneAt;
                                finishedActivities.push({ type: type as TActivityType, time })
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
                                type = "bug-fixed";
                                time = bug.fixedAt;
                                finishedActivities.push({ type: type as TActivityType, time });
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
                        { projectName,
                            completedTodo: completedTodoOfAProject,
                            fixedBug: fixedBugOfAProject
                        } );
                if((notCompletedTodoOfAProject.length > 0) || (notFixedBugOfAProject.length > 0))
                    allNotCompletedActivity.push(
                        { projectName, notCompletedTodo: notCompletedTodoOfAProject, notFixedBug: notFixedBugOfAProject } );
            })

            finishedActivities.sort(function(a,b){
                // Ensure time properties exist and are strings
                const timeA = a.time || '';
                const timeB = b.time || '';

                // Convert to Date objects and get timestamps for proper numeric comparison
                return new Date(timeA).getTime() - new Date(timeB).getTime();
            });
            let todo = 0, bug = 0, i = 0;
            let activityForChart = [];
            if(finishedActivities.length > 0) {
                //First date of finished activity
                let firstDate: Date | string = new Date(finishedActivities[0].time);
                firstDate = firstDate.getFullYear() + "/" + (firstDate.getMonth() + 1) + "/" + firstDate.getDate();
                let currentDate: Date | string = firstDate, previousDate = firstDate;

                finishedActivities.map(activity => {
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
                ['x', 'TTodo done', 'TBug fixed'],
                [0, 0, 0]
            ].concat(activityForChart);
            //Count of how many todos are completed or incomplete and bug fixed or not fixed yet.
            const todoBugCountSummary = {
                todoDone: completedTodoCount,
                todoNotDone: notCompletedTodoCount,
                fixedBug: fixedBugCount,
                notFixedBug: notFixedBugCount
            }

            state.chartData = chartData;
            state.activitySummary = {
                completedActivity: allCompletedActivity,
                notCompletedActivity: allNotCompletedActivity
            };
            state.todoBugCountSummary = todoBugCountSummary;

            // return { ...state,
            //     chartData,
            //     activitySummary: {
            //         completedActivity: allCompletedActivity,
            //         notCompletedActivity: allNotCompletedActivity
            //     },
            //     todoBugCountSummary
            // };
        } catch (error) {
            console.error(error);
        }}
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUser.fulfilled, (state, action: PayloadAction<TUser>) => {
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
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
                state.user = action.payload;
            })
            .addCase(uploadProfileImage.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(getAllUser.fulfilled, (state, action: PayloadAction<TOtherAllUsers[]>) => {
                state.users = action.payload;
            })
            .addCase(getUserByUserName.fulfilled, (state, action: PayloadAction<TUser>) => {
                state.loadedUser = action.payload;
            })
            .addMatcher((action) => action.type.endsWith('/rejected'), (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = initialUserData;
                state.users = [];
                state.selectedUser = initialSelectedUser;
            });
    }
});

export const { logout, prepareTodoAndBugForPreview } = authSlice.actions;
export default authSlice.reducer;
