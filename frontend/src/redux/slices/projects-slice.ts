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
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TProject} from "./project-slice";

type TProjects = TProject[];

const initialStateData: TProjects = [];

const projectsSlice = createSlice({
  name: "projects",
  initialState: initialStateData, ////TODO: will push projects into another project property
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(addProject.fulfilled, (state, action: PayloadAction<TProject>) => {
          state.push(action.payload);
        })
        .addCase(getAllProjects.fulfilled, (state, action: PayloadAction<TProject[]>) => {
          return action.payload;
        });
  },
});

export default projectsSlice.reducer;
