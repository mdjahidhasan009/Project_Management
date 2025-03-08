// import { combineReducers } from "redux";
// import auth from './auth-reducer';
// import project from './project-reducer';
// import projects from "./projects-reducer";
//
// export default combineReducers({
//     auth,
//     project,
//     projects
// });

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import projectReducer from "./project-slice";
import projectsReducer from "./projects-slice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        project: projectReducer,
        projects: projectsReducer,
    },
});

export default store;
