import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { getAllUser } from "../actions/auth-action";
import { useHttpClient } from "../hooks/http-hook";
import Member from "../components/Member";

const MembersScreen = ({ auth: { users }, getAllUser }) => {
    const { sendRequest } = useHttpClient();

    useEffect(() => {
        getAllUser(sendRequest);
      // eslint-disable-next-line
    }, []);

    return (
        <div className="main">
            <div className="row memberList">
                {users && (
                    users.map(user => (
                        <Member key={user.username} user={user}/>
                    ))
                )}
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { getAllUser })(MembersScreen);
