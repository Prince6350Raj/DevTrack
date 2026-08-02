import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import API from '../services/api';
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiOutlineCalendar, 
  HiOutlineTag,
  HiOutlineClipboardList,
  HiChevronLeft,
  HiChevronRight,
  HiSearch,
  HiX
} from 'react-icons/hi';

const TasksPage = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and search states
  const [selectedProjectId, setSelectedProjectId] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchData = async () => {
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
      console.error('Error fetching tasks data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = (defaultStatus = 'To Do') => {
    setEditingTask(null);
    reset({
      title: '',
      description: '',
      status: defaultStatus,
      priority: 'Medium',
      project: projects[0]?._id || '',
      labels: [],
      dueDate: ''
    });
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    reset({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      project: task.project?._id || task.project,
      labels: task.labels || [],
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editingTask) {
        // Update task
        const res = await API.put(`/tasks/${editingTask._id}`, data);
        setTasks(tasks.map(t => t._id === editingTask._id ? res.data : t));
      } else {
        // Create task
        const res = await API.post('/tasks', data);
        setTasks([res.data, ...tasks]);
      }
      setShowModal(false);
      reset();
      fetchData(); // reload to populate relations correctly
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const moveTaskStatus = async (task, direction) => {
    const statuses = ['To Do', 'In Progress', 'Completed'];
    const currentIndex = statuses.indexOf(task.status);
    let nextIndex = currentIndex + direction;

    if (nextIndex < 0 || nextIndex >= statuses.length) return;
    
    const nextStatus = statuses[nextIndex];

    try {
      const res = await API.put(`/tasks/${task._id}`, { status: nextStatus });
      setTasks(tasks.map(t => t._id === task._id ? { ...t, status: nextStatus } : t));
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
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

  // Filter and search computation
  const filteredTasks = tasks.filter(t => {
    const matchProject = selectedProjectId === 'All' || (t.project?._id === selectedProjectId || t.project === selectedProjectId);
    const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchProject && matchPriority && matchSearch;
  });

  const columns = [
    { title: 'To Do', status: 'To Do', color: 'border-t-red-500 bg-red-500/5 text-red-500' },
    { title: 'In Progress', status: 'In Progress', color: 'border-t-yellow-500 bg-yellow-500/5 text-yellow-500' },
    { title: 'Completed', status: 'Completed', color: 'border-t-green-500 bg-green-500/5 text-green-500' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header and Quick Creation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-theme-text">Tasks Board</h2>
          <p className="text-sm text-theme-muted mt-1">Organize your sprints using a Kanban task layout.</p>
        </div>
        <button
          onClick={() => openCreateModal()}
          disabled={projects.length === 0}
          className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold shadow-md shadow-theme-primary/20 transition-all hover:scale-102 disabled:opacity-50"
        >
          <HiPlus />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-theme-card border border-theme-border rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300">
        
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted h-5 w-5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm"
          />
        </div>

        {/* Project Selection Dropdown */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-theme-muted uppercase whitespace-nowrap">Project:</span>
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

          {/* Priority dropdown */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-theme-muted uppercase whitespace-nowrap">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full sm:w-36 px-3 py-2 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none text-xs font-bold"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-theme-card border border-theme-border rounded-2xl p-6">
          <HiOutlineClipboardList className="h-12 w-12 text-theme-muted mx-auto mb-4" />
          <h3 className="font-bold text-theme-text">No active project boards</h3>
          <p className="text-xs text-theme-muted mt-1">Please create a project first before creating individual tasks.</p>
        </div>
      ) : (
        /* Kanban Columns Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter(t => t.status === col.status);
            return (
              <div 
                key={col.status}
                className="flex flex-col bg-theme-card border border-theme-border rounded-2xl overflow-hidden shadow-sm min-h-[500px]"
              >
                {/* Column Header */}
                <div className={`px-5 py-4 border-t-4 ${col.color} border-b border-theme-border flex justify-between items-center`}>
                  <h3 className="font-bold text-sm text-theme-text">{col.title}</h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-theme-accent border border-theme-border text-theme-text">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Cards List */}
                <div className="p-4 space-y-4 flex-grow overflow-y-auto max-h-[600px] custom-scrollbar bg-theme-accent/20">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-12 text-xs text-theme-muted">
                      No tasks in this stage.
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div 
                        key={task._id}
                        className="bg-theme-card border border-theme-border rounded-xl p-4 shadow-sm space-y-3 hover:border-theme-primary/30 transition-colors duration-200"
                      >
                        {/* Title and Settings */}
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-theme-text break-words max-w-[80%]">
                            {task.title}
                          </h4>
                          
                          <div className="flex space-x-1.5 flex-shrink-0">
                            <button
                              onClick={() => openEditModal(task)}
                              className="p-1 rounded-md hover:bg-theme-accent text-theme-muted hover:text-theme-text transition-colors"
                            >
                              <HiPencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => deleteTask(task._id)}
                              className="p-1 rounded-md hover:bg-red-500/10 text-theme-muted hover:text-red-500 transition-colors"
                            >
                              <HiTrash className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Description */}
                        {task.description && (
                          <p className="text-xs text-theme-muted leading-relaxed line-clamp-3">
                            {task.description}
                          </p>
                        )}

                        {/* Tags / Labels */}
                        {task.labels && task.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.labels.map(l => (
                              <span 
                                key={l}
                                className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-theme-primary/10 text-theme-primary border border-theme-primary/20"
                              >
                                {l}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Bottom Row: Date & Priority, Navigation arrows */}
                        <div className="pt-3 border-t border-theme-border flex items-center justify-between text-[10px] text-theme-muted">
                          
                          <div className="flex items-center space-x-2">
                            {/* Priority */}
                            <span className={`px-1.5 py-0.5 rounded font-bold ${
                              task.priority === 'High' 
                                ? 'bg-red-500/15 text-red-500' 
                                : task.priority === 'Medium' 
                                  ? 'bg-yellow-500/15 text-yellow-500' 
                                  : 'bg-blue-500/15 text-blue-500'
                            }`}>
                              {task.priority}
                            </span>
                            
                            {/* Due date */}
                            {task.dueDate && (
                              <span className="flex items-center space-x-0.5">
                                <HiOutlineCalendar />
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                              </span>
                            )}
                          </div>

                          {/* Quick Navigation Arrows */}
                          <div className="flex items-center space-x-1">
                            <button
                              disabled={task.status === 'To Do'}
                              onClick={() => moveTaskStatus(task, -1)}
                              className="p-1 rounded bg-theme-accent hover:bg-theme-border text-theme-text disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <HiChevronLeft />
                            </button>
                            <button
                              disabled={task.status === 'Completed'}
                              onClick={() => moveTaskStatus(task, 1)}
                              className="p-1 rounded bg-theme-accent hover:bg-theme-border text-theme-text disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <HiChevronRight />
                            </button>
                          </div>

                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-lg p-6 shadow-2xl glass-effect relative animate-fade-in transition-colors duration-300">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-theme-border mb-4">
              <h3 className="text-lg font-bold text-theme-text">
                {editingTask ? 'Modify Task Details' : 'Add New Task'}
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
                <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Task Title</label>
                <input
                  type="text"
                  {...register('title', { required: 'Task title is required' })}
                  className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm"
                  placeholder="e.g. Implement REST API routes"
                />
                {errors.title && <span className="text-xs text-red-500 block mt-1">{errors.title.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Description</label>
                <textarea
                  rows="3"
                  {...register('description')}
                  className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm resize-none"
                  placeholder="Elaborate on requirements..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Assign Workspace</label>
                  <select
                    {...register('project', { required: 'Please link to a project' })}
                    className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm"
                  >
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
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
                  <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Initial Status</label>
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
                  <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Due Date (Optional)</label>
                  <input
                    type="date"
                    {...register('dueDate')}
                    className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm"
                  />
                </div>
              </div>

              {/* Checkboxes: Labels */}
              <div>
                <label className="block text-xs font-semibold text-theme-muted uppercase mb-2">Category Labels</label>
                <div className="flex flex-wrap gap-4 text-xs font-semibold">
                  {['Frontend', 'Backend', 'Bug', 'Documentation'].map(label => (
                    <label key={label} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={label}
                        {...register('labels')}
                        className="rounded border-theme-border text-theme-primary focus:ring-theme-primary bg-theme-accent"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
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
                  {editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default TasksPage;
