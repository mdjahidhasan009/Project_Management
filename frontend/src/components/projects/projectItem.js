import React, {useEffect, useState} from 'react'
import { connect } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';

import './ProjectItem.css';

const ProjectItem = ({ project, noImage, noMember }) => {
    let history = useHistory();

    const openProject = async () => {
        console.log(project._id);
        console.log(project.name);
        await history.push('/project/' + project._id);

        console.log('clicked');
    }

    useEffect(() => {
        console.log(project)
    }, [])

    return (
        <div className="col s12 m6 l4 project_item">
            <div className="card white">
                <div className="card-content" onClick={openProject}>
                    <p className="card-title">{project.name}</p>
                    <p className="grey-text">{project.description}</p>
                    <hr/>
                    <div className="summary black-text">
                        <div id="left" className="col s6">
                            <ul>
                                <li><i className="tiny blue-text material-icons">brightness_1</i>  {project.discussion.length} Discussion</li>
                                <li><i className="tiny red-text material-icons">brightness_1</i> {project.bugs.length} Bug</li>
                                {/*<li><i className="tiny blue-text text-lighten-4 material-icons">brightness_1</i>  0 Details</li>*/}
                            </ul>
                        </div>
                        <div id="right" className="col s6">
                            <ul>
                                <li><i className="tiny red-text text-lighten-2 material-icons">brightness_1</i>  {project.todos.length} To-do list</li>
                                {/*<li><i className="tiny yellow-text material-icons">brightness_1</i>  0 Comments</li>*/}
                                <li><i className="tiny green-text material-icons">brightness_1</i>  0 Milestone</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="card-action">
                    <ul className="collection">
                        {project?.members?.length > 0 && project?.members.map(userItem => (
                            <li key={userItem?.user?.username} className="collection-item avatar">
                                {userItem.user && userItem.user.profileImage &&
                                    <img src={userItem?.user?.profileImage?.imageUrl} alt=" " className="circle"/>
                                }
                                {userItem.user && !userItem.user.profileImage &&
                                    <img src={noImage} alt=" " className="circle"/>
                                }
                                {console.log(userItem?.user?.profileImage?.imageUrl)}
                            </li>
                        ))}
                        {project?.members?.length === 0 && (
                            <li key="88" className="collection-item avatar">
                                <img src={noMember} alt=" " className="circle"/>
                            </li>
                        )}
                        {/*{project?.members?.length === 0 && <img src={noImage} alt=" " className="circle"/>}*/}
                    </ul>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    noImage: state.auth.noImage,
    noMember: state.auth.noMember
})

export default connect(mapStateToProps)(ProjectItem);
