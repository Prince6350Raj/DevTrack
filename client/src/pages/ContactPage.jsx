import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone } from 'react-icons/hi';

const ContactPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data) => {
    console.log('Contact form submitted:', data);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-theme-bg min-h-screen py-16 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-theme-text sm:text-5xl">
            Get in <span className="bg-gradient-to-r from-theme-primary to-purple-400 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="mt-4 text-lg text-theme-muted max-w-xl mx-auto">
            Have feedback, bug reports, or questions? Send us a message and we'll get back to you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Contact Details Card */}
          <div className="bg-theme-card border border-theme-border rounded-2xl p-8 shadow-xl flex flex-col justify-between space-y-8 glass-effect">
            <div>
              <h2 className="text-2xl font-bold text-theme-text mb-4">Contact Info</h2>
              <p className="text-sm text-theme-muted mb-8 leading-relaxed">
                Connect with the DevTrack team. We are always open to code contributions, enhancements, and workflow suggestions!
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-theme-primary/10 text-theme-primary rounded-xl">
                    <HiOutlineMail className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-xs text-theme-muted font-medium">Email Us</span>
                    <span className="text-sm text-theme-text font-semibold">support@devtrack.io</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-theme-primary/10 text-theme-primary rounded-xl">
                    <HiOutlinePhone className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-xs text-theme-muted font-medium">Call Us</span>
                    <span className="text-sm text-theme-text font-semibold">+1 (555) 019-2834</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-theme-primary/10 text-theme-primary rounded-xl">
                    <HiOutlineLocationMarker className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-xs text-theme-muted font-medium">Headquarters</span>
                    <span className="text-sm text-theme-text font-semibold">San Francisco, CA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-theme-muted pt-6 border-t border-theme-border font-mono">
              DevTrack Open-Source Project
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-2 bg-theme-card border border-theme-border rounded-2xl p-8 shadow-xl glass-effect">
            <h2 className="text-2xl font-bold text-theme-text mb-6">Send Message</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-sm font-semibold animate-bounce">
                Success! Your message has been sent. We will get back to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-theme-muted font-semibold mb-2 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary transition-colors duration-200"
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>}
                </div>

                <div>
                  <label className="block text-xs text-theme-muted font-semibold mb-2 uppercase tracking-wide">Email Address</label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary transition-colors duration-200"
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-theme-muted font-semibold mb-2 uppercase tracking-wide">Subject</label>
                <input
                  type="text"
                  {...register('subject', { required: 'Subject is required' })}
                  className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary transition-colors duration-200"
                  placeholder="How can we help?"
                />
                {errors.subject && <span className="text-xs text-red-500 mt-1 block">{errors.subject.message}</span>}
              </div>

              <div>
                <label className="block text-xs text-theme-muted font-semibold mb-2 uppercase tracking-wide">Message</label>
                <textarea
                  rows="4"
                  {...register('message', { required: 'Message content is required' })}
                  className="w-full px-4 py-3 rounded-xl bg-theme-accent border border-theme-border text-theme-text focus:outline-none focus:border-theme-primary transition-colors duration-200 resize-none"
                  placeholder="Tell us what's on your mind..."
                />
                {errors.message && <span className="text-xs text-red-500 mt-1 block">{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold shadow-md shadow-theme-primary/20 transition-all duration-300 hover:scale-102"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
