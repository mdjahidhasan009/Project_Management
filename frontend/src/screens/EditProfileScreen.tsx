import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import UploadImage from '../components/UploadImage';
import { updateUser, TUser } from "../redux/thunks/auth-thunks";
import { useHttpClient } from "../hooks/http-hook";
import { TFormState, TInputHandler, TSetFormData, useForm } from "../hooks/form-hook";
import Input from "../components/shared/FormElements/Input";
import {
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
    VALIDATOR_EMAIL,
    VALIDATOR_NOT_REQUIRE,
    VALIDATOR_LINK
} from "../utils/validators";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

// Define a type for form field keys
type FormFieldKey = 'fullName' | 'username' | 'email' | 'role' | 'skills' | 'bio' |
    'github' | 'twitter' | 'stackoverflow' | 'facebook' | 'linkedIn' |
    'instagram' | 'youtube' | 'newPassword' | 'confirmNewPassword' | 'currentPassword';

// Define a type for the input elements
type InputElement = {
    title: string;
    key: FormFieldKey;
    type: string;
    validator: any;
};

const EditProfileScreen = () => {
    const navigate = useNavigate();
    const { sendRequest } = useHttpClient();
    const dispatch = useAppDispatch();
    const authSlice = useAppSelector((state) => state.auth);

    const [profileImage, setProfileImage] = useState("");
    const initialValues = {
        fullName: {
            value: '',
            isValid: false,
        },
        username: {
            value: '',
            isValid: false,
        },
        email: {
            value: '',
            isValid: false,
        },
        role: {
            value: '',
            isValid: false,
        },
        skills: {
            value: '',
            isValid: false,
        },
        bio: {
            value: '',
            isValid: false,
        },
        github: {
            value: '',
            isValid: false,
        },
        twitter: {
            value: '',
            isValid: false,
        },
        stackoverflow: {
            value: '',
            isValid: false,
        },
        facebook: {
            value: '',
            isValid: false,
        },
        linkedIn: {
            value: '',
            isValid: false,
        },
        instagram: {
            value: '',
            isValid: false,
        },
        youtube: {
            value: '',
            isValid: false,
        },
        newPassword: {
            value: '',
            isValid: false,
        },
        confirmNewPassword: {
            value: '',
            isValid: false,
        },
        currentPassword: {
            value: '',
            isValid: false,
        }
    };

    const [formState, inputHandler, setFormData]: [TFormState, TInputHandler, TSetFormData] = useForm(
        initialValues,
        false
    );
    const [loading, setIsLoading] = useState(false);
    const user = authSlice?.user || null;
    const isAuthenticated = authSlice?.isAuthenticated || false;

    const inputElements: InputElement[] = [
        { title: 'Full Name', key: 'fullName', type: 'text', validator: VALIDATOR_MINLENGTH(5) },
        { title: 'Username', key: 'username', type: 'text', validator: VALIDATOR_MINLENGTH(5) },
        { title: 'Email', key: 'email', type: 'email', validator: VALIDATOR_EMAIL() },
        { title: 'Role', key: 'role', type: 'select', validator: VALIDATOR_REQUIRE() },
        { title: 'Skills', key: 'skills', type: 'text', validator: VALIDATOR_MINLENGTH(2) },
        { title: 'Bio', key: 'bio', type: 'textarea', validator: VALIDATOR_MINLENGTH(10) },
        { title: 'Github', key: 'github', type: 'text', validator: VALIDATOR_LINK() },
        { title: 'Twitter', key: 'twitter', type: 'text', validator: VALIDATOR_LINK() },
        { title: 'Stackoverflow', key: 'stackoverflow', type: 'text', validator: VALIDATOR_LINK() },
        { title: 'Facebook', key: 'facebook', type: 'text', validator: VALIDATOR_LINK() },
        { title: 'LinkedIn', key: 'linkedIn', type: 'text', validator: VALIDATOR_LINK() },
        { title: 'Instagram', key: 'instagram', type: 'text', validator: VALIDATOR_LINK() },
        { title: 'Youtube', key: 'youtube', type: 'text', validator: VALIDATOR_LINK() },
        { title: 'New Password', key: 'newPassword', type: 'password', validator: VALIDATOR_MINLENGTH(6) },
        { title: 'Confirm New Password', key: 'confirmNewPassword', type: 'password', validator: VALIDATOR_MINLENGTH(6) },
        { title: 'Current Password', key: 'currentPassword', type: 'password', validator: VALIDATOR_MINLENGTH(6) },
    ];

    // Helper function to safely get user values
    const getUserValue = (key: FormFieldKey): any => {
        if (!user) return '';

        // Handle social media fields
        if (['github', 'youtube', 'twitter', 'facebook', 'linkedIn', 'instagram', 'stackoverflow'].includes(key)) {
            return user.social?.[key as keyof typeof user.social] || '';
        }

        // Handle direct properties
        if (key in user) {
            return (user as any)[key];
        }

        // Password fields or other fields not in user
        return '';
    };

    const initializeFormData = () => {
        const formData: Record<FormFieldKey, { value: any, isValid: boolean }> = {} as any;

        for (const field of inputElements) {
            // For fields that should exist on the user object
            const value = getUserValue(field.key);

            formData[field.key] = {
                value: value,
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

    const saveProfile = async () => {
        if (formState?.inputs?.newPassword?.value !== formState?.inputs?.confirmNewPassword?.value) {
            // TODO: Handle this case
        } else {
            setIsLoading(true);
            dispatch(updateUser({ formState, method:

                sendRequest }));
            setIsLoading(false);
            navigate('/profile');
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
                                            initialValue={getUserValue(field.key)}
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

export default EditProfileScreen;
