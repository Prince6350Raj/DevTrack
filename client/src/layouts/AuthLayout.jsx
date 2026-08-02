import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { MdTrendingUp } from 'react-icons/md';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-bg py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Decorative background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-theme-primary opacity-10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500 opacity-10 blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 z-10">
        {/* Header Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="p-3 rounded-xl bg-theme-primary text-white flex items-center justify-center shadow-lg">
              <MdTrendingUp className="text-2xl animate-pulse" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-theme-primary to-purple-400 bg-clip-text text-transparent">
              DevTrack
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-theme-text tracking-tight">
            Plan. Track. Achieve.
          </h2>
          <p className="mt-2 text-sm text-theme-muted">
            The modern space for developer planning
          </p>
        </div>

        {/* Auth Forms Container */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-8 shadow-xl glass-effect transition-colors duration-300">
          <Outlet />
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-sm font-medium text-theme-muted hover:text-theme-primary transition-colors duration-300"
          >
            &larr; Back to landing page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
