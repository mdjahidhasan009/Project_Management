import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './Activities.css';
import {prepareActivity} from "../../../actions/project-action";
import ActivityRow from "./ActivityRow";

const Activities = ({ activities, prepareActivity }) => {
    useEffect(() => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

    }, []);

    return (
        <>
            {activities && activities.map(activity => (
                <ActivityRow activity={activity} key={new Date(activity[0].time).getDate()}/>
            ))}
        </>

    )
}

const mapStateToProps = state => ({
    activities: state.project.activities
})

export default connect(mapStateToProps, { prepareActivity })(Activities);
