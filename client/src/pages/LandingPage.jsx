import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  HiOutlineFolderOpen,
  HiOutlineCloudUpload,
  HiChevronRight,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineChartBar
} from 'react-icons/hi';
import { MdOutlineDashboard } from 'react-icons/md';

const LandingPage = () => {
  const { user } = useContext(AuthContext);

  const features = [
    {
      title: 'Project Management',
      desc: 'Create, organize and edit developer and student workspaces. Archive projects once successfully achieved.',
      icon: HiOutlineFolderOpen,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Dynamic Task Boards',
      desc: 'Break projects down into tasks. Categorize with labels, assign priority levels, and drag through status columns.',
      icon: MdOutlineDashboard, // MD outline dashboard
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Deadline Calendar',
      desc: 'Never miss a due date. Visualize all upcoming project tasks and deadlines inside a calendar grid.',
      icon: HiOutlineCalendar,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Rich Notes',
      desc: 'Save private project notes. Jot down thoughts, snippets, architectural plans, and references.',
      icon: HiOutlineDocumentText,
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Secure Cloud Uploads',
      desc: 'Store attachments, images, schemas, or PDFs directly related to your workspaces via Cloudinary storage.',
      icon: HiOutlineCloudUpload,
      color: 'from-sky-500 to-cyan-500'
    },
    {
      title: 'Progress Analytics',
      desc: 'Visualize project and task milestones via beautiful interactive charts powered by Chart.js.',
      icon: HiOutlineChartBar,
      color: 'from-red-500 to-rose-500'
    }
  ];

  return (
    <div className="relative min-h-screen bg-theme-bg overflow-hidden transition-colors duration-300">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-[10%] left-[-15%] w-[45%] h-[45%] rounded-full bg-theme-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] w-[45%] h-[45%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative z-10">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-theme-accent border border-theme-border text-xs font-semibold text-theme-primary mb-6 animate-pulse">
          <HiOutlineFolderOpen className="h-4 w-4" />
          <span>DevTrack v1.0 is officially live!</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-theme-text max-w-4xl mx-auto leading-tight">
          Keep your projects structured. <br />
          <span className="bg-gradient-to-r from-theme-primary to-purple-400 bg-clip-text text-transparent">
            Plan. Track. Achieve.
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-6 text-lg sm:text-xl text-theme-muted max-w-2xl mx-auto">
          Ditch messy notebooks and spreadsheets. DevTrack offers developers a unified, modern dashboard to organize code workspaces, tasks, files, and notes.
        </p>

        {/* Call to Action */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 px-8 py-4 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold shadow-lg shadow-theme-primary/25 hover:shadow-theme-primary/35 transition-all duration-300 hover:scale-105"
            >
              <span>Back to Dashboard</span>
              <HiChevronRight className="text-lg" />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="flex items-center space-x-2 px-8 py-4 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold shadow-lg shadow-theme-primary/25 hover:shadow-theme-primary/35 transition-all duration-300 hover:scale-105"
              >
                <span>Get Started Now</span>
                <HiChevronRight className="text-lg" />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 rounded-xl border border-theme-border bg-theme-card hover:bg-theme-accent text-theme-text font-semibold transition-all duration-300"
              >
                Learn More
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Interface Preview / Mockup */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        <div className="bg-theme-card border border-theme-border rounded-2xl p-2 shadow-2xl glass-effect overflow-hidden transition-all duration-300">
          <div className="bg-theme-bg rounded-xl border border-theme-border p-4 sm:p-6 text-left">
            
            {/* Mock Header */}
            <div className="flex justify-between items-center pb-4 border-b border-theme-border mb-6">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-xs text-theme-muted ml-2 font-mono">devtrack-dashboard.local</span>
              </div>
              <div className="h-6 w-32 bg-theme-accent rounded-md" />
            </div>

            {/* Mock Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-4">
                <div className="h-32 bg-theme-card border border-theme-border rounded-xl p-4 flex flex-col justify-between">
                  <div className="h-4 w-1/4 bg-theme-primary/10 rounded-md" />
                  <div className="h-10 w-full bg-theme-accent rounded-md animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-28 bg-theme-card border border-theme-border rounded-xl p-4 flex flex-col justify-between">
                    <div className="h-4 w-1/2 bg-green-500/10 rounded-md" />
                    <div className="h-6 w-12 bg-theme-text rounded-md" />
                  </div>
                  <div className="h-28 bg-theme-card border border-theme-border rounded-xl p-4 flex flex-col justify-between">
                    <div className="h-4 w-1/2 bg-purple-500/10 rounded-md" />
                    <div className="h-6 w-12 bg-theme-text rounded-md" />
                  </div>
                </div>
              </div>
              <div className="h-full min-h-[250px] bg-theme-card border border-theme-border rounded-xl p-4 flex flex-col justify-between">
                <div className="h-4 w-1/2 bg-theme-primary/10 rounded-md" />
                <div className="w-full flex-grow flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full border-8 border-theme-border border-t-theme-primary animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div className="h-4 w-3/4 bg-theme-accent rounded-md" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-theme-border relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-theme-text">
            Everything you need in one space
          </h2>
          <p className="mt-4 text-theme-muted">
            Crafted with rich glassmorphic details and dark/light system compliance. Choose a theme that fits your IDE!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="bg-theme-card border border-theme-border rounded-2xl p-6 hover:border-theme-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-r ${feat.color} text-white w-fit mb-6 shadow-md`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-theme-text mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-theme-muted leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
