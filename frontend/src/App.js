import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';
import { loadUser } from "./actions/auth-action";
import { useHttpClient } from "./hooks/http-hook";

import Navbar from './components/layout/MainNavbar';
import Auth from './components/auth/auth';
import Projects from './components/projects/Projects';
import Project from './components/project/Project';
import Dashboard from "./components/Dashboard/Dashboard";
import EditProfile from "./components/EditProfile/EditProfile";
import ProfileTop from "./components/profile/Profile";
import MemberList from "./components/Member/Members";
import UploadImage from "./components/ChangeImage/UploadImage";

const App = () => {
    const { sendRequest } = useHttpClient();

    useEffect(() => {
        store.dispatch(loadUser(sendRequest));
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Switch>
                        <Route exact path="/" component={ Dashboard }  />
                        <Route exact path="/authenticate" component={ Auth }  />
                        <Route exact path="/projects" component={ Projects }  />
                        <Route exact path="/profile" component={ ProfileTop }  />
                        <Route exact path="/edit-profile" component={ EditProfile }  />
                        <Route exact path="/members" component={ MemberList }  />
                        <Route exact path="/member/:username" component={ ProfileTop }  />
                        <Route exact path="/uploadImage" component={ UploadImage } />

                        <Route exact path="/activities/:projectId" render={() => <Project selectedItem="activities" />}  />
                        <Route exact path="/discussion/:projectId" render={() => <Project selectedItem="discussion" />}/>
                        <Route exact path="/details/:projectId" render={() => <Project selectedItem="details" />}  />
                        <Route exact path="/todolist/:projectId" render={() => <Project selectedItem="todolist" />}  />
                        <Route exact path="/bugs/:projectId" render={() => <Project selectedItem="bugs" />}  />
                        <Route exact path="/project/:projectId"><Project selectedItem = "overview" /> </Route>
                    </Switch>
                </Fragment>
            </Router>
        </Provider>
    );
}

export default App;
