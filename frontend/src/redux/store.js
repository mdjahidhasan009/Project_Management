// import { createStore, applyMiddleware } from 'redux';
// import { composeWithDevTools } from "redux-devtools-extension";
// import thunk from 'redux-thunk';
// import rootReducer from './reducers';
//
// const initialState = {};
//
// const middleware = [thunk];
//
// const store = createStore(
//     rootReducer,
//     initialState,
//     composeWithDevTools(applyMiddleware(...middleware))
// );
//
// export default store;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth-slice";
import projectReducer from "./slices/project-slice";
import projectsReducer from "./slices/projects-slice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        project: projectReducer,
        projects: projectsReducer,
    },
    devTools: process.env.NODE_ENV !== "production", // Enables Redux DevTools only in development
});

export default store;
