// import React, { Fragment } from 'react';
// import { Switch } from "react-router-dom";
//
// import Dashboard from "../screens/DashboardScreen";
// import Projects from "../screens/ProjectsScreen";
// import Profile from "../screens/ProfileScreen";
// import PrivateRoute from "./PrivateRoute";
// import EditProfile from "../screens/EditProfileScreen";
// import MemberList from "../screens/MembersScreen";
// import UploadImage from "../components/UploadImage";
// import ProjectScreen from "../screens/ProjectScreen";
//
//
// const Routes = () => {
//     return (
//         <Fragment>
//             <Switch>
//                 <PrivateRoute exact path="/dashboard" component={ Dashboard }  />
//                 <PrivateRoute exact path="/projects" component={ Projects } />
//                 <PrivateRoute exact path="/profile" component={ Profile } />
//                 <PrivateRoute exact path="/edit-profile" component={ EditProfile } />
//                 <PrivateRoute exact path="/members" component={ MemberList } />
//                 <PrivateRoute exact path="/member/:username" component={ Profile } />
//                 <PrivateRoute exact path="/uploadImage" component={ UploadImage } />
//
//                 <PrivateRoute exact path="/activities/:projectId" selectedItem="activities"
//                               component={ ProjectScreen }  />
//                 <PrivateRoute exact path="/discussion/:projectId" selectedItem="discussion"
//                               component={ ProjectScreen } />
//                 <PrivateRoute exact path="/edit-project/:projectId" selectedItem="edit-project"
//                               component={ ProjectScreen } />
//                 <PrivateRoute exact path="/todolist/:projectId" selectedItem="todolist"
//                               component={ ProjectScreen } />
//                 <PrivateRoute exact path="/bugs/:projectId" selectedItem="bugs"
//                               component={ ProjectScreen  } />
//                 <PrivateRoute exact path="/project/:projectId" selectedItem = "overview"
//                               component = { ProjectScreen } />
//             </Switch>
//         </Fragment>
//     )
// }
//
// export default Routes;

import React from 'react';
import { Routes, Route } from "react-router-dom";

import Dashboard from "../screens/DashboardScreen";
import Projects from "../screens/ProjectsScreen";
import Profile from "../screens/ProfileScreen";
import PrivateRoute from "./PrivateRoute";
import EditProfile from "../screens/EditProfileScreen";
import MemberList from "../screens/MembersScreen";
import UploadImage from "../components/UploadImage";
import ProjectScreen from "../screens/ProjectScreen";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            <Route path="/members" element={<PrivateRoute><MemberList /></PrivateRoute>} />
            <Route path="/member/:username" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/uploadImage" element={<PrivateRoute><UploadImage /></PrivateRoute>} />

            <Route
                path="/activities/:projectId"
                element={
                    <PrivateRoute>
                        <ProjectScreen selectedItem="activities" />
                    </PrivateRoute>
                }
            />
            <Route path="/discussion/:projectId" element={
                <PrivateRoute>
                    <ProjectScreen selectedItem="discussion" />
                </PrivateRoute>
            } />
            <Route path="/edit-project/:projectId" element={
                <PrivateRoute>
                    <ProjectScreen selectedItem="edit-project" />
                </PrivateRoute>
            } />
            <Route path="/todolist/:projectId" element={
                <PrivateRoute>
                    <ProjectScreen selectedItem="todolist" />
                </PrivateRoute>
            } />
            <Route path="/bugs/:projectId" element={
                <PrivateRoute>
                    <ProjectScreen selectedItem="bugs" />
                </PrivateRoute>
            } />
            <Route path="/project/:projectId" element={
                <PrivateRoute>
                    <ProjectScreen selectedItem="overview" />
                </PrivateRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;