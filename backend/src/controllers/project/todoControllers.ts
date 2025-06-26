import { validationResult } from "express-validator";
import { Response } from "express";

import Project from '../../models/Project';
import User from '../../models/User';
import {IExpressRequestWithUser, IProject, ITodo, IUser} from "../../types";

interface TodoRequest {
    todo: string;
}

interface TodoEditRequest {
    todoEditText: string;
}

interface TodoDoneRequest {
    isDone: string;
}

// @route   POST api/project/todos/:projectId
// @desc    Add new todo
// @access  Private
const addTodo = async(req: IExpressRequestWithUser & { body: TodoRequest }, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      res.status(400).json({ 'error': 'Server Error' });
      return;
    }

    try {
      let project: IProject | null = await Project.findById(req.params.projectId);
      if(!project) {
        res.status(404).json({ 'message': 'Project Not Found' });
        return;
      }
      const newTodo = {
        user: req.user?.id || "",
        addedBy: req.user?.id || "",
        text: req?.body.todo || ""
      };
      project?.todos.unshift(newTodo);
      await project.save();
      project = await Project.findById(req.params.projectId)
          .populate('todos.user', 'username profileImage -_id')
          .populate('todos.subTodos.user', 'username profileImage -_id');
      if(!project || !project.todos || project.todos.length === 0) {
        res.status(404).json({ 'message': 'No todos found in this project' });
        return;
      }
      res.json(project.todos[0]);
    } catch(error) {
      console.error(error);
      res.status(400).json({ 'error': 'Server Error' });
    }
}

// @route   PUT api/project/toggle/todos/:projectId/:todoId
// @desc    Set todo done or incomplete
// @access  Private
const toggleIsTodoDone = async(req: IExpressRequestWithUser & { body: TodoDoneRequest }, res: Response): Promise<void> => {
    try {
      let project: IProject | null = await Project.findOne( { 'todos._id': req.params.todoId } );
      if(!project) {
        res.status(404).json({ 'message': 'Project Not Found' });
        return;
      }

      const todos: ITodo[] = project.todos;
      let isAssignedToCurrentUser = false;
      todos.map(todo => {
        if(todo?._id?.toString() === req.params.todoId.toString()) {
          if (todo.user.toString() === req?.user?.id.toString()) isAssignedToCurrentUser = true;
        }
      })

      if(!isAssignedToCurrentUser) {
          res.status(400).json({'error': 'This todo does not assign to you.'});
          return;
      }

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
          .populate('todos.subTodos.user', 'username profileImage -_id');
      if(!project || !project.todos || project.todos.length === 0) {
        res.status(404).json({ 'message': 'No todos found in this project' });
        return;
      }
      res.json(project.todos);
    } catch(error) {
      console.error(error);
      res.status(400).json({ 'error': 'Server Error' });
    }
}

// @route   PUT api/project/todos/:projectId/:todoId
// @desc    Edit an existing todo
// @access  Private
const editTodoText = async(req: IExpressRequestWithUser & { body: TodoEditRequest }, res: Response): Promise<void> => {
    try {
      let project: IProject | null = await Project.findOne( { 'todos._id': req.params.todoId } )
      if(!project) {
        res.status(404).json({ 'message': 'Project Not Found' });
        return;
      }

      const todos: ITodo[] = project.todos;
      let isAssignedToCurrentUser = false;
      todos.map(todo => {
        if(todo?._id?.toString() === req.params.todoId.toString()) {
            if (todo.user.toString() === req?.user?.id.toString()) isAssignedToCurrentUser = true;
        }
      })
      if(!isAssignedToCurrentUser) {
          res.status(400).json({ 'error': 'Server Error' });
          return;
      }
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
          .populate('todos.subTodos.user', 'username profileImage -_id');
      if(!project || !project.todos || project.todos.length === 0) {
        res.status(404).json({ 'message': 'No todos found in this project' });
        return;
      }
      res.json(project.todos);
    } catch(error) {
      console.error(error);
      res.status(400).json({ 'error': 'Server Error' });
    }
}

// @route   DELETE api/project/todos/:projectId/:todoId
// @desc    Delete a todo
// @access  Private
const deleteTodo = async(req: IExpressRequestWithUser, res: Response): Promise<void>  => {
    try {
      let project: IProject | null = await Project.findOne( { 'todos._id': req.params.todoId } )
      if(!project) {
        res.status(404).json({ 'message': 'Project Not Found' });
        return;
      }
      const todos: ITodo[] = project.todos;
      let isAssignedToCurrentUser = false;
      todos.map(todo => {
        if(todo?._id?.toString() === req.params.todoId.toString()) {
            if (todo.user.toString() === req?.user?.id.toString()) isAssignedToCurrentUser = true;
        }
      })
      if(!isAssignedToCurrentUser) {
          res.status(400).json({ 'error': 'Server Error' });
          return;
      }
      await Project.updateOne(
          { _id: req.params.projectId },
          {'$pull': {
              'todos': { _id: req.params.todoId }
            }}
      );
      project = await Project.findById(req.params.projectId)
          .populate('todos.user', 'username profileImage -_id')
          .populate('todos.subTodos.user', 'username profileImage -_id');
      if(!project || !project.todos || project.todos.length === 0) {
        res.status(404).json({ 'message': 'No todos found in this project' });
        return;
      }
      res.json(project.todos);
    } catch(error) {
      console.error(error);
      res.status(400).json({ 'error': 'Server Error' });
    }
}

interface TodoAssignRequest {
    todo: string;
}

// @route   POST api/project/assignTodo/todos/:projectId/:username
// @desc    Assign a todo to junior
// @access  Private
const assignTodoToAJunior = async (req: IExpressRequestWithUser & { body: TodoAssignRequest }, res: Response): Promise<void>  => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({ 'error': 'Server Error' });
        return;
    }
    try {
      //Checking is given user is junior than current user
      const givenUser: IUser | null = await User.findOne({ 'username': req.params.username })
          .select('_id role');
      const currentUser: IUser | null = await User.findById(req?.user?.id)
          .select('_id role');
      if(!givenUser || !currentUser) {
        res.status(404).json({ 'message': 'User Not Found' });
        return;
      }
      if(parseInt(currentUser.role) > parseInt(givenUser.role)) {
        res.status(400).json({'error': 'You can not assign todo for senior.'});
        return;
      }

      //Adding todo in project
      let project: IProject | null = await Project.findById(req.params.projectId);
      const newTodo = {
        user: givenUser._id || "",
        addedBy: req?.user?.id || "",
        text: req.body.todo || "",
      };
      if(!project) {
          res.status(500).json({ "message": "Project not found" });
          return;
      }

      project.todos.unshift(newTodo);
      await project.save();
      project = await Project.findById(req.params.projectId)
          .populate('todos.user', 'username profileImage -_id')
          .populate('todos.subTodos.user', 'username profileImage -_id');
      if(!project || !project.todos || project.todos.length === 0) {
        res.status(404).json({ 'message': 'No todos found in this project' });
        return;
      }
      res.json(project.todos[0]);
    } catch (e) {
      console.error(e);
      res.status(400).json({ 'error': 'Server Error' });
    }
}

export {
    addTodo,
    toggleIsTodoDone,
    editTodoText,
    deleteTodo,
    assignTodoToAJunior
};
