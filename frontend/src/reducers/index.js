import { combineReducers } from "redux";
import auth from './auth-reducer';
import project from './project-reducer';

export default combineReducers({
    auth,
    project
});
