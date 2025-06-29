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
exports.assignTodoToAJunior = exports.deleteTodo = exports.editTodoText = exports.toggleIsTodoDone = exports.addTodo = void 0;
const express_validator_1 = require("express-validator");
const Project_1 = __importDefault(require("../../models/Project"));
const User_1 = __importDefault(require("../../models/User"));
// @route   POST api/project/todos/:projectId
// @desc    Add new todo
// @access  Private
const addTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ 'error': 'Server Error' });
        return;
    }
    try {
        let project = yield Project_1.default.findById(req.params.projectId);
        if (!project) {
            res.status(404).json({ 'message': 'Project Not Found' });
            return;
        }
        const newTodo = {
            user: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || "",
            addedBy: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || "",
            text: (req === null || req === void 0 ? void 0 : req.body.todo) || ""
        };
        project === null || project === void 0 ? void 0 : project.todos.unshift(newTodo);
        yield project.save();
        project = yield Project_1.default.findById(req.params.projectId)
            .populate('todos.user', 'username profileImage -_id')
            .populate('todos.subTodos.user', 'username profileImage -_id');
        if (!project || !project.todos || project.todos.length === 0) {
            res.status(404).json({ 'message': 'No todos found in this project' });
            return;
        }
        res.json(project.todos[0]);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.addTodo = addTodo;
// @route   PUT api/project/toggle/todos/:projectId/:todoId
// @desc    Set todo done or incomplete
// @access  Private
const toggleIsTodoDone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let project = yield Project_1.default.findOne({ 'todos._id': req.params.todoId });
        if (!project) {
            res.status(404).json({ 'message': 'Project Not Found' });
            return;
        }
        const todos = project.todos;
        let isAssignedToCurrentUser = false;
        todos.map(todo => {
            var _a, _b;
            if (((_a = todo === null || todo === void 0 ? void 0 : todo._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.todoId.toString()) {
                if (todo.user.toString() === ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id.toString()))
                    isAssignedToCurrentUser = true;
            }
        });
        if (!isAssignedToCurrentUser) {
            res.status(400).json({ 'error': 'This todo does not assign to you.' });
            return;
        }
        let isDone = req.body.isDone === 'true';
        let doneAt = null;
        if (isDone)
            doneAt = new Date();
        yield Project_1.default.updateOne({ _id: req.params.projectId, 'todos._id': req.params.todoId }, {
            '$set': {
                'todos.$.done': isDone,
                'todos.$.doneAt': doneAt
            }
        });
        project = yield Project_1.default.findById(req.params.projectId)
            .populate('todos.user', 'username profileImage -_id')
            .populate('todos.subTodos.user', 'username profileImage -_id');
        if (!project || !project.todos || project.todos.length === 0) {
            res.status(404).json({ 'message': 'No todos found in this project' });
            return;
        }
        res.json(project.todos);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.toggleIsTodoDone = toggleIsTodoDone;
// @route   PUT api/project/todos/:projectId/:todoId
// @desc    Edit an existing todo
// @access  Private
const editTodoText = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let project = yield Project_1.default.findOne({ 'todos._id': req.params.todoId });
        if (!project) {
            res.status(404).json({ 'message': 'Project Not Found' });
            return;
        }
        const todos = project.todos;
        let isAssignedToCurrentUser = false;
        todos.map(todo => {
            var _a, _b;
            if (((_a = todo === null || todo === void 0 ? void 0 : todo._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.todoId.toString()) {
                if (todo.user.toString() === ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id.toString()))
                    isAssignedToCurrentUser = true;
            }
        });
        if (!isAssignedToCurrentUser) {
            res.status(400).json({ 'error': 'Server Error' });
            return;
        }
        yield Project_1.default.updateOne({ _id: req.params.projectId, 'todos._id': req.params.todoId }, {
            '$set': {
                'todos.$.text': req.body.todoEditText
            }
        });
        project = yield Project_1.default.findById(req.params.projectId)
            .populate('todos.user', 'username profileImage -_id')
            .populate('todos.subTodos.user', 'username profileImage -_id');
        if (!project || !project.todos || project.todos.length === 0) {
            res.status(404).json({ 'message': 'No todos found in this project' });
            return;
        }
        res.json(project.todos);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.editTodoText = editTodoText;
// @route   DELETE api/project/todos/:projectId/:todoId
// @desc    Delete a todo
// @access  Private
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let project = yield Project_1.default.findOne({ 'todos._id': req.params.todoId });
        if (!project) {
            res.status(404).json({ 'message': 'Project Not Found' });
            return;
        }
        const todos = project.todos;
        let isAssignedToCurrentUser = false;
        todos.map(todo => {
            var _a, _b;
            if (((_a = todo === null || todo === void 0 ? void 0 : todo._id) === null || _a === void 0 ? void 0 : _a.toString()) === req.params.todoId.toString()) {
                if (todo.user.toString() === ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id.toString()))
                    isAssignedToCurrentUser = true;
            }
        });
        if (!isAssignedToCurrentUser) {
            res.status(400).json({ 'error': 'Server Error' });
            return;
        }
        yield Project_1.default.updateOne({ _id: req.params.projectId }, { '$pull': {
                'todos': { _id: req.params.todoId }
            } });
        project = yield Project_1.default.findById(req.params.projectId)
            .populate('todos.user', 'username profileImage -_id')
            .populate('todos.subTodos.user', 'username profileImage -_id');
        if (!project || !project.todos || project.todos.length === 0) {
            res.status(404).json({ 'message': 'No todos found in this project' });
            return;
        }
        res.json(project.todos);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.deleteTodo = deleteTodo;
// @route   POST api/project/assignTodo/todos/:projectId/:username
// @desc    Assign a todo to junior
// @access  Private
const assignTodoToAJunior = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ 'error': 'Server Error' });
        return;
    }
    try {
        //Checking is given user is junior than current user
        const givenUser = yield User_1.default.findOne({ 'username': req.params.username })
            .select('_id role');
        const currentUser = yield User_1.default.findById((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id)
            .select('_id role');
        if (!givenUser || !currentUser) {
            res.status(404).json({ 'message': 'User Not Found' });
            return;
        }
        if (parseInt(currentUser.role) > parseInt(givenUser.role)) {
            res.status(400).json({ 'error': 'You can not assign todo for senior.' });
            return;
        }
        //Adding todo in project
        let project = yield Project_1.default.findById(req.params.projectId);
        const newTodo = {
            user: givenUser._id || "",
            addedBy: ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) || "",
            text: req.body.todo || "",
        };
        if (!project) {
            res.status(500).json({ "message": "Project not found" });
            return;
        }
        project.todos.unshift(newTodo);
        yield project.save();
        project = yield Project_1.default.findById(req.params.projectId)
            .populate('todos.user', 'username profileImage -_id')
            .populate('todos.subTodos.user', 'username profileImage -_id');
        if (!project || !project.todos || project.todos.length === 0) {
            res.status(404).json({ 'message': 'No todos found in this project' });
            return;
        }
        res.json(project.todos[0]);
    }
    catch (e) {
        console.error(e);
        res.status(400).json({ 'error': 'Server Error' });
    }
});
exports.assignTodoToAJunior = assignTodoToAJunior;
