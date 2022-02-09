import React from "react";
import { connect } from 'react-redux';

import { deleteMemberFromProject } from "../../../actions/project-action";
import { useHttpClient } from "../../../hooks/http-hook";
import './Member.css';
import {getUserRoleString} from "../../../utils/helper";

const Member = ({ project, member, isCreatedByUser, deleteMemberFromProject, noImage }) => {
    const { sendRequest } = useHttpClient();

    const removeMember = async () => {
        if(window.confirm('Do you want to remove this member from project?')) {
            await deleteMemberFromProject(project._id, member.user.username, sendRequest);
        }
    }

    return (
        <div className="row team-member">
            <div className="col s3 team-member__image">
                <img
                    src={member.user?.profileImage?.imageUrl === undefined
                        ?  noImage
                        :  member.user?.profileImage?.imageUrl
                    }
                    alt=" "
                    className="avatar "
                />
            </div>
            <div className="col s9 team-member__details">
                <p className="name">{member.user.username}</p>
                <p className="role">
                    {getUserRoleString(member.user?.role)}
                    {/*{member.user?.role}*/}
                    {isCreatedByUser && (
                        <i className="material-icons delete_icon" onClick={removeMember}>delete</i>
                    )}
                </p>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project,
    isCreatedByUser: state.project.isCreatedByUser,
    noImage: state.auth.noImage,
});

export default connect(mapStateToProps, { deleteMemberFromProject })(Member);
