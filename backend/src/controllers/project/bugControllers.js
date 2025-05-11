const { validationResult } = require("express-validator");
const Project = require("../../models/Project");

// @route   POST api/project/bugs/:id
// @desc    Add new bug
// @access  Private
const addNewBug = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ 'error': 'Server Error' });
    }

    try {
      let project = await Project.findById(req.params.projectId);
      const newBug = {
        user: req.user.id,
        text: req.body.bug,
      };
      project.bugs.unshift(newBug);
      await project.save();
      project = await Project.findById(req.params.projectId).populate('bugs.user', 'username profileImage -_id');
      await res.json(project.bugs[0]);
    } catch(error) {
      console.error(error);
      return res.status(400).json({ 'error': 'Server Error' });
    }
}

// @route   POST api/project/bugs/:projectId/:bugId
// @desc    Set bug fixed or not fixed
// @access  Private
const toggleIsBugFixed = async(req, res) => {
    try {
      let project = await Project.findOne( { 'bugs._id': req.params.bugId } )
      const bugs = project.bugs;
      let isThisBugAddedByCurrentUser = false;
      bugs.map(bug => {
        if(bug._id.toString() === req.params.bugId.toString()) {
          if (bug.user.toString() === req.user.id.toString()) isThisBugAddedByCurrentUser = true;
        }
      })
      if(!isThisBugAddedByCurrentUser)
        return res.status(400).json({ 'error': 'This bug does not added by you.' });

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
      await res.json(project.bugs);
    } catch(error) {
      console.error(error);
      return res.status(400).json({ 'error': 'Server Error' });
    }
}

// @route   PUT api/project/bugs/:projectId/:bugId
// @desc    Edit an existing bug
// @access  Private
const editBug = async(req, res) => {
    try {
      let project = await Project.findOne( { 'bugs._id': req.params.bugId } )
      const bugs = project.bugs;
      let isThisBugAddedByCurrentUser = false;
      bugs.map(bug => {
        if(bug._id.toString() === req.params.bugId.toString()) {
          if (bug.user.toString() === req.user.id.toString()) isThisBugAddedByCurrentUser = true;
        }
      })
      if(!isThisBugAddedByCurrentUser) return res.status(400).json({ 'error': 'Server Error' });

      await Project.updateOne(
          { _id: req.params.projectId, 'bugs._id': req.params.bugId},
          {
            '$set': {
              'bugs.$.text': req.body.bugEditText
            }
          }
      );
      project = await Project.findById(req.params.projectId).populate('bugs.user', 'username profileImage -_id');
      await res.json(project.bugs);
    } catch(error) {
      console.error(error);
      return res.status(400).json({ 'error': 'Server Error' });
    }
}

// @route   DELETE api/project/bugs/:projectId/:bugId
// @desc    Delete a bug
// @access  Private
const deleteBug = async(req, res) => {
    try {
      let project = await Project.findOne( { 'bugs._id': req.params.bugId } )
      const bugs = project.bugs;
      let isThisBugAddedByCurrentUser = false;
      bugs.map(bug => {
        if(bug._id.toString() === req.params.bugId.toString()) {
          if (bug.user.toString() === req.user.id.toString()) isThisBugAddedByCurrentUser = true;
        }
      })
      if(!isThisBugAddedByCurrentUser) return res.status(400).json({ 'error': 'Server Error' });
      await Project.updateOne(
          { _id: req.params.projectId },
          {'$pull': {
              'bugs': { _id: req.params.bugId }
            }}
      );
      project = await Project.findById(req.params.projectId).populate('bugs.user', 'username profileImage -_id');
      await res.json(project.bugs);
    } catch(error) {
      console.error(error);
      return res.status(400).json({ 'error': 'Server Error' });
    }
}


module.exports = {
    addNewBug,
    toggleIsBugFixed,
    editBug,
    deleteBug
};
