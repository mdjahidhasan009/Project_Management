import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';

import UploadImage from '../components/UploadImage';
import { updateUser } from "../actions/auth-action";
import { useHttpClient } from "../hooks/http-hook";
import { useForm } from "../hooks/form-hook";
import Input from "../components/shared/FormElements/Input";
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
    VALIDATOR_EMAIL,
    VALIDATOR_NOT_REQUIRE,
    VALIDATOR_LINK
} from "../utils/validators";

const EditProfileScreen = ({ auth: { user, isAuthenticated }, updateUser }) => {
    const history = useHistory();
    const { sendRequest } = useHttpClient();
    const [profileImage, setProfileImage] = useState("");
    const [formState, inputHandler, setFormData] = useForm();
    const [loading, setIsLoading] = useState(false);

    const initializeFormData = () => {
        const formData = {};
        for (const field of inputElements) {
            formData[field.key] = {
                value: user?.[field.key] || null,
                isValid: true,
            };
        }
        return formData;
    };

    useEffect(() => {
        if (user) {
            setFormData(initializeFormData(), false);
            if (user.profileImage?.imageUrl) {
                setProfileImage(user?.profileImage?.imageUrl);
            }
        }
        // eslint-disable-next-line
    }, [user]);

    const inputElements =  [
        { title: 'Full Name', key: 'fullName', type: 'text', validator: VALIDATOR_MINLENGTH(5) },
        { title: 'Username', key: 'username', type: 'text', validator: VALIDATOR_MINLENGTH(5) },
        { title: 'Email', key: 'email', type: 'email', validator: VALIDATOR_EMAIL() },
        { title: 'Role', key: 'role', type: 'select', validator: VALIDATOR_REQUIRE() },
        { title: 'Skills', key: 'skills', type: 'text', validator: VALIDATOR_MINLENGTH(2) },
        { title: 'Bio', key: 'bio', type: 'textarea', validator: VALIDATOR_MINLENGTH(10) },
        { title: 'Github', key: 'github', type: 'text', validator: VALIDATOR_LINK(user?.social?.github) },
        { title: 'Twitter', key: 'twitter', type: 'text', validator: VALIDATOR_LINK(user?.social?.twitter) },
        { title: 'Stackoverflow', key: 'stackoverflow', type: 'text', validator: VALIDATOR_LINK(user?.social?.stackoverflow) },
        { title: 'Facebook', key: 'facebook', type: 'text', validator: VALIDATOR_LINK(user?.social?.facebook) },
        { title: 'LinkedIn', key: 'linkedIn', type: 'text', validator: VALIDATOR_LINK(user?.social?.linkedIn) },
        { title: 'Instagram', key: 'instagram', type: 'text', validator: VALIDATOR_LINK(user?.social?.instagram) },
        { title: 'Youtube', key: 'youtube', type: 'text', validator: VALIDATOR_LINK(user?.social?.youtube) },
        { title: 'New Password', key: 'newPassword', type: 'password', validator: VALIDATOR_MINLENGTH(6) },
        { title: 'Confirm New Password', key: 'confirmNewPassword', type: 'password', validator: VALIDATOR_MINLENGTH(6) },
        { title: 'Current Password', key: 'currentPassword', type: 'password', validator: VALIDATOR_MINLENGTH(6) },
    ];

    const saveProfile = async () => {
        if (formState?.inputs?.newPassword?.value !== formState?.inputs?.confirmNewPassword?.value) {
            // TODO: Handle this case
        } else {
            setIsLoading(true);
            await updateUser(formState, sendRequest);
            setIsLoading(false);
            history?.push('/profile');
        }
    };

    return (
        <>
            {isAuthenticated && (
                <>
                    <div className="w-full row flex flex-col lg:gap-20 md:gap-14 gap-7">
                        {user && (
                            <div className="flex flex-col lg:items-start md:items-center justify-evenly lg:gap-7 md:gap-6 gap-4">
                                <UploadImage profileImageUrl={profileImage} />

                                {inputElements?.map((field) => (
                                    <div
                                        key={field?.key}
                                    >
                                        <h3 className="lg:mb-4 md:mb-3 mb-2">{field?.title}</h3>
                                        <Input
                                            element="input"
                                            placeholder={field?.title}
                                            elementTitle={field?.key}
                                            type={field?.type}
                                            validators={[field?.validator, VALIDATOR_NOT_REQUIRE()]}
                                            errorText={`Please enter a valid ${field?.key}.`}
                                            styleClass="lg:w-96 md:w-96 w-full lg:h-10 md:h-8 h-6 rounded-[4px] active:border-orange-500 focus:border-orange-500 p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                            onInput={inputHandler}
                                            initialValue={user?.[field?.key]}
                                            initialValidity={true}
                                        />
                                    </div>
                                ))}
                                <div className="lg:w-96 md:w-96 w-full flex justify-end mt-8">
                                    <button
                                        onClick={saveProfile}
                                        disabled={!formState?.isValid}
                                        className="flex items-center justify-center w-48 h-10 bg-[#1f2937] hover:bg-orange-500 font-semibold text-white-light rounded-[4px] px-4 py-2"
                                    >
                                        {loading && <i className="fas fa-spinner fa-pulse" />}
                                        {loading ? ' Saving Profile Details' : 'Save Profile Details'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
};

const mapStateToProps = (state) => ({
    auth: state?.auth,
});

export default connect(mapStateToProps, { updateUser })(EditProfileScreen);