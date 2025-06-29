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
exports.deleteBug = exports.editBug = exports.toggleIsBugFixed = exports.addNewBug = void 0;
const express_validator_1 = require("express-validator");
const Project_1 = __importDefault(require("../../models/Project"));
// @route   POST api/project/bugs/:id
// @desc    Add new bug
// @access  Private
const addNewBug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ 'error': 'Server Error' });
        return;
    }
    try {
        let project = yield Project_1.default.findById(req.params.projectId);
        if (!project) {
            res.status(404).json({ 'error': 'Project not found' });
            return;
        }
        if (!((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            res.status(401).json({ 'error': 'User not authorized' });
            return;
        }
        const newBug = {
            user: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id,
            text: req.body.bug,
        };
        project.bugs.unshift(newBug);
        yield project.save();
        project = yield Project_1.default.findById(req.params.projectId).populate('bugs.user', 'username profileImage -_id');
        if (!project || !project.bugs.length) {
            res.status(404).json({ 'error': 'No bugs found' });
            return;
        }
        res.json(project.bugs[0]);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.addNewBug = addNewBug;
// @route   POST api/project/bugs/:projectId/:bugId
// @desc    Set bug fixed or not fixed
// @access  Private
const toggleIsBugFixed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let project = yield Project_1.default.findOne({ 'bugs._id': req.params.bugId });
        if (!project || !(project === null || project === void 0 ? void 0 : project.bugs) || project.bugs.length == 0) {
            res.status(400).json({ "message": "No project or no bugs found in this project" });
            return;
        }
        const bugs = project.bugs;
        let isThisBugAddedByCurrentUser = false;
        bugs.map(bug => {
            var _a, _b, _c;
            if (((_a = bug === null || bug === void 0 ? void 0 : bug._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.bugId.toString()) {
                if (bug.user.toString() === ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString()))
                    isThisBugAddedByCurrentUser = true;
            }
        });
        if (!isThisBugAddedByCurrentUser) {
            res.status(400).json({ 'error': 'This bug does not added by you.' });
            return;
        }
        let isFixed = req.body.isFixed === 'true';
        let fixedAt = null;
        if (isFixed)
            fixedAt = new Date();
        yield Project_1.default.updateOne({ _id: req.params.projectId, 'bugs._id': req.params.bugId }, {
            '$set': {
                'bugs.$.fixed': isFixed,
                'bugs.$.fixedAt': fixedAt
            }
        });
        project = yield Project_1.default.findById(req.params.projectId).populate('bugs.user', 'username profileImage -_id');
        if (!project || !project.bugs.length) {
            res.status(404).json({ 'error': 'No bugs found' });
            return;
        }
        res.json(project.bugs);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.toggleIsBugFixed = toggleIsBugFixed;
// @route   PUT api/project/bugs/:projectId/:bugId
// @desc    Edit an existing bug
// @access  Private
const editBug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let project = yield Project_1.default.findOne({ 'bugs._id': req.params.bugId });
        if (!project || !(project === null || project === void 0 ? void 0 : project.bugs) || project.bugs.length == 0) {
            res.status(400).json({ 'error': 'No project or no bugs found in this project' });
            return;
        }
        const bugs = project.bugs;
        let isThisBugAddedByCurrentUser = false;
        bugs.map(bug => {
            var _a, _b, _c;
            if (((_a = bug === null || bug === void 0 ? void 0 : bug._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.bugId.toString()) {
                if (bug.user.toString() === ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString()))
                    isThisBugAddedByCurrentUser = true;
            }
        });
        if (!isThisBugAddedByCurrentUser) {
            res.status(400).json({ 'error': 'Server Error' });
            return;
        }
        yield Project_1.default.updateOne({ _id: req.params.projectId, 'bugs._id': req.params.bugId }, {
            '$set': {
                'bugs.$.text': req.body.bugEditText
            }
        });
        project = yield Project_1.default.findById(req.params.projectId).populate('bugs.user', 'username profileImage -_id');
        if (!project || !project.bugs.length) {
            res.status(404).json({ 'error': 'No bugs found' });
            return;
        }
        res.json(project.bugs);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.editBug = editBug;
// @route   DELETE api/project/bugs/:projectId/:bugId
// @desc    Delete a bug
// @access  Private
const deleteBug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let project = yield Project_1.default.findOne({ 'bugs._id': req.params.bugId });
        if (!project || !(project === null || project === void 0 ? void 0 : project.bugs) || project.bugs.length == 0) {
            res.status(400).json({ 'error': 'No project or no bugs found in this project' });
            return;
        }
        const bugs = project.bugs;
        let isThisBugAddedByCurrentUser = false;
        bugs.map(bug => {
            var _a, _b, _c;
            if (((_a = bug === null || bug === void 0 ? void 0 : bug._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.bugId.toString()) {
                if (bug.user.toString() === ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString()))
                    isThisBugAddedByCurrentUser = true;
            }
        });
        if (!isThisBugAddedByCurrentUser) {
            res.status(400).json({ 'error': 'Server Error' });
            return;
        }
        yield Project_1.default.updateOne({ _id: req.params.projectId }, { '$pull': {
                'bugs': { _id: req.params.bugId }
            } });
        project = yield Project_1.default.findById(req.params.projectId).populate('bugs.user', 'username profileImage -_id');
        if (!project || !project.bugs.length) {
            res.status(404).json({ 'error': 'No bugs found' });
            return;
        }
        res.json(project.bugs);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.deleteBug = deleteBug;
