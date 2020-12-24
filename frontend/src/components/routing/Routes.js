import React, { Fragment } from 'react';
import { Switch, Route } from "react-router-dom";

import Dashboard from "../Dashboard/Dashboard";
import Projects from "../projects/Projects";
import Profile from "../profile/Profile";
import PrivateRoute from "./PrivateRoute";
import EditProfile from "../EditProfile/EditProfile";
import MemberList from "../Member/Members";
import UploadImage from "../ChangeImage/UploadImage";
import Project from "../project/ProjectScreen";


const Routes = () => {
    return (
        <Fragment>
            <Switch>
                <PrivateRoute exact path="/dashboard" component={ Dashboard }  />
                <PrivateRoute exact path="/projects" component={ Projects } />
                <PrivateRoute exact path="/profile" component={ Profile } />
                <PrivateRoute exact path="/edit-profile" component={ EditProfile } />
                <PrivateRoute exact path="/members" component={ MemberList } />
                <PrivateRoute exact path="/member/:username" component={ Profile } />
                <PrivateRoute exact path="/uploadImage" component={ UploadImage } />

                <PrivateRoute exact path="/activities/:projectId" selectedItem="activities" component={ Project }  />
                <PrivateRoute exact path="/discussion/:projectId" selectedItem="discussion" component={ Project } />
                <PrivateRoute exact path="/edit-project/:projectId" selectedItem="edit-project" component={ Project } />
                <PrivateRoute exact path="/todolist/:projectId" selectedItem="todolist" component={ Project } />
                <PrivateRoute exact path="/bugs/:projectId" selectedItem="bugs" component={ Project  } />
                <PrivateRoute exact path="/project/:projectId" selectedItem = "overview" component = { Project } />
            </Switch>
        </Fragment>
    )
}

export default Routes;
