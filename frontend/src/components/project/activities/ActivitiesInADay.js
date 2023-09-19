import React from 'react';

import ActivityDetails from "./ActivityDetails";
import './ActivitiesInADay.css'

const ActivitiesInADay = ({ activity }) => {
    const day = new Date(activity[0].time).getDate();
    const month = new Date(activity[0].time).getMonth() + 1;
    const year = new Date(activity[0].time).getFullYear();

    return (
        <div className="bg-default flex items-start justify-between gap-4 p-8 rounded-2xl">
            {/*Date section*/}
            <div className="flex flex-col items-center justify-center gap-4 bg-[#1f2937] w-40 p-4 rounded-[4px]">
                <p className="text-3xl text-orange-500 font-bold">{day}</p>
                <p className="text-2xl font-semibold">{month}</p>
                <p className="text-2xl font-semibold">{year}</p>
            </div>
            {/*Activity of current date*/}
            <div className="flex flex-col gap-4 w-10/12">
                {activity.map((activityDetail, index) => (
                    <ActivityDetails key={index} activityDetail={activityDetail} />
                ))}
            </div>
        </div>
    )
}

export default ActivitiesInADay;
