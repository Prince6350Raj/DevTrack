import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import API from '../services/api';
import { 
  HiOutlineFolder, 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiArchive, 
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineBadgeCheck,
  HiX
} from 'react-icons/hi';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // stores project when editing
  const [activeFilter, setActiveFilter] = useState('All');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes] = await Promise.all([
        API.get('/projects'),
        API.get('/tasks')
      ]);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    reset({
      name: '',
      description: '',
      status: 'To Do',
      priority: 'Medium',
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setValue('name', project.name);
    setValue('description', project.description);
    setValue('status', project.status);
    setValue('priority', project.priority);
    setValue('startDate', project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '');
    setValue('endDate', project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '');
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingProject) {
        // Update
        const res = await API.put(`/projects/${editingProject._id}`, data);
        setProjects(projects.map(p => p._id === editingProject._id ? res.data : p));
      } else {
        // Create
        const res = await API.post('/projects', data);
        setProjects([res.data, ...projects]);
      }
      setShowModal(false);
      reset();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks, notes, and files.')) return;
    try {
      await API.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleArchiveProject = async (project) => {
    const nextStatus = project.status === 'Archived' ? 'In Progress' : 'Archived';
    try {
      const res = await API.put(`/projects/${project._id}`, { status: nextStatus });
      setProjects(projects.map(p => p._id === project._id ? res.data : p));
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

  // Filters
  const filteredProjects = projects.filter(p => {
    if (activeFilter === 'All') return p.status !== 'Archived'; // default hide archived in All
    if (activeFilter === 'Archived') return p.status === 'Archived';
    return p.status === activeFilter;
  });

  const filterTabs = ['All', 'To Do', 'In Progress', 'Completed', 'Archived'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-theme-text">Projects Workspace</h2>
          <p className="text-sm text-theme-muted mt-1">Manage project status, timeline, and execution priorities.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold shadow-md shadow-theme-primary/20 transition-all hover:scale-102"
        >
          <HiPlus />
          <span>Create Project</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-theme-border overflow-x-auto space-x-4 pb-2">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`
              px-4 py-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all
              ${activeFilter === tab 
                ? 'border-theme-primary text-theme-primary' 
                : 'border-transparent text-theme-muted hover:text-theme-text'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-theme-card border border-theme-border rounded-2xl p-6">
          <HiOutlineFolder className="h-12 w-12 text-theme-muted mx-auto mb-4" />
          <h3 className="font-bold text-theme-text">No projects found</h3>
          <p className="text-xs text-theme-muted mt-1">Click "Create Project" to set up your first active project board.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const projectTasks = tasks.filter(t => (t.project?._id || t.project) === project._id);
            const totalTasks = projectTasks.length;
            const completedTasks = projectTasks.filter(t => t.status === 'Completed').length;
            const pendingHigh = projectTasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;
            const overdueTasks = projectTasks.filter(t => {
              if (!t.dueDate || t.status === 'Completed') return false;
              return new Date(t.dueDate) < new Date();
            }).length;
            
            const isProjectOverdue = project.endDate && new Date(project.endDate) < new Date() && project.status !== 'Completed';

            // Health score calculation
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            let healthScore = totalTasks > 0 ? completionRate : 100;
            healthScore -= pendingHigh * 10;
            healthScore -= overdueTasks * 15;
            if (isProjectOverdue) healthScore -= 20;
            healthScore = Math.max(0, Math.min(100, healthScore));

            // Determine health color badge
            let healthColor = 'text-green-500 bg-green-500/10 border-green-500/20';
            if (healthScore < 50) {
              healthColor = 'text-red-500 bg-red-500/10 border-red-500/20';
            } else if (healthScore < 80) {
              healthColor = 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            }

            return (
              <div 
                key={project._id}
                className="bg-theme-card border border-theme-border rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Top Row: Title & Action Options */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-lg text-theme-text tracking-tight truncate max-w-[70%]">
                      {project.name}
                    </h3>
                    
                    {/* Action controls */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => openEditModal(project)}
                        className="p-1.5 rounded-lg hover:bg-theme-accent text-theme-muted hover:text-theme-text transition-colors"
                        title="Edit"
                      >
                        <HiPencil className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => toggleArchiveProject(project)}
                        className={`p-1.5 rounded-lg hover:bg-theme-accent transition-colors ${
                          project.status === 'Archived' ? 'text-theme-primary' : 'text-theme-muted hover:text-theme-text'
                        }`}
                        title={project.status === 'Archived' ? 'Restore Project' : 'Archive Project'}
                      >
                        <HiArchive className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => deleteProject(project._id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-theme-muted hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <HiTrash className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-theme-muted leading-relaxed line-clamp-3 min-h-[48px]">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                {/* Project Health Section */}
                <div className="mt-4 p-3.5 rounded-xl bg-theme-accent/20 border border-theme-border space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-theme-muted">Health Score:</span>
                    <span className={`px-2 py-0.5 rounded font-extrabold border text-[10px] ${healthColor}`}>
                      {healthScore}%
                    </span>
                  </div>
                  {/* Visual health bar */}
                  <div className="w-full bg-theme-border/55 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        healthScore < 50 ? 'bg-red-500' : healthScore < 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${healthScore}%` }}
                    />
                  </div>
                  {/* Metric items list */}
                  <div className="pt-1.5 space-y-1 text-[10px] font-semibold text-theme-muted">
                    <div className="flex items-center space-x-1">
                      <span className={completedTasks === totalTasks && totalTasks > 0 ? "text-green-500" : "text-theme-primary"}>
                        ✔ {completedTasks}/{totalTasks} Tasks Completed
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {isProjectOverdue ? (
                        <span className="text-red-500">⚠ Project Deadline Overdue</span>
                      ) : (
                        <span className="text-green-500">✔ Deadline On Track</span>
                      )}
                    </div>
                    {pendingHigh > 0 && (
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <span>⚠ {pendingHigh} High Priority Pending</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status and Priority badges */}
                <div className="pt-4 border-t border-theme-border mt-4 flex items-center justify-between text-xs">
                  
                  {/* Status indicator */}
                  <span className={`px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 ${
                    project.status === 'Completed' 
                      ? 'bg-green-500/10 text-green-500' 
                      : project.status === 'In Progress' 
                        ? 'bg-yellow-500/10 text-yellow-500' 
                        : project.status === 'Archived'
                          ? 'bg-zinc-500/10 text-zinc-500'
                          : 'bg-red-500/10 text-red-500'
                  }`}>
                    <span>{project.status}</span>
                  </span>

                  {/* Priority Indicator */}
                  <span className={`px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 ${
                    project.priority === 'High' 
                      ? 'bg-red-500/10 text-red-500' 
                      : project.priority === 'Medium' 
                        ? 'bg-yellow-500/10 text-yellow-500' 
                        : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    <HiOutlineTag className="inline" />
                    <span>{project.priority}</span>
                  </span>
                </div>

                {/* Date timeline */}
                <div className="mt-3 flex items-center text-[10px] text-theme-muted space-x-1">
                  <HiOutlineCalendar />
                  <span>
                    {new Date(project.startDate).toLocaleDateString()}
                    {project.endDate ? ` — ${new Date(project.endDate).toLocaleDateString()}` : ' — No due date'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-lg p-6 shadow-2xl glass-effect relative animate-fade-in transition-colors duration-300">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-theme-border mb-4">
              <h3 className="text-lg font-bold text-theme-text">
                {editingProject ? 'Modify Project details' : 'Create new Workspace'}
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
                <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Project Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Project name is required' })}
                  className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm"
                  placeholder="e.g. CareerPilot AI"
                />
                {errors.name && <span className="text-xs text-red-500 block mt-1">{errors.name.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Description</label>
                <textarea
                  rows="3"
                  {...register('description')}
                  className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm resize-none"
                  placeholder="Summarize the core objectives..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Priority</label>
                  <select
                    {...register('priority')}
                    className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Start Date</label>
                  <input
                    type="date"
                    {...register('startDate')}
                    className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">End Date (Optional)</label>
                  <input
                    type="date"
                    {...register('endDate')}
                    className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm"
                  />
                </div>
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
                  {editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectsPage;
