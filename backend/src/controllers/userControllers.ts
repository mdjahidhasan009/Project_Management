import {validationResult} from 'express-validator';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import {Request, Response} from "express";

import User from '../models/User';
import Project from '../models/Project';
import {IExpressRequestWithUser} from "../types";

// @route  GET api/user
// @desc   Get all user
// @access private
const getAllUsers = async (_: IExpressRequestWithUser, res: Response): Promise<void> => {
    try{
      const responseData = await User.find().select('-_id -password -skills');
      res.status(200).json(responseData);
    } catch (error) {
      console.error(error);
    }
}


interface RegisterUserRequest {
    name: string;
    email: string;
    username: string;
    password: string;
}

// @route  POST api/user
// @desc   Register new user
// @access Public
const addNewUser = async (req: Request & { body: RegisterUserRequest }, res: Response): Promise<void> => {
    const errors = validationResult(req); //Checking validation errors
    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { name, email, username, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if(user) {
          res.status(400).json({ 'error' : 'User already exits' });
          return;
      }
      //checking is user with same username already exits(case insensitive).
      user = await User.findOne( { username: {$regex: new RegExp(`^${username}$`), $options: 'i'} });
      if(user) {
          res.status(400).json({ 'error': 'Username already exits. Choose another one' });
          return;
      }

      const jwt_secret = process.env.JWTSECRET || '';
      if(!jwt_secret) {
        console.error('JWT secret is not defined in environment variables.');
        res.status(500).json({ 'error': 'Server Error' });
        return;
      }

      user = new User({
        name,
        username,
        email,
        password
      });
      const payload = {
        user: {
          id: user.id
        }
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      jwt.sign(payload, jwt_secret, { expiresIn: 360000 }, (error, token) => {
            if(error) throw error;
            res.json({ token });
          }
      )
    } catch (e) {
      console.error(e);
      res.status(500).send('Server Error');
    }
}

interface EditUserFormState {
    inputs: {
        fullName: { value: string };
        username: { value: string };
        email: { value: string };
        role: { value: string };
        newPassword: { value: string | null };
        currentPassword: { value: string };
        bio: { value: string };
        skills: { value: string | string[] };
        github: { value: string };
        youtube: { value: string };
        twitter: { value: string };
        facebook: { value: string };
        linkedIn: { value: string };
        instagram: { value: string };
        stackoverflow: { value: string };
    };
}

// @route  PUT api/user
// @desc   Edit user details
// @access Private
const editUserDetails = async (req: IExpressRequestWithUser & { body: EditUserFormState }, res: Response): Promise<void> => {
    const errors = validationResult(req); //Checking validation errors
    if(!errors.isEmpty()) {
        res.status(500).json({ 'error': 'Server Error '});
        return;
    }

    let {
        fullName, username ,email, role, newPassword, currentPassword, bio, skills, github, youtube, twitter, facebook,
        linkedIn, instagram, stackoverflow
    } = req.body.formState.inputs;

    // fullName = fullName.value
    // username = username.value
    // email = email.value
    // role = role.value
    // newPassword = newPassword.value
    // currentPassword = currentPassword.value
    // bio = bio.value
    // skills = skills.value
    // github = github.value
    // youtube = youtube.value
    // twitter = twitter.value
    // facebook = facebook.value
    // linkedIn = linkedIn.value
    // instagram = instagram.value
    // stackoverflow = stackoverflow.value

    const fullNameValue: string = fullName.value;
    const usernameValue: string = username.value;
    const emailValue: string = email.value;
    const roleValue: string = role.value;
    const newPasswordValue: string = newPassword.value;
    const currentPasswordValue: string = currentPassword.value;
    const bioValue: string = bio.value;
    let skillsValue: string | string[] = skills.value;
    const githubValue: string = github.value;
    const youtubeValue: string = youtube.value;
    const twitterValue: string = twitter.value;
    const facebookValue: string = facebook.value;
    const linkedInValue: string = linkedIn.value;
    const instagramValue: string = instagram.value;
    const stackoverflowValue: string = stackoverflow.value;


    // let updateObject = null;
    // if(skills.length > 0 && (typeof skills !== "object")) {
    //   skills = skills.split(',').map((skill: string) => skill.trim());
    // }
    if(typeof skillsValue === "string" && skillsValue.length > 0) {
        skillsValue = skillsValue.split(',').map((skill: string) => skill.trim());
    }

    try {
      let user = await User.findOne({ _id: req?.user?.id });
      if(!user) {
          res.status(500).json({ 'error': 'Server Error '});
          return;
      } //user not found

      const isMatch = await bcrypt.compare(currentPasswordValue, user.password);
      if(!isMatch) {
          res.status(400).json({ error: 'Invalid Password' });
          return;
      } //password does not match

      const socialData = {
        github: githubValue,
        youtube: youtubeValue,
        twitter: twitterValue,
        facebook: facebookValue,
        linkedIn: linkedInValue,
        instagram: instagramValue,
        stackoverflow: stackoverflowValue
      };

      const updateObject: any = {
        name: fullNameValue,
        username: usernameValue,
        email: emailValue,
        role: roleValue,
        bio: bioValue,
        skills: skillsValue,
        social: socialData // Always use object structure
      };

      if(newPasswordValue && newPasswordValue.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        updateObject.password = await bcrypt.hash(newPasswordValue, salt);
      }

      // if(newPassword !== null) {
      //   const salt = await bcrypt.genSalt(10);
      //   newPassword = await bcrypt.hash(newPassword, salt);
      //   updateObject = {
      //     name: fullName,
      //     username: username,
      //     email: email,
      //     role: role,
      //     password: newPassword,
      //     bio,
      //     skills,
      //     social: [ github, youtube, twitter, facebook, linkedIn, instagram, stackoverflow ]
      //   }
      // } else {
      //   updateObject = {
      //     name: fullName,
      //     username: username,
      //     email: email,
      //     role: role,
      //     bio,
      //     skills,
      //     social: { github, youtube, twitter, facebook, linkedIn, instagram, stackoverflow }
      //   }
      // }
      const updatedUserDetails = await User.findOneAndUpdate( { _id: req?.user?.id }, updateObject, {
        new: true //to return the document after update was applied.
      })
      res.status(200).json(updatedUserDetails);

    } catch (e) {
      console.error(e);
      res.status(500).json({ 'error': 'Server Error '});
    }
}

// @route  GET api/user/:username
// @desc   Get user by username
// @access private
const getUserDetailsByUsername = async (req: IExpressRequestWithUser, res: Response): Promise<void> => {
    try{
      const responseData = await User.findOne({ username: req.params.username }).select('-_id -password');
      res.status(200).json(responseData);
    } catch (error) {
      console.error(error);
    }
}

// @route  GET api/user/project/:projectId
// @desc   Get all unassigned member on this project
// @access Private
const getAllUnassignedMemberOnAProject = async (req: IExpressRequestWithUser, res: Response): Promise<void> => {
    try {
      let allUser = await User.find()
          .select('username -_id');
      const membersOfProject = await Project.findOne({ _id: req.params.projectId })
          .select('members -_id')
          .populate('members.user', 'username -_id');
      if (!membersOfProject) {
        res.status(404).json({ "error": "Project not found" });
        return;
      }
      membersOfProject?.members.map(member => {
        allUser = allUser.filter(user => {
          // return user1.username !== user.user.username
          return user.username !== (member.user as { username: string }).username;
        })
      });
      const nonMemberOfCurrentProject = allUser.map(user => {
        return user.username;
      })
      res.status(200).json(nonMemberOfCurrentProject);
    } catch (error) {
      console.error(error);
      res.status(500).json({ "error": "Server Error" } );
    }
}


export {
    getAllUsers,
    addNewUser,
    editUserDetails,
    getUserDetailsByUsername,
    getAllUnassignedMemberOnAProject
}
