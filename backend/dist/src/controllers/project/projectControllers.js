"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleIsProjectDone = exports.isCurrentUserMemberOrCreatorOfThisProject = exports.removeMemberFromProject = exports.addNewMemberInProject = exports.getProjectDetails = exports.deleteProject = exports.editProject = exports.addNewProject = exports.getAllProjectsDetails = void 0;
const express_validator_1 = require("express-validator");
const Project_1 = __importDefault(require("../../models/Project"));
const User_1 = __importDefault(require("../../models/User"));
// @route   GET api/project
// @desc    Get all projects
// @access  Private
const getAllProjectsDetails = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield Project_1.default.find()
            .populate('createdBy', 'username -_id')
            .populate('discussion.user', 'username profileImage -_id')
            .populate('members.user', 'username profileImage -_id')
            .populate('todos.user', 'username profileImage -_id')
            .populate('todos.subTodos.user', 'username profileImage -_id')
            .populate('bugs.user', 'username profileImage -_id');
        if (!projects || projects.length === 0) {
            res.status(404).json({ "error": "No projects found" });
            return;
        }
        res.status(200).json(projects);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ "error": "Server error " });
    }
});
exports.getAllProjectsDetails = getAllProjectsDetails;
// @route   POST api/project
// @desc    Add new project
// @access  Private
const addNewProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req); //Validation error check
    if (!errors.isEmpty()) {
        res.status(400).json({ "error": "Server error" });
        return;
    }
    const { name, category, description, deadline } = req.body;
    try {
        let project = yield Project_1.default.findOne({ name });
        if (project) {
            res.status(422).json({ 'error': 'This project name already taken, choose another one' });
            return;
        }
        const newProject = new Project_1.default({
            name,
            category,
            description,
            deadline,
            createdBy: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id
        });
        project = yield newProject.save(); //Created by will be userId as it user's own userid so it will not a problem
        res.json(project);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ "error": "Server error " });
    }
});
exports.addNewProject = addNewProject;
// @route   GET api/project/:projectId
// @desc    Get all data of project
// @access  Private
const getProjectDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield Project_1.default.findById(req.params.projectId)
            .populate('createdBy', 'username -_id')
            .populate('discussion.user', 'username profileImage -_id')
            .populate('members.user', 'username profileImage role -_id')
            .populate('todos.user', 'username profileImage -_id')
            .populate('todos.subTodos.user', 'username profileImage -_id')
            .populate('bugs.user', 'username profileImage -_id');
        if (!project) {
            res.status(404).json({ "error": "Project not found" });
            return;
        }
        res.status(200).json(project);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.getProjectDetails = getProjectDetails;
// @route   PUT api/project/:projectId
// @desc    Edit project details(name, details, category, deadline)
// @access  Private
const editProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ "error": "Server error" });
        return;
    }
    const { name, category, description, deadline } = req.body;
    try {
        let project = yield Project_1.default.findById(req.params.projectId);
        if (!project) {
            res.status(400).json({ 'error': 'Server Error' });
            return;
        }
        if (((_a = project === null || project === void 0 ? void 0 : project.createdBy) === null || _a === void 0 ? void 0 : _a.toString()) !== ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id)) {
            res.status(400).json({ 'error': 'You are not authorized to edit this project' });
            return;
        }
        project = yield Project_1.default.findOneAndUpdate({ _id: req.params.projectId }, {
            name,
            category,
            description,
            deadline
        });
        if (!project) {
            res.status(400).json({ 'error': 'Server Error' });
            return;
        }
        res.json({
            name: project.name,
            category: project.category,
            description: project.description,
            deadline: project.deadline
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ "error": "Server error " });
    }
});
exports.editProject = editProject;
// @route   DELETE api/project/:projectId
// @desc    Delete a project
// @access  Private
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const project = yield Project_1.default.findById(req.params.projectId);
        if (!project) {
            res.status(400).json({ 'error': 'Server Error' });
            return;
        } //project not found
        if (((_a = project === null || project === void 0 ? void 0 : project.createdBy) === null || _a === void 0 ? void 0 : _a.toString()) !== ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id)) {
            res.status(400).json({ 'error': 'Server Error' }); //user who requested was not created this project
            return;
        }
        yield Project_1.default.deleteOne({ _id: req.params.projectId });
        res.status(200).json('Deleted');
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ "error": "Server Error" });
    }
});
exports.deleteProject = deleteProject;
// @route   POST api/project/:projectId
// @desc    Add a member in project
// @access  Private
const addNewMemberInProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ 'error': 'Please enter all fields' });
        return;
    }
    try {
        const { username } = req.body;
        const project = yield Project_1.default.findById(req.params.projectId);
        if (!project) {
            res.status(404).json({ 'error': 'Project not found' });
            return;
        } //project not found
        const user = yield User_1.default.findOne({ username: username });
        if (!user) {
            res.status(400).json({ 'error': 'Server Error' });
            return;
        } //user not found
        project.members.unshift({ user: user._id });
        yield project.save();
        const membersOfProject = yield Project_1.default.findOne({ _id: req.params.projectId })
            .populate('members.user', 'username profileImage role -_id');
        if (!membersOfProject || membersOfProject.members.length === 0) {
            res.status(404).json({ 'error': 'No members found in this project' });
            return;
        }
        res.json(membersOfProject.members[0]);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.addNewMemberInProject = addNewMemberInProject;
// @route   DELETE api/project/member/:projectId/
// @desc    Delete a member from a project
// @access  Private
const removeMemberFromProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ 'error': 'Server Error' });
        return;
    }
    try {
        const { username } = req.body;
        const project = yield Project_1.default.findById(req.params.projectId);
        if (!project) {
            res.status(404).json({ 'error': 'Project not found' });
            return;
        } //project not found
        if (((_a = project === null || project === void 0 ? void 0 : project.createdBy) === null || _a === void 0 ? void 0 : _a.toString()) !== ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id)) {
            res.status(400).json({ 'error': 'You are not authorized to remove members from this project' });
            return;
        }
        const user = yield User_1.default.findOne({ username: username });
        if (!user) {
            res.status(400).json({ 'error': 'Server Error' });
            return;
        }
        yield Project_1.default.updateOne({ _id: req.params.projectId }, {
            '$pull': {
                'members': { user: user._id }
            }
        });
        yield project.save();
        const membersOfProject = yield Project_1.default.findOne({ _id: req.params.projectId })
            .populate('members.user', 'username profileImage role -_id');
        if (!membersOfProject || membersOfProject.members.length === 0) {
            res.status(404).json({ 'error': 'No members found in this project' });
            return;
        }
        res.json(membersOfProject.members);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.removeMemberFromProject = removeMemberFromProject;
// @route   GET api/project/memberorcreator/:projectId
// @desc    Get is current user is member or creator current project or both
// @access  Private
const isCurrentUserMemberOrCreatorOfThisProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const project = yield Project_1.default.findById(req.params.projectId);
        if (!project) {
            res.status(404).json({ 'error': 'Project not found' });
            return;
        }
        const isCreatedByUser = ((_a = project === null || project === void 0 ? void 0 : project.createdBy) === null || _a === void 0 ? void 0 : _a.toString()) === ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString());
        let isMemberOfThisProject = false;
        project.members.map(member => {
            var _a, _b, _c;
            if (((_a = member === null || member === void 0 ? void 0 : member.user) === null || _a === void 0 ? void 0 : _a.toString()) === ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString()))
                isMemberOfThisProject = true;
        });
        res.json({ isMemberOfThisProject, isCreatedByUser });
    }
    catch (error) {
        console.error(error);
        res.status(400).json("Server Error");
    }
});
exports.isCurrentUserMemberOrCreatorOfThisProject = isCurrentUserMemberOrCreatorOfThisProject;
// @route    PUT api/project/isDone/:projectId
// @desc     Toggle is a project done
// @access   Private
const toggleIsProjectDone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(500).json({ 'error': 'Server error ' });
            return;
        }
        const isDoneBool = req.body.isDone.toString() === 'true';
        yield Project_1.default.updateOne({ _id: req.params.projectId }, { isDone: isDoneBool });
        res.status(200).json({ 'result': 'ok' });
    }
    catch (error) {
        console.error(error);
    }
});
exports.toggleIsProjectDone = toggleIsProjectDone;
