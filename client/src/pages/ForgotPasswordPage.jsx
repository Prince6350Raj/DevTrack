import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import API from '../services/api';

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [step, setStep] = useState(1); // Step 1: Request code, Step 2: Reset password
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [emailSaved, setEmailSaved] = useState('');

  // Handle Request Code
  const handleRequestCode = async (data) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const response = await API.post('/auth/forgot-password', { email: data.email });
      setEmailSaved(data.email);
      setSuccessMsg(response.data.message);
      setLoading(false);
      setStep(2); // Move to password update
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || 'Failed to send reset code');
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (data) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const response = await API.post('/auth/reset-password', {
        email: emailSaved,
        resetCode: data.resetCode,
        newPassword: data.newPassword
      });
      setSuccessMsg(response.data.message + '. Redirecting to login...');
      setLoading(false);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || 'Password reset failed');
    }
  };

  const newPassword = watch('newPassword');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-theme-text">Reset Password</h3>
        <p className="text-xs text-theme-muted mt-1">
          {step === 1 ? 'Get a reset code for your account' : 'Enter the code and set your new password'}
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-xs font-semibold">
          {successMsg}
        </div>
      )}

      {step === 1 ? (
        // STEP 1: REQUEST CODE
        <form onSubmit={handleSubmit(handleRequestCode)} className="space-y-4">
          <div>
            <label className="block text-xs text-theme-muted font-semibold mb-2 uppercase">Email Address</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
              })}
              className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary transition-colors text-sm"
              placeholder="dev@example.com"
            />
            {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold transition-all shadow-md shadow-theme-primary/20 hover:shadow-theme-primary/30 flex items-center justify-center"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Request Reset Code</span>
            )}
          </button>
        </form>
      ) : (
        // STEP 2: ENTER CODE & NEW PASSWORD
        <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
          <div>
            <label className="block text-xs text-theme-muted font-semibold mb-2 uppercase">Reset Code</label>
            <input
              type="text"
              {...register('resetCode', { required: 'Reset code is required' })}
              className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary transition-colors text-sm font-mono text-center tracking-widest"
              placeholder="123456"
            />
            {errors.resetCode && <span className="text-xs text-red-500 mt-1 block">{errors.resetCode.message}</span>}
          </div>

          <div>
            <label className="block text-xs text-theme-muted font-semibold mb-2 uppercase">New Password</label>
            <input
              type="password"
              {...register('newPassword', { 
                required: 'New password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary transition-colors text-sm"
              placeholder="••••••••"
            />
            {errors.newPassword && <span className="text-xs text-red-500 mt-1 block">{errors.newPassword.message}</span>}
          </div>

          <div>
            <label className="block text-xs text-theme-muted font-semibold mb-2 uppercase">Confirm New Password</label>
            <input
              type="password"
              {...register('confirmNewPassword', { 
                required: 'Please confirm password',
                validate: value => value === newPassword || 'Passwords do not match'
              })}
              className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary transition-colors text-sm"
              placeholder="••••••••"
            />
            {errors.confirmNewPassword && <span className="text-xs text-red-500 mt-1 block">{errors.confirmNewPassword.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold transition-all shadow-md shadow-theme-primary/20 hover:shadow-theme-primary/30 flex items-center justify-center"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Reset Password</span>
            )}
          </button>
        </form>
      )}

      <div className="text-center text-xs text-theme-muted">
        Remembered your password?{' '}
        <Link to="/login" className="text-theme-primary font-bold hover:underline">
          Log In
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
