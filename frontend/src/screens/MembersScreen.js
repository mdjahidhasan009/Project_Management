import React, { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getAllUser } from "../redux/thunks/auth-thunks";
import { useHttpClient } from "../hooks/http-hook";
import Member from "../components/Member";

const MembersScreen = () => {
    const { sendRequest } = useHttpClient();
    const dispatch = useDispatch();
    const authSlice = useSelector(state => state.auth);

    const users = authSlice.users || [];

    useEffect(() => {
        dispatch(getAllUser({ method: sendRequest }));
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

// const mapStateToProps = state => ({
//     auth: state.auth
// })


export default MembersScreen;
// export default connect(mapStateToProps, { getAllUser })(MembersScreen);
