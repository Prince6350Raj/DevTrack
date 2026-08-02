import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  HiChevronLeft, 
  HiChevronRight, 
  HiOutlineCalendar,
  HiOutlineClipboardList
} from 'react-icons/hi';

const CalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get('/tasks');
      // Filter out tasks that don't have a due date
      const tasksWithDeadlines = res.data.filter(t => t.dueDate);
      setTasks(tasksWithDeadlines);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching calendar tasks:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="h-8 w-8 border-4 border-theme-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get total days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Get weekday of 1st day of month (0 = Sun, 6 = Sat)
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Constructing dates array
  const calendarCells = [];
  
  // Padding cells from previous month
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - i)
    });
  }

  // Current month cells
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      date: new Date(year, month, d)
    });
  }

  // Padding cells from next month
  const totalCells = 42; // standard 6 rows
  const remainingCells = totalCells - calendarCells.length;
  for (let n = 1; n <= remainingCells; n++) {
    calendarCells.push({
      day: n,
      isCurrentMonth: false,
      date: new Date(year, month + 1, n)
    });
  }

  // Get tasks due on a specific calendar cell date
  const getTasksForDate = (cellDate) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === cellDate.getFullYear() &&
        taskDate.getMonth() === cellDate.getMonth() &&
        taskDate.getDate() === cellDate.getDate()
      );
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Calendar Header Control */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm gap-4 transition-colors duration-300">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-theme-primary/10 text-theme-primary rounded-xl">
            <HiOutlineCalendar className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-theme-text">Deadlines Calendar</h2>
            <p className="text-xs text-theme-muted mt-0.5">Visualize your milestones and due dates chronologically.</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-theme-accent hover:bg-theme-border border border-theme-border text-theme-text transition-all"
          >
            <HiChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-extrabold text-base text-theme-text min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-theme-accent hover:bg-theme-border border border-theme-border text-theme-text transition-all"
          >
            <HiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-theme-card border border-theme-border rounded-2xl shadow-xl overflow-hidden glass-effect transition-colors duration-300">
        
        {/* Weekdays Row */}
        <div className="grid grid-cols-7 border-b border-theme-border bg-theme-accent/20">
          {weekdays.map(day => (
            <div 
              key={day} 
              className="py-3 text-center text-xs font-bold text-theme-muted uppercase tracking-wider border-r border-theme-border last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 grid-rows-6">
          {calendarCells.map((cell, idx) => {
            const dateTasks = getTasksForDate(cell.date);
            const isToday = new Date().toDateString() === cell.date.toDateString();
            const hasHighPriority = dateTasks.some(t => t.priority === 'High' && t.status !== 'Completed');
            const hasPending = dateTasks.some(t => t.status !== 'Completed');

            let highlightClass = '';
            if (isToday) {
              highlightClass = 'bg-theme-primary/5 ring-1 ring-inset ring-theme-primary/30';
            } else if (hasHighPriority && hasPending) {
              highlightClass = 'bg-red-500/5 ring-1 ring-inset ring-red-500/30 border-red-500/20';
            } else if (hasPending) {
              highlightClass = 'bg-theme-primary/[0.02] ring-1 ring-inset ring-theme-primary/10';
            }

            return (
              <div 
                key={idx}
                className={`
                  min-h-[100px] sm:min-h-[120px] p-2 border-r border-b border-theme-border last:border-r-0 flex flex-col justify-between transition-colors
                  ${cell.isCurrentMonth ? 'bg-transparent' : 'bg-theme-accent/10 opacity-40'}
                  ${highlightClass}
                `}
              >
                {/* Date number */}
                <div className="flex justify-between items-center mb-1">
                  <span className={`
                    text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center
                    ${isToday ? 'bg-theme-primary text-white shadow-sm' : 'text-theme-text'}
                  `}>
                    {cell.day}
                  </span>
                  {dateTasks.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500">
                      {dateTasks.length}
                    </span>
                  )}
                </div>

                {/* Tasks List */}
                <div className="flex-grow space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                  {dateTasks.map(task => (
                    <div 
                      key={task._id}
                      className={`
                        p-1 text-[9px] font-bold rounded truncate flex items-center space-x-1 border
                        ${task.status === 'Completed' 
                          ? 'bg-green-500/5 text-green-500 border-green-500/10' 
                          : task.priority === 'High' 
                            ? 'bg-red-500/5 text-red-500 border-red-500/10' 
                            : 'bg-theme-primary/5 text-theme-primary border-theme-primary/10'}
                      `}
                      title={`${task.title} (Priority: ${task.priority})`}
                    >
                      <HiOutlineClipboardList className="flex-shrink-0" />
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};

export default CalendarPage;
