import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

// Chart.js
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title 
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Icons
import { 
  HiOutlineFolder, 
  HiOutlineClipboardList, 
  HiOutlineCheckCircle, 
  HiOutlineClock,
  HiPlus,
  HiArrowRight,
  HiOutlineDocumentText
} from 'react-icons/hi';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const OverviewPage = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Error fetching dashboard statistics:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-8 w-8 border-4 border-theme-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Math stats
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = totalTasks - completedTasks;
  
  // Today's deadlines (tasks due today)
  const todayDeadlines = tasks.filter(t => {
    if (!t.dueDate || t.status === 'Completed') return false;
    const due = new Date(t.dueDate);
    const today = new Date();
    return due.getFullYear() === today.getFullYear() &&
           due.getMonth() === today.getMonth() &&
           due.getDate() === today.getDate();
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingRate = totalTasks > 0 ? 100 - completionRate : 0;

  // Chart Data: Statuses
  const todoTasks = tasks.filter(t => t.status === 'To Do').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;

  const statusChartData = {
    labels: ['To Do', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [todoTasks, inProgressTasks, completedTasks],
        backgroundColor: [
          'rgba(239, 68, 68, 0.75)',   // Red
          'rgba(245, 158, 11, 0.75)',  // Yellow
          'rgba(16, 185, 129, 0.75)',  // Green
        ],
        borderColor: [
          '#ef4444',
          '#f59e0b',
          '#10b981',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart Data: Priorities
  const lowPri = tasks.filter(t => t.priority === 'Low').length;
  const medPri = tasks.filter(t => t.priority === 'Medium').length;
  const highPri = tasks.filter(t => t.priority === 'High').length;

  const priorityChartData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Tasks Count',
        data: [lowPri, medPri, highPri],
        backgroundColor: [
          'rgba(59, 130, 246, 0.75)',  // Blue
          'rgba(245, 158, 11, 0.75)',  // Yellow
          'rgba(239, 68, 68, 0.75)',   // Red
        ],
        borderColor: [
          '#3b82f6',
          '#f59e0b',
          '#ef4444',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'var(--color-text)',
          font: { family: 'Outfit' }
        }
      }
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner Message */}
      <div className="bg-theme-card border border-theme-border rounded-2xl p-6 glass-effect flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 transition-colors duration-300">
        <div>
          <h2 className="text-2xl font-bold text-theme-text">Hello, {user.username}!</h2>
          <p className="text-sm text-theme-muted mt-1">Here is a quick overview of your software planning and development progress.</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/dashboard/projects"
            className="flex items-center space-x-2 px-4 py-2 text-xs rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-semibold shadow-md transition-all hover:scale-102"
          >
            <HiPlus />
            <span>New Project</span>
          </Link>
          <Link
            to="/dashboard/tasks"
            className="flex items-center space-x-2 px-4 py-2 text-xs rounded-xl border border-theme-border bg-theme-accent hover:bg-theme-border text-theme-text font-semibold transition-all hover:scale-102"
          >
            <HiPlus />
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Projects */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">Total Projects</span>
            <h3 className="text-3xl font-extrabold text-theme-text">{totalProjects}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <HiOutlineFolder className="h-6 w-6" />
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">Pending Tasks</span>
            <h3 className="text-3xl font-extrabold text-theme-text">{pendingTasks}</h3>
          </div>
          <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl">
            <HiOutlineClipboardList className="h-6 w-6" />
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">Completed Tasks</span>
            <h3 className="text-3xl font-extrabold text-theme-text">{completedTasks}</h3>
          </div>
          <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
            <HiOutlineCheckCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Today's Deadlines */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-theme-muted uppercase tracking-wider">Today's Deadlines</span>
            <h3 className="text-3xl font-extrabold text-theme-text">{todayDeadlines.length}</h3>
          </div>
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <HiOutlineClock className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Analytics Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Distribution */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm lg:col-span-1 flex flex-col">
          <h4 className="text-sm font-bold text-theme-text mb-4">Task Status Distribution</h4>
          <div className="relative flex-grow min-h-[220px] max-h-[260px] flex items-center justify-center">
            {totalTasks > 0 ? (
              <Doughnut data={statusChartData} options={chartOptions} />
            ) : (
              <div className="text-center text-xs text-theme-muted py-8">
                No tasks available. Add some tasks to view stats!
              </div>
            )}
          </div>
        </div>

        {/* Priority Analysis */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm lg:col-span-1 flex flex-col">
          <h4 className="text-sm font-bold text-theme-text mb-4">Task Priority Statistics</h4>
          <div className="relative flex-grow min-h-[220px] max-h-[260px] flex items-center justify-center">
            {totalTasks > 0 ? (
              <Bar 
                data={priorityChartData} 
                options={{
                  ...chartOptions,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { 
                      ticks: { color: 'var(--color-text)', stepSize: 1 },
                      grid: { color: 'var(--color-border)' }
                    },
                    x: {
                      ticks: { color: 'var(--color-text)' },
                      grid: { display: false }
                    }
                  }
                }} 
              />
            ) : (
              <div className="text-center text-xs text-theme-muted py-8">
                No tasks available. Add some tasks to view stats!
              </div>
            )}
          </div>
        </div>

        {/* Completion Rates */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm lg:col-span-1 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-theme-text mb-4">Development Completion</h4>
            <p className="text-xs text-theme-muted leading-relaxed">
              Your overall development milestone is currently at {completionRate}%. Try checking off completed items inside your projects to push this bar up!
            </p>
          </div>
          
          <div className="space-y-4 py-6">
            <div className="w-full bg-theme-accent rounded-full h-4 overflow-hidden border border-theme-border">
              <div 
                className="bg-gradient-to-r from-theme-primary to-purple-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-green-500">Achieved: {completionRate}%</span>
              <span className="text-yellow-500">Pending: {pendingRate}%</span>
            </div>
          </div>

          <div className="pt-4 border-t border-theme-border flex justify-between items-center text-xs">
            <span className="text-theme-muted">Need a quick reference?</span>
            <Link to="/dashboard/tasks" className="text-theme-primary font-bold hover:underline flex items-center space-x-1">
              <span>View Tasks Board</span>
              <HiArrowRight />
            </Link>
          </div>
        </div>

      </div>

      {/* Deadlines list & Quick Notes list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Deadlines Widget */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center pb-4 border-b border-theme-border mb-4">
            <h4 className="text-sm font-bold text-theme-text flex items-center space-x-2">
              <HiOutlineClock className="text-red-500" />
              <span>Today's Deadlines</span>
            </h4>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
              {todayDeadlines.length} Due Today
            </span>
          </div>

          <div className="space-y-3 flex-grow max-h-[220px] overflow-y-auto custom-scrollbar">
            {todayDeadlines.length === 0 ? (
              <div className="text-center text-xs text-theme-muted py-8">
                No deadlines scheduled for today.
              </div>
            ) : (
              todayDeadlines.map((task) => (
                <div 
                  key={task._id}
                  className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex justify-between items-center text-xs"
                >
                  <div>
                    <p className="font-bold text-theme-text">{task.title}</p>
                    <span className="text-[10px] text-theme-muted block mt-0.5">
                      Project: {task.project ? task.project.name : 'Unassigned'}
                    </span>
                  </div>
                  <span className="font-semibold text-red-500">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Active Tasks */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center pb-4 border-b border-theme-border mb-4">
            <h4 className="text-sm font-bold text-theme-text flex items-center space-x-2">
              <HiOutlineClipboardList className="text-theme-primary" />
              <span>Recent Tasks activity</span>
            </h4>
            <Link to="/dashboard/tasks" className="text-xs text-theme-primary hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3 flex-grow max-h-[220px] overflow-y-auto custom-scrollbar">
            {tasks.length === 0 ? (
              <div className="text-center text-xs text-theme-muted py-8">
                No tasks logged yet. Create a project and task to start tracking activity.
              </div>
            ) : (
              tasks.slice(0, 4).map((task) => (
                <div 
                  key={task._id}
                  className="p-3 bg-theme-accent border border-theme-border rounded-xl flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="font-semibold text-theme-text">{task.title}</span>
                    <span className="block text-[10px] text-theme-muted mt-0.5">
                      Project: {task.project ? task.project.name : 'Unknown'}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    task.status === 'Completed' 
                      ? 'bg-green-500/10 text-green-500' 
                      : task.status === 'In Progress' 
                        ? 'bg-yellow-500/10 text-yellow-500' 
                        : 'bg-red-500/10 text-red-500'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default OverviewPage;
