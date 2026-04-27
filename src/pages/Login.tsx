import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = import.meta.env.SSR ? null : window.location;
  const queryRole = new URLSearchParams(location?.search).get('role') as 'student' | 'creator';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'creator'>(queryRole || 'student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      if (role === 'creator') {
        navigate('/creator-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Update metadata if they selected creator and weren't one before
      if (role === 'creator' && data.user?.user_metadata?.role !== 'creator') {
        await supabase.auth.updateUser({ data: { role: 'creator' } });
      }

      window.showToast('Logged in successfully!');
      if (role === 'creator') {
        navigate('/creator-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="flex bg-surface-container-low p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={cn(
                "flex-1 py-3 text-sm font-bold rounded-lg transition-all",
                role === 'student' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
              )}
            >
              Login as Student
            </button>
            <button
              type="button"
              onClick={() => setRole('creator')}
              className={cn(
                "flex-1 py-3 text-sm font-bold rounded-lg transition-all",
                role === 'creator' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"
              )}
            >
              Login as Creator
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address" 
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white py-4 flex justify-center items-center gap-2 rounded-xl font-bold text-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Login to Dashboard <ArrowRight size={20} /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-on-surface-variant font-medium">
          Don't have an account? <Link to="/signup" className="text-secondary font-bold hover:underline underline-offset-4">Sign up here</Link>
        </p>

        {/* Creator Callout */}
        <div className="mt-8 p-6 bg-surface-container-low rounded-2xl border border-secondary/20 text-center relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="font-headline font-bold text-primary mb-2 relative z-10">Are you an AI Expert?</h3>
          <p className="text-sm text-on-surface-variant mb-4 relative z-10">Upload your videos, reach thousands of students, and make money.</p>
          <Link to="/signup?role=creator" className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md shadow-secondary/20 relative z-10">
            Become a Creator <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
