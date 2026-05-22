import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, LogOut, LayoutDashboard, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const navLinks = [
    { name: 'Courses', href: '/courses' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'Creators', href: '/become-creator' },
    { name: 'About', href: '/about' },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant p-1">
              <img src="/logo.png" alt="Nigeria AI School Logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-base sm:text-lg font-semibold text-primary font-headline">
              Nigeria AI School
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to={profile?.role === 'creator' ? "/creator-dashboard" : "/dashboard"} 
                  className="flex items-center gap-2 text-sm font-medium text-primary border border-outline-variant px-4 py-2 rounded-full hover:bg-surface-container transition-colors"
                >
                  <LayoutDashboard size={18} />
                  {profile?.role === 'creator' ? 'Creator Hub' : 'Dashboard'}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors px-3 py-2">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary-container active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  Get Started <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          {!location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/creator-dashboard') && !location.pathname.startsWith('/admin') && (
            <button
              className="md:hidden p-2 text-primary border border-outline-variant rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && !location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/creator-dashboard') && !location.pathname.startsWith('/admin') && (
          <div className="md:hidden bg-white border-b border-outline-variant p-5 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block text-lg font-medium text-on-surface-variant"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-4">
              {user ? (
                <>
                  <Link 
                    to={profile?.role === 'creator' ? "/creator-dashboard" : "/dashboard"} 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-3 bg-surface-container text-primary rounded-full font-medium border border-outline-variant"
                  >
                    <LayoutDashboard size={20} />
                    {profile?.role === 'creator' ? 'Creator Hub' : 'Dashboard'}
                  </Link>
                  <button 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 py-3 text-on-surface-variant font-medium hover:text-primary"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-center py-3 font-medium text-on-surface-variant">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-center py-3 bg-primary text-white rounded-full font-medium">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-outline-variant py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant p-1">
                <img src="/logo.png" alt="Nigeria AI School Logo" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-base font-semibold text-primary font-headline">Nigeria AI School</span>
            </Link>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Empowering the next generation of African AI leaders with globally recognized skills and community support.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-primary mb-5 font-headline">Learning</h4>
            <ul className="space-y-4">
              <li><Link to="/courses" className="text-sm text-on-surface-variant hover:text-primary transition-colors">AI & ML</Link></li>
              <li><Link to="/courses" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Data Science</Link></li>
              <li><Link to="/courses" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Web Dev</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-primary mb-5 font-headline">Opportunities</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Affiliate Program</Link></li>
              <li><Link to="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Become a Creator</Link></li>
              <li><Link to="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Job Board</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-primary mb-5 font-headline">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface-variant">
            © 2024 Nigeria AI School — Learn. Create. Earn.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-on-surface-variant hover:text-primary transition-colors">
              <Search size={18} />
            </Link>
            <Link to="#" className="text-on-surface-variant hover:text-primary transition-colors">
              <User size={18} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
