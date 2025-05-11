const { validationResult } = require("express-validator");
const Project = require("../../models/Project");

// @route   POST api/project/todos/:projectId/todoId/:todoId
// @desc    Add new sub todo
// @access  Private
const addNewSubTodo = async(req, res) => {
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

// @route   PUT api/project/todos/:projectId/:todoId/:subTodoId
// @desc    Edit an existing sub todo
// @access  Private
const editSubTodo = async(req, res) => {
    try {
      //Checking is the subTodo assigned to current user
      let todos = await Project.findById(req.params.projectId)
          .select({ 'todos' : { $elemMatch: { _id: req.params.todoId }}})
      //as elemMatch does not work for nested element
      let subTodoRequested = await todos.todos[0].subTodos.filter(subTodo =>
          subTodo._id.toString() === req.params.subTodoId.toString());
      subTodoRequested = subTodoRequested[0]; //as return array
      let isAssignedToCurrentUser = subTodoRequested.user.toString() === req.user.id.toString();
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

// @route   PUT api/project/toggle/todos/:projectId/:todoId/:subTodoId
// @desc    Set sub todo done or incomplete
// @access  Private
const toggleIsSubTodoDone = async(req, res) => {
    try {
      //Checking is the subTodo assigned to current user
      let todos = await Project.findById(req.params.projectId)
          .select({ 'todos' : { $elemMatch: { _id: req.params.todoId }}})
      //as elemMatch does not work for nested element
      let subTodoRequested = await todos.todos[0].subTodos.filter(subTodo =>
          subTodo._id.toString() === req.params.subTodoId.toString());
      subTodoRequested = subTodoRequested[0]; //as return array
      let isAssignedToCurrentUser = subTodoRequested.user.toString() === req.user.id.toString();
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

// @route   DELETE api/project/todos/:projectId/:todoId/:subTodoId
// @desc    Delete a sub todo
// @access  Private
const deleteSubTodo = async(req, res) => {
    try {
      //Checking is the subTodo assigned to current user
      let todos = await Project.findById(req.params.projectId)
          .select({ 'todos' : { $elemMatch: { _id: req.params.todoId }}})
      //as elemMatch does not work for nested element
      let subTodoRequested = await todos.todos[0].subTodos.filter(subTodo =>
          subTodo._id.toString() === req.params.subTodoId.toString());
      if(subTodoRequested.length <= 0) return res.status(400).json({ 'error': 'No sub todo there' });
      subTodoRequested = subTodoRequested[0]; //as return array
      let isAssignedToCurrentUser = subTodoRequested.user.toString() === req.user.id.toString();
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

module.exports = {
    addNewSubTodo,
    editSubTodo,
    toggleIsSubTodoDone,
    deleteSubTodo
};
