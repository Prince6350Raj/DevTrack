const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'File name is required'],
      trim: true
    },
    url: {
      type: String,
      required: [true, 'File URL is required']
    },
    public_id: {
      type: String,
      default: '' // Used to delete from Cloudinary if needed
    },
    size: {
      type: Number // in bytes
    },
    type: {
      type: String // mime type, e.g., 'image/png', 'application/pdf'
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('File', FileSchema);
