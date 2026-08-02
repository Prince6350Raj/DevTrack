const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get tasks (optionally filtered by projectId, status, priority, label)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const filter = { user: req.user.id };

    if (req.query.projectId) {
      filter.project = req.query.projectId;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    if (req.query.label) {
      filter.labels = req.query.label; // matches if label is in array
    }

    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .sort({ dueDate: 1, createdAt: -1 });
      
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, labels, project: projectId, dueDate } = req.body;

    if (!title || !projectId) {
      res.status(400);
      throw new Error('Task title and project are required');
    }

    // Verify project belongs to user
    const project = await Project.findOne({ _id: projectId, user: req.user.id });
    if (!project) {
      res.status(404);
      throw new Error('Project not found or not authorized');
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'To Do',
      priority: priority || 'Medium',
      labels: labels || [],
      project: projectId,
      dueDate,
      user: req.user.id
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description !== undefined ? req.body.description : task.description;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.labels = req.body.labels !== undefined ? req.body.labels : task.labels;
    task.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : task.dueDate;

    // Handle project transfer if project ID is provided
    if (req.body.project && req.body.project !== task.project.toString()) {
      const projectExists = await Project.findOne({ _id: req.body.project, user: req.user.id });
      if (!projectExists) {
        res.status(404);
        throw new Error('New project not found or not authorized');
      }
      task.project = req.body.project;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await Task.deleteOne({ _id: req.params.id });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
