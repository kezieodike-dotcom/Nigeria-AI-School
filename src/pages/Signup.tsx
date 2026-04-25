import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, User, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignedUp, setIsSignedUp] = useState(false);

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) throw error;
      
      if (data.session) {
        window.showToast('Welcome to Nigeria AI School!');
      } else {
        window.showToast('Account created! Please check your email.');
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup.');
    } finally {
      setLoading(false);
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name" 
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
              </div>
              <div className="relative w-full">
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                placeholder="Create Password" 
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="text-sm font-medium text-on-surface-variant text-center">
            By signing up, you agree to our <Link to="#" className="text-primary hover:underline">Terms</Link> and <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>.
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full text-white py-4 flex justify-center items-center gap-2 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg bg-primary shadow-primary/20 hover:bg-primary/90 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-on-surface-variant font-medium">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">Log in</Link>
        </p>
      </div>
    </div>
  );
}
