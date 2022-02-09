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
        <>
            {/*Activities Row*/}
            {activities && activities.map(activity => (
                <ActivitiesInADay activity={activity} key={new Date(activity[0].time).getDate()}/>
            ))}
        </>
    )
}

const mapStateToProps = state => ({
    project: state.project.project,
    activities: state.project.activities
})

export default connect(mapStateToProps, { prepareActivity })(Activities);

//As while not logged in activities of project state will be null nothing will show for that
