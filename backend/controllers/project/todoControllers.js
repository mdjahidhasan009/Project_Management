const { validationResult } = require("express-validator");
const Project = require("../../models/Project");
const User = require("../../models/User");

// @route   POST api/project/todos/:projectId
// @desc    Add new todo
// @access  Private
const addTodo = async(req, res) => {
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

// @route   PUT api/project/toggle/todos/:projectId/:todoId
// @desc    Set todo done or incomplete
// @access  Private
const toggleIsTodoDone = async(req, res) => {
    try {
      let project = await Project.findOne( { 'todos._id': req.params.todoId } );
      const todos = project.todos;
      let isAssignedToCurrentUser = false;
      todos.map(todo => {
        if(todo._id.toString() === req.params.todoId.toString()) {
          if (todo.user.toString() === req.user.id.toString()) isAssignedToCurrentUser = true;
        }
      })
      if(!isAssignedToCurrentUser)
        return res.status(400).json({ 'error': 'This todo does not assign to you.' });

      let isDone = req.body.isDone === 'true';
      let doneAt = null;
      if(isDone) doneAt = new Date();
      await Project.updateOne({ _id: req.params.projectId, 'todos._id': req.params.todoId},
          {
            '$set': {
              'todos.$.done': isDone,
              'todos.$.doneAt': doneAt
            }
          }
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

// @route   PUT api/project/todos/:projectId/:todoId
// @desc    Edit an existing todo
// @access  Private
const editTodoText = async(req, res) => {
    try {
      let project = await Project.findOne( { 'todos._id': req.params.todoId } )
      const todos = project.todos;
      let isAssignedToCurrentUser = false;
      todos.map(todo => {
        if(todo._id.toString() === req.params.todoId.toString()) {
          if (todo.user.toString() === req.user.id.toString()) isAssignedToCurrentUser = true;
        }
      })
      if(!isAssignedToCurrentUser) return res.status(400).json({ 'error': 'Server Error' });
      await Project.updateOne(
          { _id: req.params.projectId, 'todos._id': req.params.todoId},
          {
            '$set': {
              'todos.$.text': req.body.todoEditText
            }
          }
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

// @route   DELETE api/project/todos/:projectId/:todoId
// @desc    Delete a todo
// @access  Private
const deleteTodo = async(req, res) => {
    try {
      let project = await Project.findOne( { 'todos._id': req.params.todoId } )
      const todos = project.todos;
      let isAssignedToCurrentUser = false;
      todos.map(todo => {
        if(todo._id.toString() === req.params.todoId.toString()) {
          if (todo.user.toString() === req.user.id.toString()) isAssignedToCurrentUser = true;
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

// @route   POST api/project/assignTodo/todos/:projectId/:username
// @desc    Assign a todo to junior
// @access  Private
const assignTodoToAJunior = async (req, res) => {
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

module.exports = {
    addTodo,
    toggleIsTodoDone,
    editTodoText,
    deleteTodo,
    assignTodoToAJunior
};
