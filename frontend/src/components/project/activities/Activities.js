import React, { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';

import ActivitiesInADay from "./ActivitiesInADay";
import {prepareActivity} from "../../../redux/slices/project-slice";

const Activities = () => {
    const dispatch = useDispatch();
    const projectSlice = useSelector(state => state.project);

    const project = projectSlice.project || null;
    const activities = projectSlice.activities || null;

    useEffect(() => {
        if(project) {
            dispatch(prepareActivity(project));
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

// const mapStateToProps = state => ({
//     project: state.project.project,
//     activities: state.project.activities
// })



// export default connect(mapStateToProps, { prepareActivity })(Activities);
export default Activities;

//As while not logged in activities of project state will be null nothing will show for that
