import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CreditCard, Settings, LogOut, Search, Bell, Star, Clock, PlayCircle, ChevronRight, TrendingUp, Users, Share2, Rocket } from 'lucide-react';
import { cn } from '../lib/utils';
import { COURSES } from '../constants';
import { GlowCard } from '../components/ui/spotlight-card';

export default function Dashboard() {
  const [activeTab, setActiveTab] = React.useState('Overview');

  const sidebarItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'My Courses', icon: BookOpen },
    { name: 'Earnings', icon: CreditCard },
    { name: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-12">
            {/* Stats Grid: Bento Box Style */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Earnings', value: '₦1.2M', icon: CreditCard, color: 'text-primary', bg: 'bg-primary/10', glow: 'blue' as const, border: 'border-primary/20', span: 'lg:col-span-2' },
                { label: 'Active Students', value: '1,240', icon: Users, color: 'text-secondary', bg: 'bg-secondary/10', glow: 'green' as const, border: 'border-secondary/20', span: 'col-span-1' },
                { label: 'Course Rating', value: '4.9', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10', glow: 'orange' as const, border: 'border-amber-500/20', span: 'col-span-1' },
              ].map((stat) => (
                <GlowCard 
                  key={stat.label} 
                  glowColor={stat.glow}
                  customSize={true}
                  className={cn(
                    "bg-white p-7 rounded-[2rem] border flex items-center gap-6 group hover:shadow-2xl transition-all duration-500 h-auto",
                    stat.border,
                    stat.span
                  )}
                >
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm", stat.bg, stat.color)}>
                    <stat.icon size={32} className="drop-shadow-sm" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1.5 opacity-60">{stat.label}</p>
                    <h4 className="text-3xl font-headline font-black text-primary tracking-tight">{stat.value}</h4>
                  </div>
                </GlowCard>
              ))}
              <GlowCard 
                glowColor="blue"
                customSize={true}
                className="bg-primary p-7 rounded-[2rem] border border-white/10 flex flex-col justify-between group hover:shadow-2xl transition-all duration-500 h-auto text-white sm:col-span-2 lg:col-span-1"
              >
                <div className="flex justify-between items-start mb-4">
                   <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                      <TrendingUp size={24} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Referral</span>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest mb-1 opaque-60">Referral Bonus</p>
                   <h4 className="text-3xl font-headline font-black tracking-tight">₦85k</h4>
                </div>
              </GlowCard>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-headline font-bold text-primary">Continue Learning</h2>
                  <button onClick={() => setActiveTab('My Courses')} className="text-sm font-bold text-primary hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {COURSES.slice(0, 2).map((course) => (
                    <GlowCard 
                      key={course.id} 
                      glowColor="blue"
                      customSize={true}
                      className="bg-white p-6 rounded-2xl border border-outline-variant/10 flex flex-col md:flex-row items-center gap-8 group hover:shadow-md transition-all h-auto"
                    >
                      <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden relative shrink-0">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle size={48} className="text-white" />
                        </div>
                      </div>
                      <div className="flex-grow space-y-4 w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-headline font-bold text-lg text-primary mb-1">{course.title}</h3>
                            <p className="text-xs text-on-surface-variant flex items-center gap-2">
                              <Clock size={14} /> 12 modules left • 45% completed
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                            <div className="h-full bg-secondary w-[45%] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </GlowCard>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-xl font-headline font-bold text-primary">Quick Earnings</h2>
                <GlowCard glowColor="purple" customSize={true} className="bg-white p-8 rounded-2xl border border-outline-variant/10 space-y-8 h-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Total Balance</p>
                      <h3 className="text-3xl font-headline font-bold text-primary">₦1.2M</h3>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('Earnings')} className="w-full py-4 bg-primary text-white rounded-xl font-bold">Details</button>
                </GlowCard>
              </div>
            </div>
          </div>
        );
      case 'My Courses':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-headline font-bold text-primary">Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COURSES.map((course) => (
                <GlowCard key={course.id} glowColor="blue" className="bg-white overflow-hidden flex flex-col h-auto">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                  <div className="p-6 space-y-4 flex-grow">
                    <h3 className="font-bold text-primary line-clamp-1">{course.title}</h3>
                    <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                      <div className="h-full bg-secondary w-[60%] rounded-full"></div>
                    </div>
                    <button className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm">Resume Course</button>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        );
      case 'Earnings':
        return (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <GlowCard glowColor="green" className="bg-white p-8 h-auto">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Wallet Balance</p>
                <h3 className="text-3xl font-black text-primary">₦1,245,000</h3>
                <button className="mt-6 w-full py-3 bg-secondary text-white rounded-xl font-bold">Withdraw Now</button>
              </GlowCard>
              <GlowCard glowColor="blue" className="lg:col-span-2 bg-primary p-8 text-white h-auto">
                <h3 className="text-xl font-bold mb-4">Your Referral Engine</h3>
                <p className="opacity-70 mb-6">Share your link and earn 30% on every checkout.</p>
                <div className="flex gap-3">
                  <input readOnly value="nigeriaaischool.com/ref/kola" className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 flex-grow font-mono overflow-auto" />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("nigeriaaischool.com/ref/kola");
                      window.showToast("Referral link copied to clipboard!");
                    }}
                    className="bg-secondary text-white px-6 rounded-xl font-bold"
                  >
                    Copy
                  </button>
                </div>
              </GlowCard>
            </div>
            <div className="bg-white rounded-3xl border border-outline-variant/10 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant/10">
                  <tr>
                    <th className="px-8 py-5 font-bold text-primary text-sm uppercase tracking-widest">Description</th>
                    <th className="px-8 py-5 font-bold text-primary text-sm uppercase tracking-widest">Date</th>
                    <th className="px-8 py-5 font-bold text-primary text-sm uppercase tracking-widest">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {[1,2,3,4,5].map(i => (
                    <tr key={i} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-8 py-6 text-on-surface font-medium">Referral: AI Mastery Course</td>
                      <td className="px-8 py-6 text-on-surface-variant text-sm">Oct {10+i}, 2024</td>
                      <td className="px-8 py-6 text-secondary font-black">+₦12,500</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="max-w-2xl bg-white p-12 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-8">
            <h2 className="text-2xl font-headline font-bold text-primary">Account Settings</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-on-surface-variant">First Name</label>
                  <input defaultValue="Kolawole" className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-on-surface-variant">Last Name</label>
                  <input defaultValue="Abidemi" className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-on-surface-variant">Email Address</label>
                <input defaultValue="kola@nigeriaaischool.com" className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <button className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">Update Profile</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-container-low">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-outline-variant/10 hidden lg:flex flex-col p-8 sticky top-20 h-[calc(100vh-80px)]">
        <div className="space-y-12 flex-grow">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-4">Menu</h3>
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all",
                    activeTab === item.name 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                  )}
                >
                  <item.icon size={20} />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <button className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all">
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 lg:p-12 space-y-12 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary mb-2">
              {activeTab === 'Overview' ? 'Welcome back, Kolawole! 👋' : activeTab}
            </h1>
            <p className="text-on-surface-variant">Manage your learning and earning in one place.</p>
          </div>
          <div className="flex items-center gap-4">
             <button className="p-3 bg-white border border-outline-variant/10 rounded-xl text-on-surface-variant hover:text-primary relative group transition-all">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white shadow-sm" />
             </button>
             <Link to="/creator-dashboard" className="bg-secondary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                <Rocket size={18} />
                Upload Course
              </Link>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
