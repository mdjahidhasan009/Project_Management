import { validationResult } from "express-validator";
import { Response } from 'express';

import Project from "../../models/Project";
import {IExpressRequestWithUser, IProject, ISubTodo, ITodo} from "../../types";

interface SubTodoRequest {
  todo: string;
}

interface SubTodoEditRequest {
  subTodoEditText: string;
}

interface SubTodoDoneRequest {
  isDone: string;
}

// @route   POST api/project/todos/:projectId/todoId/:todoId
// @desc    Add new sub todo
// @access  Private
const addNewSubTodo = async(req: IExpressRequestWithUser & { body: SubTodoRequest }, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      res.status(400).json({ 'error': 'Server Error' });
      return;
    }
    try {
      const newTodo = {
        user: req?.user?.id,
        addedBy: req?.user?.id,
        text: req?.body?.todo,
      };
      await Project.update({ '_id': req.params.projectId , 'todos._id': req.params.todoId},
          { $push: { 'todos.$.subTodos': newTodo }});
      let updatedProject = await Project.findById(req.params.projectId)
          .populate('todos.user', 'username profileImage -_id')
          .populate('todos.subTodos.user', 'username profileImage -_id');
      if(!updatedProject || !updatedProject.todos || updatedProject.todos.length === 0) {
        res.status(404).json({ 'message': 'No todos found in this project' });
        return;
      }
      res.status(200).json(updatedProject.todos);
    } catch(error) {
      console.error(error);
      res.status(400).json({ 'error': 'Server Error' });
    }
}

// @route   PUT api/project/todos/:projectId/:todoId/:subTodoId
// @desc    Edit an existing sub todo
// @access  Private
const editSubTodo = async(req: IExpressRequestWithUser & { body: SubTodoEditRequest }, res: Response): Promise<void> => {
    try {
      //Checking is the subTodo assigned to current user
      let todos: IProject | null = await Project.findById(req.params.projectId)
          .select({ 'todos' : { $elemMatch: { _id: req.params.todoId }}})
      //as elemMatch does not work for nested element
      if(!todos || !todos.todos || todos.todos.length === 0 || !todos.todos[0].subTodos) {
        res.status(404).json({ 'error': 'No todos found in this project' });
        return;
      }
      let subTodoRequested: ISubTodo | null = todos.todos[0].subTodos.filter(subTodo =>
          subTodo?._id?.toString() === req.params.subTodoId.toString())[0];
      if(!subTodoRequested) {
        res.status(404).json({ 'error': 'No sub todo found' });
        return;
      }
      // subTodoRequested = subTodoRequested[0]; //as return array
      let isAssignedToCurrentUser = subTodoRequested?.user?.toString() === req?.user?.id.toString();
      if(!isAssignedToCurrentUser) {
        res.status(400).json({'error': 'This sub todo does not assign to you.'});
        return;
      }

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
          .populate('todos.subTodos.user', 'username profileImage -_id');
      if(!project || !project.todos || project.todos.length === 0) {
        res.status(404).json({ 'message': 'No todos found in this project' });
        return;
      }
      res.status(200).json(project.todos);
    } catch(error) {
      console.error(error);
      res.status(400).json({ 'error': 'Server Error' });
    }
}

// @route   PUT api/project/toggle/todos/:projectId/:todoId/:subTodoId
// @desc    Set sub todo done or incomplete
// @access  Private
const toggleIsSubTodoDone = async(req: IExpressRequestWithUser & { body: SubTodoDoneRequest }, res: Response): Promise<void> => {
    try {
      //Checking is the subTodo assigned to current user
      let todos: IProject | null = await Project.findById(req.params.projectId)
          .select({ 'todos' : { $elemMatch: { _id: req.params.todoId }}});
      if(!todos || !todos.todos || todos.todos.length === 0 || !todos.todos[0]?.subTodos || todos.todos[0].subTodos.length === 0) {
        res.status(404).json({ 'error': 'No todos found in this project' });
        return;
      }
      //as elemMatch does not work for nested element
      let subTodoRequested: ISubTodo = todos.todos[0].subTodos.filter(subTodo =>
          subTodo?._id?.toString() === req.params.subTodoId.toString())[0];

      // subTodoRequested = subTodoRequested[0]; //as return array
      let isAssignedToCurrentUser = subTodoRequested?.user?.toString() === req?.user?.id?.toString();
      if(!isAssignedToCurrentUser) {
        res.status(400).json({'error': 'This sub todo does not assign to you.'});
        return;
      }

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
          .populate('todos.subTodos.user', 'username profileImage -_id');
      if(!project || !project.todos || project.todos.length === 0) {
          res.status(404).json({ 'message': 'No todos found in this project' });
          return;
      }
      res.status(200).json(project.todos);
    } catch(error) {
      console.error(error);
      res.status(400).json({ 'error': 'Server Error' });
    }
}

// @route   DELETE api/project/todos/:projectId/:todoId/:subTodoId
// @desc    Delete a sub todo
// @access  Private
const deleteSubTodo = async(req: IExpressRequestWithUser, res: Response): Promise<void> => {
    try {
      //Checking is the subTodo assigned to current user
      let todos = await Project.findById(req.params.projectId)
          .select({ 'todos' : { $elemMatch: { _id: req.params.todoId }}});
      if(!todos || !todos.todos || todos.todos.length === 0 || !todos.todos[0].subTodos || todos.todos[0].subTodos.length === 0) {
          res.status(404).json({ 'error': 'No todos found in this project' });
          return;
      }
      //as elemMatch does not work for nested element
      let subTodoRequested: ISubTodo | null = todos.todos[0].subTodos.filter(subTodo =>
          subTodo?._id?.toString() === req?.params?.subTodoId?.toString())[0]
      if(!subTodoRequested) {
        res.status(400).json({ 'error': 'No sub todo there' });
        return;
      }
      // subTodoRequested = subTodoRequested[0]; //as return array
      let isAssignedToCurrentUser = subTodoRequested?.user?.toString() === req?.user?.id?.toString();
      if(!isAssignedToCurrentUser) {
        res.status(400).json({'error': 'This sub todo does not assign to you.'});
        return;
      }

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
          .populate('todos.subTodos.user', 'username profileImage -_id');
        if(!project || !project.todos || project.todos.length === 0) {
          res.status(404).json({ 'message': 'No todos found in this project' });
          return;
        }
      res.status(200).json(project.todos);
    } catch(error) {
      console.error(error);
      res.status(400).json({ 'error': 'Server Error' });
    }
}

export {
    addNewSubTodo,
    editSubTodo,
    toggleIsSubTodoDone,
    deleteSubTodo
};
