import {
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
    DELETE_BUG, DELETE_TODO, DELETE_MEMBER_FROM_PROJECT, UPDATE_DISCUSSION, DELETE_DISCUSSION
} from "../actions/types";

const initialState = {
    project: null,
    activities: null,
    chartData: [],
    isMemberOfThisProject: false,
    isCreatedByUser: false,
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_PROJECT:
            return {
                ...state,
                project: payload
            };
        case ADD_DISCUSSION:
            return {
                ...state,
                project: {
                    ...state.project,
                    discussion: [payload, ...state.project.discussion]
                }
            };
        case UPDATE_DISCUSSION:
        case DELETE_DISCUSSION:
            return {
                ...state,
                project: {
                    ...state.project,
                    discussion: payload
                }
            };
        case ADD_TODO:
            return {
                ...state,
                project: {
                    ...state.project,
                    todos: [payload, ...state.project.todos]
                }
            };
        case ADD_BUG:
            return {
                ...state,
                project: {
                    ...state.project,
                    bugs: [payload, ...state.project.bugs]
                }
            };
        case UPDATE_TODO:
        case DELETE_TODO:
            return {
                ...state,
                project: {
                    ...state.project,
                    todos: payload
                }
            };
        case UPDATE_BUG:
        case DELETE_BUG:
            return {
                ...state,
                project: {
                    ...state.project,
                    bugs: payload
                }
            }
        case ADD_NOT_ASSIGNED_MEMBER:
            return {
                ...state,
                notAssignMembers: payload
            }
        case ADD_MEMBER_AT_PROJECT:
            return {
                ...state,
                project: {
                    ...state.project,
                    members: [ payload, ...state.project.members]
                }
            }
        case DELETE_MEMBER_FROM_PROJECT:
            return {
                ...state,
                project: {
                    ...state.project,
                    members: payload
                }
            }
        case ACTIVITY_PREPARED:
            return {
                ...state,
                activities: payload
            }
        case ADD_WORK_PREVIEW:
            return {
                ...state,
                chartData: payload
            }
        case ADD_IS_MEMBER_AND_CREATOR:
            return {
                ...state,
                isMemberOfThisProject: payload.isMemberOfThisProject,
                isCreatedByUser: payload.isCreatedByUser
            }
        default:
            return state;
    }
}
