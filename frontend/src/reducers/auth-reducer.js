import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT, PREPARE_DATA_FOR_DASHBOARD,
    ALL_USER_LOADED,
    LOADED_SELECTED_USER
} from "../actions/types";

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null,
    chartData: null,
    activitySummary: null,
    todoBugSummary: null,
    users: [],
    selectedUser: null,
    noImage: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
    noMember: 'https://res.cloudinary.com/store-image/image/upload/v1601440064/muswbaylzg5sjxqv7cwb.jpg'
}

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload);
            return {
                ...state,
                token: payload,
                isAuthenticated: true,
                loading: false
            }
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                chartData: null,
                activitySummary: null,
                todoBugSummary: null,
                users: [],
                selectedUser: null,
            }
        case LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                chartData: null,
                activitySummary: null,
                todoBugSummary: null,
                users: [],
                selectedUser: null,
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            }
        case PREPARE_DATA_FOR_DASHBOARD:
            return {
                ...state,
                chartData: payload.chartData,
                activitySummary: payload.activitySummary,
                todoBugCountSummary: payload.todoBugCountSummary,
                loading: false
            }
        case ALL_USER_LOADED:
            return {
                ...state,
                users: payload            }
        case LOADED_SELECTED_USER:
            return {
                ...state,
                loadedUser: payload,
                loading: false
            }
        default:
            return {
                ...state
            }
    }
}
