import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getAllUser } from "../../actions/auth-action";
import { useHttpClient } from "../../hooks/http-hook";
import MemberItem from "./MemberItem";

const Members = ({ users, getAllUser }) => {
    const { sendRequest } = useHttpClient();

    useEffect(() => {
        getAllUser(sendRequest);
    }, [])

    return (
        <div className="main">
            <div className="row memberList">
                {users && (
                    users.map(user => (
                        <MemberItem key={user.username} user={user}/>
                    ))
                )}
            </div>
        </div>

    )
}

const mapStateToProps = state => ({
    users: state.auth.users
})

export default connect(mapStateToProps, { getAllUser })(Members);
