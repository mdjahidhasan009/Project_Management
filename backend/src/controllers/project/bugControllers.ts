import { validationResult } from "express-validator";
import { Response } from "express";

import Project from '../../models/Project';
import {IExpressRequestWithUser, IProject} from "../../types";

interface BugRequest {
    bug: string;
}

interface BugFixedRequest {
    isFixed: string;
}

interface BugEditRequest {
    bugEditText: string;
}

// @route   POST api/project/bugs/:id
// @desc    Add new bug
// @access  Private
const addNewBug = async(req: IExpressRequestWithUser & { body: BugRequest }, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      res.status(400).json({ 'error': 'Server Error' });
      return;
    }

    try {
      let project: IProject | null = await Project.findById(req.params.projectId);
      if(!project) {
          res.status(404).json({ 'error': 'Project not found' });
          return;
      }
      if(!req?.user?.id) {
        res.status(401).json({ 'error': 'User not authorized' });
        return;
      }
      const newBug = {
        user: req?.user?.id,
        text: req.body.bug,
      };
      project.bugs.unshift(newBug);
      await project.save();
      project = await Project.findById(req.params.projectId).populate('bugs.user', 'username profileImage -_id');
      if(!project || !project.bugs.length) {
        res.status(404).json({ 'error': 'No bugs found' });
        return;
      }
      res.json(project.bugs[0]);
    } catch(error) {
      console.error(error);
      res.status(400).json({ 'error': 'Server Error' });
    }
}

// @route   POST api/project/bugs/:projectId/:bugId
// @desc    Set bug fixed or not fixed
// @access  Private
const toggleIsBugFixed = async(req: IExpressRequestWithUser & { body: BugFixedRequest }, res: Response): Promise<void> => {
    try {
      let project: IProject | null = await Project.findOne( { 'bugs._id': req.params.bugId } );
      if(!project || !project?.bugs || project.bugs.length == 0) {
          res.status(400).json({ "message": "No project or no bugs found in this project" });
          return;
      }
      const bugs = project.bugs;
      let isThisBugAddedByCurrentUser = false;
      bugs.map(bug => {
        if(bug?._id?.toString() === req.params.bugId.toString()) {
          if (bug.user.toString() === req?.user?.id?.toString()) isThisBugAddedByCurrentUser = true;
        }
      })
      if(!isThisBugAddedByCurrentUser) {
          res.status(400).json({'error': 'This bug does not added by you.'});
          return;
      }

      let isFixed = req.body.isFixed === 'true';
      let fixedAt = null;
      if(isFixed) fixedAt = new Date();
      await Project.updateOne(
          { _id: req.params.projectId, 'bugs._id': req.params.bugId},
          {
            '$set': {
              'bugs.$.fixed': isFixed,
              'bugs.$.fixedAt': fixedAt
            }
          }
      );
      project = await Project.findById(req.params.projectId).populate('bugs.user', 'username profileImage -_id');
      if(!project || !project.bugs.length) {
        res.status(404).json({ 'error': 'No bugs found' });
        return;
      }
      res.json(project.bugs);
    } catch(error) {
      console.error(error);
      res.status(400).json({ 'error': 'Server Error' });
    }
}

// @route   PUT api/project/bugs/:projectId/:bugId
// @desc    Edit an existing bug
// @access  Private
const editBug = async(req: IExpressRequestWithUser & { body: BugEditRequest }, res: Response): Promise<void> => {
    try {
      let project = await Project.findOne( { 'bugs._id': req.params.bugId } );
      if(!project || !project?.bugs || project.bugs.length == 0) {
        res.status(400).json({ 'error': 'No project or no bugs found in this project' });
        return;
      }
      const bugs = project.bugs;
      let isThisBugAddedByCurrentUser = false;
      bugs.map(bug => {
        if(bug?._id?.toString() === req.params.bugId.toString()) {
          if (bug.user.toString() === req?.user?.id?.toString()) isThisBugAddedByCurrentUser = true;
        }
      })
      if(!isThisBugAddedByCurrentUser) {
          res.status(400).json({ 'error': 'Server Error' });
          return;
      }

      await Project.updateOne(
          { _id: req.params.projectId, 'bugs._id': req.params.bugId},
          {
            '$set': {
              'bugs.$.text': req.body.bugEditText
            }
          }
      );
      project = await Project.findById(req.params.projectId).populate('bugs.user', 'username profileImage -_id');
      if(!project || !project.bugs.length) {
        res.status(404).json({ 'error': 'No bugs found' });
        return;
      }
      res.json(project.bugs);
    } catch(error) {
      console.error(error);
      res.status(400).json({ 'error': 'Server Error' });
    }
}

// @route   DELETE api/project/bugs/:projectId/:bugId
// @desc    Delete a bug
// @access  Private
const deleteBug = async(req: IExpressRequestWithUser, res: Response): Promise<void> => {
    try {
      let project: IProject | null = await Project.findOne( { 'bugs._id': req.params.bugId } );
      if(!project || !project?.bugs || project.bugs.length == 0) {
          res.status(400).json({ 'error': 'No project or no bugs found in this project' });
          return;
      }
      const bugs = project.bugs;
      let isThisBugAddedByCurrentUser = false;
      bugs.map(bug => {
        if(bug?._id?.toString() === req.params.bugId.toString()) {
          if (bug.user.toString() === req?.user?.id?.toString()) isThisBugAddedByCurrentUser = true;
        }
      })
      if(!isThisBugAddedByCurrentUser) {
          res.status(400).json({ 'error': 'Server Error' });
          return;
      }
      await Project.updateOne(
          { _id: req.params.projectId },
          {'$pull': {
              'bugs': { _id: req.params.bugId }
            }}
      );
      project = await Project.findById(req.params.projectId).populate('bugs.user', 'username profileImage -_id');
      if(!project || !project.bugs.length) {
        res.status(404).json({ 'error': 'No bugs found' });
        return;
      }
      res.json(project.bugs);
    } catch(error) {
      console.error(error);
      res.status(400).json({ 'error': 'Server Error' });
    }
}


export {
    addNewBug,
    toggleIsBugFixed,
    editBug,
    deleteBug
};
