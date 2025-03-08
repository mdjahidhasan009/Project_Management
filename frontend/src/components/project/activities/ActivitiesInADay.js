import React from 'react';

import ActivityDetails from "./ActivityDetails";
import './ActivitiesInADay.css'

const ActivitiesInADay = ({ activity }) => {
    const day = new Date(activity[0].time).getDate();
    const month = new Date(activity[0].time).getMonth() + 1;
    const year = new Date(activity[0].time).getFullYear();

    return (
        <div className="w-full bg-default flex lg:flex-row md:flex-row flex-col lg:items-start md:items-start items-center justify-between lg:gap-4 md:gap-3 gap2 lg:p-8 md:p-6 p-4 rounded-2xl">
            {/*Date section*/}
            <div className="flex flex-col items-center justify-center lg:gap-4 md:gap-3 gap-2 bg-[#1f2937] lg:w-40 md:w-36 w-28 lg:p-4 md:p-3 p-2 lg:rounded-[4px] md:rounded-[3px] rounded-[2px]">
                <p className="lg:text-3xl md:text-2xl text-2xl text-orange-500 font-bold">{day}</p>
                <p className="lg:text-2xl md:text-xl text-lg font-semibold">{month}</p>
                <p className="lg:text-2xl md:text-xl text-lg font-semibold">{year}</p>
            </div>
            {/*Activity of current date*/}
            <div className="flex flex-col gap-4 lg:w-10/12 md:w-10/12 w-full lg:mt-0 md:mt-0 mt-4">
                {activity.map((activityDetail, index) => (
                    <ActivityDetails key={index} activityDetail={activityDetail} />
                ))}
            </div>
        </div>
    )
}

export default ActivitiesInADay;
