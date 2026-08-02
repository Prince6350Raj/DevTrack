import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { HiOutlineCheck, HiSave } from 'react-icons/hi';

const SettingsPage = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const { updateProfile, loading } = useContext(AuthContext);
  const [successMsg, setSuccessMsg] = useState(false);

  const themeOptions = [
    {
      id: 'light',
      name: 'Light Mode',
      colors: ['bg-[#f8fafc]', 'border-[#e2e8f0]', 'bg-[#3b82f6]'],
      desc: 'Clean, standard slate scaling'
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      colors: ['bg-[#09090b]', 'border-[#27272a]', 'bg-[#6366f1]'],
      desc: 'Indigo accents on deep charcoal'
    },
    {
      id: 'blue',
      name: 'Midnight Ocean',
      colors: ['bg-[#0a1128]', 'border-[#1e293b]', 'bg-[#0ea5e9]'],
      desc: 'Sky blue highlights on dark navy'
    },
    {
      id: 'green',
      name: 'Emerald Forest',
      colors: ['bg-[#021a14]', 'border-[#0b453a]', 'bg-[#10b981]'],
      desc: 'Mint tones on forest backgrounds'
    },
    {
      id: 'purple',
      name: 'Cyber Violet',
      colors: ['bg-[#100720]', 'border-[#3b1767]', 'bg-[#a855f7]'],
      desc: 'Neon purple accents on dark violet'
    }
  ];

  const handleSaveTheme = async () => {
    setSuccessMsg(false);
    try {
      await updateProfile({ theme });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (error) {
      console.error('Error saving default theme preference:', error);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-theme-text font-sans">Settings Panel</h2>
        <p className="text-sm text-theme-muted mt-1">Configure layout options and personalize your developer space.</p>
      </div>

      {/* Theme Options Cards */}
      <div className="bg-theme-card border border-theme-border rounded-2xl p-6 sm:p-8 shadow-sm glass-effect transition-colors duration-300">
        <h3 className="text-base font-bold text-theme-text pb-2 border-b border-theme-border mb-6">
          Theme Customization
        </h3>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-sm font-semibold animate-fade-in">
            Default workspace theme saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themeOptions.map((opt) => {
            const isSelected = theme === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`
                  cursor-pointer border-2 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-theme-primary/40 transition-all duration-200 hover:-translate-y-0.5
                  ${isSelected ? 'border-theme-primary shadow-md bg-theme-primary/5' : 'border-theme-border bg-theme-accent/20'}
                `}
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-theme-text">{opt.name}</span>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-theme-primary text-white">
                      <HiOutlineCheck className="h-3 w-3" />
                    </span>
                  )}
                </div>

                {/* Theme Palette Previews */}
                <div className={`h-16 w-full rounded-xl border flex overflow-hidden ${opt.colors[0]} ${opt.colors[1]}`}>
                  <div className="w-1/3 border-r border-theme-border flex items-center justify-center">
                    <div className={`h-6 w-6 rounded-full ${opt.colors[2]}`} />
                  </div>
                  <div className="w-2/3 p-2 space-y-1.5 flex flex-col justify-center">
                    <div className="h-2 w-3/4 bg-theme-muted/30 rounded" />
                    <div className="h-2 w-1/2 bg-theme-muted/20 rounded" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-theme-muted">
                  {opt.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Save Theme button */}
        <div className="mt-8 pt-6 border-t border-theme-border flex justify-end">
          <button
            onClick={handleSaveTheme}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-sm shadow-md transition-all hover:scale-102"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <HiSave />
                <span>Save Theme Preference</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

export default SettingsPage;
