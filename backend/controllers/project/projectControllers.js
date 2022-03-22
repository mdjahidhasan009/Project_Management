const Project = require("../../models/Project");
const { validationResult } = require("express-validator");
const User = require("../../models/User");

// @route   GET api/project
// @desc    Get all projects
// @access  Private
const getAllProjectsDetails = async (req, res) => {
  try {
    const projects = await Project.find()
        .populate('createdBy', 'username -_id')
        .populate('discussion.user', 'username profileImage -_id')
        .populate('members.user', 'username profileImage -_id')
        .populate('todos.user', 'username profileImage -_id')
        .populate('todos.subTodos.user', 'username profileImage -_id')
        .populate('bugs.user', 'username profileImage -_id');
    await res.json(projects);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ "error": "Server error "});
  }
}

// @route   POST api/project
// @desc    Add new project
// @access  Private
const addNewProject = async(req, res) => {
    const errors = validationResult(req); //Validation error check
    if(!errors.isEmpty()) return res.status(400).json({ "error": "Server error" });
    const { name, category, description, deadline } = req.body;
    try {
      let project = await Project.findOne({ name });
      if(project) return res.status(422).json({ 'error': 'This project name already taken, choose another one' });
      const newProject = new Project({
        name,
        category,
        description,
        deadline,
        createdBy : req.user.id
      });
      project = await newProject.save(); //Created by will be userId as it user's own userid so it will not a problem
      await res.json(project);
    } catch(error) {
      console.error(error);
      return res.status(400).json({ "error": "Server error "});
    }
}

// @route   GET api/project/:projectId
// @desc    Get all data of project
// @access  Private
const getProjectDetails = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId)
            .populate('createdBy', 'username -_id')
            .populate('discussion.user', 'username profileImage -_id')
            .populate('members.user', 'username profileImage role -_id')
            .populate('todos.user', 'username profileImage -_id')
            .populate('todos.subTodos.user', 'username profileImage -_id')
            .populate('bugs.user', 'username profileImage -_id');
        await res.status(200).json(project);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ 'error': 'Server Error' });
    }
}

// @route   PUT api/project/:projectId
// @desc    Edit project details(name, details, category, deadline)
// @access  Private
const editProject = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ "error": "Server error" });

    const { name, category, description, deadline } = req.body;
    try {
      let project = await Project.findById(req.params.projectId);
      if(!project) return res.status(400).json({ 'error': 'Server Error' });
      if(project.createdBy.toString() !== req.user.id)
        return await res.status(400).json({ 'error': 'Server Error' });
      project = await Project.findOneAndUpdate({ _id: req.params.projectId},
          {
            name,
            category,
            description,
            deadline
          }
      );
      await res.json({
        name: project.name,
        category: project.category,
        description: project.description,
        deadline: project.deadline
      });
    } catch(error) {
      console.error(error);
      return res.status(400).json({ "error": "Server error "});
    }
}

// @route   DELETE api/project/:projectId
// @desc    Delete an project
// @access  Private
const deleteProject = async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);
      if(!project) await res.status(400).json({ 'error': 'Server Error' }); //project not found
      if(project.createdBy.toString() !== req.user.id)
        return await res.status(400).json({ 'error': 'Server Error' }); //user who requested was not created this project
      await Project.deleteOne({ _id: req.params.projectId });
      await res.status(200).json('Deleted');
    } catch(error) {
      console.error(error);
      return res.status(400).json({ "error": "Server Error"});
    }
}

// @route   POST api/project/:projectId
// @desc    Add a member in project
// @access  Private
const addNewMemberInProject = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ 'error': 'Server Error' });
    }
    try {
        const { username } = req.body;
        const project = await Project.findById(req.params.projectId);
        const user = await User.findOne({ username: username });
        if(!user) return res.status(400).json({ 'error': 'Server Error' });
        await project.members.unshift({ user: user._id });
        await project.save();
        const membersOfProject = await Project.findOne({ _id: req.params.projectId })
            .populate('members.user', 'username profileImage role -_id')
        await res.json(membersOfProject.members[0]);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ 'error': 'Server Error' });
    }
}



// @route   DELETE api/project/member/:projectId/
// @desc    Delete a member from a project
// @access  Private
const removeMemberFromProject = async (req, res) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
          return res.status(400).json({ 'error': 'Server Error' });
      }
      try {
          const { username } = req.body;
          const project = await Project.findById(req.params.projectId);
          if(project.createdBy.toString() !== req.user.id) return res.status(400).json({ 'error': 'Server Error' });
          const user = await User.findOne({ username: username });
          if(!user) return res.status(400).json({ 'error': 'Server Error' });
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
          await res.json(membersOfProject.members);
      } catch (error) {
          console.error(error);
          return res.status(400).json({ 'error': 'Server Error' });
      }
}

// @route   GET api/project/memberorcreator/:projectId
// @desc    Get is current user is member or creator current project or both
// @access  Private
const isCurrentUserMemberOrCreatorOfThisProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        const isCreatedByUser = project.createdBy.toString() === req.user.id.toString();
        let isMemberOfThisProject = false;
        project.members.map(member => {
          if(member.user.toString() === req.user.id.toString()) isMemberOfThisProject = true;
        })
        return res.json({ isMemberOfThisProject, isCreatedByUser});
    } catch(error) {
        console.error(error);
        return res.status(400).json("Server Error");
    }
}

// @route    PUT api/project/isDone/:projectId
// @desc     Toggle is a project done
// @access   Private
const toggleIsProjectDone = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(500).json({ 'error': 'Server error '});
        const isDoneBool = req.body.isDone.toString() === 'true';
        await Project.updateOne( { _id: req.params.projectId }, { isDone: isDoneBool } );
        return res.status(200).json({ 'result': 'ok' });
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
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
