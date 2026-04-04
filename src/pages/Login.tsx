import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, User, Lock, Mail } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface-container-low flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/80 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-outline-variant/10 relative z-10">
        <div className="text-center mb-10">
          <h1 className="font-headline font-extrabold text-3xl text-primary mb-2">Welcome Back</h1>
          <p className="text-on-surface-variant font-medium">Log in to continue learning and earning.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary/20 w-4 h-4" />
              <span className="text-on-surface-variant font-medium">Remember me</span>
            </label>
            <Link to="#" className="font-bold text-primary hover:underline underline-offset-4">Forgot Password?</Link>
          </div>

          <Link to="/dashboard" className="w-full bg-primary text-white py-4 flex justify-center items-center gap-2 rounded-xl font-bold text-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
            Login to Dashboard <ArrowRight size={20} />
          </Link>
        </form>

        <p className="text-center mt-8 text-on-surface-variant font-medium">
          Don't have an account? <Link to="/signup" className="text-secondary font-bold hover:underline underline-offset-4">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}
