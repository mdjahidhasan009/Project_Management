import {createSlice, PayloadAction} from "@reduxjs/toolkit";
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
import {TChartData} from "./auth-slice";

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

export type TBug = {
    time: string;
    user: TUserShortData;
    text: string;
    fixedAt?: string;
    fixed: boolean;
    _id: string;
}

// TTodo interface
export type TTodo = {
    _id: string;
    addedBy: string;
    time: string;
    user: TUserShortData;
    text: string;
    doneAt?: string;
    done: boolean;
    subTodos?: TTodo[];
}

// Optional interfaces for other project data
export type TDiscussion = {
    _id: string;
    text: string;
    time: string;
    user: TUserShortData;
}

export type TProjectMember = {
    _id: string;
    user: TUserShortData;
}

export type TUserShortData = {
    profileImage: {
        imageUrl: string;
        publicId: string;
    },
    username: string;
    _id: string;
}

// Project data structure containing bugs and todos
export type TProject = {
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
    createdBy: {
        username: string;
    }
}

export type TProjectSliceState = {
    project: TProject | null;
    activities: TActivityGroups;
    chartData: TChartData;
    isMemberOfThisProject: boolean;
    isCreatedByUser: boolean;
    notAssignMembers: string[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: any;
}

export type TPrepareActivityHelper = (responseData: TProject) => TActivityGroups;

export const initialUserData: TUser = {
    name: '',
    username: '',
    email: '',
    role: "-1",
    bio: '',
    skills: [],
    profileImage: {
        imageUrl: '',
        publicId: '',
    },
    social: {
        github: '',
        youtube: '',
        twitter: '',
        facebook: '',
        linkedIn: '',
        instagram: '',
        stackoverflow: '',
    },
    _id: ""
};

export const initialProjectData: TProject = {
    _id: "",
    bugs: [],
    discussion: [],
    members: [
        {
            user: {
                username: '',
                profileImage: {
                    imageUrl: '',
                    publicId: '',
                },
                _id: '',
            },
            _id: '',
        }
    ],
    name: "",
    description: "",
    category: "",
    deadline: "",
    isDone: false,
    createdBy: initialUserData,
    todos: [
        {
            _id: '',
            time: '',
            user: {
                username: '',
                profileImage: {
                    imageUrl: '',
                    publicId: '',
                },
                _id: '',
            },
            text: '',
            doneAt: '',
            done: false,
            addedBy: '',
            subTodos: [
                {
                    _id: '',
                    time: '',
                    user: {
                        username: '',
                        profileImage: {
                            imageUrl: '',
                            publicId: '',
                        },
                        _id: '',
                    },
                    text: '',
                    doneAt: '',
                    done: false,
                    addedBy: '',
                }
        ]},
    ]
}

const initialState: TProjectSliceState = {
    project: null,
    activities: [],
    chartData: [],
    isMemberOfThisProject: false,
    isCreatedByUser: false,
    notAssignMembers: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};


// Create Slice
const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        prepareActivity: (state, action) => {
            state.status = 'succeeded';
            state.activities = prepareActivityHelper(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProjectById.fulfilled, (state, action: PayloadAction<TProject>) => {
                state.status = 'succeeded';
                state.project = action.payload;
            })
            .addCase(getNotAssignedMember.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.status = 'succeeded';
                state.notAssignMembers = action.payload;
            })
            .addCase(addDiscussion.fulfilled, (state, action: PayloadAction<TDiscussion>) => {
                state.status = 'succeeded';
                if(state.project) {
                    state.project.discussion = [action.payload, ...state.project.discussion];
                }
            })
            .addCase(editDiscussion.fulfilled, (state, action: PayloadAction<TDiscussion[]>) => {
                state.status = 'succeeded';
                if(state.project) {
                    state.project.discussion = action.payload;
                }
            })
            .addCase(deleteDiscussion.fulfilled, (state, action: PayloadAction<TDiscussion[]>) => {
                state.status = 'succeeded';
                if(state.project) {
                    state.project.discussion = action.payload;
                }
            })


            .addCase(addTodo.fulfilled, (state, action: PayloadAction<TTodo>) => {
                state.status = 'succeeded';
                if(state.project && state.project.todos) {
                    state.project.todos = [action.payload, ...state.project.todos];
                }
            })
            .addCase(editTodo.fulfilled, (state, action: PayloadAction<TTodo[]>) => {
                state.status = 'succeeded';
                if(state.project && state.project.todos) {
                    state.project.todos = action.payload;
                }
            })
            .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<TTodo[]>) => {
                state.status = 'succeeded';
                if(state.project && state.project.todos) {
                    state.project.todos = action.payload;
                }
            })


            .addCase(addBug.fulfilled, (state, action: PayloadAction<TBug>) => {
                state.status = 'succeeded';
                if(state.project && state.project.bugs) {
                    state.project.bugs = [action.payload, ...state.project.bugs];
                }
            })
            .addCase(editBug.fulfilled, (state, action: PayloadAction<TBug[]>) => {
                state.status = 'succeeded';
                if(state.project && state.project.bugs) {
                    state.project.bugs = action.payload;
                }
            })
            .addCase(deleteBug.fulfilled, (state, action: PayloadAction<TBug[]>) => {
                state.status = 'succeeded';
                if(state.project && state.project.bugs) {
                    state.project.bugs = action.payload;
                }
            })


            .addCase(assignAMemberToAProject.fulfilled, (state, action: PayloadAction<TProjectMember>) => {
                state.status = 'succeeded';
                if(state.project && state.project.members) {
                    state.project.members = [action.payload, ...state.project.members];
                }
            })
            .addCase(deleteMemberFromProject.fulfilled, (state, action: PayloadAction<TProjectMember[]>) => {
                state.status = 'succeeded';
                if(state.project && state.project.members) {
                    state.project.members = action.payload;
                }
            })
            .addCase(getIsMemberAndCreatorOfProject.fulfilled, (state, action: PayloadAction<{isMemberOfThisProject: boolean, isCreatedByUser: boolean }>) => {
                state.status = 'succeeded';
                state.isMemberOfThisProject = action.payload.isMemberOfThisProject;
                state.isCreatedByUser = action.payload.isCreatedByUser;
            })
            // .addCase(prepareActivity.fulfilled, (state, action) => {
            //     state.status = 'succeeded';
            //     state.activities = action.payload;
            // })
            ////TODO: Will fix its type later
            .addCase(prepareWorkDonePreview.fulfilled, (state, action) => {////TODO: Will fix its type later
                state.status = 'succeeded';
                state.chartData = action.payload;
            })
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.status = 'loading';
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action: PayloadAction<any>) => {
                    state.status = 'failed';
                    state.error = action.payload;
                }
            );
    }
});

export const { prepareActivity } = projectSlice.actions;
export default projectSlice.reducer;
