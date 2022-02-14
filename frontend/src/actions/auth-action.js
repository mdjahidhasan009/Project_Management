import {
    ALL_USER_LOADED,         AUTH_ERROR,             LOGIN_SUCCESS,               LOGOUT,              REGISTER_SUCCESS,
    USER_LOADED,             LOADED_SELECTED_USER
} from './types'
import M from "materialize-css";

//Load user form token
export const loadUser = (method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/auth',
            'GET',
            null,
            {
                'Authorization': 'Bearer ' + localStorage.token
            }
        );
        //if token is not valid it returns undefined and update the state isAuthenticated to true it will prevent that
        if(responseData) {
            dispatch({
                type: USER_LOADED,
                payload: responseData
            })
        } else {
            dispatch({
                type: AUTH_ERROR
            })
        }
    } catch (error) {

    }
}

//Register new user
export const register = ( name, username, email, password, method ) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL +'/api/user',
            'POST',
            JSON.stringify({
                name,
                username,
                email,
                password
            }),
            {
                'Content-Type': 'application/json'
            }
        );
        dispatch({
            type: REGISTER_SUCCESS,
            payload: responseData.token
        });
    } catch (e) {
        console.error(e);
    }
}

//Login User
export const login = (email, password, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/auth',
            'POST',
            JSON.stringify({
                email,
                password
            }),
            {
                'Content-Type': 'application/json'
            }
        );
        if(responseData) {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: responseData.token
            });
        }
    } catch (err) {
        console.error(err);
    }
}

//Edit user details
export const updateUser = (formState, method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/user',
            'PUT',
            JSON.stringify({
                formState
            }),
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            }
        );
        if(responseData) {
            dispatch({
                type: USER_LOADED,
                payload: responseData
            })
            M.toast({ html: 'User Details Updated', classes: 'green' });
        }
    } catch (error) {
        console.error(error);
    }
}

//Logout user
export const logout = () => async dispatch => {
    dispatch({ type: LOGOUT });
}

//Get all user
export const getAllUser = (method) => async dispatch => {
    try {
        const responseData = await method(
            process.env.REACT_APP_ASSET_URL + '/api/user',
            'GET',
            null,
            {
                'Authorization': 'Bearer ' + localStorage.token
            }
        );
        dispatch({
            type: ALL_USER_LOADED,
            payload: responseData
        });
    } catch (error) {}
}

//Get user by username
export const getUserByUserName = (username, method) => async dispatch => {
    try {
        const responseData =  await method(
            process.env.REACT_APP_ASSET_URL + '/api/user/' + username,
            'GET',
            null,
            {
                'Authorization': 'Bearer ' + localStorage.token
            }
        );
        dispatch({
            type: LOADED_SELECTED_USER,
            payload: responseData
        });
    } catch (error) {
        console.error(error);
    }
}
