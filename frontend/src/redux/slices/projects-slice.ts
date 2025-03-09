// import {
//   ADD_PROJECT, GET_PROJECTS
// } from "../actions/types";
//
// const initialState = {};
//
// export default function (state = initialState, action) {
//   const { type, payload } = action;
//
//   switch (type) {
//     case ADD_PROJECT:
//       return [...state, payload];
//     case GET_PROJECTS:
//       return  payload;
//     default:
//       return state;
//   }
// }
//

import {addProject, getAllProjects} from "../thunks/projects-thunks";
import {createSlice} from "@reduxjs/toolkit";

const projectsSlice = createSlice({
  name: "projects",
  initialState: [], ////TODO: will push projects into another project property
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(addProject.fulfilled, (state, action) => {
          state.push(action.payload);
        })
        .addCase(getAllProjects.fulfilled, (state, action) => {
          return action.payload;
        });
  },
});

export default projectsSlice.reducer;
