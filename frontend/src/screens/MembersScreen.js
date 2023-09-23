import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getAllUser } from "../actions/auth-action";
import { useHttpClient } from "../hooks/http-hook";
import Member from "../components/Member";

const MembersScreen = ({ auth: { users }, getAllUser }) => {
    const { sendRequest } = useHttpClient();

    useEffect(() => {
        getAllUser(sendRequest);
    }, []);

    return (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-8 md:gap-6 gap-4">
            {users && (
                users?.map(user => (
                    <Member key={user?.username} user={user}/>
                ))
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { getAllUser })(MembersScreen);
