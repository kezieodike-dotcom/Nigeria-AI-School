import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  DollarSign, 
  BookOpen, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  ArrowUpRight,
  MoreVertical,
  CheckCircle,
  XCircle,
  CreditCard,
  Settings as SettingsIcon,
  Search,
  Video,
  Upload,
  Play,
  FileText,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GlowCard } from '../components/ui/spotlight-card';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [courseType, setCourseType] = useState('video');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [adminCourses, setAdminCourses] = useState<any[]>([]);

  const stats = [
    { label: 'Total Revenue', value: '₦12.4M', growth: '+24%', icon: DollarSign, glow: 'green' as const },
    { label: 'Total Users', value: '8,421', growth: '+12%', icon: Users, glow: 'blue' as const },
    { label: 'Active Courses', value: '142', growth: '+5', icon: BookOpen, glow: 'purple' as const },
    { label: 'Platform Health', value: '99.9%', growth: 'Stable', icon: Activity, glow: 'orange' as const },
  ];

  const recentUsers = [
    { name: 'Chioma Adeyemi', email: 'chioma@example.com', role: 'Student', status: 'Active', date: 'Just now' },
    { name: 'Oluwaseun Ibrahim', email: 'seun@example.com', role: 'Creator', status: 'Pending', date: '2h ago' },
    { name: 'Ngozi Okafor', email: 'ngozi@example.com', role: 'Student', status: 'Active', date: '5h ago' },
    { name: 'Emeka Nwosu', email: 'emeka@example.com', role: 'Creator', status: 'Suspended', date: '1d ago' },
  ];

  const pendingPayouts = [
    { creator: 'Tech With Tim', amount: '₦450,000', method: 'Bank Transfer', status: 'Pending' },
    { creator: 'DataSis NG', amount: '₦210,000', method: 'Bank Transfer', status: 'Pending' },
    { creator: 'Code Master', amount: '₦85,000', method: 'Crypto (USDT)', status: 'Processing' },
  ];

  const renderOverview = () => (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <GlowCard key={i} glowColor={stat.glow} className="bg-white p-7 rounded-3xl border border-outline-variant/10 h-auto">
            <div className="flex justify-between items-start mb-6">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", `bg-${stat.glow === 'blue' ? 'primary' : stat.glow === 'green' ? 'secondary' : 'amber'}-500/10`, `text-${stat.glow === 'blue' ? 'primary' : stat.glow === 'green' ? 'secondary' : 'amber'}-500`)}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-black text-secondary flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} />
                {stat.growth}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1.5 opacity-60">{stat.label}</p>
              <h4 className="text-3xl font-headline font-black text-primary tracking-tight">{stat.value}</h4>
            </div>
          </GlowCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* User Management Quick View */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-headline font-bold text-primary">Recent User Registrations</h2>
            <button onClick={() => setActiveTab('Users')} className="text-sm font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="bg-white rounded-3xl border border-outline-variant/10 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-outline-variant/10 bg-surface-container-lowest flex items-center gap-4">
              <Search size={18} className="text-on-surface-variant" />
              <input type="text" placeholder="Search users..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
            <ul className="divide-y divide-outline-variant/10">
              {recentUsers.map((user, i) => (
                <li key={i} className="p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-primary">{user.name}</p>
                      <p className="text-xs text-on-surface-variant">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                     <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                        user.role === 'Creator' ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                     )}>
                        {user.role}
                     </span>
                     <span className={cn(
                        "text-[10px] font-bold flex items-center gap-1",
                        user.status === 'Active' ? 'text-green-600' : user.status === 'Suspended' ? 'text-red-600' : 'text-amber-600'
                     )}>
                       {user.status === 'Active' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                       {user.status}
                     </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payouts Quick View */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-headline font-bold text-primary">Pending Payouts</h2>
            <button onClick={() => setActiveTab('Payouts')} className="text-sm font-bold text-primary hover:underline">Manage</button>
          </div>
          <div className="space-y-4">
            {pendingPayouts.map((payout, i) => (
              <GlowCard key={i} glowColor="orange" customSize={true} className="bg-white p-5 rounded-2xl border border-outline-variant/10 flex items-center justify-between h-auto">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
                     <CreditCard size={20} />
                   </div>
                   <div>
                     <p className="font-bold text-sm text-primary">{payout.creator}</p>
                     <p className="text-xs text-on-surface-variant">{payout.method}</p>
                   </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                   <p className="font-black text-primary">{payout.amount}</p>
                   <div className="flex gap-2">
                     <button className="text-[10px] font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors">Approve</button>
                     <button className="text-[10px] font-bold bg-surface-container text-on-surface-variant px-3 py-1.5 rounded-lg hover:bg-surface-container-highest transition-colors">Review</button>
                   </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-outline-variant/10 border-dashed text-center">
      <ShieldCheck size={64} className="text-primary/20 mb-6" />
      <h3 className="text-2xl font-headline font-bold text-primary mb-2">{title} Management</h3>
      <p className="text-on-surface-variant max-w-md">Detailed controls for {title.toLowerCase()} will be displayed here. Only users with Admin or Superadmin roles can make changes.</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface-container-low">
      <aside className="w-72 bg-white border-r border-outline-variant/10 hidden lg:flex flex-col p-8 sticky top-20 h-[calc(100vh-80px)] z-10">
        <div className="space-y-12 flex-grow">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-4 flex items-center gap-2">
               <ShieldCheck size={16} className="text-primary" /> Admin Center
            </h3>
            <nav className="space-y-2">
              {[
                { name: 'Overview', icon: Activity },
                { name: 'Users', icon: Users },
                { name: 'Videos', icon: Video },
                { name: 'Courses', icon: BookOpen },
                { name: 'Payouts', icon: DollarSign },
                { name: 'Settings', icon: SettingsIcon }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all",
                    activeTab === item.name ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                  )}
                >
                  <item.icon size={20} /> {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      <main className="flex-grow p-8 lg:p-12 space-y-12 overflow-x-hidden relative">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-headline font-black text-primary mb-2 flex items-center gap-3">
               Platform Administration
               <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-md uppercase tracking-widest">Restricted</span>
            </h1>
            <p className="text-on-surface-variant">Monitor health, manage users, and control operations.</p>
          </div>
          <div className="flex gap-4">
             <button className="bg-white border border-outline-variant/20 text-primary px-6 py-3 rounded-xl font-bold hover:bg-surface-container-lowest transition-all flex items-center gap-2">
               Export Data
             </button>
          </div>
        </header>

        {activeTab === 'Overview' ? renderOverview() : 
         activeTab === 'Videos' ? (
           <div className="space-y-8">
             <div className="flex justify-between items-center">
               <div>
                 <h2 className="text-2xl font-headline font-bold text-primary">Video Library</h2>
                 <p className="text-on-surface-variant">Upload and manage educational videos for students.</p>
               </div>
               <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                 <Upload size={18} /> Upload New Video
               </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                 { title: 'Introduction to AI Ethics', duration: '15:20', course: 'AI Mastery', date: 'Oct 12, 2024' },
                 { title: 'Advanced Prompt Engineering', duration: '45:10', course: 'Prompt Pro', date: 'Oct 10, 2024' },
                 { title: 'Data Cleaning with Python', duration: '32:45', course: 'Data Science 101', date: 'Oct 08, 2024' },
               ].map((video, i) => (
                 <GlowCard key={i} glowColor="blue" className="bg-white p-6 rounded-2xl border border-outline-variant/10 h-auto space-y-4">
                   <div className="aspect-video bg-surface-container-low rounded-xl flex items-center justify-center relative group overflow-hidden">
                      <Play size={40} className="text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-md font-bold">
                        {video.duration}
                      </div>
                   </div>
                   <div>
                     <h4 className="font-bold text-primary mb-1">{video.title}</h4>
                     <p className="text-xs text-on-surface-variant mb-4">{video.course}</p>
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                        <span>{video.date}</span>
                        <div className="flex gap-2">
                          <button className="text-primary hover:underline">Edit</button>
                          <button className="text-red-500 hover:underline">Delete</button>
                        </div>
                     </div>
                   </div>
                 </GlowCard>
               ))}
             </div>
           </div>
         ) : activeTab === 'Courses' ? (
           <div className="space-y-8">
             <div className="flex justify-between items-center">
               <div>
                 <h2 className="text-2xl font-headline font-bold text-primary">Course Management</h2>
                 <p className="text-on-surface-variant">Create and publish official platform courses.</p>
               </div>
               <button onClick={() => setShowUploadModal(true)} className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                 <Plus size={18} /> Create Course
               </button>
             </div>
             
             {adminCourses.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-16 bg-surface-container-lowest rounded-3xl border border-outline-variant/10 border-dashed">
                 <BookOpen size={48} className="text-primary/20 mb-4" />
                 <p className="text-on-surface-variant font-medium">Click "Create Course" to add the first platform course.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {adminCourses.map((course) => (
                   <GlowCard key={course.id} glowColor="purple" className="bg-white overflow-hidden flex flex-col h-auto">
                     <div className="relative h-40 overflow-hidden group">
                       <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     </div>
                     <div className="p-6 space-y-4 flex-grow">
                       <h3 className="text-lg font-headline font-bold text-primary mb-1 line-clamp-1">{course.title}</h3>
                       <div className="flex gap-2">
                         <button className="flex-grow py-2 bg-surface-container-high rounded-xl text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Edit</button>
                         <button className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><XCircle size={16} /></button>
                       </div>
                     </div>
                   </GlowCard>
                 ))}
               </div>
             )}
           </div>
         ) : renderPlaceholder(activeTab)}

         {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
              <div className="md:w-72 bg-primary p-12 text-white space-y-12 shrink-0">
                <h3 className="text-2xl font-headline font-black mb-2 tracking-tight line-clamp-2 leading-tight">Admin Course Creator</h3>
                <p className="text-white/70 text-sm">Upload official curriculum content for students.</p>
              </div>
              <div className="flex-grow p-8 md:p-12 space-y-8 relative overflow-y-auto">
                <button onClick={() => setShowUploadModal(false)} className="absolute top-8 right-8 text-on-surface-variant hover:text-primary">
                  <XCircle size={24} />
                </button>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-headline font-black text-primary mb-4">Basic Details</h4>
                    <div className="space-y-4">
                      <input 
                        placeholder="Course Title" 
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        className="w-full px-5 py-4 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold" 
                      />
                      <textarea placeholder="Course Description... what will students learn?" rows={3} className="w-full px-5 py-4 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 resize-none"></textarea>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-outline-variant/10">
                    <h4 className="text-xl font-headline font-black text-primary mb-4">Course Content</h4>
                    <div className="flex gap-4 mb-6">
                      <button 
                        type="button"
                        onClick={() => setCourseType('video')}
                        className={cn("flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all", courseType === 'video' ? "bg-primary text-white border-primary" : "bg-transparent text-on-surface-variant border-outline-variant/20 hover:border-primary/50")}
                      >
                        <Video size={18} /> Video Lesson
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCourseType('text')}
                        className={cn("flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all", courseType === 'text' ? "bg-primary text-white border-primary" : "bg-transparent text-on-surface-variant border-outline-variant/20 hover:border-primary/50")}
                      >
                        <FileText size={18} /> Text Article
                      </button>
                    </div>

                    {courseType === 'video' ? (
                      <div className="space-y-4">
                        <div 
                          onClick={() => document.getElementById('admin-video-upload')?.click()}
                          className="border-2 border-dashed border-outline-variant/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer bg-surface-container-lowest"
                        >
                          <Upload size={32} className="text-primary/40 mb-4" />
                          <p className="font-bold text-primary">Upload Video File</p>
                          <p className="text-xs text-on-surface-variant mt-1">MP4, WebM or MOV (Max 2GB)</p>
                          <input id="admin-video-upload" type="file" className="hidden" accept="video/*" onChange={(e) => window.showToast("Video selected: " + e.target.files?.[0]?.name)} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <textarea 
                          placeholder="Write your comprehensive text lesson here. You can use markdown for formatting..." 
                          rows={10} 
                          className="w-full px-5 py-4 bg-surface-container-low rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-mono text-sm"
                        ></textarea>
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-6 border-t border-outline-variant/10 flex justify-between items-center mt-4">
                  <button onClick={() => setShowUploadModal(false)} className="text-on-surface-variant font-bold hover:text-primary px-4 py-2">Cancel</button>
                  <button 
                    onClick={() => {
                      if (newCourseTitle.trim()) {
                        setAdminCourses([...adminCourses, {
                          id: Date.now().toString(),
                          title: newCourseTitle,
                          thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80'
                        }]);
                        setNewCourseTitle('');
                        window.showToast?.("Course published successfully!");
                      } else {
                        window.showToast?.("Please enter a course title.");
                      }
                      setShowUploadModal(false);
                    }} 
                    className="bg-secondary text-white px-8 py-3 rounded-xl font-black flex items-center gap-2"
                  >
                    <CheckCircle size={18} /> Publish Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
