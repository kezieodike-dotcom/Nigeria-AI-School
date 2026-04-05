import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, User, Lock, Mail, Presentation, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Signup() {
  const [role, setRole] = useState<'student' | 'creator'>('student');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'creator') {
      navigate('/dashboard'); // Will be creator-dashboard in future mapping
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-surface-container-low flex items-center justify-center p-6 lg:py-16 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/80 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="w-full max-w-xl bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-outline-variant/10 relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-headline font-extrabold text-3xl text-primary mb-2">Create an Account</h1>
          <p className="text-on-surface-variant font-medium">Join Africa's leading AI learning platform.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-2">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={cn(
                "p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all",
                role === 'student' 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-outline-variant/20 bg-surface-container-lowest text-on-surface-variant hover:border-primary/50"
              )}
            >
              <User size={24} />
              <span className="font-bold text-sm">I want to Learn</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('creator')}
              className={cn(
                "p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all",
                role === 'creator' 
                  ? "border-secondary bg-secondary/5 text-secondary" 
                  : "border-outline-variant/20 bg-surface-container-lowest text-on-surface-variant hover:border-secondary/50"
              )}
            >
              <Presentation size={24} />
              <span className="font-bold text-sm">I want to Teach</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
              </div>
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  className="w-full px-4 py-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
              </div>
            </div>
            
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
                placeholder="Create Password" 
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="text-sm font-medium text-on-surface-variant text-center">
            By signing up, you agree to our <Link to="#" className="text-primary hover:underline">Terms</Link> and <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>.
          </div>

          <button type="submit" className={cn(
            "w-full text-white py-4 flex justify-center items-center gap-2 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg",
            role === 'creator' ? "bg-secondary shadow-secondary/20 hover:bg-secondary/90" : "bg-primary shadow-primary/20 hover:bg-primary/90"
          )}>
            Create Account <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-center mt-8 text-on-surface-variant font-medium">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">Log in</Link>
        </p>
      </div>
    </div>
  );
}
