const File = require('../models/File');
const Project = require('../models/Project');
const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

// @desc    Get files (optionally filtered by projectId)
// @route   GET /api/files
// @access  Private
const getFiles = async (req, res, next) => {
  try {
    const filter = { user: req.user.id };

    if (req.query.projectId) {
      filter.project = req.query.projectId;
    }

    const files = await File.find(filter)
      .populate('project', 'name')
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (error) {
    next(error);
  }
};

// @desc    Upload file
// @route   POST /api/files
// @access  Private
const uploadFile = async (req, res, next) => {
  try {
    const { project: projectId } = req.body;

    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a file');
    }

    if (!projectId) {
      res.status(400);
      throw new Error('Project ID is required');
    }

    // Verify project belongs to user
    const project = await Project.findOne({ _id: projectId, user: req.user.id });
    if (!project) {
      res.status(404);
      throw new Error('Project not found or not authorized');
    }

    // Determine storage location
    const url = req.file.path.startsWith('http') 
      ? req.file.path 
      : `/uploads/${req.file.filename}`;

    const newFile = await File.create({
      name: req.file.originalname,
      url,
      public_id: req.file.filename || '', // filename or public_id
      size: req.file.size,
      type: req.file.mimetype,
      project: projectId,
      user: req.user.id
    });

    res.status(201).json(newFile);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete file from DB and storage
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findOne({ _id: req.params.id, user: req.user.id });

    if (!file) {
      res.status(404);
      throw new Error('File not found');
    }

    // Delete from physical storage
    if (file.url.startsWith('http') && cloudinary) {
      // Cloudinary upload
      try {
        await cloudinary.uploader.destroy(file.public_id);
      } catch (cloudinaryErr) {
        console.error('Failed to delete file from Cloudinary:', cloudinaryErr);
      }
    } else {
      // Local disk upload
      const filename = file.url.split('/').pop();
      const localPath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(localPath)) {
        fs.unlink(localPath, (err) => {
          if (err) console.error('Failed to delete local file:', err);
        });
      }
    }

    // Delete from DB
    await File.deleteOne({ _id: req.params.id });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFiles,
  uploadFile,
  deleteFile
};
