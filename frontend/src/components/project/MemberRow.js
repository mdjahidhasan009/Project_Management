import React, {useEffect} from "react";
import { connect } from 'react-redux';

import './MemberRow.css';
import { deleteMemberFromProject } from "../../actions/project-action";
import {useHttpClient} from "../../hooks/http-hook";

const MemberRow = ({ project, member, isCreatedByUser, deleteMemberFromProject }) => {
    const { isLoading, error, sendRequest , clearError} = useHttpClient();

    useEffect(() => {
        console.log(member);
    }, [])
    const removeMember = async () => {
        console.log('clicked')
        await deleteMemberFromProject(project._id, member.user.username, sendRequest);
    }

    return (
        <div className="row member_list_row">
            <div className="col s3 member_image">
                <img
                    src={member.user?.profileImage?.imageUrl}
                    alt=" "
                    className="avatar "
                />
            </div>
            <div className="col s9">
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
    isCreatedByUser: state.project.isCreatedByUser
});

export default connect(mapStateToProps, { deleteMemberFromProject })(MemberRow);
