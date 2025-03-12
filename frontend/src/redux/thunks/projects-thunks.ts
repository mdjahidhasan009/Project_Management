// //Add new project
// // import M from "materialize-css";
// import {ADD_PROJECT, GET_PROJECTS} from "./types";
// import Swal from "sweetalert2";
//
// export const addProject = (projectName, projectCategory, projectDescription, projectDeadline, method) => async dispatch =>{
//   try {
//     const responseData = await method(
//         VITE_ASSET_URL +'/api/project',
//         'POST',
//         JSON.stringify({
//           name: projectName,
//           category: projectCategory,
//           description: projectDescription,
//           deadline: projectDeadline
//         }),
//         {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + localStorage.token
//         }
//     )
//     //TODO: HAVE TO FIX
//     // M.toast({html: 'New Project Added', classes: 'green'});
//       Swal.fire({
//           title: 'Success',
//           text: 'New Project Added',
//           icon: 'success',
//       });
//     dispatch({
//       type: ADD_PROJECT,
//       payload: responseData
//     })
//   } catch(error) {
//     console.error(error);
//   }
// }
//
// //Get all projects
// export const getAllProjects = (method) => async dispatch => {
//   try {
//     const responseData = await method(
//         VITE_ASSET_URL +'/api/project',
//         'GET',
//         null,
//         {
//           Authorization: 'Bearer ' + localStorage.token
//         }
//     );
//     dispatch({
//       type: GET_PROJECTS,
//       payload: responseData
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }

// Async thunk to add a project
import {createAsyncThunk} from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import {TProject} from "../slices/project-slice";
const VITE_ASSET_URL = import.meta.env.VITE_ASSET_URL;

export const addProject = createAsyncThunk<
    TProject,
    { projectName: string, projectCategory: string, projectDescription: string, projectDeadline: string, method: Function },
    { rejectValue: string }
>(
    "projects/addProject",
    async ({ projectName, projectCategory, projectDescription, projectDeadline, method }, { rejectWithValue }) => {
        try {
            const responseData = await method(
                VITE_ASSET_URL + "/api/project",
                "POST",
                JSON.stringify({
                    name: projectName,
                    category: projectCategory,
                    description: projectDescription,
                    deadline: projectDeadline,
                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.token,
                }
            );
            Swal.fire({ title: "Success", text: "New Project Added", icon: "success" });
            return responseData;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error instanceof Error ? error.message : "An error occurred");
        }
    }
);

// Async thunk to get all projects
export const getAllProjects = createAsyncThunk<
    TProject[],
    { method: Function },
    { rejectValue: string }
>(
    "projects/getAllProjects",
    async ({ method }, { rejectWithValue }) => {
        try {
            const responseData = await method(
                VITE_ASSET_URL + "/api/project",
                "GET",
                null,
                {
                    Authorization: "Bearer " + localStorage.token,
                }
            );
            return responseData;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error instanceof Error ? error.message : "An error occurred");
        }
    }
);
