import React from 'react';

import ActivityDetailsRow from "./ActivityDetailsRow";
import './ActivityRow.css'

const ActivityRow = ({ activity }) => {
    const day = new Date(activity[0].time).getDate();
    const month = new Date(activity[0].time).getMonth() + 1;
    const year = new Date(activity[0].time).getFullYear();

    return (
        <div className="row activity">
            {/*Date section*/}
            <div className="col s12 m1 l1 time_section white">
                <p className="date">{day}</p>
                <p className="month">{month}</p>
                <p className="year">{year}</p>
            </div>
            {/*Activity of current date*/}
            {activity.map(activityDetail => (
                <ActivityDetailsRow activityDetail={activityDetail} />
            ))}
        </div>
    )
}

export default ActivityRow;
