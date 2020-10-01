import { combineReducers } from "redux";
import auth from './auth-reducer';
import form from './form-reducer';
import alert from './alert-reducer';
import project from './project-reducer';

export default combineReducers({
    auth,
    alert,
    form,
    project
});
