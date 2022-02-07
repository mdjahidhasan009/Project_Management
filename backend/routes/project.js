const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/project
// @desc    Get all projects
// @access  Private
router.get('/', auth, async (req, res) => {
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
        //Validation error check
        const errors = validationResult(req);
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
)

// @route   DELETE api/project/:projectId
// @desc    Delete an project
// @access  Private
router.delete(
    '/:projectId',
    auth,
    async (req, res) => {
        try {
            const project = await Project.findById(req.params.projectId);
            if(!project) await res.status(400).json({ 'error': 'Server Error' });
            if(project.createdBy.toString() !== req.user.id)
                return await res.status(400).json({ 'error': 'Server Error' });
            await Project.deleteOne({ _id: req.params.projectId });
            await res.status(200).json('Deleted');
        } catch(error) {
            console.error(error);
            return res.status(400).json({ "error": "Server Error"});
        }
    }
)

// @route   GET api/project/memberorcreator/:projectId
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
            project = await Project.findById(req.params.projectId).populate('discussion.user', 'username profileImage -_id')
            await res.json(project.discussion[0]);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   PUT api/project/discussion/:projectId/:discussionId
// @desc    Edit an existing discussion
// @access  Private
router.put(
    '/discussion/:projectId/:discussionId',
    auth,
    [
        check('discussionEditText')
            .not()
            .isEmpty()
    ],
    async(req, res) => {
        try {
            let project = await Project.findOne( { 'discussion._id': req.params.discussionId } )
            const discussion = project.discussion;
            let isThisDiscussionAddedByCurrentUser = false;
            discussion.map(discussion => {
                if(discussion._id.toString() === req.params.discussionId) {
                    if (discussion.user.toString() === req.user.id) isThisDiscussionAddedByCurrentUser = true;
                }
            })
            if(!isThisDiscussionAddedByCurrentUser) return res.status(400).json({ 'error': 'Server Error' });
            await Project.updateOne(
                { _id: req.params.projectId, 'discussion._id': req.params.discussionId},
                {'$set': {
                        'discussion.$.text': req.body.discussionEditText
                        }
                }
            );
            project = await Project.findById(req.params.projectId).populate('discussion.user', 'username profileImage -_id');
            await res.json(project.discussion);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   DELETE api/project/discussion/:projectId/:discussionId
// @desc    Delete an discussion
// @access  Private
router.delete(
    '/discussion/:projectId/:discussionId',
    auth,
    async(req, res) => {
        try {
            let project = await Project.findOne( { 'discussion._id': req.params.discussionId } )
            const discussion = project.discussion;
            let isThisDiscussionAddedByCurrentUser = false;
            discussion.map(discuss => {
                if(discuss._id.toString() === req.params.discussionId) {
                    if (discuss.user.toString() === req.user.id) isThisDiscussionAddedByCurrentUser = true;
                }
            })
            if(!isThisDiscussionAddedByCurrentUser) return res.status(400).json({ 'error': 'Server Error' });
            await Project.updateOne(
                { _id: req.params.projectId },
                {'$pull': {
                        'discussion': { _id: req.params.discussionId }
                    }}
            );
            project = await Project.findById(req.params.projectId).populate('discussion.user', 'username profileImage -_id');
            await res.json(project.discussion);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   POST api/project/assignTodo/todos/:projectId/:username
// @desc    Assign an todo to junior
// @access  Private
router.post(
    '/assignTodo/todos/:projectId/:username',
    auth,
    [
        check('todo')
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({ 'error': 'Server Error' });
        try {
            //Checking is given user is junior than current user
            const givenUser = await User.findOne({ 'username': req.params.username })
                .select('_id role');
            const currentUser = await User.findById(req.user.id)
                .select('_id role');
            if(parseInt(currentUser.role) > parseInt(givenUser.role))
                return res.status(400).json({ 'error': 'You can not assign todo for senior.'});

            //Adding todo in project
            let project = await Project.findById(req.params.projectId);
            const newTodo = {
                user: givenUser._id,
                addedBy: req.user.id,
                text: req.body.todo,
            };
            project.todos.unshift(newTodo);
            await project.save();
            project = await Project.findById(req.params.projectId)
                .populate('todos.user', 'username profileImage -_id')
                .populate('todos.subTodos.user', 'username profileImage -_id')
            await res.json(project.todos[0]);
        } catch (e) {
            console.error(e);
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
                addedBy: req.user.id,
                text: req.body.todo,
            };
            project.todos.unshift(newTodo);
            await project.save();
            project = await Project.findById(req.params.projectId)
                .populate('todos.user', 'username profileImage -_id')
                .populate('todos.subTodos.user', 'username profileImage -_id')
            await res.json(project.todos[0]);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   PUT api/project/toggle/todos/:projectId/:todoId
// @desc    Set todo done or incomplete
// @access  Private
router.put(
    '/toggle/todos/:projectId/:todoId',
    auth,
    [
        check('isDone')
            .not()
            .isEmpty()
    ],
    async(req, res) => {
        try {
            let project = await Project.findOne( { 'todos._id': req.params.todoId } );
            const todos = project.todos;
            let isAssignedToCurrentUser = false;
            todos.map(todo => {
                if(todo._id.toString() === req.params.todoId) {
                    if (todo.user.toString() === req.user.id) isAssignedToCurrentUser = true;
                }
            })
            if(!isAssignedToCurrentUser)
                return res.status(400).json({ 'error': 'This todo does not assign to you.' });

            let isDone = req.body.isDone === 'true';
            let doneAt = null;
            if(isDone) doneAt = new Date();
            await Project.updateOne({ _id: req.params.projectId, 'todos._id': req.params.todoId},
                 {'$set': {
                    'todos.$.done': isDone,
                    'todos.$.doneAt': doneAt
                }}
            );
            project = await Project.findById(req.params.projectId)
                .populate('todos.user', 'username profileImage -_id')
                .populate('todos.subTodos.user', 'username profileImage -_id')
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
            let isAssignedToCurrentUser = false;
            todos.map(todo => {
                if(todo._id.toString() === req.params.todoId) {
                    if (todo.user.toString() === req.user.id) isAssignedToCurrentUser = true;
                }
            })
            if(!isAssignedToCurrentUser) return res.status(400).json({ 'error': 'Server Error' });
            await Project.updateOne(
                { _id: req.params.projectId, 'todos._id': req.params.todoId},
                {'$set': {
                    'todos.$.text': req.body.todoEditText
                }}
            );
            project = await Project.findById(req.params.projectId)
                .populate('todos.user', 'username profileImage -_id')
                .populate('todos.subTodos.user', 'username profileImage -_id')
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
            let isAssignedToCurrentUser = false;
            todos.map(todo => {
                if(todo._id.toString() === req.params.todoId) {
                    if (todo.user.toString() === req.user.id) isAssignedToCurrentUser = true;
                }
            })
            if(!isAssignedToCurrentUser) return res.status(400).json({ 'error': 'Server Error' });
            await Project.updateOne(
                { _id: req.params.projectId },
                {'$pull': {
                        'todos': { _id: req.params.todoId }
                    }}
            );
            project = await Project.findById(req.params.projectId)
                .populate('todos.user', 'username profileImage -_id')
                .populate('todos.subTodos.user', 'username profileImage -_id')
            await res.json(project.todos);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   POST api/project/todos/:projectId/todoId/:todoId
// @desc    Add new sub todo
// @access  Private
router.post(
    '/todos/:projectId/todoId/:todoId',
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
            const newTodo = {
                user: req.user.id,
                addedBy: req.user.id,
                text: req.body.todo,
            };
            await Project.update({ '_id': req.params.projectId , 'todos._id': req.params.todoId},
                { $push: { 'todos.$.subTodos': newTodo }});
            let updatedProject = await Project.findById(req.params.projectId)
                .populate('todos.user', 'username profileImage -_id')
                .populate('todos.subTodos.user', 'username profileImage -_id');
            await res.json(updatedProject.todos);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   PUT api/project/toggle/todos/:projectId/:todoId/:subTodoId
// @desc    Set sub todo done or incomplete
// @access  Private
router.put(
    '/toggle/todos/:projectId/:todoId/:subTodoId',
    auth,
    [
        check('isDone')
            .not()
            .isEmpty()
    ],
    async(req, res) => {
        try {
            //Checking is the subTodo assigned to current user
            let todos = await Project.findById(req.params.projectId)
                    .select({ 'todos' : { $elemMatch: { _id: req.params.todoId }}})
            //as elemMatch does not work for nested element
            let subTodoRequested = await todos.todos[0].subTodos.filter(subTodo =>
                subTodo._id.toString() === req.params.subTodoId.toString());
            subTodoRequested = subTodoRequested[0]; //as return array
            let isAssignedToCurrentUser = subTodoRequested.user.toString() === req.user.id;
            if(!isAssignedToCurrentUser)
                return res.status(400).json({ 'error': 'This sub todo does not assign to you.' });

            //Toggling isDone
            let isDone = req.body.isDone === 'true';
            let doneAt = null;
            if(isDone) doneAt = new Date();
            await Project.updateOne({
                _id: req.params.projectId,
            }, {
                "$set": {
                    "todos.$[i].subTodos.$[j].done": isDone,
                    "todos.$[i].subTodos.$[j].doneAt": doneAt
                }
            }, {
                arrayFilters: [
                    {"i._id": req.params.todoId},
                    {"j._id": req.params.subTodoId}
                ]
            })

            let project = await Project.findById(req.params.projectId)
                .populate('todos.user', 'username profileImage -_id')
                .populate('todos.subTodos.user', 'username profileImage -_id')
            await res.json(project.todos);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   PUT api/project/todos/:projectId/:todoId/:subTodoId
// @desc    Edit an existing sub todo
// @access  Private
router.put(
    '/todos/:projectId/:todoId/:subTodoId',
    auth,
    [
        check('subTodoEditText')
            .not()
            .isEmpty()
    ],
    async(req, res) => {
        try {
            //Checking is the subTodo assigned to current user
            let todos = await Project.findById(req.params.projectId)
                .select({ 'todos' : { $elemMatch: { _id: req.params.todoId }}})
            //as elemMatch does not work for nested element
            let subTodoRequested = await todos.todos[0].subTodos.filter(subTodo =>
                subTodo._id.toString() === req.params.subTodoId.toString());
            subTodoRequested = subTodoRequested[0]; //as return array
            let isAssignedToCurrentUser = subTodoRequested.user.toString() === req.user.id;
            if(!isAssignedToCurrentUser)
                return res.status(400).json({ 'error': 'This sub todo does not assign to you.' });

            //Update subTodo
            await Project.updateOne({
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
            })

            let project = await Project.findById(req.params.projectId)
                .populate('todos.user', 'username profileImage -_id')
                .populate('todos.subTodos.user', 'username profileImage -_id')
            await res.json(project.todos);
        } catch(error) {
            console.error(error);
            return res.status(400).json({ 'error': 'Server Error' });
        }
    }
)

// @route   DELETE api/project/todos/:projectId/:todoId/:subTodoId
// @desc    Delete an sub todo
// @access  Private
router.delete(
    '/todos/:projectId/:todoId/:subTodoId',
    auth,
    async(req, res) => {
        try {
            //Checking is the subTodo assigned to current user
            let todos = await Project.findById(req.params.projectId)
                .select({ 'todos' : { $elemMatch: { _id: req.params.todoId }}})
            //as elemMatch does not work for nested element
            let subTodoRequested = await todos.todos[0].subTodos.filter(subTodo =>
                subTodo._id.toString() === req.params.subTodoId.toString());
            if(subTodoRequested.length <= 0) return res.status(400).json({ 'error': 'No sub todo there' });
            subTodoRequested = subTodoRequested[0]; //as return array
            let isAssignedToCurrentUser = subTodoRequested.user.toString() === req.user.id;
            if(!isAssignedToCurrentUser)
                return res.status(400).json({ 'error': 'This sub todo does not assign to you.' });

            //deleting sub todo
            await Project.updateOne({
                _id: req.params.projectId
            }, {
                "$pull" : {
                    "todos.$[i].subTodos": { '_id' : req.params.subTodoId }
                }
            }, {
                arrayFilters: [
                    { "i._id": req.params.todoId }
                ]
            })


            let project = await Project.findById(req.params.projectId)
                .populate('todos.user', 'username profileImage -_id')
                .populate('todos.subTodos.user', 'username profileImage -_id')
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
            if(!isThisBugAddedByCurrentUser)
                return res.status(400).json({ 'error': 'This bug does not added by you.' });

            let isFixed = req.body.isFixed === 'true';
            let fixedAt = null;
            if(isFixed) fixedAt = new Date();
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
            project = await Project.findById(req.params.projectId).populate('bugs.user', 'username profileImage -_id');
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
        await project.members.unshift({ user: user._id });
        await project.save();
        const membersOfProject = await Project.findOne({ _id: req.params.projectId })
            .populate('members.user', 'username profileImage role -_id')
        await res.json(membersOfProject.members[0]);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ 'error': 'Server Error' });
    }
})

// @route   DELETE api/project/member/:projectId/
// @desc    Delete a member from a project
// @access  Private
router.delete(
    '/member/:projectId',
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
            if(project.createdBy.toString() !== req.user.id) return res.status(400).json({ 'error': 'Server Error' });
            const user = await User.findOne({ username: username });
            if(!user) return res.status(400).json({ 'error': 'Server Error' });
            await Project.updateOne(
                { _id: req.params.projectId },
                {'$pull': {
                        'members': { user: user._id }
                    }}
            );
            await project.save();
            const membersOfProject = await Project.findOne({ _id: req.params.projectId })
                .populate('members.user', 'username profileImage role -_id');
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
    auth,
    async (req, res) => {
        try {
            const membersOfProject = await Project.findOne({ _id: req.params.projectId })
                .select('members -_id')
                .populate('members.user', 'username profileImage -_id');
            const userNameOfMemberInProject = membersOfProject.members.map(member => {
                return member.user.username;
            })
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
})

module.exports = router;
