import React from 'react'
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PropTypes } from "prop-types";

import './stylesheets/ProjectCard.css';

const ProjectCard = ({ project, noImage, noMember }) => {
    let history = useHistory();

    const openProject = async () => {
        await history.push('/project/' + project._id);
    };

    return (
        <div className="col s12 m6 l4 project_item">
            <div className="card white">
                <div className="card-content" onClick={openProject}>
                    <p className="card-title">{project.name}</p>
                    <p className="grey-text">{project.description}</p>
                    <hr/>

                    {/*Project summary(Total discussion, bugs, todos, members)*/}
                    <div className="summary black-text">
                        <div id="left" className="col s6">
                            <ul>
                                <li>
                                    <i className="tiny blue-text material-icons">brightness_1</i>
                                    { project?.discussion.length } Discussion
                                </li>
                                <li>
                                    <i className="tiny red-text material-icons">brightness_1</i>
                                    { project?.bugs.length }
                                    {
                                        project?.bugs.length > 1
                                            ? ' Bugs'
                                            : ' Bug'
                                    }
                                </li>
                            </ul>
                        </div>
                        <div id="right" className="col s6">
                            <ul>
                                <li>
                                    <i className="tiny red-text text-lighten-2 material-icons">brightness_1</i>
                                    { project?.todos.length }
                                    {
                                        project?.todos.length > 1
                                            ? ' Todos'
                                            : ' Todo'
                                    }
                                </li>

                                <li>
                                    <i className="tiny green-text material-icons">brightness_1</i>
                                    { project?.members.length }
                                    {
                                        project?.members.length > 1
                                            ? ' Members'
                                            : ' Member'
                                    }
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/*Members image*/}
                <div className="card-action">
                    <ul className="collection">
                        {project?.members?.length > 0 && project?.members.map(userItem => (
                            <li key={userItem?.user?.username+project._id} className="collection-item avatar">
                                {userItem.user && userItem.user.profileImage &&
                                    <img src={userItem?.user?.profileImage?.imageUrl} alt=" " className="circle"/>
                                }
                                {userItem.user && !userItem.user.profileImage &&
                                    <img src={noImage} alt=" " className="circle"/>
                                }
                            </li>
                        ))}
                        {project?.members?.length === 0 && (
                            <li key="no_member" className="collection-item avatar">
                                <img src={noMember} alt=" " className="circle"/>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

ProjectCard.propTypes = {
    project: PropTypes.object.isRequired,
    noImage: PropTypes.string.isRequired,
    noMember: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
    noImage: state.auth.noImage,
    noMember: state.auth.noMember
})

export default connect(mapStateToProps)(ProjectCard);
