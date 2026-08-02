import React from 'react';
import { HiOutlineCode, HiOutlineGlobe, HiOutlineUsers } from 'react-icons/hi';

const AboutPage = () => {
  const points = [
    {
      title: 'Our Mission',
      desc: 'To build clean, developer-focused tooling that helps students and teams structure their workflows without administrative bloat.',
      icon: HiOutlineCode
    },
    {
      title: 'Built for Open Source',
      desc: 'Created using modern open-source foundations (MongoDB, Express, React, Node.js) with modular, self-hostable design principles.',
      icon: HiOutlineGlobe
    },
    {
      title: 'Premium UX',
      desc: 'Designed with beautiful, modern aesthetics including responsive grids, glassmorphism, dynamic theme context systems, and live charts.',
      icon: HiOutlineUsers
    }
  ];

  return (
    <div className="bg-theme-bg min-h-screen py-16 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-theme-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-theme-text sm:text-5xl">
            About <span className="bg-gradient-to-r from-theme-primary to-purple-400 bg-clip-text text-transparent">DevTrack</span>
          </h1>
          <p className="mt-4 text-lg text-theme-muted max-w-xl mx-auto">
            A developer companion designed to align software architecture design, task tracking, and milestone logging.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-8 mb-12 shadow-xl glass-effect">
          <h2 className="text-2xl font-bold text-theme-text mb-4">Why we built DevTrack</h2>
          <p className="text-theme-muted leading-relaxed mb-4">
            Most project management platforms are either too heavy, requiring hours of training, or too simple, missing essential code-centric attachment handling and local note taking. DevTrack is built specifically for students and individual developers who need structure, simplicity, and dynamic visual styling.
          </p>
          <p className="text-theme-muted leading-relaxed">
            By combining notes, files, priorities, and Kanban views, DevTrack bridges the gap between coding folders and spreadsheets.
          </p>
        </div>

        {/* Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div key={idx} className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-md">
                <div className="p-3 bg-theme-primary/10 text-theme-primary rounded-xl w-fit mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-theme-text mb-2">{pt.title}</h3>
                <p className="text-sm text-theme-muted leading-relaxed">{pt.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
