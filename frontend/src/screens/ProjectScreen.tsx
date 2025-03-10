import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectSummaryRow from "../components/project/projectSummary/ProjectSummary";
import Overview from "../components/project/overview/Overview";
import Discussion from "../components/project/discussion/Discussions";
import Activities from "../components/project/activities/Activities";
import EditProjectDetails from "../components/project/edit-project-details/EditProjectDetails";
import Todos from "../components/project/todos/Todos";
import Bugs from "../components/project/bugs/Bugs";
import { useHttpClient } from "../hooks/http-hook";
import {
    getProjectById, getNotAssignedMember, prepareWorkDonePreview, getIsMemberAndCreatorOfProject
} from "../redux/thunks/project-thunks";
import {useAppDispatch, useAppSelector} from "../redux/hooks";

const ProjectScreen = ({ selectedItem }: { selectedItem: string }) => {
    const { sendRequest } = useHttpClient();
    const projectId = useParams().projectId || "";
    const dispatch = useAppDispatch();

    const projectSlice = useAppSelector(state => state.project);

    const project = projectSlice.project || null;

    useEffect(() => {
        dispatch(getProjectById({
            projectId: projectId,
            method: sendRequest
        }));
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(!project) {
            dispatch(getIsMemberAndCreatorOfProject({
                projectId: projectId,
                method: sendRequest
            }));
            dispatch(getNotAssignedMember({
                projectId: projectId,
                method: sendRequest
            }));
            dispatch(prepareWorkDonePreview({
                projectId: projectId,
                method: sendRequest
            }));
        }
        // eslint-disable-next-line
    }, [project])

    return (
        <div className="flex flex-col lg:gap-8 md:gap-6 gap-4">
            <>
                <ProjectSummaryRow projectId={projectId} selectedItem={selectedItem} />
                {selectedItem === 'overview' && <Overview />}
                {selectedItem === 'activities' && <Activities />}
                {selectedItem === 'discussion' && <Discussion />}
                {selectedItem === 'todolist' && <Todos />}
                {selectedItem === 'bugs' && <Bugs />}
                {selectedItem === 'edit-project' && <EditProjectDetails />}
            </>
        </div>
    );
};

export default ProjectScreen;

//Checking isAuthenticated here casing delay html preparing and for this index.html does not get any modal for initialization
//So I put authentication check in projectSummary and and also other file(Overview, bug etc)
