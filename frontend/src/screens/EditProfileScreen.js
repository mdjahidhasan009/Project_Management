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
import M from 'materialize-css';

const EditProfileScreen = ({ auth: { user, isAuthenticated }, updateUser }) => {
  const history = useHistory();
  const [ profileImage, setProfileImage ] = useState("");
  const [ formState, inputHandler, setFormData ] = useForm();
  const { sendRequest } = useHttpClient();
  const [ loading, setIsLoading ] = useState(false);

  useEffect(  () => {
    let elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
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
              value: (user.social && user.social.github) || null,
              isValid: true
            },
            youtube: {
              value: (user.social && user.social.youtube) || null,
              isValid: true
            },
            twitter: {
              value: (user.social && user.social.twitter) || null,
              isValid: true
            },
            facebook: {
              value: (user.social && user.social.facebook) || null,
              isValid: true
            },
            linkedIn: {
              value: (user.social && user.social.linkedIn) || null,
              isValid: true
            },
            instagram: {
              value: (user.social && user.social.instagram) || null,
              isValid: true
            },
            stackoverflow: {
              value: (user.social && user.social.stackoverflow) || null,
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
    // eslint-disable-next-line
  }, [user]);

  const saveProfile = async () => {
    if(formState.inputs.newPassword.value !== formState.inputs.confirmNewPassword.value) {
      M.toast({ html: 'Confirm password and Confirm new password have to be same', classes: 'red' });
    } else {
      setIsLoading(true);
      await updateUser(formState, sendRequest);
      setIsLoading(false);
      history.push('/profile');
    }
  }

  return(
      <div className="bg-default text-white-light p-8 w-full">
        {isAuthenticated
        && (
            <>
              <div className="row flex flex-col gap-20">
                <UploadImage profileImageUrl={profileImage} />

                {user && (
                    <div className="flex flex-col justify-evenly gap-5 w-1/2">
                        <div className="flex items-center justify-between">
                            <h3>Full Name</h3>

                            <Input
                                element="input"
                                placeholder="Full Name"
                                elementTitle="fullName"
                                type="text"
                                validators={[VALIDATOR_MINLENGTH(5)]}
                                errorText="Please enter at least 5 character."
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={user.name}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>Username</h3>

                            <Input
                                element="input"
                                placeholder="Username"
                                elementTitle="username"
                                type="text"
                                validators={[VALIDATOR_MINLENGTH(5)]}
                                errorText="Please enter at least 5 character."
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={user.username}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>Email</h3>

                            <Input
                                element="input"
                                placeholder="Email"
                                elementTitle="email"
                                type="email"
                                validators={[VALIDATOR_EMAIL()]}
                                errorText="Please enter an valid email."
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={user.email}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>Role</h3>

                            <Input
                                element="select"
                                placeholder="Role"
                                elementTitle="role"
                                type="select"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please select type of role"
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={user.role}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>Skills</h3>

                            <Input
                                element="input"
                                placeholder="Use comma to separate skills such as(HTML, CSS, JavaScript)"
                                elementTitle="skills"
                                type="text"
                                validators={[VALIDATOR_MINLENGTH(2)]}
                                errorText="Please enter at least 2 character."
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={user.skills}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>Bio</h3>

                            <Input
                                element="textarea"
                                placeholder="Bio"
                                elementTitle="bio"
                                type="textarea"
                                validators={[VALIDATOR_MINLENGTH(10)]}
                                errorText="Please enter at least 10 character."
                                styleClass="w-96 h-32 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={user.bio}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>Github</h3>

                            <Input
                                element="input"
                                placeholder="Github profile url"
                                elementTitle="github"
                                type="text"
                                validators={[VALIDATOR_LINK(user?.social?.github), VALIDATOR_NOT_REQUIRE()]}
                                errorText="Please enter your github profile link"
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={user.social && user.social.github}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>Twitter</h3>

                            <Input
                                element="input"
                                placeholder="Twitter profile url"
                                elementTitle="twitter"
                                type="text"
                                validators={[VALIDATOR_LINK(user?.social?.twitter), VALIDATOR_NOT_REQUIRE()]}
                                errorText="Please enter your github profile link"
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={user.social && user.social.twitter}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>Stackoverflow</h3>

                            <Input
                                element="input"
                                placeholder="Stackoverflow profile url"
                                elementTitle="stackoverflow"
                                type="text"
                                validators={[VALIDATOR_LINK(user?.social?.stackoverflow), VALIDATOR_NOT_REQUIRE()]}
                                errorText="Please enter your stackoverflow profile link"
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={user.social && user.social.stackoverflow}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>Facebook</h3>

                            <Input
                                element="input"
                                placeholder="Facebook profile url"
                                elementTitle="facebook"
                                type="text"
                                validators={[VALIDATOR_LINK(user?.social?.facebook), VALIDATOR_NOT_REQUIRE()]}
                                errorText="Please enter your facebook profile link"
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={user.social && user.social.facebook}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>LinkedIn</h3>

                            <Input
                                element="input"
                                placeholder="LinkedIn profile url"
                                elementTitle="linkedIn"
                                type="text"
                                validators={[VALIDATOR_LINK(user?.social?.linkedIn), VALIDATOR_NOT_REQUIRE()]}
                                errorText="Please enter your linkedIn profile link"
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={user.social && user.social.linkedIn}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>Instagram</h3>

                            <Input
                                element="input"
                                placeholder="Instagram profile url"
                                elementTitle="instagram"
                                type="text"
                                validators={[VALIDATOR_LINK(user?.social?.instagram), VALIDATOR_NOT_REQUIRE()]}
                                errorText="Please enter your instagram profile link"
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={user.social && user.social.instagram}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>Youtube</h3>

                            <Input
                                element="input"
                                placeholder="Youtube channel url"
                                elementTitle="youtube"
                                type="text"
                                validators={[VALIDATOR_LINK(user?.social?.youtube), VALIDATOR_NOT_REQUIRE()]}
                                errorText="Please enter your youtube profile link"
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                                initialValue={user.social && user.social.youtube}
                                initialValidity={true}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>New Password</h3>

                            <Input
                                element="input"
                                placeholder="New Password"
                                elementTitle="newPassword"
                                type="password"
                                validators={[VALIDATOR_MINLENGTH(6)]}
                                errorText="Please enter at least 6 character."
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>Confirm New Password</h3>

                            <Input
                                element="input"
                                placeholder="Confirm New Password"
                                elementTitle="confirmNewPassword"
                                type="password"
                                validators={[VALIDATOR_MINLENGTH(6)]}
                                errorText="Please enter at least 6 character."
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <h3>Current Password</h3>

                            <Input
                                element="input"
                                placeholder="Current Password(To save edit)"
                                elementTitle="currentPassword"
                                type="password"
                                validators={[VALIDATOR_MINLENGTH(6)]}
                                errorText="Please enter current password."
                                styleClass="w-96 h-12 rounded-[4px] p-4 pr-12 text-gray-700 text-sm shadow-sm"
                                onInput={inputHandler}
                            />
                        </div>
                        <button
                            onClick={saveProfile}
                            disabled={!formState.isValid}
                            className="mt-14 flex items-center justify-between w-60 h-10 bg-[#1f2937] hover:bg-orange-500 text-white-light rounded-2xl px-4 py-2 uppercase"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                className="w-5 h-5"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                                />
                            </svg>

                            {loading && <i className="fas fa-spinner fa-pulse" />}
                            {loading && ' Saving Profile Details'}
                            {!loading && 'Save Profile Details'}
                        </button>
                        </div>
                )}
              </div>
            </>
        )}
      </div>
  )
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { updateUser })(EditProfileScreen);
