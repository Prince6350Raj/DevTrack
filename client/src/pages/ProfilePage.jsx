import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, updateProfile, updateProfilePic, loading, authError } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: user.username,
      bio: user.bio || '',
      github: user.github || '',
      linkedin: user.linkedin || '',
      portfolio: user.portfolio || ''
    }
  });

  const [savingText, setSavingText] = useState(false);
  const [savingPic, setSavingPic] = useState(false);
  const [successText, setSuccessText] = useState(false);
  const [successPic, setSuccessPic] = useState(false);

  const onTextSubmit = async (data) => {
    setSavingText(true);
    setSuccessText(false);
    try {
      await updateProfile(data);
      setSavingText(false);
      setSuccessText(true);
      setTimeout(() => setSuccessText(false), 3000);
    } catch (error) {
      console.error(error);
      setSavingText(false);
    }
  };

  const handlePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSavingPic(true);
    setSuccessPic(false);
    try {
      await updateProfilePic(file);
      setSavingPic(false);
      setSuccessPic(true);
      setTimeout(() => setSuccessPic(false), 3000);
    } catch (error) {
      console.error(error);
      setSavingPic(false);
    }
  };

  const userAvatar = user.profilePic 
    ? (user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:5000${user.profilePic}`)
    : '';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Overview Header banner */}
      <div>
        <h2 className="text-2xl font-bold text-theme-text font-sans">Developer Profile</h2>
        <p className="text-sm text-theme-muted mt-1">Customize your developer bio, avatar, and portfolio links.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar Card */}
        <div className="bg-theme-card border border-theme-border rounded-2xl p-6 shadow-sm flex flex-col items-center justify-between text-center glass-effect h-fit transition-colors duration-300">
          <div className="w-full flex flex-col items-center">
            
            {/* Profile Avatar Image */}
            <div className="relative mb-6">
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt={user.username} 
                  className="h-28 w-28 rounded-full object-cover border-4 border-theme-primary/20 shadow-md"
                />
              ) : (
                <div className="h-28 w-28 rounded-full bg-theme-primary text-white flex items-center justify-center font-bold text-4xl shadow-inner uppercase">
                  {user.username.charAt(0)}
                </div>
              )}

              {/* Upload spinner */}
              {savingPic && (
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <h3 className="font-extrabold text-lg text-theme-text truncate max-w-full">
              {user.username}
            </h3>
            <p className="text-xs text-theme-muted mt-1 font-mono">{user.email}</p>

            {user.bio && (
              <p className="text-xs text-theme-muted mt-4 bg-theme-accent/25 border border-theme-border rounded-xl p-3 leading-relaxed w-full">
                "{user.bio}"
              </p>
            )}
          </div>

          {/* Social connections buttons */}
          <div className="w-full mt-6 pt-6 border-t border-theme-border space-y-3">
            <div className="flex justify-center space-x-4 text-theme-muted">
              {user.github && (
                <a href={user.github} target="_blank" rel="noreferrer" className="hover:text-theme-text transition-colors">
                  <FaGithub className="h-5 w-5" />
                </a>
              )}
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noreferrer" className="hover:text-theme-text transition-colors">
                  <FaLinkedin className="h-5 w-5" />
                </a>
              )}
              {user.portfolio && (
                <a href={user.portfolio} target="_blank" rel="noreferrer" className="hover:text-theme-text transition-colors">
                  <FaGlobe className="h-5 w-5" />
                </a>
              )}
            </div>

            {/* Upload form input */}
            <div className="relative w-full pt-3">
              <input
                type="file"
                id="avatar-upload"
                onChange={handlePicChange}
                accept="image/*"
                className="hidden"
              />
              <label 
                htmlFor="avatar-upload"
                className="w-full inline-flex justify-center items-center space-x-2 px-4 py-2.5 rounded-xl border border-theme-border bg-theme-accent hover:bg-theme-border text-theme-text text-xs font-bold transition-all cursor-pointer hover:scale-102"
              >
                <span>Upload New Photo</span>
              </label>
              {successPic && (
                <span className="text-[10px] text-green-500 font-semibold block mt-1.5 animate-bounce">
                  Avatar updated successfully!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Profile Details form */}
        <div className="md:col-span-2 bg-theme-card border border-theme-border rounded-2xl p-6 sm:p-8 shadow-sm glass-effect transition-colors duration-300">
          
          {authError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">
              {authError}
            </div>
          )}

          {successText && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-xs font-semibold animate-fade-in">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit(onTextSubmit)} className="space-y-5">
            <h3 className="text-base font-bold text-theme-text pb-2 border-b border-theme-border mb-4">Edit profile details</h3>
            
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Username</label>
              <input
                type="text"
                {...register('username', { required: 'Username is required' })}
                className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm font-semibold"
              />
              {errors.username && <span className="text-xs text-red-500 block mt-1">{errors.username.message}</span>}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Bio / Description</label>
              <textarea
                rows="3"
                {...register('bio')}
                className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm resize-none"
                placeholder="Write a brief coder description..."
              />
            </div>

            <h3 className="text-base font-bold text-theme-text pb-2 border-b border-theme-border mt-8 mb-4">Social Links</h3>

            {/* GitHub */}
            <div>
              <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">GitHub Profile Link</label>
              <div className="relative">
                <FaGithub className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted h-5 w-5" />
                <input
                  type="url"
                  {...register('github')}
                  placeholder="https://github.com/octocat"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">LinkedIn Profile Link</label>
              <div className="relative">
                <FaLinkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted h-5 w-5" />
                <input
                  type="url"
                  {...register('linkedin')}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm"
                />
              </div>
            </div>

            {/* Portfolio */}
            <div>
              <label className="block text-xs font-semibold text-theme-muted uppercase mb-1.5">Personal Portfolio / Website</label>
              <div className="relative">
                <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted h-5 w-5" />
                <input
                  type="url"
                  {...register('portfolio')}
                  placeholder="https://mywebsite.dev"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-theme-border flex justify-end">
              <button
                type="submit"
                disabled={savingText}
                className="px-6 py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2"
              >
                {savingText ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
