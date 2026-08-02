const express = require('express');
const router = express.Router();
const {
  getFiles,
  uploadFile,
  deleteFile
} = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.use(protect); // Protect all routes

router.get('/', getFiles);
router.post('/', upload.single('file'), uploadFile);
router.delete('/:id', deleteFile);

module.exports = router;
