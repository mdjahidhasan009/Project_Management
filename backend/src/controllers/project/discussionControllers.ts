import { validationResult } from "express-validator";

import {IExpressRequestWithUser} from "../../types";
import Project from "../../models/Project";

interface DiscussionRequest {
  discussion: string;
}

interface DiscussionEditRequest {
  discussionEditText: string;
}

// @route   POST api/project/discussion/:projectId
// @desc    Add new discussion
// @access  Private
const addNewDiscussion = async(req: IExpressRequestWithUser & { body: DiscussionRequest }, res: Response) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ 'error': 'Server Error' });
  }
  try {
    let project = await Project.findById(req.params.projectId);
    const newDiscussion = {
      user: req.user.id,
      text: req.body.discussion,
    };
    project.discussion.unshift(newDiscussion);
    await project.save();
    project = await Project.findById(req.params.projectId).populate('discussion.user', 'username profileImage -_id')
    await res.json(project.discussion[0]);
  } catch(error) {
    console.error(error);
    return res.status(400).json({ 'error': 'Server Error' });
  }
}


// @route   PUT api/project/discussion/:projectId/:discussionId
// @desc    Edit an existing discussion
// @access  Private
const editDiscussion = async(req: IExpressRequestWithUser & { body: DiscussionEditRequest }, res: Response) => {
  try {
    let project = await Project.findOne( { 'discussion._id': req.params.discussionId } )
    const discussion = project.discussion;
    let isThisDiscussionAddedByCurrentUser = false;
    discussion.map(discussion => {
      if(discussion._id.toString() === req.params.discussionId.toString()) {
        if (discussion.user.toString() === req.user.id.toString()) isThisDiscussionAddedByCurrentUser = true;
      }
    })
    if(!isThisDiscussionAddedByCurrentUser) return res.status(400).json({ 'error': 'Server Error' });
    await Project.updateOne(
        { _id: req.params.projectId, 'discussion._id': req.params.discussionId},
        {'$set': {
            'discussion.$.text': req.body.discussionEditText
          }
        }
    );
    project = await Project
        .findById(req.params.projectId)
        .populate('discussion.user', 'username profileImage -_id');
    await res.json(project.discussion);
  } catch(error) {
    console.error(error);
    return res.status(400).json({ 'error': 'Server Error' });
  }
}

// @route   DELETE api/project/discussion/:projectId/:discussionId
// @desc    Delete an discussion
// @access  Private
const deleteDiscussion = async(req: IReqeustWithUser, res: Response) => {
    try {
      let project = await Project.findOne( { 'discussion._id': req.params.discussionId } )
      const discussion = project.discussion;
      let isThisDiscussionAddedByCurrentUser = false;
      discussion.map(discuss => {
        if(discuss._id.toString() === req.params.discussionId.toString()) {
          if (discuss.user.toString() === req.user.id.toString()) isThisDiscussionAddedByCurrentUser = true;
        }
      })
      if(!isThisDiscussionAddedByCurrentUser) return res.status(400).json({ 'error': 'Server Error' });
      await Project.updateOne(
          { _id: req.params.projectId },
          {'$pull': {
              'discussion': { _id: req.params.discussionId }
            }}
      );
      project = await Project.findById(req.params.projectId).populate('discussion.user', 'username profileImage -_id');
      await res.json(project.discussion);
    } catch(error) {
      console.error(error);
      return res.status(400).json({ 'error': 'Server Error' });
    }
}

export {
    addNewDiscussion,
    editDiscussion,
    deleteDiscussion
}
