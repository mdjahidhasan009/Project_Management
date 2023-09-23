import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { prepareActivity } from "../../../actions/project-action";
import ActivitiesInADay from "./ActivitiesInADay";

const Activities = ({ project, activities, prepareActivity }) => {
    useEffect(() => {
        if(project) {
            prepareActivity(project);
        }
        // eslint-disable-next-line
    }, [project]);

    return (
        <div className="bg-[#1f2937] lg:p-8 md:p-6 p-4 lg:rounded-2xl md:rounded-xl rounded-lg flex flex-col lg:gap-8 md:gap-6 gap-4">
            {/*Activities Row*/}
            {activities && activities.length > 0
                ? activities.map(activity => (
                    <ActivitiesInADay activity={activity} key={new Date(activity[0].time).getDate()}/>
                ))
                : <h5 className="center-align">No Activity in this project yet!!</h5>
            }
        </div>
    )
}

const mapStateToProps = state => ({
    project: state.project.project,
    activities: state.project.activities
})

export default connect(mapStateToProps, { prepareActivity })(Activities);

//As while not logged in activities of project state will be null nothing will show for that
