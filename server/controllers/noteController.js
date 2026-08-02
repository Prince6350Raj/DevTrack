const Note = require('../models/Note');
const Project = require('../models/Project');

// @desc    Get notes (optionally filtered by projectId)
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const filter = { user: req.user.id };
    
    if (req.query.projectId) {
      filter.project = req.query.projectId;
    }

    const notes = await Note.find(filter)
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { title, content, project: projectId } = req.body;

    if (!title || !projectId) {
      res.status(400);
      throw new Error('Note title and project are required');
    }

    // Verify project belongs to user
    const project = await Project.findOne({ _id: projectId, user: req.user.id });
    if (!project) {
      res.status(404);
      throw new Error('Project not found or not authorized');
    }

    const note = await Note.create({
      title,
      content: content || '',
      project: projectId,
      user: req.user.id
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content !== undefined ? req.body.content : note.content;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });

    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }

    await Note.deleteOne({ _id: req.params.id });
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote
};
