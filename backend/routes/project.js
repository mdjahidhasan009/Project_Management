const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth');
const ObjectId = require("mongoose");

// @route   GET api/project
// @desc    Get all projects
// @access  Private
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('discussion.user', 'username profileImage -_id')
            .populate('members.user', 'username profileImage -_id')
            .populate('todos.user', 'username profileImage -_id')
            .populate('bugs.user', 'username profileImage -_id');
        await res.json(projects);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ "error": "Server error "});
    }
})

// @route   POST api/project
// @desc    Add new project
// @access  Private
router.post(
    '/',
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
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            // console.log(errors.array());
            // return res.status(400).json({ errors: errors.array() });
            return res.status(400).json({ "error": "Server error" });
        }
        const { name, category, description, deadline } = req.body;
        // console.log(name, category, deadline);
        try {
            let project = await Project.findOne({ name });
            // console.log(project);
            // console.log(req.user.id);
            // console.log(req.user);
            if(project) return res.status(400).json({ 'error': 'This project name already taken, choose another one' });
            const newProject = new Project({
                name,
                category,
                description,
                deadline,
                createdBy : req.user.id
            });
            project = await newProject.save();
            await res.json(project);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ "error": "Server error "});
        }
    }
)

// @route   PUT api/project/:projectId
// @desc    Edit project details(name, details, category, deadline)
// @access  Private
router.put(
    '/:projectId',
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
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ "error": "Server error" });
        }
        const { name, category, description, deadline } = req.body;
        // console.log(name, category, description, deadline, req.params.projectId);
        try {
            let project = await Project.findById(req.params.projectId);
            if(!project) return res.status(400).json({ 'error': 'Server Error' });
            // console.log('11111111111111111111111111111111111111111111111111111111')
            project = await Project.findOneAndUpdate({ _id: req.params.projectId},
                 {
                        name,
                        category,
                        description,
                        deadline
                    }
            );
            // console.log('9999999999999999999999');
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
)

// @route   POST api/project/memberorcreator/:projectId
// @desc    Get is current user is member or creator current project or both
// @access  Private
router.get(
    '/memberorcreator/:projectId',
    auth,
    async (req, res) => {
        try {
            const project = await Project.findById(req.params.projectId);
            const isCreatedByUser = project.createdBy.toString() === req.user.id;
            let isMemberOfThisProject = false;
            project.members.map(member => {
                if(member.user.toString() === req.user.id) isMemberOfThisProject = true;
            })
            return res.json({ isMemberOfThisProject, isCreatedByUser});

        } catch(error) {
            console.error(error);
            return res.status(400).json("Server Error");
        }
    }
)

// @route   POST api/project/discussion/:projectId
// @desc    Add new discussion
// @access  Private
router.post(
    '/discussion/:projectId',
    auth,
    [
        check('discussion')
            .not()
            .isEmpty()
    ],
    async(req, res) => {
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
            project = await Project.findById(req.params.projectId).populate('discussion.user', 'username -_id')
            await res.json(project.discussion[0]);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   POST api/project/todos/:projectId
// @desc    Add new todo
// @access  Private
router.post(
    '/todos/:projectId',
    auth,
    [
        check('todo')
            .not()
            .isEmpty()
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ 'error': 'Server Error' });
        }
        try {
            let project = await Project.findById(req.params.projectId);
            const newTodo = {
                user: req.user.id,
                text: req.body.todo,
            };
            project.todos.unshift(newTodo);
            await project.save();
            project = await Project.findById(req.params.projectId).populate('todos.user', 'username profileImage -_id');
            await res.json(project.todos[0]);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   POST api/project/todos/:projectId/:todoId
// @desc    Set todo done or incomplete
// @access  Private
router.post(
    '/todos/:projectId/:todoId',
    auth,
    [
        check('isDone')
            .not()
            .isEmpty()
    ],
    async(req, res) => {
        try {
            let project = await Project.findOne( { 'todos._id': req.params.todoId } )
            const todos = project.todos;
            let isThisTodoAddedByCurrentUser = false;
            todos.map(todo => {
                if(todo._id.toString() === req.params.todoId) {
                    if (todo.user.toString() === req.user.id) isThisTodoAddedByCurrentUser = true;
                }
            })
            if(!isThisTodoAddedByCurrentUser) return res.status(400).json({ 'error': 'Server Error' });


            let isDone = req.body.isDone === 'true';
            // let project = await Project.findOne({ _id: req.params.projectId, 'todos._id': req.params.todoId});
            let doneAt = null;
            if(isDone) doneAt = new Date();
            // console.log(doneAt);
            await Project.updateOne({ _id: req.params.projectId, 'todos._id': req.params.todoId},
                 {'$set': {
                    'todos.$.done': isDone,
                    'todos.$.doneAt': doneAt
                }}
            );
            project = await Project.findById(req.params.projectId).populate('todos.user', 'username profileImage -_id');
            await res.json(project.todos);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   PUT api/project/todos/:projectId/:todoId
// @desc    Edit an existing todo
// @access  Private
router.put(
    '/todos/:projectId/:todoId',
    auth,
    [
        check('todoEditText')
            .not()
            .isEmpty()
    ],
    async(req, res) => {
        try {
            let project = await Project.findOne( { 'todos._id': req.params.todoId } )
            const todos = project.todos;
            let isThisTodoAddedByCurrentUser = false;
            todos.map(todo => {
                if(todo._id.toString() === req.params.todoId) {
                    if (todo.user.toString() === req.user.id) isThisTodoAddedByCurrentUser = true;
                }
            })
            if(!isThisTodoAddedByCurrentUser) return res.status(400).json({ 'error': 'Server Error' });
            await Project.updateOne(
                { _id: req.params.projectId, 'todos._id': req.params.todoId},
                {'$set': {
                    'todos.$.text': req.body.todoEditText
                }}
            );
            project = await Project.findById(req.params.projectId).populate('todos.user', 'username profileImage -_id');
            await res.json(project.todos);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   DELETE api/project/todos/:projectId/:todoId
// @desc    Delete an todo
// @access  Private
router.delete(
    '/todos/:projectId/:todoId',
    auth,
    async(req, res) => {
        try {
            let project = await Project.findOne( { 'todos._id': req.params.todoId } )
            const todos = project.todos;
            let isThisTodoAddedByCurrentUser = false;
            todos.map(todo => {
                if(todo._id.toString() === req.params.todoId) {
                    if (todo.user.toString() === req.user.id) isThisTodoAddedByCurrentUser = true;
                }
            })
            if(!isThisTodoAddedByCurrentUser) return res.status(400).json({ 'error': 'Server Error' });
            await Project.updateOne(
                { _id: req.params.projectId },
                {'$pull': {
                        'todos': { _id: req.params.todoId }
                    }}
            );
            project = await Project.findById(req.params.projectId).populate('todos.user', 'username profileImage -_id');
            await res.json(project.todos);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   POST api/project/bugs/:id
// @desc    Add new bug
// @access  Private
router.post(
    '/bugs/:projectId',
    auth,
    [
        check('bug')
            .not()
            .isEmpty()
    ],
    async(req, res) => {
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
            project = await Project.findById(req.params.projectId).populate('bugs.user', 'username -_id');
            await res.json(project.bugs[0]);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   POST api/project/bugs/:projectId/:bugId
// @desc    Set bug fixed or not fixed
// @access  Private
router.post(
    '/bugs/:projectId/:bugId',
    auth,
    [
        check('isFixed')
            .not()
            .isEmpty()
    ],
    async(req, res) => {
        try {
            let project = await Project.findOne( { 'bugs._id': req.params.bugId } )
            const bugs = project.bugs;
            let isThisBugAddedByCurrentUser = false;
            bugs.map(bug => {
                if(bug._id.toString() === req.params.bugId) {
                    if (bug.user.toString() === req.user.id) isThisBugAddedByCurrentUser = true;
                }
            })
            if(!isThisBugAddedByCurrentUser) return res.status(400).json({ 'error': 'Server Error' });

            let isFixed = req.body.isFixed === 'true';
            let fixedAt = null;
            if(isFixed) fixedAt = new Date();
            // console.log(fixedAt);
            // let project = await Project.findOne({ _id: req.params.projectId, 'todos._id': req.params.todoId});
            await Project.updateOne(
                { _id: req.params.projectId, 'bugs._id': req.params.bugId},
                {'$set': {
                    'bugs.$.fixed': isFixed,
                    'bugs.$.fixedAt': fixedAt
                }}
            );
            project = await Project.findById(req.params.projectId).populate('bugs.user', 'username profileImage -_id');
            await res.json(project.bugs);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   PUT api/project/bugs/:projectId/:bugId
// @desc    Edit an existing bug
// @access  Private
router.put(
    '/bugs/:projectId/:bugId',
    auth,
    [
        check('bugEditText')
            .not()
            .isEmpty()
    ],
    async(req, res) => {
        try {
            let project = await Project.findOne( { 'bugs._id': req.params.bugId } )
            const bugs = project.bugs;
            let isThisBugAddedByCurrentUser = false;
            bugs.map(bug => {
                if(bug._id.toString() === req.params.bugId) {
                    if (bug.user.toString() === req.user.id) isThisBugAddedByCurrentUser = true;
                }
            })
            if(!isThisBugAddedByCurrentUser) return res.status(400).json({ 'error': 'Server Error' });

            await Project.updateOne(
                { _id: req.params.projectId, 'bugs._id': req.params.bugId},
                {'$set': {
                        'bugs.$.text': req.body.bugEditText
                    }}
            );
            project = await Project.findById(req.params.projectId).populate('bugs.user', 'username -_id');
            await res.json(project.bugs);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   DELETE api/project/bugs/:projectId/:bugId
// @desc    Delete an bug
// @access  Private
router.delete(
    '/bugs/:projectId/:bugId',
    auth,
    async(req, res) => {
        try {
            let project = await Project.findOne( { 'bugs._id': req.params.bugId } )
            const bugs = project.bugs;
            let isThisBugAddedByCurrentUser = false;
            bugs.map(bug => {
                if(bug._id.toString() === req.params.bugId) {
                    if (bug.user.toString() === req.user.id) isThisBugAddedByCurrentUser = true;
                }
            })
            if(!isThisBugAddedByCurrentUser) return res.status(400).json({ 'error': 'Server Error' });
            await Project.updateOne(
                { _id: req.params.projectId },
                {'$pull': {
                    'bugs': { _id: req.params.bugId }
                }}
            );
            project = await Project.findById(req.params.projectId).populate('bugs.user', 'username -_id');
            await res.json(project.bugs);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   POST api/project/:projectId
// @desc    Add an member in project
// @access  Private
router.post(
    '/:projectId',
    auth,
    [
        check('username')
            .not()
            .isEmpty()
    ],
    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ 'error': 'Server Error' });
    }
    try {
        const { username } = req.body;
        const project = await Project.findById(req.params.projectId);
        const user = await User.findOne({ username: username });
        if(!user) return res.status(400).json({ 'error': 'Server Error' });
        // console.log(user);
        // console.log(user._id);
        await project.members.unshift({ user: user._id });
        await project.save();
        // await res.json(user.username);
        const membersOfProject = await Project.findOne({ _id: req.params.projectId })
            .populate('members.user', 'username profileImage -_id')
        await res.json(membersOfProject.members[0]);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ 'error': 'Server Error' });
    }
})

// @route   DELETE api/project/:projectId
// @desc    Delete an member from a project
// @access  Private
router.delete(
    '/:projectId',
    auth,
    [
        check('username')
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ 'error': 'Server Error' });
        }
        try {
            const { username } = req.body;
            // console.log('server');
            const project = await Project.findById(req.params.projectId);
            if(project.createdBy.toString() !== req.user.id) return res.status(400).json({ 'error': 'Server Error' });
            const user = await User.findOne({ username: username });
            // console.log(user)
            if(!user) return res.status(400).json({ 'error': 'Server Error' });
            await Project.updateOne(
                { _id: req.params.projectId },
                {'$pull': {
                        'members': { user: user._id }
                    }}
            );
            await project.save();
            const membersOfProject = await Project.findOne({ _id: req.params.projectId })
                .populate('members.user', 'username profileImage -_id');
            await res.json(membersOfProject.members);
        } catch (error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    })

// @route   GET api/project/:projectId/allmember
// @desc    Get all member of project
// @access  Private
router.get(
    '/:projectId/allmember',
    // auth,
    async (req, res) => {
        try {
            const membersOfProject = await Project.findOne({ _id: req.params.projectId })
                .select('members -_id')
                .populate('members.user', 'username profileImage -_id');
            // console.log(membersOfProject);
            const memberNameList = {};
            // membersOfProject.members.map(member => {
            //     console.log(member.user.username);
            // })
            // console.log('member of project')
            // console.log(membersOfProject);
            const userNameOfMemberInProject = membersOfProject.members.map(member => {
                return member.user.username;
            })
            // console.log(userNameOfMemberInProject);
            return await res.json(userNameOfMemberInProject);
        } catch (error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route    PUT api/project/isDone/:projectId
// @desc     Toggle is a project done
// @access   Private
router.put(
    '/isDone/:projectId',
    auth,
    [
        check('isDone')
            .not()
            .isEmpty()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(500).json({ 'error': 'Server error '});
        const isDoneBool = req.body.isDone.toString() === 'true';
        await Project.updateOne( { _id: req.params.projectId }, { isDone: isDoneBool } );
        return res.status(200).json({ 'result': 'ok' });
    } catch (error) {
        console.error(error);
    }
})

// @route   GET api/project/:projectId
// @desc    Get all data of project
// @access  Private
router.get('/:projectId', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId)
            .populate('discussion.user', 'username profileImage -_id')
            .populate('members.user', 'username profileImage role -_id')
            .populate('todos.user', 'username profileImage -_id')
            .populate('bugs.user', 'username profileImage -_id');
        await res.status(200).json(project);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ 'error': 'Server Error' });
    }
})

module.exports = router;
