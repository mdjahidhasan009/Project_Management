import { combineReducers } from "redux";
import auth from './auth-reducer';
import project from './project-reducer';
import projects from "./projects-reducer";

export default combineReducers({
    auth,
    project,
    projects
});
