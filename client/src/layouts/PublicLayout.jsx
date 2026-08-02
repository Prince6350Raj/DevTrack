import React, { useState, useContext } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { MdTrendingUp } from 'react-icons/md';

const PublicLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const activeStyle = "text-theme-primary font-semibold border-b-2 border-theme-primary pb-1 transition-all duration-300";
  const inactiveStyle = "text-theme-muted hover:text-theme-text transition-all duration-300";

  return (
    <div className="min-h-screen flex flex-col bg-theme-bg text-theme-text transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-theme-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-theme-primary text-white flex items-center justify-center">
                <MdTrendingUp className="text-xl" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-theme-primary to-purple-400 bg-clip-text text-transparent">
                DevTrack
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : inactiveStyle} end>
                Home
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                About
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                Contact
              </NavLink>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg bg-theme-primary hover:bg-theme-primary-hover text-white font-medium shadow-md transition-all duration-300 hover:scale-105"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-theme-muted hover:text-theme-text font-medium transition-colors duration-300"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-lg bg-theme-primary hover:bg-theme-primary-hover text-white font-medium shadow-md transition-all duration-300 hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-theme-muted hover:text-theme-text p-2 rounded-lg focus:outline-none"
              >
                {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {isOpen && (
          <div className="md:hidden glass-effect border-b border-theme-border animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md hover:bg-theme-accent text-theme-text"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md hover:bg-theme-accent text-theme-text"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md hover:bg-theme-accent text-theme-text"
              >
                Contact
              </Link>
              <hr className="border-theme-border my-2" />
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-4 py-2 rounded-lg bg-theme-primary text-white font-medium"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex flex-col space-y-2 px-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2 rounded-md border border-theme-border hover:bg-theme-accent text-theme-text font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2 rounded-md bg-theme-primary text-white font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-theme-border bg-theme-card py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-theme-muted text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-theme-text">DevTrack</span>
            <span>&copy; {new Date().getFullYear()} — Plan. Track. Achieve.</span>
          </div>
          <div className="flex space-x-6">
            <Link to="/about" className="hover:text-theme-text transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-theme-text transition-colors">Contact</Link>
            <span className="cursor-default">Version 1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
