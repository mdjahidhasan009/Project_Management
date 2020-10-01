import axios from 'axios';

import setAuthTokenToAxiosHeader from "../utils/setAuthToken";

import {ALL_USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGOUT, REGISTER_SUCCESS, USER_LOADED,
    LOADED_SELECTED_USER
} from './types'

//Load user form token
export const loadUser = () => async dispatch => {
    console.log('in load user')
    if(localStorage.token) {
        console.log(localStorage.token);
        setAuthTokenToAxiosHeader(localStorage.token);
    }
    try {
        const res = await axios.get(process.env.REACT_APP_ASSET_URL + '/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (e) {
        dispatch({
            type: AUTH_ERROR
        })
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
        console.log(responseData);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: responseData //token
        });
        // dispatch(loadUser()); //will do later after add image upload
        console.log(responseData)
        // auth.login(responseData.userId, responseData.token);
    } catch (e) {
        console.log(e);
        throw e;
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
        dispatch({
            type: LOGIN_SUCCESS,
            payload: responseData   //Token
        });
        // dispatch(loadUser()); //will do later after add image upload
        // await auth.login(responseData.userId, responseData.token);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//Edit user details
export const updateUser = (formState, method) => async dispatch => {
    try {
        // console.log(fullName, username, email, role, newPassword, currentPassword);
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
        console.log(responseData);
    } catch (error) {
        console.log(error);
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
    } catch (error) {
        console.error(error);
    }
}

//Get user by username
export const getUserByUserName = (username, method) => async dispatch => {
    console.log('in getUserByUserName')
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



//Check is given username available
export const isUsernameAvailable = () => async dispatch => {

}
