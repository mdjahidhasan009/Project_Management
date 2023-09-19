import React from "react";

import './ActivityDetails.css';
import {Link} from "react-router-dom";

const ActivityDetails = ({ activityDetail }) => {
     let type;
     if(activityDetail.type === 'todo') type = 'Todo added ';
     if(activityDetail.type === 'todo-done') type = 'Todo done ';
     else if(activityDetail.type === 'bug') type = 'Bug appear ';
     else if(activityDetail.type === 'bug-fixed') type = 'Bug fixed ';
     else if(activityDetail.type === 'discuss') type = 'Discussion added ';

    return (
        <div className="col s12 m11 l11 activity_details_row">
            <div className="activity_details_row__div white">
                <p>
                    <span className={
                        `${((type === 'Todo done ' || type === 'Bug fixed ') && 'green-text') 
                           || ((type === 'Bug appear ') && 'red-text')
                           || ((type === 'Todo added ') && 'purple-text')
                           }`
                        }>{type}
                    </span>
                    {activityDetail.text + " "}
                    by {" "}
                    <Link to={`/member/${activityDetail.user}`} className="text-orange-500 hover:underline">{activityDetail.user}</Link>
                    {" "}
                    at - {new Date(activityDetail.time).toUTCString()}
                </p>
            </div>
        </div>
    )
}

export default ActivityDetails;
