const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth');
const {
  addNewDiscussion, editDiscussion, deleteDiscussion
} = require("../controllers/project/discussionControllers");
const {
  addTodo, toggleIsTodoDone, editTodoText, deleteTodo, assignTodoToAJunior
} = require("../controllers/project/todoControllers");
const {
  addNewSubTodo, editSubTodo, toggleIsSubTodoDone, deleteSubTodo
} = require("../controllers/project/subTodoControllers");
const {
  addNewBug, toggleIsBugFixed, editBug, deleteBug
} = require("../controllers/project/bugControllers");
const {getAllProjectsDetails, addNewProject, editProject, deleteProject, getProjectDetails, addNewMemberInProject,
  removeMemberFromProject, isCurrentUserMemberOrCreatorOfThisProject, toggleIsProjectDone
} = require("../controllers/project/projectControllers");

// base route for all route in this file => api/project/

// @route api/project
router.route('/')
    // @desc    Get all projects, @access  Private
    .get(
        auth,
        getAllProjectsDetails
    )
    // @desc  Add new project, @access  Private
    .post(
        auth,
        [
          check('name')
              .not()
              .isEmpty(),
          check('category')
              .not()
              .isEmail(),
          check('description')
              .not()
              .isEmpty(),
          check('deadline')
              .not()
              .isEmpty()
        ],
        addNewProject
    )

// @route api/project/:projectId
router.route('/:projectId')
    // @desc    Get all data of project, @access  Private
    .get(
        auth,
        getProjectDetails
    )
    // @desc  Edit project details(name, details, category, deadline), @access  Private
    .put(
        auth,
        [
            check('name')
                .not()
                .isEmpty(),
            check('category')
                .not()
                .isEmail(),
            check('description')
                .not()
                .isEmpty(),
            check('deadline')
                .not()
                .isEmpty()
        ],
        editProject
    )
    // @desc  Delete a existing project, @access  Private
    .delete(
      auth,
      deleteProject
  )

// @route  api/project/member/:projectId/
router.route('/member/:projectId')
    // @desc  Add a member in project, @access  Private
    .post(
        auth,
        [
          check('username')
              .not()
              .isEmpty()
        ],
        addNewMemberInProject
    )
    // @desc  Delete a member from a project, @access  Private
    .delete(
        auth,
        [
            check('username')
                .not()
                .isEmpty()
        ],
        removeMemberFromProject
    )

// @route   GET api/project/memberorcreator/:projectId
// @desc    Get is current user is member or creator current project or both
// @access  Private
router.route("/memberorcreator/:projectId")
    .get(
        auth,
        isCurrentUserMemberOrCreatorOfThisProject
    )

// @route    PUT api/project/isDone/:projectId
// @desc     Toggle is a project done
// @access   Private
router.route('/isDone/:projectId')
    .put(
        auth,
        [
          check('isDone')
              .not()
              .isEmpty()
        ],
        toggleIsProjectDone
    )

// @route  api/project/discussion/:projectId
router.route("/discussion/:projectId")
    // @desc    Add new discussion, @access  Private
    .post(
        auth,
        [
            check('discussion')
            .not()
            .isEmpty()
        ],
        addNewDiscussion
    );

// @route  api/project/discussion/:projectId/:discussionId
router.route("/discussion/:projectId/:discussionId")
    // @desc    Edit an existing discussion, @access  Private
    .put(
        auth,
        [
            check('discussionEditText')
                .not()
                .isEmpty()
        ],
        editDiscussion
    )
    // @desc    Delete an discussion, @access  Private
    .delete(
        auth,
        deleteDiscussion
    )

// @route  api/project/assignTodo/todos/:projectId/:username
router.route("/assignTodo/todos/:projectId/:username")
    // @desc  Assign a todo to junior, @access  Private
    .post(
        auth,
        [
            check('todo')
                .not()
                .isEmpty()
        ],
        assignTodoToAJunior
    )

// @route  api/project/todos/:projectId
router.route("/todos/:projectId")
    // @desc  Add new todo, @access  Private
    .post(
        auth,
        [
            check('todo')
                .not()
                .isEmpty()
        ],
        addTodo
    )
// @route  api/project/toggle/todos/:projectId/:todoId
router.route("/toggle/todos/:projectId/:todoId")
    // @desc    Set todo done or incomplete, @access  Private
    .put(
        auth,
        [
            check('isDone')
                .not()
                .isEmpty()
        ],
        toggleIsTodoDone
    )

// @route  api/project/todos/:projectId/:todoId
router.route("/todos/:projectId/:todoId")
    // @desc  Edit an existing todo, @access  Private
    .put(
        auth,
        [
            check('todoEditText')
                .not()
                .isEmpty()
        ],
        editTodoText
    )
    // @desc    Delete an todo, @access  Private
    .delete(
        auth,
        deleteTodo
    )

// @route  api/project/todos/:projectId/todoId/:todoId
router.route("/todos/:projectId/todoId/:todoId")
    // @desc  Add new sub todo, @access  Private
    .post(
        auth,
        [
            check('todo')
                .not()
                .isEmpty()
        ],
        addNewSubTodo
    )

// @route   PUT api/project/todos/:projectId/:todoId/:subTodoId
router.route("/todos/:projectId/:todoId/:subTodoId")
    // @desc  Edit an existing sub todo,  @access  Private
    .put(
        auth,
        [
            check('subTodoEditText')
                .not()
                .isEmpty()
        ],
        editSubTodo
    )
    // @desc    Delete an sub todo, @access  Private
    .delete(
        auth,
        deleteSubTodo
    )


// @route  api/project/toggle/todos/:projectId/:todoId/:subTodoId
router.route("/toggle/todos/:projectId/:todoId/:subTodoId")
    // @desc  Set sub todo done or incomplete, @access  Private
    .put(
        auth,
        [
            check('isDone')
                .not()
                .isEmpty()
        ],
        toggleIsSubTodoDone
    )



// @route  api/project/bugs/:id
router.route("/bugs/:projectId")
    // @desc    Add new bug, @access  Private
    .post(
        auth,
        [
            check('bug')
                .not()
                .isEmpty()
        ],
        addNewBug
    )

// @route  api/project/bugs/:projectId/:bugId
router.route("/bugs/:projectId/:bugId")
    // @desc  Set bug fixed or not fixed, @access  Private
    .post(
        auth,
        [
            check('isFixed')
                .not()
                .isEmpty()
        ],
        toggleIsBugFixed
    )
    // @desc    Edit an existing bug, @access  Private
    .put(
        auth,
        [
            check('bugEditText')
                .not()
                .isEmpty()
        ],
        editBug
    )
    // @desc    Delete a bug, @access  Private
    .delete(
        auth,
        deleteBug
    )

module.exports = router;
