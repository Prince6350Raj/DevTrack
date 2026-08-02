const Project = require('../models/Project');
const Task = require('../models/Task');
const Note = require('../models/Note');
const File = require('../models/File');

// @desc    Get user's projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const filter = { user: req.user.id };

    // Support filter by status if provided (e.g. In Progress, Completed, Archived, etc.)
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user.id });

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { name, description, status, priority, startDate, endDate } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Project name is required');
    }

    const project = await Project.create({
      name,
      description,
      status: status || 'To Do',
      priority: priority || 'Medium',
      startDate: startDate || Date.now(),
      endDate,
      user: req.user.id
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user.id });

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    project.name = req.body.name || project.name;
    project.description = req.body.description !== undefined ? req.body.description : project.description;
    project.status = req.body.status || project.status;
    project.priority = req.body.priority || project.priority;
    project.startDate = req.body.startDate || project.startDate;
    project.endDate = req.body.endDate !== undefined ? req.body.endDate : project.endDate;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project and its associated data
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user.id });

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    await Project.deleteOne({ _id: req.params.id });

    // Cascade delete related items
    await Task.deleteMany({ project: req.params.id });
    await Note.deleteMany({ project: req.params.id });
    await File.deleteMany({ project: req.params.id });

    res.json({ message: 'Project and all associated tasks, notes, and files deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
