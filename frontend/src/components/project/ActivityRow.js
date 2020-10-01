import React, {useEffect} from 'react';

import './ActivityRow.css'
import ActivityDetailsRow from "./ActivityDetailsRow";

const ActivityRow = ({ activity }) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

    const day = new Date(activity[0].time).getDate();
    // const month = monthNames[new Date(activity[0].time).getMonth()];
    const month = new Date(activity[0].time).getMonth() + 1;
    const year = new Date(activity[0].time).getFullYear();

    return (
        <div className="row activity">
            <div className="col s12 m1 l1 time_section white">
                <p className="date">{day}</p>
                <p className="month">{month}</p>
                <p className="year">{year}</p>
            </div>
            {activity.map(activityDetail => (
                <ActivityDetailsRow activityDetail={activityDetail} />
            ))}
        </div>
    )
}

export default ActivityRow;
