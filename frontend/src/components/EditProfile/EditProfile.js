import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';

import { updateUser } from "../../actions/auth-action";
import { useHttpClient } from "../../hooks/http-hook";
import { useForm } from "../../hooks/form-hook";
import Input from "../shared/FormElements/Input";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE,VALIDATOR_EMAIL} from "../../utils/validators";
import M from 'materialize-css';
import './EditProfile.css';

const EditProfile = ({ user, updateUser }) => {
    const history = useHistory();
    const [ profileImage, setProfileImage ] = useState("");
    const [ formState, inputHandler, setFormData ] = useForm();
    const { isLoading, error, sendRequest , clearError } = useHttpClient();
    const [image, setImage] = useState('');

    useEffect(  () => {
        if(user) {
            setFormData(
                {
                    fullName: {
                        value: user.name,
                        isValid: true,
                    },
                    username: {
                        value: user.username,
                        isValid: true
                    },
                    email: {
                        value: user.email,
                        isValid: true,
                    },
                    role: {
                        value: user.role,
                        isValid: true
                    },
                    bio: {
                        value: user.bio || null,
                        isValid: true
                    },
                    skills: {
                        value: user.skills || null,
                        isValid: true
                    },
                    github: {
                        value: user.social && user.social.github || null,
                        isValid: true
                    },
                    youtube: {
                        value: user.social && user.social.youtube || null,
                        isValid: true
                    },
                    twitter: {
                        value: user.social && user.social.twitter || null,
                        isValid: true
                    },
                    facebook: {
                        value: user.social && user.social.facebook || null,
                        isValid: true
                    },
                    linkedIn: {
                        value: user.social && user.social.linkedIn || null,
                        isValid: true
                    },
                    instagram: {
                        value: user.social && user.social.instagram || null,
                        isValid: true
                    },
                    stackoverflow: {
                        value: user.social && user.social.stackoverflow || null,
                        isValid: true
                    },
                    newPassword: {
                        value: null,
                        isValid: true
                    },
                    confirmNewPassword: {
                        value: null,
                        isValid: true
                    },
                    currentPassword: {
                        value: null,
                        isValid: false
                    }
                },
                false
            )
        }
        if(user?.profileImage?.imageUrl) {
            setProfileImage(user.profileImage.imageUrl);
        }
    }, [user]);

    const saveProfile = async () => {
        console.log(formState);
        if(formState.inputs.newPassword.value !== formState.inputs.confirmNewPassword.value) {
            M.toast({html: 'Confirm password and Confirm new password have to be same', classes: 'red'});
        } else {
            await updateUser(formState, sendRequest);
            history.push('/profile');
        }
    }

    return(
        <div className="main">
            <div className="row edit_profile">
                <img
                    src={profileImage}
                    alt="Add Profile Image"
                    className="profile_avatar"
                />
                <a href="/uploadImage" className="btn">Change Profile Pic</a>

                {user && (
                    <div className="details">
                        <Input
                            label="Full Name"
                            element="input"
                            placeholder="Full Name"
                            elementTitle="fullName"
                            type="text"
                            validators={[VALIDATOR_MINLENGTH(5)]}
                            errorText="Please enter at least 5 character."
                            onInput={inputHandler}
                            initialValue={user.name}
                            initialValidity={true}
                        />
                        <Input
                            label="Username"
                            element="input"
                            placeholder="Username"
                            elementTitle="username"
                            type="text"
                            validators={[VALIDATOR_MINLENGTH(5)]}
                            errorText="Please enter at least 5 character."
                            onInput={inputHandler}
                            initialValue={user.username}
                            initialValidity={true}
                        />
                        <Input
                            label="Email"
                            element="input"
                            placeholder="Email"
                            elementTitle="email"
                            type="email"
                            validators={[VALIDATOR_EMAIL()]}
                            errorText="Please enter at least 5 character."
                            onInput={inputHandler}
                            initialValue={user.email}
                            initialValidity={true}
                        />
                        <Input
                            label="Role"
                            element="input"
                            placeholder="Role"
                            elementTitle="role"
                            type="text"
                            validators={[VALIDATOR_MINLENGTH(2)]}
                            errorText="Please enter at least 2 character."
                            onInput={inputHandler}
                            initialValue={user.role}
                            initialValidity={true}
                        />
                        <Input
                            label="Skills"
                            element="input"
                            placeholder="Use comma to separate skills such as(HTML, CSS, JavaScript)"
                            elementTitle="skills"
                            type="text"
                            validators={[VALIDATOR_MINLENGTH(2)]}
                            errorText="Please enter at least 2 character."
                            onInput={inputHandler}
                            initialValue={user.skills}
                            initialValidity={true}
                        />
                        <Input
                            label="Bio"
                            element="input"
                            placeholder="Bio"
                            elementTitle="bio"
                            type="textarea"
                            validators={[VALIDATOR_MINLENGTH(10)]}
                            errorText="Please enter at least 10 character."
                            onInput={inputHandler}
                            initialValue={user.bio}
                            initialValidity={true}
                        />
                        <Input
                            label="Github"
                            element="input"
                            placeholder="Github profile url"
                            elementTitle="github"
                            type="text"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter your github profile link"
                            onInput={inputHandler}
                            initialValue={user.social && user.social.github}
                            initialValidity={true}
                        />
                        <Input
                            label="Twitter"
                            element="input"
                            placeholder="Twitter profile url"
                            elementTitle="twitter"
                            type="text"
                            // validators={[VALIDATOR_MINLENGTH(2)]}
                            // errorText="Please enter at least 2 character."
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter your github profile link"
                            onInput={inputHandler}
                            initialValue={user.social && user.social.twitter}
                            initialValidity={true}
                        />
                        <Input
                            label="Stackoverflow"
                            element="input"
                            placeholder="Stackoverflow profile url"
                            elementTitle="stackoverflow"
                            type="text"
                            // validators={[VALIDATOR_MINLENGTH(2)]}
                            // errorText="Please enter at least 2 character."
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter your stackoverflow profile link"
                            onInput={inputHandler}
                            initialValue={user.social && user.social.stackoverflow}
                            initialValidity={true}
                        />
                        <Input
                            label="Facebook"
                            element="input"
                            placeholder="Facebook profile url"
                            elementTitle="facebook"
                            type="text"
                            // validators={[VALIDATOR_MINLENGTH(2)]}
                            // errorText="Please enter at least 2 character."
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter your github profile link"
                            onInput={inputHandler}
                            initialValue={user.social && user.facebook}
                            initialValidity={true}
                        />
                        <Input
                            label="LinkedIn"
                            element="input"
                            placeholder="LinkedIn profile url"
                            elementTitle="linkedIn"
                            type="text"
                            // validators={[VALIDATOR_MINLENGTH(2)]}
                            // errorText="Please enter at least 2 character."
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter your github profile link"
                            onInput={inputHandler}
                            initialValue={user.social && user.social.linkedIn}
                            initialValidity={true}
                        />
                        <Input
                            label="Instagram"
                            element="input"
                            placeholder="Instagram profile url"
                            elementTitle="instagram"
                            type="text"
                            // validators={[VALIDATOR_MINLENGTH(2)]}
                            // errorText="Please enter at least 2 character."
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter your github profile link"
                            onInput={inputHandler}
                            initialValue={user.social && user.social.instagram}
                            initialValidity={true}
                        />
                        <Input
                            label="Youtube"
                            element="input"
                            placeholder="Youtube channel url"
                            elementTitle="youtube"
                            type="text"
                            // validators={[VALIDATOR_MINLENGTH(2)]}
                            // errorText="Please enter at least 2 character."
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter your github profile link"
                            onInput={inputHandler}
                            initialValue={user.social && user.social.youtube}
                            initialValidity={true}
                        />

                        <Input
                            label="New Password"
                            element="input"
                            placeholder="New Password"
                            elementTitle="newPassword"
                            type="password"
                            validators={[VALIDATOR_MINLENGTH(6)]}
                            errorText="Please enter at least 6 character."
                            onInput={inputHandler}
                        />
                        <Input
                            label="Confirm New Password"
                            element="input"
                            placeholder="Confirm New Password"
                            elementTitle="confirmNewPassword"
                            type="password"
                            validators={[VALIDATOR_MINLENGTH(6)]}
                            errorText="Please enter at least 6 character."
                            onInput={inputHandler}
                        />
                        <Input
                            label="Current Password"
                            element="input"
                            placeholder="Current Password"
                            elementTitle="currentPassword"
                            type="password"
                            validators={[VALIDATOR_MINLENGTH(6)]}
                            errorText="Please enter current password."
                            onInput={inputHandler}
                        />
                        <button className="waves-effect waves-light blue btn"
                                onClick={saveProfile} disabled={!formState.isValid}>Save Profile Details</button>
                    </div>
                )}
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.auth.user
})

export default connect(mapStateToProps, { updateUser })(EditProfile);
