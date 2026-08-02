import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import API from '../services/api';
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiOutlineDocumentText, 
  HiSearch,
  HiX
} from 'react-icons/hi';

const NotesPage = () => {
  const [projects, setProjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and scoping states
  const [selectedProjectId, setSelectedProjectId] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, notesRes] = await Promise.all([
        API.get('/projects'),
        API.get('/notes')
      ]);
      setProjects(projectsRes.data);
      setNotes(notesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingNote(null);
    reset({
      title: '',
      content: '',
      project: projects[0]?._id || ''
    });
    setShowModal(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    reset({
      title: note.title,
      content: note.content,
      project: note.project?._id || note.project
    });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingNote) {
        // Update note
        const res = await API.put(`/notes/${editingNote._id}`, data);
        setNotes(notes.map(n => n._id === editingNote._id ? res.data : n));
      } else {
        // Create note
        const res = await API.post('/notes', data);
        setNotes([res.data, ...notes]);
      }
      setShowModal(false);
      reset();
      fetchData(); // Reload to populate project name
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await API.delete(`/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-8 w-8 border-4 border-theme-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Filter notes
  const filteredNotes = notes.filter(n => {
    const matchProject = selectedProjectId === 'All' || (n.project?._id === selectedProjectId || n.project === selectedProjectId);
    const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchProject && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-theme-text">Scratchpad Notes</h2>
          <p className="text-sm text-theme-muted mt-1">Keep project blueprints and snippets structured.</p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={projects.length === 0}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold shadow-md shadow-theme-primary/20 transition-all hover:scale-102 disabled:opacity-50"
        >
          <HiPlus />
          <span>Write New Note</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-theme-card border border-theme-border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300">
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted h-5 w-5" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm"
          />
        </div>

        {/* Project Scoping */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <span className="text-xs font-semibold text-theme-muted uppercase whitespace-nowrap">Filter Project:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none text-xs font-bold"
          >
            <option value="All">All Projects</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Notes Grid Display */}
      {projects.length === 0 ? (
        <div className="text-center py-16 bg-theme-card border border-theme-border rounded-2xl p-6">
          <HiOutlineDocumentText className="h-12 w-12 text-theme-muted mx-auto mb-4" />
          <h3 className="font-bold text-theme-text">No active project boards</h3>
          <p className="text-xs text-theme-muted mt-1">Please create a project workspace first before writing related notes.</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-16 bg-theme-card border border-theme-border rounded-2xl p-6">
          <HiOutlineDocumentText className="h-12 w-12 text-theme-muted mx-auto mb-4" />
          <h3 className="font-bold text-theme-text">No notes found</h3>
          <p className="text-xs text-theme-muted mt-1">Create a note to save links, setup details, or checklists.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div 
              key={note._id}
              className="bg-theme-card border border-theme-border rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div className="space-y-3">
                
                {/* Header */}
                <div className="flex justify-between items-start">
                  <h3 className="font-extrabold text-sm text-theme-text tracking-tight truncate max-w-[80%]">
                    {note.title}
                  </h3>
                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(note)}
                      className="p-1 rounded hover:bg-theme-accent text-theme-muted hover:text-theme-text transition-colors"
                    >
                      <HiPencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="p-1 rounded hover:bg-red-500/10 text-theme-muted hover:text-red-500 transition-colors"
                    >
                      <HiTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Subtag */}
                <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-bold bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
                  Project: {note.project ? note.project.name : 'Linked'}
                </span>

                {/* Content */}
                <p className="text-xs text-theme-muted leading-relaxed whitespace-pre-wrap line-clamp-6 min-h-[100px] overflow-hidden">
                  {note.content || 'Empty note content.'}
                </p>
              </div>

              {/* Footer date info */}
              <div className="mt-4 pt-3 border-t border-theme-border flex items-center justify-between text-[9px] text-theme-muted">
                <span>Created {new Date(note.createdAt).toLocaleDateString()}</span>
                <span>Edited {new Date(note.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Note Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-lg p-6 shadow-2xl glass-effect relative animate-fade-in transition-colors duration-300">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-theme-border mb-4">
              <h3 className="text-lg font-bold text-theme-text">
                {editingNote ? 'Edit note' : 'Write private project note'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-theme-accent text-theme-muted hover:text-theme-text"
              >
                <HiX className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Note Title</label>
                <input
                  type="text"
                  {...register('title', { required: 'Note title is required' })}
                  className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm"
                  placeholder="e.g. MongoDB Connection Credentials"
                />
                {errors.title && <span className="text-xs text-red-500 block mt-1">{errors.title.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Assign Workspace</label>
                <select
                  disabled={!!editingNote}
                  {...register('project', { required: 'Please select a project link' })}
                  className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm disabled:opacity-60"
                >
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Note Content</label>
                <textarea
                  rows="6"
                  {...register('content')}
                  className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm font-sans resize-none"
                  placeholder="Type notes, installation guide, docker command lines, setup details..."
                />
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-theme-border flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-theme-border hover:bg-theme-accent text-theme-text font-semibold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-sm shadow-md transition-all"
                >
                  {editingNote ? 'Update' : 'Create'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default NotesPage;
