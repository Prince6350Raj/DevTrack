import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { login, loading, authError, setAuthError, user } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  // Clear auth error when mounting the login screen
  useEffect(() => {
    setAuthError(null);
  }, [setAuthError]);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-theme-text">Welcome Back</h3>
        <p className="text-xs text-theme-muted mt-1">Sign in to track your current milestones</p>
      </div>

      {authError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs text-theme-muted font-semibold uppercase">Password</label>
            <Link 
              to="/forgot-password" 
              className="text-xs font-semibold text-theme-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary transition-colors text-sm"
            placeholder="••••••••"
          />
          {errors.password && <span className="text-xs text-red-500 mt-1 block">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold transition-all shadow-md shadow-theme-primary/20 hover:shadow-theme-primary/30 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Log In</span>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-theme-muted">
        Don't have an account?{' '}
        <Link to="/signup" className="text-theme-primary font-bold hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
