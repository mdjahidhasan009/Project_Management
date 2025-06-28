import { validationResult } from 'express-validator';
import { Response } from 'express';

import Project from "../../models/Project";
import User from "../../models/User";
import {IProject} from "../../types";
import {IExpressRequestWithUser} from "../../types";
import {IUser} from "../../types";

// @route   GET api/project
// @desc    Get all projects
// @access  Private
const getAllProjectsDetails = async (_: IExpressRequestWithUser, res: Response): Promise<void> => {
  try {
    const projects: IProject[] | null = await Project.find()
        .populate('createdBy', 'username -_id')
        .populate('discussion.user', 'username profileImage -_id')
        .populate('members.user', 'username profileImage -_id')
        .populate('todos.user', 'username profileImage -_id')
        .populate('todos.subTodos.user', 'username profileImage -_id')
        .populate('bugs.user', 'username profileImage -_id');
    if(!projects || projects.length === 0) {
        res.status(404).json({ "error": "No projects found" });
        return;
    }
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(400).json({ "error": "Server error "});
  }
}

interface IProjectMetaData {
    name: string;
    category: string;
    description: string;
    deadline: string;
}

// @route   POST api/project
// @desc    Add new project
// @access  Private
const addNewProject = async(req: IExpressRequestWithUser & { body: IProjectMetaData }, res: Response): Promise<void> => {
    const errors = validationResult(req); //Validation error check
    if(!errors.isEmpty()) {
        res.status(400).json({ "error": "Server error" });
        return;
    }

    const { name, category, description, deadline } = req.body;
    try {
      let project: IProject | null = await Project.findOne({ name });
      if(project) {
          res.status(422).json({ 'error': 'This project name already taken, choose another one' });
            return;
      }
      const newProject = new Project({
        name,
        category,
        description,
        deadline,
        createdBy : req?.user?.id
      });
      project = await newProject.save(); //Created by will be userId as it user's own userid so it will not a problem
      res.json(project);
    } catch(error) {
      console.error(error);
      res.status(400).json({ "error": "Server error "});
    }
}

// @route   GET api/project/:projectId
// @desc    Get all data of project
// @access  Private
const getProjectDetails = async (req: IExpressRequestWithUser, res: Response): Promise<void> => {
    try {
        const project: IProject | null = await Project.findById(req.params.projectId)
            .populate('createdBy', 'username -_id')
            .populate('discussion.user', 'username profileImage -_id')
            .populate('members.user', 'username profileImage role -_id')
            .populate('todos.user', 'username profileImage -_id')
            .populate('todos.subTodos.user', 'username profileImage -_id')
            .populate('bugs.user', 'username profileImage -_id');
        if(!project) {
            res.status(404).json({ "error": "Project not found" });
            return;
        }
        res.status(200).json(project);
    } catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
}

// @route   PUT api/project/:projectId
// @desc    Edit project details(name, details, category, deadline)
// @access  Private
const editProject = async(req: IExpressRequestWithUser & { body: IProjectMetaData }, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({ "error": "Server error" });
        return;
    }

    const { name, category, description, deadline } = req.body;
    try {
      let project: IProject | null = await Project.findById(req.params.projectId);
      if(!project) {
          res.status(400).json({'error': 'Server Error'});
          return;
      }
      if(project?.createdBy?.toString() !== req?.user?.id) {
          res.status(400).json({'error': 'You are not authorized to edit this project'});
          return;
      }
      project = await Project.findOneAndUpdate({ _id: req.params.projectId},
          {
            name,
            category,
            description,
            deadline
          }
      );
      if(!project) {
          res.status(400).json({ 'error': 'Server Error' });
          return;
      }
      res.json({
        name: project.name,
        category: project.category,
        description: project.description,
        deadline: project.deadline
      });
    } catch(error) {
      console.error(error);
      res.status(400).json({ "error": "Server error "});
    }
}

// @route   DELETE api/project/:projectId
// @desc    Delete a project
// @access  Private
const deleteProject = async (req: IExpressRequestWithUser, res: Response): Promise<void> => {
    try {
      const project = await Project.findById(req.params.projectId);
      if(!project) {
          res.status(400).json({ 'error': 'Server Error' });
          return;
      } //project not found

      if(project?.createdBy?.toString() !== req?.user?.id) {
          res.status(400).json({'error': 'Server Error'}); //user who requested was not created this project
          return;
      }
      await Project.deleteOne({ _id: req.params.projectId });
      res.status(200).json('Deleted');
    } catch(error) {
      console.error(error);
      res.status(400).json({ "error": "Server Error"});
    }
}

interface AddMemberRequest {
    username: string;
}

// @route   POST api/project/:projectId
// @desc    Add a member in project
// @access  Private
const addNewMemberInProject = async (req: IExpressRequestWithUser & { body: AddMemberRequest }, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      res.status(400).json({ 'error': 'Please enter all fields' });
      return;
    }

    try {
        const { username } = req.body;
        const project: IProject | null = await Project.findById(req.params.projectId);
        if(!project) {
            res.status(404).json({ 'error': 'Project not found' });
            return;
        } //project not found
        const user: IUser | null = await User.findOne({ username: username });
        if(!user) {
            res.status(400).json({ 'error': 'Server Error' });
            return;
        } //user not found
        project.members.unshift({ user: user._id });
        await project.save();

        const membersOfProject = await Project.findOne({ _id: req.params.projectId })
            .populate('members.user', 'username profileImage role -_id');
        if(!membersOfProject || membersOfProject.members.length === 0) {
            res.status(404).json({ 'error': 'No members found in this project' });
            return;
        }
        res.json(membersOfProject.members[0]);
    } catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
}



// @route   DELETE api/project/member/:projectId/
// @desc    Delete a member from a project
// @access  Private
const removeMemberFromProject = async (req: IExpressRequestWithUser & { body: AddMemberRequest }, res: Response): Promise<void> => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
          res.status(400).json({ 'error': 'Server Error' });
          return;
      }
      try {
          const { username } = req.body;
          const project: IProject | null = await Project.findById(req.params.projectId);
            if(!project) {
                res.status(404).json({ 'error': 'Project not found' });
                return;
            } //project not found
          if(project?.createdBy?.toString() !== req?.user?.id) {
              res.status(400).json({ 'error': 'You are not authorized to remove members from this project' });
              return;
          }
          const user = await User.findOne({ username: username });
          if(!user) {
              res.status(400).json({'error': 'Server Error'});
              return;
          }
          await Project.updateOne(
              { _id: req.params.projectId },
              {
                '$pull': {
                  'members': { user: user._id }
                }
              }
          );
          await project.save();
          const membersOfProject = await Project.findOne({ _id: req.params.projectId })
              .populate('members.user', 'username profileImage role -_id');
          if(!membersOfProject || membersOfProject.members.length === 0) {
            res.status(404).json({ 'error': 'No members found in this project' });
            return;
          }
          res.json(membersOfProject.members);
      } catch (error) {
          console.error(error);
          res.status(400).json({ 'error': 'Server Error' });
      }
}

// @route   GET api/project/memberorcreator/:projectId
// @desc    Get is current user is member or creator current project or both
// @access  Private
const isCurrentUserMemberOrCreatorOfThisProject = async (req: IExpressRequestWithUser, res: Response): Promise<void> => {
    try {
        const project: IProject | null = await Project.findById(req.params.projectId);
        if(!project) {
            res.status(404).json({ 'error': 'Project not found' });
            return;
        }
        const isCreatedByUser = project?.createdBy?.toString() === req?.user?.id?.toString();
        let isMemberOfThisProject = false;
        project.members.map(member => {
          if(member?.user?.toString() === req?.user?.id?.toString()) isMemberOfThisProject = true;
        })
        res.json({ isMemberOfThisProject, isCreatedByUser});
    } catch(error) {
        console.error(error);
        res.status(400).json("Server Error");
    }
}

interface ToggleProjectDoneRequest {
    isDone: string;
}

// @route    PUT api/project/isDone/:projectId
// @desc     Toggle is a project done
// @access   Private
const toggleIsProjectDone = async (req: IExpressRequestWithUser & { body: ToggleProjectDoneRequest }, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.status(500).json({ 'error': 'Server error '});
            return;
        }
        const isDoneBool = req.body.isDone.toString() === 'true';
        await Project.updateOne( { _id: req.params.projectId }, { isDone: isDoneBool } );
        res.status(200).json({ 'result': 'ok' });
    } catch (error) {
        console.error(error);
    }
}

export {
    getAllProjectsDetails,
    addNewProject,
    editProject,
    deleteProject,
    getProjectDetails,
    addNewMemberInProject,
    removeMemberFromProject,
    isCurrentUserMemberOrCreatorOfThisProject,
    toggleIsProjectDone
}
