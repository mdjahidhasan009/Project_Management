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
exports.deleteDiscussion = exports.editDiscussion = exports.addNewDiscussion = void 0;
const express_validator_1 = require("express-validator");
const Project_1 = __importDefault(require("../../models/Project"));
// @route   POST api/project/discussion/:projectId
// @desc    Add new discussion
// @access  Private
const addNewDiscussion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            res.status(401).json({ 'error': 'Unauthorized' });
            return;
        }
        const newDiscussion = {
            user: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id,
            text: req.body.discussion,
        };
        project.discussion.unshift(newDiscussion);
        yield project.save();
        project = yield Project_1.default.findById(req.params.projectId).populate('discussion.user', 'username profileImage -_id');
        if (!project || !project.discussion || project.discussion.length === 0) {
            res.status(404).json({ 'error': 'No discussions found' });
            return;
        }
        res.json(project.discussion[0]);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.addNewDiscussion = addNewDiscussion;
// @route   PUT api/project/discussion/:projectId/:discussionId
// @desc    Edit an existing discussion
// @access  Private
const editDiscussion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let project = yield Project_1.default.findOne({ 'discussion._id': req.params.discussionId });
        if (!project) {
            res.status(404).json({ 'error': 'Project not found' });
            return;
        }
        const discussion = project.discussion;
        let isThisDiscussionAddedByCurrentUser = false;
        discussion.map(discussion => {
            var _a, _b, _c;
            if (((_a = discussion === null || discussion === void 0 ? void 0 : discussion._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.discussionId.toString()) {
                if (discussion.user.toString() === ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString()))
                    isThisDiscussionAddedByCurrentUser = true;
            }
        });
        if (!isThisDiscussionAddedByCurrentUser) {
            res.status(400).json({ 'error': 'Server Error' });
            return;
        }
        yield Project_1.default.updateOne({ _id: req.params.projectId, 'discussion._id': req.params.discussionId }, { '$set': {
                'discussion.$.text': req.body.discussionEditText
            }
        });
        project = yield Project_1.default
            .findById(req.params.projectId)
            .populate('discussion.user', 'username profileImage -_id');
        if (!project || !project.discussion || project.discussion.length === 0) {
            res.status(404).json({ 'error': 'No discussions found' });
            return;
        }
        res.status(200).json(project.discussion);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.editDiscussion = editDiscussion;
// @route   DELETE api/project/discussion/:projectId/:discussionId
// @desc    Delete an discussion
// @access  Private
const deleteDiscussion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let project = yield Project_1.default.findOne({ 'discussion._id': req.params.discussionId });
        if (!project) {
            res.status(404).json({ 'error': 'Project not found' });
            return;
        }
        const discussion = project.discussion;
        let isThisDiscussionAddedByCurrentUser = false;
        discussion.map(discuss => {
            var _a, _b, _c;
            if (((_a = discuss === null || discuss === void 0 ? void 0 : discuss._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.discussionId.toString()) {
                if (discuss.user.toString() === ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString()))
                    isThisDiscussionAddedByCurrentUser = true;
            }
        });
        if (!isThisDiscussionAddedByCurrentUser) {
            res.status(400).json({ 'error': 'Server Error' });
            return;
        }
        yield Project_1.default.updateOne({ _id: req.params.projectId }, { '$pull': {
                'discussion': { _id: req.params.discussionId }
            } });
        project = yield Project_1.default.findById(req.params.projectId).populate('discussion.user', 'username profileImage -_id');
        if (!project || !project.discussion || project.discussion.length === 0) {
            res.status(404).json({ 'error': 'No discussions found' });
            return;
        }
        res.json(project.discussion);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.deleteDiscussion = deleteDiscussion;
