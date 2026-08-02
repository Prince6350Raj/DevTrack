import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  HiOutlinePaperClip, 
  HiOutlineCloudUpload, 
  HiTrash, 
  HiDownload,
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlineDocumentReport,
  HiPlus
} from 'react-icons/hi';

const FilesPage = () => {
  const [projects, setProjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  
  // Upload states
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const [projectsRes, filesRes] = await Promise.all([
        API.get('/projects'),
        API.get('/files')
      ]);
      setProjects(projectsRes.data);
      setFiles(filesRes.data);
      if (projectsRes.data.length > 0) {
        setSelectedProjectId(projectsRes.data[0]._id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching files:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setUploadFile(e.target.files[0]);
    setUploadError(null);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a file to upload');
      return;
    }
    if (!selectedProjectId) {
      setUploadError('Please link the file to a project');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('project', selectedProjectId);

      const res = await API.post('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setFiles([res.data, ...files]);
      setUploadFile(null);
      
      // Clear file inputs manually
      e.target.reset();
      alert('File uploaded successfully!');
    } catch (err) {
      console.error(err);
      setUploadError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file from storage?')) return;
    try {
      await API.delete(`/files/${id}`);
      setFiles(files.filter(f => f._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Helper: Format bytes
  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Helper: Get File Icon based on type
  const getFileIcon = (mimeType) => {
    if (!mimeType) return HiOutlinePaperClip;
    if (mimeType.startsWith('image/')) return HiOutlinePhotograph;
    if (mimeType === 'application/pdf') return HiOutlineDocumentReport;
    return HiOutlineDocumentText;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-8 w-8 border-4 border-theme-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Filter categorization tabs
  const filteredFiles = files.filter(f => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Images') return f.type?.startsWith('image/');
    if (activeTab === 'PDFs') return f.type === 'application/pdf';
    if (activeTab === 'Documents') {
      return !f.type?.startsWith('image/') && f.type !== 'application/pdf';
    }
    return true;
  });

  const tabs = ['All', 'Images', 'PDFs', 'Documents'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-theme-text font-sans">Project Attachments</h2>
        <p className="text-sm text-theme-muted mt-1">Upload and organize documents, references, and graphics.</p>
      </div>

      {/* Main Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Form Card */}
        <div className="lg:col-span-1 bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm flex flex-col justify-between h-fit glass-effect transition-colors duration-300">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-theme-text flex items-center space-x-2">
                <HiOutlineCloudUpload className="text-theme-primary h-5 w-5" />
                <span>Upload Attachment</span>
              </h3>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                Cloudinary CDN
              </span>
            </div>

            {projects.length === 0 ? (
              <p className="text-xs text-theme-muted">
                Create a project workspace before uploading documents.
              </p>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                
                {/* Project selector */}
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Link to Project</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm font-bold"
                  >
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* File picker */}
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Select File</label>
                  <div className="border border-dashed border-theme-border rounded-xl p-4 text-center cursor-pointer hover:border-theme-primary transition-colors bg-theme-accent/20 relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <HiOutlinePaperClip className="mx-auto h-8 w-8 text-theme-muted mb-2" />
                    <span className="block text-xs font-semibold text-theme-text">
                      {uploadFile ? uploadFile.name : 'Choose a file...'}
                    </span>
                    <span className="block text-[10px] text-theme-muted mt-1">
                      Max size: 10MB (Images, PDFs, Docs)
                    </span>
                  </div>
                </div>

                {uploadError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">
                    {uploadError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="w-full py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold transition-all shadow-md shadow-theme-primary/20 hover:shadow-theme-primary/30 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <HiPlus />
                      <span>Upload to Storage</span>
                    </>
                  )}
                </button>

              </form>
            )}
          </div>
        </div>

        {/* Files Directory Card */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Tab Filters */}
          <div className="flex border-b border-theme-border overflow-x-auto space-x-4 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all
                  ${activeTab === tab 
                    ? 'border-theme-primary text-theme-primary' 
                    : 'border-transparent text-theme-muted hover:text-theme-text'}
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Files Grid list */}
          {filteredFiles.length === 0 ? (
            <div className="text-center py-16 bg-theme-card border border-theme-border rounded-2xl p-6">
              <HiOutlinePaperClip className="h-12 w-12 text-theme-muted mx-auto mb-4" />
              <h3 className="font-bold text-theme-text">No attachments found</h3>
              <p className="text-xs text-theme-muted mt-1">Upload project graphics or requirement PDFs to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.type);
                // Check if absolute path (local uploads need full url path)
                const fileUrl = file.url.startsWith('http') 
                  ? file.url 
                  : `http://localhost:5000${file.url}`;

                return (
                  <div 
                    key={file._id}
                    className="bg-theme-card border border-theme-border rounded-2xl p-4 shadow-sm flex items-start justify-between space-x-3 hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div className="flex items-start space-x-3 truncate">
                      {/* Left Icon */}
                      <div className="p-3 bg-theme-primary/10 text-theme-primary rounded-xl flex-shrink-0">
                        <FileIcon className="h-6 w-6" />
                      </div>
                      
                      {/* Center Info */}
                      <div className="truncate">
                        <a 
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block font-bold text-xs text-theme-text hover:text-theme-primary transition-colors truncate"
                          title={file.name}
                        >
                          {file.name}
                        </a>
                        <span className="block text-[10px] text-theme-muted mt-1">
                          Size: {formatBytes(file.size)} | Project: {file.project ? file.project.name : 'Workspace'}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg hover:bg-theme-accent text-theme-muted hover:text-theme-text transition-colors"
                        title="Download / View"
                      >
                        <HiDownload className="h-4 w-4" />
                      </a>
                      <button
                        onClick={() => deleteFile(file._id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-theme-muted hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <HiTrash className="h-4 w-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default FilesPage;
