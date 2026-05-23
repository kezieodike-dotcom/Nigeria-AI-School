import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Users, 
  DollarSign, 
  BookOpen, 
  PlayCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus, 
  Trash2, 
  Edit3, 
  Video, 
  Layout, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  BarChart3,
  FileText,
  Image as ImageIcon,
  LogOut,
  Star,
  Eye,
  Clock,
  Wallet,
  CreditCard,
  Download,
  MoreVertical,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Award,
  MessageSquare,
  Zap,
  Menu,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GlowCard } from '../components/ui/spotlight-card';
import { COURSES } from '../constants';
import { useAuth } from '../contexts/AuthContext';

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  students: number;
  rating: number;
  reviewsCount: number;
  status: 'published' | 'draft';
  createdAt: string;
  revenue: number;
  views: number;
}

interface Enrollment {
  id: string;
  studentName: string;
  studentAvatar: string;
  courseTitle: string;
  amount: number;
  date: string;
  status: 'completed' | 'in-progress';
}

interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed';
  date: string;
  method: string;
}

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [courseType, setCourseType] = useState('video');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Enhanced mock data
  const [creatorCourses, setCreatorCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Derived stats
  const totalEnrollments = enrollments.length;
  const totalRevenue = enrollments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const averageRating = creatorCourses.length > 0 
    ? (creatorCourses.reduce((acc, curr) => acc + (curr.rating || 0), 0) / creatorCourses.length).toFixed(1)
    : '0.0';

  const dynamicStats = {
    revenue: { value: `₦${totalRevenue.toLocaleString()}`, growth: '+12.5%', trend: 'up' },
    enrollments: { value: totalEnrollments.toLocaleString(), growth: '+18.2%', trend: 'up' },
    rating: { value: averageRating, growth: '+0.2', trend: 'up' },
    watchTime: { value: '1,240h', growth: '+142h', trend: 'up' }
  };

  React.useEffect(() => {
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;
    setLoading(true);
    await Promise.all([
      fetchCourses(),
      fetchEnrollments(),
      fetchPayouts()
    ]);
    setLoading(false);
  };

  const fetchCourses = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, thumbnail, price, students, rating, status, created_at, revenue, views, video_url, type')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedCourses = (data || []).map(course => ({
        id: course.id,
        title: course.title,
        thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
        price: course.price || 0,
        students: course.students || 0,
        rating: course.rating || 0,
        reviewsCount: 0,
        status: course.status || 'published',
        createdAt: course.created_at,
        revenue: course.revenue || 0,
        views: course.views || 0,
        videoUrl: course.video_url,
        type: course.type || 'video'
      }));

      setCreatorCourses(formattedCourses);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
    }
  };
  const fetchEnrollments = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, courses!inner(title, instructor_id), profiles:student_id(first_name, last_name, avatar_url)')
        .eq('courses.instructor_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (!error && data) {
        setEnrollments(data.map((enrollment) => {
          const studentName = enrollment.profiles
            ? `${enrollment.profiles.first_name || ''} ${enrollment.profiles.last_name || ''}`.trim() || 'Student'
            : 'Student';

          return {
            ...enrollment,
            studentName,
            studentAvatar: enrollment.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=1E40AF&color=fff`,
            courseTitle: enrollment.courses?.title || 'Course',
          };
        }));
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const fetchPayouts = async () => {
    const { data, error } = await supabase
      .from('payouts')
      .select('*')
      .eq('creator_id', user?.id)
      .order('created_at', { ascending: false });
    if (!error && data) setPayouts(data);
  };



  const chartData = [
    { label: 'Mon', revenue: 45000, enrollments: 3 },
    { label: 'Tue', revenue: 65000, enrollments: 5 },
    { label: 'Wed', revenue: 35000, enrollments: 2 },
    { label: 'Thu', revenue: 85000, enrollments: 7 },
    { label: 'Fri', revenue: 55000, enrollments: 4 },
    { label: 'Sat', revenue: 95000, enrollments: 8 },
    { label: 'Sun', revenue: 75000, enrollments: 6 },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const sidebarItems = [
    { name: 'Overview', icon: Layout },
    { name: 'Courses', icon: BookOpen },
    { name: 'Enrollments', icon: Users },
    { name: 'Payouts', icon: Wallet },
    { name: 'Analytics', icon: BarChart3 }
  ];

  const toggleCardExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Overview Tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Zap size={16} className="sm:w-5 sm:h-5 text-yellow-300" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Creator Dashboard</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-headline font-black mb-1 sm:mb-2">
            Welcome back, {profile?.first_name || 'Creator'}!
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-xl">
            You're doing great! Your courses have earned ₦{totalRevenue.toLocaleString()} this month. Keep creating amazing content.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
            <button 
              onClick={() => setShowUploadModal(true)} 
              className="bg-white text-primary px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform text-sm sm:text-base"
            >
              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> 
              <span className="hidden sm:inline">Create New Course</span>
              <span className="sm:hidden">New Course</span>
            </button>
            <Link 
              to="/creator-profile" 
              className="bg-white/20 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/30 transition-colors text-sm sm:text-base"
            >
              <Eye size={16} className="sm:w-[18px] sm:h-[18px]" /> 
              <span className="hidden sm:inline">View Public Profile</span>
              <span className="sm:hidden">View Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[
          { label: 'Total Revenue', value: dynamicStats.revenue.value, growth: dynamicStats.revenue.growth, trend: dynamicStats.revenue.trend, icon: DollarSign, color: 'green' },
          { label: 'Total Students', value: dynamicStats.enrollments.value, growth: dynamicStats.enrollments.growth, trend: dynamicStats.enrollments.trend, icon: Users, color: 'blue' },
          { label: 'Avg. Rating', value: dynamicStats.rating.value, growth: dynamicStats.rating.growth, trend: dynamicStats.rating.trend, icon: Star, color: 'amber' },
          { label: 'Watch Time', value: dynamicStats.watchTime.value, growth: dynamicStats.watchTime.growth, trend: dynamicStats.watchTime.trend, icon: Clock, color: 'purple' }
        ].map((stat, i) => (
          <GlowCard key={i} glowColor={stat.color as any} className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border border-outline-variant/10 h-auto">
            <div className="flex justify-between items-start mb-2 sm:mb-4">
              <div className={cn("w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center", 
                stat.color === 'green' && "bg-green-500/10 text-green-600",
                stat.color === 'blue' && "bg-primary/10 text-primary",
                stat.color === 'amber' && "bg-amber-500/10 text-amber-600",
                stat.color === 'purple' && "bg-purple-500/10 text-purple-600"
              )}>
                <stat.icon size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
              <span className={cn("text-[10px] sm:text-xs font-bold flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded",
                stat.trend === 'up' ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
              )}>
                {stat.trend === 'up' ? <ArrowUpRight size={10} className="sm:w-3 sm:h-3" /> : <ArrowDownRight size={10} className="sm:w-3 sm:h-3" />}
                <span className="hidden sm:inline">{stat.growth}</span>
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-0.5 sm:mb-1 truncate">{stat.label}</p>
            <h4 className="text-lg sm:text-xl lg:text-2xl font-headline font-black text-primary">{stat.value}</h4>
          </GlowCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-headline font-bold text-primary">Revenue Overview</h2>
            <div className="flex gap-1 sm:gap-2">
              {['7d', '30d', '90d', '1y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={cn(
                    "px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all",
                    selectedTimeRange === range 
                      ? "bg-primary text-white" 
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  )}
                >
                  {range === '7d' ? 'Week' : range === '30d' ? 'Month' : range === '90d' ? 'Quarter' : 'Year'}
                </button>
              ))}
            </div>
          </div>
          <GlowCard glowColor="blue" className="bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-outline-variant/10">
            <div className="flex items-end justify-between h-36 sm:h-40 lg:h-48 gap-2 sm:gap-3">
              {chartData.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 sm:gap-2">
                  <div className="w-full flex flex-col justify-end gap-1 h-24 sm:h-28 lg:h-36">
                    <div 
                      className="bg-primary/20 hover:bg-primary transition-all duration-300 rounded-t-md sm:rounded-t-lg w-full relative group cursor-pointer"
                      style={{ height: `${(day.revenue / 95000) * 100}%` }}
                    >
                      <div className="absolute -top-6 sm:-top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ₦{day.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-on-surface-variant">{day.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-outline-variant/10 gap-2 sm:gap-0">
              <div>
                <p className="text-xs sm:text-sm text-on-surface-variant">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-headline font-black text-primary">₦425,500</p>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-green-600 bg-green-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                <TrendingUp size={14} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-bold">+22.5% vs last week</span>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Recent Enrollments */}
          <div className="space-y-2 sm:space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm sm:text-lg font-headline font-bold text-primary">Recent Enrollments</h2>
              <button onClick={() => setActiveTab('Enrollments')} className="text-xs sm:text-sm font-bold text-secondary hover:underline">View All</button>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl border border-outline-variant/10 p-3 sm:p-4 space-y-2 sm:space-y-4">
              {enrollments.slice(0, 4).map((enrollment) => (
                <div key={enrollment.id} className="flex items-center gap-2 sm:gap-3">
                  <img src={enrollment.studentAvatar} alt={enrollment.studentName} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-primary truncate">{enrollment.studentName}</p>
                    <p className="text-[10px] sm:text-xs text-on-surface-variant truncate">{enrollment.courseTitle}</p>
                  </div>
                  <span className="text-[10px] sm:text-xs font-black text-secondary flex-shrink-0">₦{enrollment.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 sm:space-y-4">
            <h2 className="text-sm sm:text-lg font-headline font-bold text-primary">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
              <button onClick={() => setShowUploadModal(true)} className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-outline-variant/10 hover:border-primary/30 hover:shadow-lg transition-all text-left group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  <Video size={16} className="sm:w-5 sm:h-5 text-primary" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-primary">New Course</p>
              </button>
              <button className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-outline-variant/10 hover:border-secondary/30 hover:shadow-lg transition-all text-left group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary/10 rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  <BarChart3 size={16} className="sm:w-5 sm:h-5 text-secondary" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-primary">Analytics</p>
              </button>
              <button className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-outline-variant/10 hover:border-amber-500/30 hover:shadow-lg transition-all text-left group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  <MessageSquare size={16} className="sm:w-5 sm:h-5 text-amber-600" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-primary">Reviews</p>
              </button>
              <button onClick={() => setActiveTab('Payouts')} className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-outline-variant/10 hover:border-green-500/30 hover:shadow-lg transition-all text-left group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  <Wallet size={16} className="sm:w-5 sm:h-5 text-green-600" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-primary">Withdraw</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Courses */}
      <div className="space-y-3 sm:space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-headline font-bold text-primary">Top Performing Courses</h2>
          <button onClick={() => setActiveTab('Courses')} className="text-xs sm:text-sm font-bold text-secondary hover:underline">Manage All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {creatorCourses.slice(0, 3).map((course, index) => (
            <GlowCard key={course.id} glowColor="blue" className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-outline-variant/10 h-auto group">
              <div className="relative h-32 sm:h-36 lg:h-40 overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                  <span className="text-xs sm:text-sm font-black text-primary">#{index + 1}</span>
                </div>
              </div>
              <div className="p-3 sm:p-5 space-y-2 sm:space-y-4">
                <h3 className="font-bold text-primary text-sm sm:text-base line-clamp-1">{course.title}</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-black text-on-surface-variant uppercase">Students</p>
                    <p className="text-base sm:text-lg font-black text-primary">{course.students}</p>
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-black text-on-surface-variant uppercase">Revenue</p>
                    <p className="text-base sm:text-lg font-black text-green-600">₦{(course.revenue / 1000).toFixed(0)}K</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs sm:text-sm font-bold text-primary">{course.rating}</span>
                  <span className="text-[10px] sm:text-xs text-on-surface-variant">({course.reviewsCount} reviews)</span>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </div>
  );

  // Courses Tab
  const renderCourses = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-headline font-bold text-primary">Your Courses</h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">Manage and track your course content</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            <input 
              type="text" 
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-white rounded-lg sm:rounded-xl border border-outline-variant/10 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm font-bold" 
            />
          </div>
          <button 
            onClick={() => setShowUploadModal(true)} 
            className="bg-primary text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform text-sm"
          >
            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> 
            <span className="hidden sm:inline">New Course</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {[
          { label: 'Published', value: creatorCourses.filter(c => c.status === 'published').length, color: 'green' },
          { label: 'Drafts', value: creatorCourses.filter(c => c.status === 'draft').length, color: 'amber' },
          { label: 'Total Students', value: creatorCourses.reduce((acc, c) => acc + c.students, 0), color: 'blue' },
          { label: 'Avg. Rating', value: '4.8', color: 'purple' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-outline-variant/10">
            <p className="text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase mb-0.5 sm:mb-1">{stat.label}</p>
            <p className={cn("text-xl sm:text-2xl font-headline font-black",
              stat.color === 'green' && "text-green-600",
              stat.color === 'amber' && "text-amber-600",
              stat.color === 'blue' && "text-primary",
              stat.color === 'purple' && "text-purple-600"
            )}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Course Grid */}
      {creatorCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 bg-surface-container-lowest rounded-2xl sm:rounded-3xl border-2 border-dashed border-outline-variant/20">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <BookOpen size={24} className="sm:w-8 sm:h-8 text-primary" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-primary mb-1 sm:mb-2">No courses yet</h3>
          <p className="text-xs sm:text-sm text-on-surface-variant mb-4 sm:mb-6">Create your first course and start earning</p>
          <button 
            onClick={() => setShowUploadModal(true)} 
            className="bg-primary text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold flex items-center gap-2 text-sm sm:text-base"
          >
            <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> Create Your First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {creatorCourses
            .filter(course => course.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((course) => (
            <GlowCard key={course.id} glowColor="blue" className="bg-white overflow-hidden flex flex-col h-auto border border-outline-variant/10 group">
              <div className="relative h-36 sm:h-40 lg:h-48 overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1 sm:gap-2">
                  <button className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-md sm:rounded-lg hover:bg-white transition-colors">
                    <Edit3 size={14} className="sm:w-4 sm:h-4 text-primary" />
                  </button>
                  <button className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-md sm:rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 size={14} className="sm:w-4 sm:h-4 text-red-500" />
                  </button>
                </div>
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                  <span className={cn("px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold",
                    course.status === 'published' ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                  )}>
                    {course.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="p-3 sm:p-5 space-y-2 sm:space-y-4 flex-grow">
                <h3 className="font-bold text-primary text-sm sm:text-base line-clamp-1">{course.title}</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-on-surface-variant">
                    <Users size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>{course.students} students</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-on-surface-variant">
                    <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span>{course.views} views</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-outline-variant/10">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs sm:text-sm font-bold text-primary">{course.rating}</span>
                  </div>
                  <span className="text-base sm:text-lg font-black text-secondary">₦{course.price.toLocaleString()}</span>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      )}
    </div>
  );

  // Enrollments Tab
  const renderEnrollments = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-headline font-bold text-primary">Student Enrollments</h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">Track your students and their progress</p>
        </div>
        <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white rounded-lg sm:rounded-xl border border-outline-variant/10 font-bold text-on-surface-variant hover:border-primary/30 transition-colors text-sm">
          <Download size={16} className="sm:w-[18px] sm:h-[18px]" /> 
          <span className="hidden sm:inline">Export CSV</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>

      {/* Enrollment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <GlowCard glowColor="blue" className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-outline-variant/10 h-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Users size={20} className="sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-black text-on-surface-variant uppercase">Total Enrollments</p>
              <p className="text-xl sm:text-2xl font-headline font-black text-primary">{totalEnrollments}</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard glowColor="green" className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-outline-variant/10 h-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle size={20} className="sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-black text-on-surface-variant uppercase">Completed</p>
              <p className="text-xl sm:text-2xl font-headline font-black text-green-600">0</p>
            </div>
          </div>
        </GlowCard>
        <GlowCard glowColor="amber" className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-outline-variant/10 h-auto">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <PlayCircle size={20} className="sm:w-6 sm:h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-black text-on-surface-variant uppercase">In Progress</p>
              <p className="text-xl sm:text-2xl font-headline font-black text-amber-600">{totalEnrollments}</p>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-outline-variant/10 overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-outline-variant/10 flex justify-between items-center">
          <h3 className="font-bold text-primary text-sm sm:text-base">Recent Enrollments</h3>
          <button className="p-1.5 sm:p-2 hover:bg-surface-container-low rounded-lg transition-colors">
            <Filter size={16} className="sm:w-[18px] sm:h-[18px] text-on-surface-variant" />
          </button>
        </div>
        <div className="divide-y divide-outline-variant/10 overflow-x-auto">
          <div className="min-w-full">
            {enrollments.map((enrollment) => {
              const studentName = enrollment.profiles ? `${enrollment.profiles.first_name} ${enrollment.profiles.last_name}` : 'Student';
              const studentAvatar = enrollment.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${studentName}&background=1E40AF&color=fff`;
              
              return (
                <div key={enrollment.id} className="p-3 sm:p-4 flex items-center gap-2 sm:gap-4 hover:bg-surface-container-low/50 transition-colors">
                  <img src={studentAvatar} alt={studentName} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-bold text-primary truncate">{studentName}</p>
                    <p className="text-[10px] sm:text-xs text-on-surface-variant truncate">{enrollment.courses?.title}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm sm:text-base font-black text-primary">₦{enrollment.amount.toLocaleString()}</p>
                    <p className="text-[10px] sm:text-xs text-on-surface-variant">{new Date(enrollment.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
            {enrollments.length === 0 && (
              <div className="p-12 text-center text-on-surface-variant">No recent enrollments.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Payouts Tab
  const renderPayouts = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-headline font-bold text-primary">Payouts & Earnings</h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">Manage your earnings and withdrawals</p>
        </div>
        <button className="bg-secondary text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold flex items-center gap-1.5 sm:gap-2 hover:scale-105 transition-transform text-sm">
          <Wallet size={16} className="sm:w-[18px] sm:h-[18px]" /> 
          <span className="hidden sm:inline">Withdraw Funds</span>
          <span className="sm:hidden">Withdraw</span>
        </button>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <GlowCard glowColor="green" className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-outline-variant/10 h-auto">
          <p className="text-[9px] sm:text-[10px] font-black text-on-surface-variant uppercase mb-1 sm:mb-2">Available Balance</p>
          <p className="text-2xl sm:text-3xl font-headline font-black text-green-600 mb-1 sm:mb-2">₦520,000</p>
          <p className="text-xs sm:text-sm text-on-surface-variant">Ready to withdraw</p>
        </GlowCard>
        <GlowCard glowColor="blue" className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-outline-variant/10 h-auto">
          <p className="text-[9px] sm:text-[10px] font-black text-on-surface-variant uppercase mb-1 sm:mb-2">Lifetime Earnings</p>
          <p className="text-2xl sm:text-3xl font-headline font-black text-primary mb-1 sm:mb-2">₦4.25M</p>
          <p className="text-xs sm:text-sm text-on-surface-variant">Since you started</p>
        </GlowCard>
        <GlowCard glowColor="purple" className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-outline-variant/10 h-auto">
          <p className="text-[9px] sm:text-[10px] font-black text-on-surface-variant uppercase mb-1 sm:mb-2">Pending Clearance</p>
          <p className="text-2xl sm:text-3xl font-headline font-black text-purple-600 mb-1 sm:mb-2">₦85,000</p>
          <p className="text-xs sm:text-sm text-on-surface-variant">Will be available in 7 days</p>
        </GlowCard>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-outline-variant/10 overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-outline-variant/10">
          <h3 className="font-bold text-primary text-sm sm:text-base">Payout History</h3>
        </div>
        <div className="divide-y divide-outline-variant/10 overflow-x-auto">
          <div className="min-w-full">
            {payouts.map((payout) => (
              <div key={payout.id} className="p-3 sm:p-4 flex items-center justify-between hover:bg-surface-container-low/50 transition-colors">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0",
                    payout.status === 'completed' ? "bg-green-100" : 
                    payout.status === 'processing' ? "bg-amber-100" : "bg-surface-container-low"
                  )}>
                    {payout.status === 'completed' ? <CheckCircle size={18} className="sm:w-5 sm:h-5 text-green-600" /> :
                     payout.status === 'processing' ? <Clock size={18} className="sm:w-5 sm:h-5 text-amber-600" /> :
                     <Wallet size={18} className="sm:w-5 sm:h-5 text-on-surface-variant" />}
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm sm:text-base">{payout.amount > 0 ? `₦${payout.amount.toLocaleString()}` : 'Upcoming Payout'}</p>
                    <p className="text-xs sm:text-sm text-on-surface-variant">{payout.method} • {new Date(payout.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={cn("px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold capitalize flex-shrink-0",
                  payout.status === 'completed' ? "bg-green-100 text-green-700" : 
                  payout.status === 'processing' ? "bg-amber-100 text-amber-700" : 
                  "bg-surface-container-low text-on-surface-variant"
                )}>
                  {payout.status}
                </span>
              </div>
            ))}
            {payouts.length === 0 && (
              <div className="p-12 text-center text-on-surface-variant">No payout history found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Bank Account Info */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-outline-variant/10 p-4 sm:p-6">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="font-bold text-primary text-sm sm:text-base">Bank Account</h3>
          <button className="text-xs sm:text-sm font-bold text-secondary hover:underline">Edit</button>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-surface-container-low rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <CreditCard size={20} className="sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <p className="font-bold text-primary text-sm sm:text-base">Guaranty Trust Bank</p>
            <p className="text-xs sm:text-sm text-on-surface-variant">**** **** **** 4582 • Chikezie Odike</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Analytics Tab
  const renderAnalytics = () => (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-headline font-bold text-primary">Analytics & Insights</h2>
        <p className="text-xs sm:text-sm text-on-surface-variant">Deep dive into your performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {[
          { label: 'Course Views', value: '4.2K', change: '+18%', icon: Eye },
          { label: 'Conversion Rate', value: '8.5%', change: '+2.3%', icon: TrendingUp },
          { label: 'Avg. Watch Time', value: '45 min', change: '+12%', icon: Clock },
          { label: 'Student Reviews', value: '145', change: '+28', icon: Star }
        ].map((metric, i) => (
          <div key={i} className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-outline-variant/10">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <metric.icon size={14} className="sm:w-[18px] sm:h-[18px] text-primary" />
              <span className="text-[10px] sm:text-xs font-bold text-on-surface-variant uppercase">{metric.label}</span>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-lg sm:text-2xl font-headline font-black text-primary">{metric.value}</p>
              <span className="text-[10px] sm:text-xs font-bold text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">{metric.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-outline-variant/10 p-4 sm:p-6">
          <h3 className="font-bold text-primary text-sm sm:text-base mb-4 sm:mb-6">Traffic Sources</h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              { source: 'Direct', percentage: 45, color: 'bg-primary' },
              { source: 'Social Media', percentage: 30, color: 'bg-secondary' },
              { source: 'Referrals', percentage: 15, color: 'bg-amber-500' },
              { source: 'Search', percentage: 10, color: 'bg-purple-500' }
            ].map((item) => (
              <div key={item.source}>
                <div className="flex justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                  <span className="font-bold text-primary">{item.source}</span>
                  <span className="text-on-surface-variant">{item.percentage}%</span>
                </div>
                <div className="h-1.5 sm:h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-outline-variant/10 p-4 sm:p-6">
          <h3 className="font-bold text-primary text-sm sm:text-base mb-4 sm:mb-6">Top Countries</h3>
          <div className="space-y-3 sm:space-y-4">
            {[
              { country: 'Nigeria', students: 89, flag: '🇳🇬' },
              { country: 'Ghana', students: 34, flag: '🇬🇭' },
              { country: 'Kenya', students: 28, flag: '🇰🇪' },
              { country: 'South Africa', students: 21, flag: '🇿🇦' },
              { country: 'United Kingdom', students: 15, flag: '🇬🇧' }
            ].map((item) => (
              <div key={item.country} className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">{item.flag}</span>
                  <span className="font-bold text-primary text-sm sm:text-base">{item.country}</span>
                </div>
                <span className="text-xs sm:text-sm font-black text-secondary">{item.students} students</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Performance Chart */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-outline-variant/10 p-4 sm:p-6">
        <h3 className="font-bold text-primary text-sm sm:text-base mb-4 sm:mb-6">Course Performance</h3>
        <div className="space-y-3 sm:space-y-4">
          {creatorCourses.map((course) => (
            <div key={course.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-surface-container-low/50 rounded-lg sm:rounded-xl">
              <img src={course.thumbnail} alt={course.title} className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary text-sm sm:text-base truncate">{course.title}</p>
                <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-on-surface-variant">
                  <span>{course.students} students</span>
                  <span>{course.views} views</span>
                  <span className="flex items-center gap-1">
                    <Star size={10} className="sm:w-3 sm:h-3 text-amber-500 fill-amber-500" />
                    {course.rating}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-green-600 text-sm sm:text-base">₦{(course.revenue / 1000).toFixed(0)}K</p>
                <p className="text-[10px] sm:text-xs text-on-surface-variant">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen min-w-0 bg-surface-container-low">
      {/* Sidebar - Desktop */}
      <aside className="w-72 bg-white border-r border-outline-variant/10 hidden lg:flex flex-col p-6 sticky top-0 h-[100dvh]">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Award size={24} className="text-white" />
            </div>
            <span className="font-headline font-bold text-xl text-primary">Creator Hub</span>
          </Link>
        </div>
        
        <div className="space-y-2 flex-grow">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-4 mb-2">Menu</p>
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
                activeTab === item.name 
                  ? "bg-primary text-white shadow-lg shadow-primary/25" 
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </button>
          ))}
        </div>

        <div className="pt-6 border-t border-outline-variant/10 space-y-4">
          <Link to="/creator-profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-colors">
            <img 
              src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.first_name || 'C'}&background=1E40AF&color=fff`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-bold text-primary text-sm">{profile?.first_name || 'Creator'}</p>
              <p className="text-xs text-on-surface-variant">View Profile</p>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-outline-variant/10 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Award size={18} className="text-white" />
          </div>
          <span className="font-headline font-bold text-lg text-primary">Creator Hub</span>
        </Link>
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 hover:bg-surface-container-low rounded-lg transition-colors"
        >
          {showMobileMenu ? <X size={24} className="text-primary" /> : <Menu size={24} className="text-primary" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[min(20rem,88vw)] bg-white shadow-xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 pt-16 flex-1 overflow-y-auto">
                {/* Navigation Section */}
                <div className="space-y-2 mb-8">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-4 mb-2">Navigation</p>
                  {sidebarItems.filter(item => item.name !== 'Overview').map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveTab(item.name);
                        setShowMobileMenu(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all",
                        activeTab === item.name 
                          ? "bg-primary text-white shadow-lg shadow-primary/25" 
                          : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                      )}
                    >
                      <item.icon size={20} />
                      {item.name}
                    </button>
                  ))}
                </div>

                {/* Quick Actions Section */}
                <div className="space-y-2 mb-8">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-4 mb-2">Quick Actions</p>
                  <button 
                    onClick={() => {
                      setShowUploadModal(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all"
                  >
                    <Plus size={20} />
                    Create New Course
                  </button>
                  <Link 
                    to="/creator-profile" 
                    onClick={() => setShowMobileMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all"
                  >
                    <Eye size={20} />
                    View Public Profile
                  </Link>
                </div>

                {/* Profile & Logout Section */}
                <div className="pt-6 border-t border-outline-variant/10 space-y-4">
                  <Link to="/creator-profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low transition-colors">
                    <img 
                      src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.first_name || 'C'}&background=1E40AF&color=fff`}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <p className="font-bold text-primary text-sm">{profile?.first_name || 'Creator'}</p>
                      <p className="text-xs text-on-surface-variant">View Profile</p>
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="min-w-0 flex-grow p-3 sm:p-4 lg:p-8 space-y-4 sm:space-y-6 overflow-x-hidden pb-6 sm:pb-8 lg:pb-8 pt-14 sm:pt-16 lg:pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'Overview' && renderOverview()}
            {activeTab === 'Courses' && renderCourses()}
            {activeTab === 'Enrollments' && renderEnrollments()}
            {activeTab === 'Payouts' && renderPayouts()}
            {activeTab === 'Analytics' && renderAnalytics()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-lg sm:max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 sm:p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-headline font-black text-primary">Create New Course</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-surface-container-low rounded-lg transition-colors">
                <X size={20} className="sm:w-6 sm:h-6 text-on-surface-variant" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label className="text-xs font-black text-on-surface-variant uppercase mb-2 block">Course Title</label>
                <input 
                  placeholder="Enter an engaging title..."
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 bg-surface-container-low rounded-lg sm:rounded-xl border-none focus:ring-2 focus:ring-primary/20 font-bold text-sm sm:text-base" 
                />
              </div>
              <div>
                <label className="text-xs font-black text-on-surface-variant uppercase mb-2 block">Description</label>
                <textarea 
                  placeholder="What will students learn?" 
                  rows={3} 
                  className="w-full px-4 py-2.5 sm:py-3 bg-surface-container-low rounded-lg sm:rounded-xl border-none focus:ring-2 focus:ring-primary/20 resize-none text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="text-xs font-black text-on-surface-variant uppercase mb-3 block">Content Type</label>
                <div className="flex gap-2 sm:gap-3">
                  <button 
                    type="button"
                    onClick={() => setCourseType('video')}
                    className={cn("flex-1 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition-all text-xs sm:text-sm", 
                      courseType === 'video' ? "bg-primary text-white border-primary" : "bg-transparent text-on-surface-variant border-outline-variant/20 hover:border-primary/50"
                    )}
                  >
                    <Video size={18} className="sm:w-5 sm:h-5" /> 
                    <span className="hidden sm:inline">Video Course</span>
                    <span className="sm:hidden">Video</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCourseType('text')}
                    className={cn("flex-1 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-2 border-2 transition-all text-xs sm:text-sm", 
                      courseType === 'text' ? "bg-primary text-white border-primary" : "bg-transparent text-on-surface-variant border-outline-variant/20 hover:border-primary/50"
                    )}
                  >
                    <FileText size={18} className="sm:w-5 sm:h-5" /> 
                    <span className="hidden sm:inline">Text Course</span>
                    <span className="sm:hidden">Text</span>
                  </button>
                </div>
              </div>
              {courseType === 'video' && (
                <div 
                  onClick={() => document.getElementById('creator-video-upload')?.click()}
                  className={cn("border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer", 
                    selectedVideo ? "border-primary bg-primary/5" : "border-outline-variant/20 hover:border-primary/50 bg-surface-container-lowest"
                  )}
                >
                  {selectedVideo ? (
                    <>
                      <CheckCircle size={32} className="sm:w-10 sm:h-10 text-green-500 mb-2 sm:mb-3" />
                      <p className="font-bold text-primary text-sm sm:text-base">{selectedVideo.name}</p>
                      <p className="text-xs sm:text-sm text-on-surface-variant">{(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <Upload size={32} className="sm:w-10 sm:h-10 text-primary/40 mb-2 sm:mb-3" />
                      <p className="font-bold text-primary text-sm sm:text-base">Upload Video</p>
                      <p className="text-xs sm:text-sm text-on-surface-variant">MP4, WebM or MOV (Max 2GB)</p>
                    </>
                  )}
                  <input id="creator-video-upload" type="file" className="hidden" accept="video/*" onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setSelectedVideo(e.target.files[0]);
                    }
                  }} />
                </div>
              )}
            </div>
            <div className="p-4 sm:p-6 border-t border-outline-variant/10 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
              <button 
                onClick={() => setShowUploadModal(false)} 
                className="px-4 sm:px-6 py-2.5 sm:py-3 text-on-surface-variant font-bold hover:text-primary transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button 
                disabled={isUploading || !newCourseTitle.trim()}
                onClick={async () => {
                  if (!newCourseTitle.trim()) return;
                  setIsUploading(true);
                  try {
                    let mediaUrl = '';
                    if (courseType === 'video' && selectedVideo) {
                      const fileExt = selectedVideo.name.split('.').pop();
                      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
                      
                      const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('courses')
                        .upload(fileName, selectedVideo, {
                          cacheControl: '3600',
                          upsert: false
                        });

                      if (uploadError) throw uploadError;

                      mediaUrl = uploadData.path;
                    }

                    const { error } = await supabase
                      .from('courses')
                      .insert([{
                        title: newCourseTitle,
                        instructor_id: user?.id,
                        type: courseType,
                        video_url: mediaUrl,
                        status: 'published',
                        price: 15000,
                        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80'
                      }])
                      .select();

                    if (error) throw error;

                    await fetchCourses();
                    setNewCourseTitle('');
                    setSelectedVideo(null);
                    setShowUploadModal(false);
                    window.showToast?.("Course published successfully!");
                  } catch (error: any) {
                    window.showToast?.("Failed to publish course. Please ensure 'courses' table and bucket exist. " + error.message, "error");
                  } finally {
                    setIsUploading(false);
                  }
                }} 
                className="bg-secondary text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-105 transition-transform text-sm sm:text-base"
              >
                {isUploading ? (
                  <><Upload size={16} className="sm:w-[18px] sm:h-[18px] animate-bounce" /> Uploading...</>
                ) : (
                  <><CheckCircle size={16} className="sm:w-[18px] sm:h-[18px]" /> Create Course</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mobile Bottom Navigation - Hidden on mobile, navigation moved to header menu */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-outline-variant/10 hidden lg:flex items-center justify-around px-1 sm:px-2 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {sidebarItems.slice(0, 4).map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-1 sm:px-2 py-1.5 rounded-xl transition-all min-w-[44px] sm:min-w-[52px]",
              activeTab === item.name ? "text-primary" : "text-on-surface-variant/60"
            )}
          >
            <item.icon size={18} className="sm:w-5 sm:h-5" strokeWidth={activeTab === item.name ? 2.5 : 1.5} />
            <span className={cn("text-[9px] sm:text-[10px]", activeTab === item.name ? "font-bold" : "font-medium")}>{item.name}</span>
          </button>
        ))}
        <button 
          onClick={() => setActiveTab('Analytics')} 
          className={cn(
            "flex flex-col items-center gap-0.5 px-1 sm:px-2 py-1.5 rounded-xl transition-all min-w-[44px] sm:min-w-[52px]",
            activeTab === 'Analytics' ? "text-primary" : "text-on-surface-variant/60"
          )}
        >
          <BarChart3 size={18} className="sm:w-5 sm:h-5" strokeWidth={activeTab === 'Analytics' ? 2.5 : 1.5} />
          <span className={cn("text-[9px] sm:text-[10px]", activeTab === 'Analytics' ? "font-bold" : "font-medium")}>Analytics</span>
        </button>
      </nav>
    </div>
  );
}
