import React, {Fragment, useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/auth-action";

import Navbar from './components/layout/MainNavbar';
import Auth from './components/auth/auth';
import Projects from './components/projects/Projects';
import Project from './components/project/Project';
import Dashboard from "./components/Dashboard/Dashboard";
import EditProfile from "./components/EditProfile/EditProfile";
import ProfileTop from "./components/profile/ProfileTop";
import Activities from './components/project/Activities';
import Discussion from './components/project/Discussion.js';
import Files from './components/project/Details.js';
import ToDoLists from './components/project/todos/ToDoLists.js';
import Bugs from './components/project/bugs/Bugs.js';
import Alert from "./components/layout/Alert";
import './App.css';
import MemberList from "./components/Member/MemberList";
import Profile from "./components/profile/Profile";
import UploadImage from "./components/ChangeImage/UploadImage";

if(localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    useEffect(() => {
        console.log('in app.js')
        store.dispatch(loadUser());
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
