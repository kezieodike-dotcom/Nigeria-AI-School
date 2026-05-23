import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { user, profile } = useAuth();
  const searchParams = new URLSearchParams(routeLocation.search);
  const redirectTo = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const getSafeRedirectPath = () => {
    const stateFrom = routeLocation.state?.from?.pathname;
    const requestedPath = redirectTo || stateFrom;
    return requestedPath?.startsWith('/') && !requestedPath.startsWith('//') ? requestedPath : null;
  };

  const getPostLoginPath = (profileRole?: string | null) => {
    if (profileRole === 'admin') return '/admin';
    if (profileRole === 'creator') return '/creator-dashboard';
    return getSafeRedirectPath() || '/dashboard';
  };

  React.useEffect(() => {
    if (user && profile) {
      navigate(getPostLoginPath(profile.role), { replace: true });
    }
  }, [user, profile, navigate, redirectTo, routeLocation.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password.trim(),
      });

      if (error) throw error;
      
      if (data.user) {
        // Directly fetch the profile and redirect based on the actual database role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          // Fallback to student dashboard if profile can't be fetched
          navigate('/dashboard');
          return;
        }

        navigate(getPostLoginPath(profileData?.role), { replace: true });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Enter your email address first, then click Forgot Password.');
      return;
    }

    setResetLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;
      window.showToast?.('Password reset email sent. Check your inbox.', 'success');
    } catch (err: any) {
      setError(err.message || 'Unable to send password reset email.');
    } finally {
      setResetLoading(false);
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
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value.trimStart())}
                onBlur={(e) => setEmail(e.target.value.trim().toLowerCase())}
                placeholder="Email Address" 
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full pl-12 pr-12 py-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary/20 w-4 h-4" />
              <span className="text-on-surface-variant font-medium">Remember me</span>
            </label>
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={resetLoading}
              className="font-bold text-primary hover:underline underline-offset-4 disabled:opacity-60"
            >
              {resetLoading ? 'Sending...' : 'Forgot Password?'}
            </button>
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

      </div>
    </div>
  );
}
