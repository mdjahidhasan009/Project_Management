import React from "react";
import {useHistory} from "react-router-dom";

import './ActivityDetailsRow.css';

const ActivityDetailsRow = ({ activityDetail }) => {
    const history = useHistory();
     let type;
     if(activityDetail.type === 'todo') type = 'Todo added ';
     if(activityDetail.type === 'todo-done') type = 'Todo done ';
     else if(activityDetail.type === 'bug') type = 'Bug appear ';
     else if(activityDetail.type === 'bug-fixed') type = 'Bug fixed ';
     else if(activityDetail.type === 'discuss') type = 'Discussion added ';
     console.log(type[0])
    return (
        <div className="col s12 m11 l11 col_section">
            <div className="activity_section white">
                <p>
                    <span className={
                        `${((type === 'Todo done ' || type === 'Bug fixed ') && 'green-text') 
                           || ((type === 'Bug appear ') && 'red-text')
                           || ((type === 'Todo added ') && 'purple-text')
                           }`
                        }>{type}
                    </span>
                    {activityDetail.text + " "}
                    {/*by {" " + activityDetail.user + " "}*/}
                    by {" "}
                    <a href={`/member/${activityDetail.user}`}>{activityDetail.user}</a>
                    {" "}
                    at - {new Date(activityDetail.time).getHours()}:{new Date(activityDetail.time).getMinutes()}
                </p>
            </div>
        </div>
    )
}

export default ActivityDetailsRow;
