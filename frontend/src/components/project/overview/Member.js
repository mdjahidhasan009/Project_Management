import React from "react";
import {useDispatch, useSelector} from 'react-redux';

import { deleteMemberFromProject } from "../../../redux/thunks/project-thunks";
import { useHttpClient } from "../../../hooks/http-hook";
import './Member.css';
import {getUserRoleString} from "../../../utils/helper";

const Member = ({ member }) => {
    const { sendRequest } = useHttpClient();
    const dispatch = useDispatch();
    const projectSlice = useSelector((state) => state.project);
    const authSlice = useSelector((state) => state.auth);

    const project = projectSlice.project || {};
    const isCreatedByUser = projectSlice.isCreatedByUser || false;
    const noImage = authSlice.noImage || '';

    const removeMember = async () => {
        if(window.confirm('Do you want to remove this member from project?')) {
            dispatch(deleteMemberFromProject({ projectId: project._id, username: member.user.username, method: sendRequest }));
        }
    }

    return (
        <div className="bg-default flex items-start p-2 lg:rounded-[4px] md:rounded-[3px] rounded-[2px]">
            <div className="h-14 w-20">
                <img
                    src={member.user?.profileImage?.imageUrl === undefined
                        ?  noImage
                        :  member.user?.profileImage?.imageUrl
                    }
                    alt=""
                    className="w-14 h-14 rounded-full object-cover"
                />
            </div>
            <div className="col s9 team-member__details">
                <p className="text-lg text-orange-500">{member.user.username}</p>
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

// const mapStateToProps = state => ({
//     project: state.project.project,
//     isCreatedByUser: state.project.isCreatedByUser,
//     noImage: state.auth.noImage,
// });

export default Member;
// export default connect(mapStateToProps, { deleteMemberFromProject })(Member);
