import React from 'react';

import { useHttpClient } from "../../../hooks/http-hook";
import { toggleIsFixed } from "../../../redux/thunks/project-thunks";
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {TBug} from "../../../redux/slices/project-slice";

const FixedBug = ({ bug, projectId }: { bug: TBug, projectId: string }) => {
    const { sendRequest } = useHttpClient();
    const dispatch = useAppDispatch();
    const authSlice = useAppSelector(state => state.auth);
    const noImage = authSlice.noImage || "";

    const handleIsFixed = async () => {
        dispatch(toggleIsFixed({ projectId: projectId, bugId: bug._id, isFixed: 'false', method: sendRequest }));
    }

    return (
        <>
            {bug.fixed && (
                <div
                    onClick={handleIsFixed}
                    className="bg-default flex lg:flex-row md:flex-row flex-col items-center justify-between lg:gap-8 md:gap-6 gap-4 lg:p-8 md:p-6 p-4 lg:rounded-2xl md:rounded-xl rounded-lg cursor-pointer"
                    id="discussion-row"
                >
                    <div className="lg:w-2/12 md:w-3/12 w-full flex lg:justify-start md:justify-start justify-center">
                        <img
                            src = {
                                bug.user?.profileImage?.imageUrl === undefined
                                    ? noImage
                                    : bug.user?.profileImage?.imageUrl
                            }
                            alt=" "
                            className="w-40 h-32 rounded-full object-cover"
                        />
                    </div>
                    <div className="group lg:w-10/12 md:w-9/12 w-full">
                        <p className="text-justify">{bug.text}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default FixedBug;
