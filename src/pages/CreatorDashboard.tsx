import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  DollarSign, 
  BookOpen, 
  PlayCircle, 
  ArrowUpRight, 
  Plus, 
  Trash2, 
  Edit3, 
  Video, 
  Layout, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  TrendingUp,
  BarChart3,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GlowCard } from '../components/ui/spotlight-card';
import { COURSES } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [courseType, setCourseType] = useState('video');
  const [courseModules, setCourseModules] = useState([{ title: '', type: 'video', content: '', file: null }]);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [creatorCourses, setCreatorCourses] = useState<any[]>([]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const stats = [
    { label: 'Total Revenue', value: '₦0', growth: '0%', icon: DollarSign, glow: 'green' as const },
    { label: 'Enrollments', value: '0', growth: '0%', icon: Users, glow: 'blue' as const },
    { label: 'Avg. Rating', value: '0.0', growth: '0.0', icon: BarChart3, glow: 'orange' as const },
    { label: 'Watch Time', value: '0 hrs', growth: '0%', icon: PlayCircle, glow: 'purple' as const },
  ];


  const renderOverview = () => (
    <div className="space-y-12">
      {/* Stats Grid */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="flex justify-between items-center">
            <h2 className="text-xl font-headline font-bold text-primary">Sales Performance</h2>
          </div>
          <GlowCard glowColor="blue" className="bg-white p-8 rounded-3xl border border-outline-variant/10 h-80 flex flex-col justify-end gap-4 overflow-hidden relative">
            <div className="absolute top-8 left-8">
              <p className="text-4xl font-headline font-black text-primary">₦0</p>
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Earnings this month</p>
            </div>
            <div className="flex items-end justify-between h-40 gap-3">
              {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((h, i) => (
                <div key={i} className="flex-grow bg-primary/5 rounded-t-lg group relative h-full flex flex-col justify-end">
                   <div className="bg-primary/20 group-hover:bg-primary transition-all duration-500 rounded-t-lg" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </GlowCard>
        </div>

        <div className="space-y-8">
          <h2 className="text-xl font-headline font-bold text-primary">Top Courses</h2>
          <div className="space-y-4">
            {creatorCourses.map((course) => (
              <div key={course.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-outline-variant/10 hover:border-primary/20 transition-all group">
                <img src={course.thumbnail} className="w-16 h-16 rounded-xl object-cover" alt={course.title} />
                <div className="flex-grow">
                  <h4 className="text-sm font-bold text-primary line-clamp-1">{course.title}</h4>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{course.reviewsCount} students</span>
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest">₦{course.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-headline font-bold text-primary">Your Courses</h2>
        <button onClick={() => setShowUploadModal(true)} className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
          <Plus size={20} /> Create Course
        </button>
      </div>

      {creatorCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-surface-container-lowest rounded-3xl border border-outline-variant/10 border-dashed">
          <BookOpen size={48} className="text-primary/20 mb-4" />
          <p className="text-on-surface-variant font-medium">You haven't uploaded any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creatorCourses.map((course) => (
            <GlowCard key={course.id} glowColor="blue" className="bg-white overflow-hidden flex flex-col h-auto">
              <div className="relative h-48 overflow-hidden group">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8 space-y-6 flex-grow">
                <h3 className="text-lg font-headline font-bold text-primary mb-2 line-clamp-1">{course.title}</h3>
                <div className="flex gap-2">
                  <button className="flex-grow py-3 bg-surface-container-high rounded-xl text-xs font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                    <Edit3 size={16} /> Edit
                  </button>
                  <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface-container-low">
      <aside className="w-72 bg-white border-r border-outline-variant/10 hidden lg:flex flex-col p-8 sticky top-20 h-[calc(100vh-80px)]">
        <div className="space-y-12 flex-grow">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-4">Creator Hub</h3>
            <nav className="space-y-2">
              {[
                { name: 'Overview', icon: Layout },
                { name: 'Courses', icon: BookOpen },
                { name: 'Enrollments', icon: Users },
                { name: 'Payouts', icon: DollarSign },
                { name: 'Analytics', icon: BarChart3 }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all",
                    activeTab === item.name ? "bg-primary text-white" : "text-on-surface-variant hover:text-primary"
                  )}
                >
                  <item.icon size={20} /> {item.name}
                </button>
              ))}
            </nav>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-grow p-8 lg:p-12 space-y-12 overflow-x-hidden">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary mb-2">Creator Hub</h1>
            <p className="text-on-surface-variant">Your engine for impact and income.</p>
          </div>
          <button onClick={() => setShowUploadModal(true)} className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black flex items-center gap-2">
            <Upload size={18} /> Launch New Course
          </button>
        </header>

        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Courses' && renderCourses()}

        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <div className="md:w-72 bg-primary p-12 text-white space-y-12">
                <h3 className="text-2xl font-headline font-black mb-2 tracking-tight line-clamp-2 leading-tight">Launch Your Genius</h3>
              </div>
              <div className="flex-grow p-12 space-y-8 relative">
                <button onClick={() => setShowUploadModal(false)} className="absolute top-8 right-8 text-on-surface-variant hover:text-primary">
                  <AlertCircle size={24} />
                </button>
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
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
                          onClick={() => document.getElementById('creator-video-upload')?.click()}
                          className="border-2 border-dashed border-outline-variant/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer bg-surface-container-lowest"
                        >
                          <Upload size={32} className="text-primary/40 mb-4" />
                          <p className="font-bold text-primary">Upload Video File</p>
                          <p className="text-xs text-on-surface-variant mt-1">MP4, WebM or MOV (Max 2GB)</p>
                          <input id="creator-video-upload" type="file" className="hidden" accept="video/*" onChange={(e) => window.showToast("Video selected: " + e.target.files?.[0]?.name)} />
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
                        setCreatorCourses([...creatorCourses, {
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
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
