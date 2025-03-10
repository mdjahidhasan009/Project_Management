import {createSlice} from "@reduxjs/toolkit";
import {
    addBug,
    addDiscussion, addTodo, assignAMemberToAProject, deleteBug,
    deleteDiscussion, deleteMemberFromProject, deleteTodo, editBug,
    editDiscussion, editTodo, getIsMemberAndCreatorOfProject,
    getNotAssignedMember,
    getProjectById, prepareWorkDonePreview
} from "../thunks/project-thunks";
import {prepareActivityHelper} from "../../utils/helper";
import {TUser} from "../thunks/auth-thunks";

// Base activity type
export type TBaseActivity = {
    time: string;
    user: string;
    text: string;
    type: TActivityType;
}

// Activity types
export type TActivityType = 'bug' | 'bug-fixed' | 'todo' | 'todo-done' | 'discuss';

// Group of activities by date
export type TActivityGroup = TBaseActivity[];

// All activity groups
export type TActivityGroups = TActivityGroup[];

// Project data structure containing bugs and todos
export type TProjectData = {
    _id: string;
    bugs: TBug[];
    todos: TTodo[];
    discussion: TDiscussion[];
    members: TProjectMember[];
    name: string;
    description: string;
    category: string;
    deadline: string;
    isDone: boolean;
}

export type TBug = {
    time: string;
    user: {
        username: string;
        [key: string]: any;
    };
    text: string;
    fixedAt?: string;
    [key: string]: any;
}

// TTodo interface
export type TTodo = {
    time: string;
    user: {
        username: string;
        [key: string]: any;
    };
    text: string;
    doneAt?: string;
    [key: string]: any;
}

// Optional interfaces for other project data
export type TDiscussion = {
    _id: string;
    text: string;
    time: string;
    user: {
        username: string;
        [key: string]: any;
    };
    [key: string]: any;
}

export type TProjectMember = {
    _id: string;
    user: TUser;
}

export type TProjectState = {
    project: TProjectData | null;
    activities: TActivityGroups;
    chartData: any[];
    isMemberOfThisProject: boolean;
    isCreatedByUser: boolean;
    notAssignMembers: string[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: any;
}

export type TPrepareActivityHelper = (responseData: TProjectData) => TActivityGroups;

export type TActivitiesInADayProps = {
    activity: TActivityGroup;
    key: number;
}

export const initialProjectData: TProjectData = {
    _id: "",
    bugs: [],
    todos: [],
    discussion: [],
    members: [],
    name: "",
    description: "",
    category: "",
    deadline: "",
    isDone: false
}

const initialState: TProjectState = {
    project: null,
    activities: [],
    chartData: [],
    isMemberOfThisProject: false,
    isCreatedByUser: false,
    notAssignMembers: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};


// Create Slice
const projectSlice = createSlice({
    name: 'project',
    initialState,

    // .addCase(prepareActivity.fulfilled, (state, action) => {
    //     state.status = 'succeeded';
    //     state.activities = action.payload;
    // })
    reducers: {
        prepareActivity: (state, action) => {
            state.status = 'succeeded';
            state.activities = prepareActivityHelper(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjectById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.project = action.payload;
            })
            .addCase(getNotAssignedMember.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notAssignMembers = action.payload;
            })
            .addCase(addDiscussion.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.project.discussion = [action.payload, ...state.project.discussion];
            })
            .addCase(editDiscussion.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.project.discussion = action.payload;
            })
            .addCase(deleteDiscussion.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.project.discussion = action.payload;
            })
            .addCase(addTodo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.project.todos = [action.payload, ...state.project.todos];
            })
            .addCase(addBug.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.project.bugs = [action.payload, ...state.project.bugs];
            })
            .addCase(editTodo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.project.todos = action.payload;
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.project.todos = action.payload;
            })
            .addCase(editBug.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.project.bugs = action.payload;
            })
            .addCase(deleteBug.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.project.bugs = action.payload;
            })
            .addCase(assignAMemberToAProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.project.members = [action.payload, ...state.project.members];
            })
            .addCase(deleteMemberFromProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.project.members = action.payload;
            })
            .addCase(getIsMemberAndCreatorOfProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isMemberOfThisProject = action.payload.isMemberOfThisProject;
                state.isCreatedByUser = action.payload.isCreatedByUser;
            })
            // .addCase(prepareActivity.fulfilled, (state, action) => {
            //     state.status = 'succeeded';
            //     state.activities = action.payload;
            // })
            .addCase(prepareWorkDonePreview.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.chartData = action.payload;
            })
            // .addCase(prepareTodoAndBugForPreview.fulfilled, (state, action) => {
            //     state.status = 'succeeded';
            //     state.chartData = action.payload.chartData;
            //     // You can add other parts of the payload to your state here
            // })
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.status = 'loading';
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload;
                }
            );
    }
});

export const { prepareActivity } = projectSlice.actions;
export default projectSlice.reducer;
