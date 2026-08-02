import React, { useState, useContext, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import API from '../services/api';

// Icons
import { 
  HiOutlineHome, 
  HiOutlineFolder, 
  HiOutlineClipboardList, 
  HiOutlineCalendar, 
  HiOutlineDocumentText, 
  HiOutlinePaperClip, 
  HiOutlineUser, 
  HiOutlineCog, 
  HiOutlineLogout,
  HiOutlineBell,
  HiMenu,
  HiX
} from 'react-icons/hi';
import { MdTrendingUp } from 'react-icons/md';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Protected route check
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: HiOutlineHome, end: true },
    { name: 'Projects', path: '/dashboard/projects', icon: HiOutlineFolder },
    { name: 'Tasks', path: '/dashboard/tasks', icon: HiOutlineClipboardList },
    { name: 'Calendar', path: '/dashboard/calendar', icon: HiOutlineCalendar },
    { name: 'Notes', path: '/dashboard/notes', icon: HiOutlineDocumentText },
    { name: 'Files', path: '/dashboard/files', icon: HiOutlinePaperClip },
    { name: 'Profile', path: '/dashboard/profile', icon: HiOutlineUser },
    { name: 'Settings', path: '/dashboard/settings', icon: HiOutlineCog },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const pageTitle = navItems.find(item => {
    if (item.end) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  })?.name || 'Dashboard';

  return (
    <div className="min-h-screen flex bg-theme-bg text-theme-text transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-theme-card border-r border-theme-border flex flex-col justify-between 
        transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-theme-border flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center space-x-2" onClick={() => setSidebarOpen(false)}>
            <div className="p-2 rounded-lg bg-theme-primary text-white flex items-center justify-center">
              <MdTrendingUp className="text-xl" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-theme-primary to-purple-400 bg-clip-text text-transparent">
              DevTrack
            </span>
          </NavLink>
          <button className="md:hidden p-2 rounded-lg hover:bg-theme-accent text-theme-muted hover:text-theme-text" onClick={() => setSidebarOpen(false)}>
            <HiX className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-theme-primary text-white shadow-md shadow-theme-primary/10' 
                    : 'text-theme-muted hover:bg-theme-accent hover:text-theme-text'}
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer (Logout) */}
        <div className="p-4 border-t border-theme-border">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-500/10 transition-all duration-200"
          >
            <HiOutlineLogout className="h-5 w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-theme-card border-b border-theme-border flex items-center justify-between px-6 flex-shrink-0 z-30 transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-theme-accent text-theme-muted hover:text-theme-text focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <HiMenu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-theme-text hidden sm:block">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center space-x-4 relative">
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-theme-muted hover:text-theme-text hover:bg-theme-accent transition-all duration-200 relative focus:outline-none"
              >
                <HiOutlineBell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-theme-card animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto bg-theme-card border border-theme-border rounded-2xl shadow-xl z-50 glass-effect p-4 flex flex-col custom-scrollbar animate-fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-theme-border mb-2">
                      <span className="font-bold text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-theme-primary font-semibold hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-theme-muted">
                        No alerts or notifications yet.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {notifications.map((notif) => (
                          <div 
                            key={notif._id}
                            onClick={() => !notif.isRead && markAsRead(notif._id)}
                            className={`p-3 rounded-xl text-xs cursor-pointer border transition-colors ${
                              notif.isRead 
                                ? 'bg-transparent border-transparent text-theme-muted' 
                                : 'bg-theme-primary/5 border-theme-primary/10 text-theme-text font-medium hover:bg-theme-primary/10'
                            }`}
                          >
                            <p>{notif.message}</p>
                            <span className="block mt-1 text-[10px] text-theme-muted">
                              {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Profile Brief Info */}
            <NavLink 
              to="/dashboard/profile"
              className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-theme-accent transition-all duration-200"
            >
              {user.profilePic ? (
                <img 
                  src={user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:5000${user.profilePic}`} 
                  alt={user.username} 
                  className="h-8 w-8 rounded-full object-cover border border-theme-primary/20"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-theme-primary text-white flex items-center justify-center font-bold text-sm shadow-inner uppercase">
                  {user.username.charAt(0)}
                </div>
              )}
              <span className="text-sm font-semibold text-theme-text hidden md:inline-block max-w-[120px] truncate">
                {user.username}
              </span>
            </NavLink>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
