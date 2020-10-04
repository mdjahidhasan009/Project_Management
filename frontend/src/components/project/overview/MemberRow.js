import React  from "react";
import { connect } from 'react-redux';

import { deleteMemberFromProject } from "../../../actions/project-action";
import { useHttpClient } from "../../../hooks/http-hook";
import './MemberRow.css';

const MemberRow = ({ project, member, isCreatedByUser, deleteMemberFromProject, noImage }) => {
    const { sendRequest } = useHttpClient();

    const removeMember = async () => {
        await deleteMemberFromProject(project._id, member.user.username, sendRequest);
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
                <p className="role">{member.user?.role}</p>
                {isCreatedByUser && (
                    <i className="material-icons delete_icon" onClick={removeMember}>delete</i>
                )}
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project,
    isCreatedByUser: state.project.isCreatedByUser,
    noImage: state.auth.noImage,
});

export default connect(mapStateToProps, { deleteMemberFromProject })(MemberRow);
