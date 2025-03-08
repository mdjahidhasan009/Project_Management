// //Add new project
// // import M from "materialize-css";
// import {ADD_PROJECT, GET_PROJECTS} from "./types";
// import Swal from "sweetalert2";
//
// export const addProject = (projectName, projectCategory, projectDescription, projectDeadline, method) => async dispatch =>{
//   try {
//     const responseData = await method(
//         process.env.REACT_APP_ASSET_URL +'/api/project',
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
//         process.env.REACT_APP_ASSET_URL +'/api/project',
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

export const addProject = createAsyncThunk(
    "projects/addProject",
    async ({ projectName, projectCategory, projectDescription, projectDeadline, method }, { rejectWithValue }) => {
        try {
            const responseData = await method(
                process.env.REACT_APP_ASSET_URL + "/api/project",
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
            return rejectWithValue(error.response?.data || "Failed to add project");
        }
    }
);

// Async thunk to get all projects
export const getAllProjects = createAsyncThunk(
    "projects/getAllProjects",
    async ({ method }, { rejectWithValue }) => {
        try {
            const responseData = await method(
                process.env.REACT_APP_ASSET_URL + "/api/project",
                "GET",
                null,
                {
                    Authorization: "Bearer " + localStorage.token,
                }
            );
            return responseData;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error.response?.data || "Failed to fetch projects");
        }
    }
);