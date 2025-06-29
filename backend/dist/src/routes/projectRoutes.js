"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const discussionControllers_1 = require("../controllers/project/discussionControllers");
const todoControllers_1 = require("../controllers/project/todoControllers");
const subTodoControllers_1 = require("../controllers/project/subTodoControllers");
const bugControllers_1 = require("../controllers/project/bugControllers");
const projectControllers_1 = require("../controllers/project/projectControllers");
// base route for all route in this file => api/project/
// @route api/project
router.route('/')
    // @desc    Get all projects, @access  Private
    .get(auth_1.default, projectControllers_1.getAllProjectsDetails)
    // @desc  Add new project, @access  Private
    .post(auth_1.default, [
    (0, express_validator_1.check)('name')
        .not()
        .isEmpty(),
    (0, express_validator_1.check)('category')
        .not()
        .isEmail(),
    (0, express_validator_1.check)('description')
        .not()
        .isEmpty(),
    (0, express_validator_1.check)('deadline')
        .not()
        .isEmpty()
], projectControllers_1.addNewProject);
// @route api/project/:projectId
router.route('/:projectId')
    // @desc    Get all data of project, @access  Private
    .get(auth_1.default, projectControllers_1.getProjectDetails)
    // @desc  Edit project details(name, details, category, deadline), @access  Private
    .put(auth_1.default, [
    (0, express_validator_1.check)('name')
        .not()
        .isEmpty(),
    (0, express_validator_1.check)('category')
        .not()
        .isEmail(),
    (0, express_validator_1.check)('description')
        .not()
        .isEmpty(),
    (0, express_validator_1.check)('deadline')
        .not()
        .isEmpty()
], projectControllers_1.editProject)
    // @desc  Delete a existing project, @access  Private
    .delete(auth_1.default, projectControllers_1.deleteProject);
// @route  api/project/member/:projectId/
router.route('/member/:projectId')
    // @desc  Add a member in project, @access  Private
    .post(auth_1.default, [
    (0, express_validator_1.check)('username')
        .not()
        .isEmpty()
], projectControllers_1.addNewMemberInProject)
    // @desc  Delete a member from a project, @access  Private
    .delete(auth_1.default, [
    (0, express_validator_1.check)('username')
        .not()
        .isEmpty()
], projectControllers_1.removeMemberFromProject);
// @route   GET api/project/memberorcreator/:projectId
// @desc    Get is current user is member or creator current project or both
// @access  Private
router.route("/memberorcreator/:projectId")
    .get(auth_1.default, projectControllers_1.isCurrentUserMemberOrCreatorOfThisProject);
// @route    PUT api/project/isDone/:projectId
// @desc     Toggle is a project done
// @access   Private
router.route('/isDone/:projectId')
    .put(auth_1.default, [
    (0, express_validator_1.check)('isDone')
        .not()
        .isEmpty()
], projectControllers_1.toggleIsProjectDone);
// @route  api/project/discussion/:projectId
router.route("/discussion/:projectId")
    // @desc    Add new discussion, @access  Private
    .post(auth_1.default, [
    (0, express_validator_1.check)('discussion')
        .not()
        .isEmpty()
], discussionControllers_1.addNewDiscussion);
// @route  api/project/discussion/:projectId/:discussionId
router.route("/discussion/:projectId/:discussionId")
    // @desc    Edit an existing discussion, @access  Private
    .put(auth_1.default, [
    (0, express_validator_1.check)('discussionEditText')
        .not()
        .isEmpty()
], discussionControllers_1.editDiscussion)
    // @desc    Delete an discussion, @access  Private
    .delete(auth_1.default, discussionControllers_1.deleteDiscussion);
// @route  api/project/assignTodo/todos/:projectId/:username
router.route("/assignTodo/todos/:projectId/:username")
    // @desc  Assign a todo to junior, @access  Private
    .post(auth_1.default, [
    (0, express_validator_1.check)('todo')
        .not()
        .isEmpty()
], todoControllers_1.assignTodoToAJunior);
// @route  api/project/todos/:projectId
router.route("/todos/:projectId")
    // @desc  Add new todo, @access  Private
    .post(auth_1.default, [
    (0, express_validator_1.check)('todo')
        .not()
        .isEmpty()
], todoControllers_1.addTodo);
// @route  api/project/toggle/todos/:projectId/:todoId
router.route("/toggle/todos/:projectId/:todoId")
    // @desc    Set todo done or incomplete, @access  Private
    .put(auth_1.default, [
    (0, express_validator_1.check)('isDone')
        .not()
        .isEmpty()
], todoControllers_1.toggleIsTodoDone);
// @route  api/project/todos/:projectId/:todoId
router.route("/todos/:projectId/:todoId")
    // @desc  Edit an existing todo, @access  Private
    .put(auth_1.default, [
    (0, express_validator_1.check)('todoEditText')
        .not()
        .isEmpty()
], todoControllers_1.editTodoText)
    // @desc    Delete an todo, @access  Private
    .delete(auth_1.default, todoControllers_1.deleteTodo);
// @route  api/project/todos/:projectId/todoId/:todoId
router.route("/todos/:projectId/todoId/:todoId")
    // @desc  Add new sub todo, @access  Private
    .post(auth_1.default, [
    (0, express_validator_1.check)('todo')
        .not()
        .isEmpty()
], subTodoControllers_1.addNewSubTodo);
// @route   PUT api/project/todos/:projectId/:todoId/:subTodoId
router.route("/todos/:projectId/:todoId/:subTodoId")
    // @desc  Edit an existing sub todo,  @access  Private
    .put(auth_1.default, [
    (0, express_validator_1.check)('subTodoEditText')
        .not()
        .isEmpty()
], subTodoControllers_1.editSubTodo)
    // @desc    Delete an sub todo, @access  Private
    .delete(auth_1.default, subTodoControllers_1.deleteSubTodo);
// @route  api/project/toggle/todos/:projectId/:todoId/:subTodoId
router.route("/toggle/todos/:projectId/:todoId/:subTodoId")
    // @desc  Set sub todo done or incomplete, @access  Private
    .put(auth_1.default, [
    (0, express_validator_1.check)('isDone')
        .not()
        .isEmpty()
], subTodoControllers_1.toggleIsSubTodoDone);
// @route  api/project/bugs/:id
router.route("/bugs/:projectId")
    // @desc    Add new bug, @access  Private
    .post(auth_1.default, [
    (0, express_validator_1.check)('bug')
        .not()
        .isEmpty()
], bugControllers_1.addNewBug);
// @route  api/project/bugs/:projectId/:bugId
router.route("/bugs/:projectId/:bugId")
    // @desc  Set bug fixed or not fixed, @access  Private
    .post(auth_1.default, [
    (0, express_validator_1.check)('isFixed')
        .not()
        .isEmpty()
], bugControllers_1.toggleIsBugFixed)
    // @desc    Edit an existing bug, @access  Private
    .put(auth_1.default, [
    (0, express_validator_1.check)('bugEditText')
        .not()
        .isEmpty()
], bugControllers_1.editBug)
    // @desc    Delete a bug, @access  Private
    .delete(auth_1.default, bugControllers_1.deleteBug);
exports.default = router;
