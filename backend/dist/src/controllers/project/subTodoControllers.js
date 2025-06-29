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
exports.deleteSubTodo = exports.toggleIsSubTodoDone = exports.editSubTodo = exports.addNewSubTodo = void 0;
const express_validator_1 = require("express-validator");
const Project_1 = __importDefault(require("../../models/Project"));
// @route   POST api/project/todos/:projectId/todoId/:todoId
// @desc    Add new sub todo
// @access  Private
const addNewSubTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ 'error': 'Server Error' });
        return;
    }
    try {
        const newTodo = {
            user: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id,
            addedBy: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id,
            text: (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.todo,
        };
        yield Project_1.default.update({ '_id': req.params.projectId, 'todos._id': req.params.todoId }, { $push: { 'todos.$.subTodos': newTodo } });
        let updatedProject = yield Project_1.default.findById(req.params.projectId)
            .populate('todos.user', 'username profileImage -_id')
            .populate('todos.subTodos.user', 'username profileImage -_id');
        if (!updatedProject || !updatedProject.todos || updatedProject.todos.length === 0) {
            res.status(404).json({ 'message': 'No todos found in this project' });
            return;
        }
        res.status(200).json(updatedProject.todos);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.addNewSubTodo = addNewSubTodo;
// @route   PUT api/project/todos/:projectId/:todoId/:subTodoId
// @desc    Edit an existing sub todo
// @access  Private
const editSubTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        //Checking is the subTodo assigned to current user
        let todos = yield Project_1.default.findById(req.params.projectId)
            .select({ 'todos': { $elemMatch: { _id: req.params.todoId } } });
        //as elemMatch does not work for nested element
        if (!todos || !todos.todos || todos.todos.length === 0 || !todos.todos[0].subTodos) {
            res.status(404).json({ 'error': 'No todos found in this project' });
            return;
        }
        let subTodoRequested = todos.todos[0].subTodos.filter(subTodo => { var _a; return ((_a = subTodo === null || subTodo === void 0 ? void 0 : subTodo._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.subTodoId.toString(); })[0];
        if (!subTodoRequested) {
            res.status(404).json({ 'error': 'No sub todo found' });
            return;
        }
        // subTodoRequested = subTodoRequested[0]; //as return array
        let isAssignedToCurrentUser = ((_a = subTodoRequested === null || subTodoRequested === void 0 ? void 0 : subTodoRequested.user) === null || _a === void 0 ? void 0 : _a.toString()) === ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id.toString());
        if (!isAssignedToCurrentUser) {
            res.status(400).json({ 'error': 'This sub todo does not assign to you.' });
            return;
        }
        //Update subTodo
        yield Project_1.default.updateOne({
            _id: req.params.projectId
        }, {
            "$set": {
                "todos.$[i].subTodos.$[j].text": req.body.subTodoEditText
            }
        }, {
            arrayFilters: [
                { "i._id": req.params.todoId },
                { "j._id": req.params.subTodoId }
            ]
        });
        let project = yield Project_1.default.findById(req.params.projectId)
            .populate('todos.user', 'username profileImage -_id')
            .populate('todos.subTodos.user', 'username profileImage -_id');
        if (!project || !project.todos || project.todos.length === 0) {
            res.status(404).json({ 'message': 'No todos found in this project' });
            return;
        }
        res.status(200).json(project.todos);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.editSubTodo = editSubTodo;
// @route   PUT api/project/toggle/todos/:projectId/:todoId/:subTodoId
// @desc    Set sub todo done or incomplete
// @access  Private
const toggleIsSubTodoDone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        //Checking is the subTodo assigned to current user
        let todos = yield Project_1.default.findById(req.params.projectId)
            .select({ 'todos': { $elemMatch: { _id: req.params.todoId } } });
        if (!todos || !todos.todos || todos.todos.length === 0 || !((_a = todos.todos[0]) === null || _a === void 0 ? void 0 : _a.subTodos) || todos.todos[0].subTodos.length === 0) {
            res.status(404).json({ 'error': 'No todos found in this project' });
            return;
        }
        //as elemMatch does not work for nested element
        let subTodoRequested = todos.todos[0].subTodos.filter(subTodo => { var _a; return ((_a = subTodo === null || subTodo === void 0 ? void 0 : subTodo._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.subTodoId.toString(); })[0];
        // subTodoRequested = subTodoRequested[0]; //as return array
        let isAssignedToCurrentUser = ((_b = subTodoRequested === null || subTodoRequested === void 0 ? void 0 : subTodoRequested.user) === null || _b === void 0 ? void 0 : _b.toString()) === ((_d = (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id) === null || _d === void 0 ? void 0 : _d.toString());
        if (!isAssignedToCurrentUser) {
            res.status(400).json({ 'error': 'This sub todo does not assign to you.' });
            return;
        }
        //Toggling isDone
        let isDone = req.body.isDone === 'true';
        let doneAt = null;
        if (isDone)
            doneAt = new Date();
        yield Project_1.default.updateOne({
            _id: req.params.projectId,
        }, {
            "$set": {
                "todos.$[i].subTodos.$[j].done": isDone,
                "todos.$[i].subTodos.$[j].doneAt": doneAt
            }
        }, {
            arrayFilters: [
                { "i._id": req.params.todoId },
                { "j._id": req.params.subTodoId }
            ]
        });
        let project = yield Project_1.default.findById(req.params.projectId)
            .populate('todos.user', 'username profileImage -_id')
            .populate('todos.subTodos.user', 'username profileImage -_id');
        if (!project || !project.todos || project.todos.length === 0) {
            res.status(404).json({ 'message': 'No todos found in this project' });
            return;
        }
        res.status(200).json(project.todos);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.toggleIsSubTodoDone = toggleIsSubTodoDone;
// @route   DELETE api/project/todos/:projectId/:todoId/:subTodoId
// @desc    Delete a sub todo
// @access  Private
const deleteSubTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        //Checking is the subTodo assigned to current user
        let todos = yield Project_1.default.findById(req.params.projectId)
            .select({ 'todos': { $elemMatch: { _id: req.params.todoId } } });
        if (!todos || !todos.todos || todos.todos.length === 0 || !todos.todos[0].subTodos || todos.todos[0].subTodos.length === 0) {
            res.status(404).json({ 'error': 'No todos found in this project' });
            return;
        }
        //as elemMatch does not work for nested element
        let subTodoRequested = todos.todos[0].subTodos.filter(subTodo => { var _a, _b, _c; return ((_a = subTodo === null || subTodo === void 0 ? void 0 : subTodo._id) === null || _a === void 0 ? void 0 : _a.toString()) === ((_c = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.subTodoId) === null || _c === void 0 ? void 0 : _c.toString()); })[0];
        if (!subTodoRequested) {
            res.status(400).json({ 'error': 'No sub todo there' });
            return;
        }
        // subTodoRequested = subTodoRequested[0]; //as return array
        let isAssignedToCurrentUser = ((_a = subTodoRequested === null || subTodoRequested === void 0 ? void 0 : subTodoRequested.user) === null || _a === void 0 ? void 0 : _a.toString()) === ((_c = (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) === null || _c === void 0 ? void 0 : _c.toString());
        if (!isAssignedToCurrentUser) {
            res.status(400).json({ 'error': 'This sub todo does not assign to you.' });
            return;
        }
        //deleting sub todo
        yield Project_1.default.updateOne({
            _id: req.params.projectId
        }, {
            "$pull": {
                "todos.$[i].subTodos": { '_id': req.params.subTodoId }
            }
        }, {
            arrayFilters: [
                { "i._id": req.params.todoId }
            ]
        });
        let project = yield Project_1.default.findById(req.params.projectId)
            .populate('todos.user', 'username profileImage -_id')
            .populate('todos.subTodos.user', 'username profileImage -_id');
        if (!project || !project.todos || project.todos.length === 0) {
            res.status(404).json({ 'message': 'No todos found in this project' });
            return;
        }
        res.status(200).json(project.todos);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.deleteSubTodo = deleteSubTodo;
