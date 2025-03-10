import Swal from "sweetalert2";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {TApiError} from "../../types/api.types";
const VITE_ASSET_URL = import.meta.env.VITE_ASSET_URL;


type TRegisterParams = {
    name: string;
    username: string;
    email: string;
    password: string;
    method: (
        url: string,
        method?: 'POST',
        body?: BodyInit | null,
        headers?: HeadersInit
    ) => Promise<any>;
}

// Async Thunks
export const loadUser =
    createAsyncThunk<
        string,
        { method: Function },
        { rejectValue: TApiError | unknown }
    >
    ("auth/loadUser", async ({ method }, { rejectWithValue }) => {
    try {
        const responseData = await method(
            VITE_ASSET_URL + '/api/auth',
            'GET',
            null,
            { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        );
        return responseData;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const register = createAsyncThunk<string, TRegisterParams>(
    "auth/register",
    async ({ name, username, email, password, method }, { rejectWithValue }) => {
    try {
        const responseData = await method(
            VITE_ASSET_URL + '/api/user',
            'POST',
            JSON.stringify({ name, username, email, password }),
            { 'Content-Type': 'application/json' }
        );
        return responseData.token;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const login = createAsyncThunk<
    string,
    { email: string, password: string, method: Function },
    { rejectValue: TApiError | unknown }
>
("auth/login", async ({ email, password, method }, { rejectWithValue }) => {
    try {
        const responseData = await method(
            VITE_ASSET_URL + '/api/auth',
            'POST',
            JSON.stringify({ email, password }),
            { 'Content-Type': 'application/json' }
        );
        return responseData.token;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const updateUser = createAsyncThunk("auth/updateUser", async ({ formState, method }, { rejectWithValue }) => {
    try {
        const responseData = await method(
            VITE_ASSET_URL + '/api/user',
            'PUT',
            JSON.stringify({ formState }),
            { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        );
        Swal.fire({ title: 'Success', text: 'User Details Updated', icon: 'success' });
        return responseData;
    } catch (error) {
        return rejectWithValue(error);
    }
});

// TODO: will make getAllUsers
export const getAllUser = createAsyncThunk("auth/getAllUsers", async ({ method }, { rejectWithValue }) => {
    try {
        const responseData = await method(
            VITE_ASSET_URL + '/api/user',
            'GET',
            null,
            { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        );
        return responseData;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const getUserByUserName = createAsyncThunk("auth/getUserByUsername", async ({ username, method }, { rejectWithValue }) => {
    try {
        const responseData = await method(
            `${VITE_ASSET_URL}/api/user/${username}`,
            'GET',
            null,
            { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        );
        return responseData;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const uploadProfileImage = createAsyncThunk("auth/uploadProfileImage", async ({ base64EncodedImage, method }, { rejectWithValue }) => {
    try {
        await method(
            VITE_ASSET_URL + '/api/upload',
            'POST',
            JSON.stringify({ data: base64EncodedImage }),
            {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        );
        Swal.fire({
            title: 'Success',
            text: 'Image uploaded successfully',
            icon: 'success',
        });
    } catch (error) {
        return rejectWithValue(error);
    }
});
