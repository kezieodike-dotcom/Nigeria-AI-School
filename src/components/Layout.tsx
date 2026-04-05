import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Explore Courses', href: '/courses' },
    { name: 'How it Works', href: '/how-it-works' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact-us' },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <header className="sticky top-0 z-50 glass-effect border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center overflow-hidden border border-primary/10 group-hover:border-primary/30 transition-colors">
              <img src="/logo.png" alt="Nigeria AI School Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-xl font-extrabold tracking-tighter text-primary font-headline">
              Nigeria AI School
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.href 
                    ? "text-primary border-b-2 border-primary pb-1" 
                    : "text-on-surface-variant"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
              Login
            </Link>
            <Link 
              to="/signup" 
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-outline-variant/10 p-6 space-y-4">
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
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-center py-3 font-medium text-on-surface-variant">
                Login
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-center py-3 bg-primary text-white rounded-xl font-bold">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-surface-container-low border-t border-outline-variant/10 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group inline-flex">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden border border-outline-variant/20 group-hover:border-primary/30 transition-colors">
                <img src="/logo.png" alt="Nigeria AI School Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-lg font-bold text-primary font-headline">Nigeria AI School</span>
            </Link>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Empowering the next generation of African AI leaders with globally recognized skills and community support.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-6 font-headline">Learning</h4>
            <ul className="space-y-4">
              <li><Link to="/courses" className="text-sm text-on-surface-variant hover:text-primary transition-colors">AI & ML</Link></li>
              <li><Link to="/courses" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Data Science</Link></li>
              <li><Link to="/courses" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Web Dev</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-6 font-headline">Opportunities</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Affiliate Program</Link></li>
              <li><Link to="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Become a Creator</Link></li>
              <li><Link to="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Job Board</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-6 font-headline">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
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
