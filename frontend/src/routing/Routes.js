import React, { Fragment } from 'react';
import { Switch } from "react-router-dom";

import Dashboard from "../screens/DashboardScreen";
import Projects from "../screens/ProjectsScreen";
import Profile from "../screens/ProfileScreen";
import PrivateRoute from "./PrivateRoute";
import EditProfile from "../screens/EditProfileScreen";
import MemberList from "../screens/MembersScreen";
import UploadImage from "../components/UploadImage";
import ProjectScreen from "../screens/ProjectScreen";


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

                <PrivateRoute exact path="/activities/:projectId" selectedItem="activities"
                              component={ ProjectScreen }  />
                <PrivateRoute exact path="/discussion/:projectId" selectedItem="discussion"
                              component={ ProjectScreen } />
                <PrivateRoute exact path="/edit-project/:projectId" selectedItem="edit-project"
                              component={ ProjectScreen } />
                <PrivateRoute exact path="/todolist/:projectId" selectedItem="todolist"
                              component={ ProjectScreen } />
                <PrivateRoute exact path="/bugs/:projectId" selectedItem="bugs"
                              component={ ProjectScreen  } />
                <PrivateRoute exact path="/project/:projectId" selectedItem = "overview"
                              component = { ProjectScreen } />
            </Switch>
        </Fragment>
    )
}

export default Routes;
