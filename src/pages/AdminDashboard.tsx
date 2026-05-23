import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  BookOpen,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  Upload,
  UserCheck,
  Users,
  Video,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { GlowCard } from '../components/ui/spotlight-card';

type AdminStats = {
  total_revenue: number;
  total_users: number;
  students: number;
  creators: number;
  admins: number;
  published_courses: number;
  total_courses: number;
  active_subscriptions: number;
  successful_payments: number;
  pending_creator_applications: number;
  active_enrollments: number;
  completed_lessons: number;
};

type AdminData = {
  generated_at: string;
  warnings?: string[];
  stats: AdminStats;
  recent_users: any[];
  courses: any[];
  payments: any[];
  subscriptions: any[];
  payouts: any[];
  creators: any[];
};

const tabs = [
  { name: 'Overview', mobileName: 'Home', icon: Activity },
  { name: 'Users', mobileName: 'Users', icon: Users },
  { name: 'Applications', mobileName: 'Apps', icon: UserCheck },
  { name: 'Videos', mobileName: 'Videos', icon: Video },
  { name: 'Courses', mobileName: 'Courses', icon: BookOpen },
  { name: 'Payments', mobileName: 'Pay', icon: CreditCard },
  { name: 'Subscriptions', mobileName: 'Subs', icon: Activity },
  { name: 'Payouts', mobileName: 'Payouts', icon: DollarSign },
  { name: 'Settings', mobileName: 'Settings', icon: SettingsIcon },
];

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  approved: 'bg-green-100 text-green-700',
  success: 'bg-green-100 text-green-700',
  published: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  failed: 'bg-red-100 text-red-700',
  cancelled: 'bg-red-100 text-red-700',
  inactive: 'bg-surface-container text-on-surface-variant',
};

const emptyStats: AdminStats = {
  total_revenue: 0,
  total_users: 0,
  students: 0,
  creators: 0,
  admins: 0,
  published_courses: 0,
  total_courses: 0,
  active_subscriptions: 0,
  successful_payments: 0,
  pending_creator_applications: 0,
  active_enrollments: 0,
  completed_lessons: 0,
};

function formatCurrency(amount: number | string | null | undefined) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(Number(amount ?? 0));
}

function formatDate(value?: string | null) {
  if (!value) return 'Not available';
  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function StatusBadge({ status }: { status?: string | null }) {
  const normalized = (status || 'inactive').toLowerCase();
  return (
    <span className={cn('inline-flex w-fit rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest', statusStyles[normalized] || statusStyles.inactive)}>
      {normalized}
    </span>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-dashed border-outline-variant/20 bg-white px-4 py-12 text-center sm:py-16">
      <Icon size={48} className="mb-4 text-primary/20" />
      <p className="max-w-sm text-sm font-bold text-on-surface-variant">{message}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [courseType, setCourseType] = useState('video');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingPayout, setIsCreatingPayout] = useState(false);
  const [payoutCreatorId, setPayoutCreatorId] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('Bank Transfer');
  const [payoutStatus, setPayoutStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [creatorApplications, setCreatorApplications] = useState<any[]>([]);
  const [payoutCreators, setPayoutCreators] = useState<any[]>([]);
  const [reviewingApplicationId, setReviewingApplicationId] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = adminData?.stats || emptyStats;
  const courses = adminData?.courses || [];
  const payments = adminData?.payments || [];
  const subscriptions = adminData?.subscriptions || [];
  const payouts = adminData?.payouts || [];
  const creators = adminData?.creators?.length ? adminData.creators : payoutCreators;
  const videos = courses.filter((course) => course.type === 'video' || Boolean(course.video_url));

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return adminData?.recent_users || [];
    return (adminData?.recent_users || []).filter((person) =>
      [person.name, person.email, person.role].some((value) => String(value || '').toLowerCase().includes(term))
    );
  }, [adminData?.recent_users, searchTerm]);

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    if (profile?.role === 'admin') {
      refreshDashboard();
    }
  }, [profile, navigate]);

  const refreshDashboard = async () => {
    setLoading(true);
    setLoadError(null);
    const [dashboardResult, applicationResult, creatorResult] = await Promise.all([
      supabase.functions.invoke('admin-dashboard-data', { method: 'GET' }),
      supabase
        .from('creator_applications')
        .select('*, applicant:profiles!applicant_id(first_name, last_name, avatar_url, role)')
        .order('created_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .in('role', ['creator', 'admin'])
        .order('first_name', { ascending: true }),
    ]);

    if (dashboardResult.error) {
      let message = dashboardResult.error.message || 'Unable to load admin data.';
      const context = (dashboardResult.error as any).context;

      if (context?.json) {
        try {
          const body = await context.json();
          message = body.error || body.message || message;
        } catch {
          message = dashboardResult.error.message || message;
        }
      }

      setLoadError(message);
    } else if (dashboardResult.data) {
      setAdminData(dashboardResult.data as AdminData);
    }

    if (!applicationResult.error && applicationResult.data) {
      setCreatorApplications(applicationResult.data);
    }

    if (!creatorResult.error && creatorResult.data) {
      setPayoutCreators(creatorResult.data.map((creator) => ({
        id: creator.id,
        name: `${creator.first_name || ''} ${creator.last_name || ''}`.trim() || 'Unnamed creator',
        email: creator.role,
        role: creator.role,
      })));
    }

    setLoading(false);
  };

  const reviewApplication = async (applicationId: string, action: 'approve' | 'reject') => {
    setReviewingApplicationId(applicationId);
    try {
      const { error } = await supabase.functions.invoke('review-creator-application', {
        body: { application_id: applicationId, action },
      });

      if (error) throw error;
      await refreshDashboard();
      window.showToast?.(action === 'approve' ? 'Creator approved successfully.' : 'Application rejected.', 'success');
    } catch (error: any) {
      window.showToast?.(error.message || 'Unable to review application.', 'error');
    } finally {
      setReviewingApplicationId(null);
    }
  };

  const exportData = () => {
    const payload = {
      exported_at: new Date().toISOString(),
      dashboard: adminData,
      creator_applications: creatorApplications,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nigeria-ai-school-admin-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const publishCourse = async () => {
    if (!newCourseTitle.trim()) return;
    setIsUploading(true);
    try {
      let mediaUrl = '';
      if (courseType === 'video' && selectedVideo) {
        const fileExt = selectedVideo.name.split('.').pop();
        const fileName = `admin/${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('courses')
          .upload(fileName, selectedVideo, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;
        mediaUrl = uploadData.path;
      }

      const { error } = await supabase.from('courses').insert([{
        title: newCourseTitle.trim(),
        description: newCourseDescription.trim(),
        instructor_id: user?.id,
        type: courseType,
        video_url: mediaUrl,
        status: 'published',
        price: 10000,
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
      }]);

      if (error) throw error;

      await refreshDashboard();
      setNewCourseTitle('');
      setNewCourseDescription('');
      setSelectedVideo(null);
      setShowUploadModal(false);
      window.showToast?.('Course published successfully.', 'success');
    } catch (error: any) {
      window.showToast?.(`Failed to publish course: ${error.message}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const createPayoutRecord = async () => {
    setIsCreatingPayout(true);
    try {
      const { error } = await supabase.functions.invoke('create-payout-record', {
        body: {
          creator_id: payoutCreatorId,
          amount: Number(payoutAmount),
          method: payoutMethod,
          status: payoutStatus,
        },
      });

      if (error) throw error;

      await refreshDashboard();
      setShowPayoutModal(false);
      setPayoutCreatorId('');
      setPayoutAmount('');
      setPayoutMethod('Bank Transfer');
      setPayoutStatus('pending');
      window.showToast?.('Payout record created.', 'success');
    } catch (error: any) {
      window.showToast?.(error.message || 'Unable to create payout record.', 'error');
    } finally {
      setIsCreatingPayout(false);
    }
  };

  const setUserRole = async (userId: string, role: 'student' | 'creator' | 'admin') => {
    setUpdatingUserId(userId);
    try {
      const { error } = await supabase.functions.invoke('set-user-role', {
        body: {
          user_id: userId,
          role,
        },
      });

      if (error) throw error;

      await refreshDashboard();
      window.showToast?.(role === 'creator' ? 'User is now a creator.' : `User role updated to ${role}.`, 'success');
    } catch (error: any) {
      window.showToast?.(error.message || 'Unable to update user role.', 'error');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const metricCards = [
    { label: 'Total Revenue', value: formatCurrency(stats.total_revenue), detail: `${stats.successful_payments} successful payments`, icon: DollarSign, glow: 'green' as const },
    { label: 'Users', value: stats.total_users.toLocaleString(), detail: `${stats.students} students, ${stats.creators} creators`, icon: Users, glow: 'blue' as const },
    { label: 'Published Courses', value: stats.published_courses.toLocaleString(), detail: `${stats.total_courses} total courses`, icon: BookOpen, glow: 'purple' as const },
    { label: 'Subscriptions', value: stats.active_subscriptions.toLocaleString(), detail: 'active monthly access', icon: Activity, glow: 'orange' as const },
  ];

  const renderOverview = () => (
    <div className="space-y-5 sm:space-y-8">
      <div className="grid grid-cols-1 gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((stat) => (
          <GlowCard key={stat.label} glowColor={stat.glow} className="h-auto rounded-2xl sm:rounded-3xl border border-outline-variant/10 bg-white p-4 sm:p-6">
            <div className="mb-4 flex items-start justify-between sm:mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-12 sm:w-12 sm:rounded-2xl">
                <stat.icon size={23} />
              </div>
              <StatusBadge status="active" />
            </div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{stat.label}</p>
            <h3 className="break-words font-headline text-2xl font-black tracking-tight text-primary sm:text-3xl">{stat.value}</h3>
            <p className="mt-2 text-xs font-bold text-on-surface-variant">{stat.detail}</p>
          </GlowCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
        <div className="rounded-2xl sm:rounded-3xl border border-outline-variant/10 bg-white p-4 sm:p-6 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="font-headline text-xl font-bold text-primary">Recent Users</h2>
            <button onClick={() => setActiveTab('Users')} className="shrink-0 text-sm font-black text-primary hover:underline">View all</button>
          </div>
          {filteredUsers.length === 0 ? (
            <EmptyState icon={Users} message="No users have signed up yet." />
          ) : (
            <div className="divide-y divide-outline-variant/10">
              {filteredUsers.slice(0, 5).map((person) => (
                <div key={person.id} className="flex items-center justify-between gap-3 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={person.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=1E40AF&color=fff`}
                      alt={person.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-primary">{person.name}</p>
                      <p className="truncate text-xs text-on-surface-variant">{person.email}</p>
                    </div>
                  </div>
                  <StatusBadge status={person.role} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-outline-variant/10 bg-white p-4 sm:p-6">
          <h2 className="mb-5 font-headline text-xl font-bold text-primary">Operations</h2>
          <div className="space-y-4">
            <div className="rounded-2xl bg-surface-container-low p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Creator Reviews</p>
              <p className="mt-1 text-2xl font-black text-primary">{stats.pending_creator_applications}</p>
            </div>
            <div className="rounded-2xl bg-surface-container-low p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Active Enrollments</p>
              <p className="mt-1 text-2xl font-black text-primary">{stats.active_enrollments}</p>
            </div>
            <div className="rounded-2xl bg-surface-container-low p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Completed Lessons</p>
              <p className="mt-1 text-2xl font-black text-primary">{stats.completed_lessons}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-primary">Users</h2>
          <p className="text-sm text-on-surface-variant">Real profile and auth records from Supabase.</p>
        </div>
        <div className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 md:w-auto">
          <Search size={18} className="text-on-surface-variant" />
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search users" className="min-w-0 flex-1 bg-transparent text-sm outline-none md:w-56" />
        </div>
      </div>
      {filteredUsers.length === 0 ? (
        <EmptyState icon={Users} message="No matching users found." />
      ) : (
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-outline-variant/10 bg-white">
          {filteredUsers.map((person) => (
            <div key={person.id} className="grid gap-3 border-b border-outline-variant/10 p-4 last:border-b-0 sm:p-5 md:grid-cols-[1.5fr_0.8fr_1fr_0.9fr] md:items-center">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={person.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=1E40AF&color=fff`}
                  alt={person.name}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate font-black text-primary">{person.name}</p>
                  <p className="truncate text-xs text-on-surface-variant">{person.email}</p>
                </div>
              </div>
              <StatusBadge status={person.role} />
              <p className="text-xs font-bold text-on-surface-variant md:text-right">{formatDate(person.created_at)}</p>
              <div className="flex justify-start md:justify-end">
                {person.role === 'student' ? (
                  <button
                    onClick={() => setUserRole(person.id, 'creator')}
                    disabled={updatingUserId === person.id}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-black text-white disabled:opacity-60 sm:w-auto sm:min-w-[120px]"
                  >
                    {updatingUserId === person.id ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
                    Make Creator
                  </button>
                ) : (
                  <span className="text-xs font-bold text-on-surface-variant">No action</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-5">
      <div>
        <h2 className="font-headline text-2xl font-bold text-primary">Creator Applications</h2>
        <p className="text-sm text-on-surface-variant">Approve real student applications and convert qualified applicants to creators.</p>
      </div>
      {creatorApplications.length === 0 ? (
        <EmptyState icon={UserCheck} message="No creator applications yet." />
      ) : (
        <div className="space-y-4">
          {creatorApplications.map((application) => (
            <div key={application.id} className="rounded-2xl sm:rounded-3xl border border-outline-variant/10 bg-white p-4 sm:p-5 md:p-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={application.applicant?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(application.full_name)}&background=1E40AF&color=fff`}
                      alt={application.full_name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <h3 className="truncate font-headline text-lg font-bold text-primary">{application.full_name}</h3>
                      <p className="truncate text-xs text-on-surface-variant">{application.email}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div><p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Expertise</p><p className="mt-1 text-sm font-bold text-primary">{application.expertise}</p></div>
                    <div><p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Applied</p><p className="mt-1 text-sm font-bold text-primary">{formatDate(application.created_at)}</p></div>
                    <div><p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</p><div className="mt-1"><StatusBadge status={application.status} /></div></div>
                  </div>
                  <p className="text-sm leading-6 text-on-surface-variant"><strong className="text-primary">Experience:</strong> {application.experience}</p>
                  <p className="text-sm leading-6 text-on-surface-variant"><strong className="text-primary">Course idea:</strong> {application.course_idea}</p>
                  {application.portfolio_url && <a href={application.portfolio_url} target="_blank" rel="noreferrer" className="inline-flex text-sm font-bold text-secondary hover:underline">View portfolio</a>}
                </div>
                {application.status === 'pending' && (
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <button onClick={() => reviewApplication(application.id, 'approve')} disabled={reviewingApplicationId === application.id} className="rounded-xl bg-green-600 px-4 py-2.5 text-xs font-black text-white disabled:opacity-60">Approve</button>
                    <button onClick={() => reviewApplication(application.id, 'reject')} disabled={reviewingApplicationId === application.id} className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 disabled:opacity-60">Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-primary">Courses</h2>
          <p className="text-sm text-on-surface-variant">All published and draft courses in the database.</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-white sm:w-auto">
          <Plus size={18} /> Create Course
        </button>
      </div>
      {courses.length === 0 ? (
        <EmptyState icon={BookOpen} message="No courses have been uploaded yet." />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <GlowCard key={course.id} glowColor="purple" className="h-auto overflow-hidden rounded-2xl sm:rounded-3xl bg-white">
              <img src={course.thumbnail} alt={course.title} className="h-40 w-full object-cover" />
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 font-headline text-lg font-bold text-primary">{course.title}</h3>
                    <p className="text-xs font-bold text-on-surface-variant">{course.instructor_name}</p>
                  </div>
                  <StatusBadge status={course.status} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl sm:rounded-2xl bg-surface-container-low p-2 sm:p-3"><p className="text-xs font-black text-primary">{course.students || 0}</p><p className="text-[9px] font-bold uppercase text-on-surface-variant">Students</p></div>
                  <div className="rounded-xl sm:rounded-2xl bg-surface-container-low p-2 sm:p-3"><p className="text-xs font-black text-primary">{course.views || 0}</p><p className="text-[9px] font-bold uppercase text-on-surface-variant">Views</p></div>
                  <div className="rounded-xl sm:rounded-2xl bg-surface-container-low p-2 sm:p-3"><p className="text-xs font-black text-primary">{course.average_progress || 0}%</p><p className="text-[9px] font-bold uppercase text-on-surface-variant">Progress</p></div>
                </div>
                <p className="text-xs font-bold text-on-surface-variant">Created {formatDate(course.created_at)}</p>
              </div>
            </GlowCard>
          ))}
        </div>
      )}
    </div>
  );

  const renderVideos = () => (
    <div className="space-y-5">
      <div>
        <h2 className="font-headline text-2xl font-bold text-primary">Videos</h2>
        <p className="text-sm text-on-surface-variant">Courses with uploaded video content.</p>
      </div>
      {videos.length === 0 ? (
        <EmptyState icon={Video} message="No course videos have been uploaded yet." />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((course) => (
            <GlowCard key={course.id} glowColor="blue" className="h-auto rounded-2xl sm:rounded-3xl border border-outline-variant/10 bg-white p-4 sm:p-5">
              <div className="mb-4 flex aspect-video items-center justify-center rounded-2xl bg-surface-container-low">
                <Play size={42} className="text-primary/30" />
              </div>
              <h3 className="line-clamp-2 font-headline text-lg font-bold text-primary">{course.title}</h3>
              <p className="mt-1 text-xs font-bold text-on-surface-variant">{course.instructor_name}</p>
              <div className="mt-4 flex items-center justify-between">
                <StatusBadge status={course.status} />
                <span className="text-xs font-black text-primary">{course.progress_count || 0} viewers</span>
              </div>
            </GlowCard>
          ))}
        </div>
      )}
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-5">
      <div>
        <h2 className="font-headline text-2xl font-bold text-primary">Payments</h2>
        <p className="text-sm text-on-surface-variant">Latest Paystack payment records.</p>
      </div>
      {payments.length === 0 ? (
        <EmptyState icon={CreditCard} message="No payments have been recorded yet." />
      ) : (
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-outline-variant/10 bg-white">
          {payments.map((payment) => (
            <div key={payment.id} className="grid gap-3 border-b border-outline-variant/10 p-4 last:border-b-0 sm:p-5 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:items-center">
              <div className="min-w-0"><p className="truncate font-black text-primary">{payment.student_name}</p><p className="truncate text-xs text-on-surface-variant">{payment.student_email}</p></div>
              <p className="text-sm font-black text-primary">{formatCurrency(payment.amount)}</p>
              <StatusBadge status={payment.status} />
              <p className="text-xs font-bold text-on-surface-variant lg:text-right">{formatDate(payment.paid_at || payment.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-5">
      <div>
        <h2 className="font-headline text-2xl font-bold text-primary">Subscriptions</h2>
        <p className="text-sm text-on-surface-variant">Monthly all-access subscriptions created from Paystack payments.</p>
      </div>
      {subscriptions.length === 0 ? (
        <EmptyState icon={Activity} message="No subscriptions have been recorded yet." />
      ) : (
        <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-outline-variant/10 bg-white">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="grid gap-3 border-b border-outline-variant/10 p-4 last:border-b-0 sm:p-5 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:items-center">
              <div className="min-w-0"><p className="truncate font-black text-primary">{subscription.student_name}</p><p className="truncate text-xs text-on-surface-variant">{subscription.student_email}</p></div>
              <p className="text-sm font-black text-primary">{formatCurrency(subscription.amount)}</p>
              <StatusBadge status={subscription.status} />
              <p className="text-xs font-bold text-on-surface-variant lg:text-right">Expires {formatDate(subscription.expires_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPayouts = () => (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-primary">Payouts</h2>
          <p className="text-sm text-on-surface-variant">Creator payout records from the payouts table.</p>
        </div>
        <button onClick={() => setShowPayoutModal(true)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-white sm:w-auto">
          <Plus size={18} /> Create Payout
        </button>
      </div>
      {payouts.length === 0 ? (
        <EmptyState icon={DollarSign} message="No payouts have been created yet." />
      ) : (
        <div className="grid gap-4">
          {payouts.map((payout) => (
            <div key={payout.id} className="grid gap-3 rounded-2xl sm:rounded-3xl border border-outline-variant/10 bg-white p-4 sm:p-5 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:items-center">
              <p className="truncate font-black text-primary">{payout.creator_name}</p>
              <p className="text-sm font-black text-primary">{formatCurrency(payout.amount)}</p>
              <p className="text-xs font-bold text-on-surface-variant">{payout.method || 'Not set'}</p>
              <StatusBadge status={payout.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl sm:rounded-3xl border border-outline-variant/10 bg-white p-4 sm:p-6">
        <ShieldCheck size={32} className="mb-4 text-primary" />
        <h2 className="font-headline text-2xl font-bold text-primary">Admin Access</h2>
        <p className="mt-2 text-sm text-on-surface-variant">This dashboard is protected by the `/admin` route and server-side profile checks.</p>
        <div className="mt-5 space-y-3 text-sm">
          <p><strong className="text-primary">Current role:</strong> {profile?.role}</p>
          <p><strong className="text-primary">Admin emails:</strong> mvpxlab@gmail.com, kezieodike@gmail.com, mvplabx@gmail.com</p>
          <p><strong className="text-primary">Admins:</strong> {stats.admins}</p>
        </div>
      </div>
      <div className="rounded-2xl sm:rounded-3xl border border-outline-variant/10 bg-white p-4 sm:p-6">
        <DollarSign size={32} className="mb-4 text-primary" />
        <h2 className="font-headline text-2xl font-bold text-primary">Subscription Plan</h2>
        <p className="mt-2 text-sm text-on-surface-variant">Students pay once monthly for access to every published course.</p>
        <div className="mt-5 space-y-3 text-sm">
          <p><strong className="text-primary">Monthly price:</strong> {formatCurrency(10000)}</p>
          <p><strong className="text-primary">Active subscriptions:</strong> {stats.active_subscriptions}</p>
          <p><strong className="text-primary">Last sync:</strong> {formatDate(adminData?.generated_at)}</p>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    if (activeTab === 'Overview') return renderOverview();
    if (activeTab === 'Users') return renderUsers();
    if (activeTab === 'Applications') return renderApplications();
    if (activeTab === 'Videos') return renderVideos();
    if (activeTab === 'Courses') return renderCourses();
    if (activeTab === 'Payments') return renderPayments();
    if (activeTab === 'Subscriptions') return renderSubscriptions();
    if (activeTab === 'Payouts') return renderPayouts();
    return renderSettings();
  };

  return (
    <div className="flex min-h-screen min-w-0 bg-surface-container-low">
      <aside className="sticky top-20 z-10 hidden h-[calc(100vh-80px)] w-72 flex-col border-r border-outline-variant/10 bg-white p-8 lg:flex">
        <h3 className="mb-6 flex items-center gap-2 px-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          <ShieldCheck size={16} className="text-primary" /> Admin Center
        </h3>
        <nav className="space-y-2">
          {tabs.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                'flex w-full items-center gap-4 rounded-xl px-4 py-3.5 font-bold transition-all',
                activeTab === item.name ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              )}
            >
              <item.icon size={20} /> {item.name}
            </button>
          ))}
        </nav>
      </aside>

      <main className="relative min-w-0 flex-grow space-y-5 overflow-x-hidden p-3 pb-28 sm:space-y-8 sm:p-6 lg:p-12 lg:pb-12">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="mb-1 flex flex-wrap items-center gap-2 font-headline text-xl font-black text-primary sm:gap-3 sm:text-2xl md:text-3xl">
              Platform Administration
              <span className="rounded-md bg-red-100 px-2 py-1 text-[10px] uppercase tracking-widest text-red-600">Restricted</span>
            </h1>
            <p className="text-sm text-on-surface-variant">Live operational data from Supabase and Paystack records.</p>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:gap-3">
            <button onClick={refreshDashboard} className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/20 bg-white px-4 py-3 text-sm font-black text-primary">
              <RefreshCw size={17} /> Refresh
            </button>
            <button onClick={exportData} disabled={!adminData} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-black text-white disabled:opacity-50">
              <ArrowDownToLine size={17} /> Export Data
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-3xl bg-white">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : loadError ? (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-700">
            <div className="mb-2 flex items-center gap-2 font-black"><AlertTriangle size={20} /> Unable to load admin data</div>
            <p className="text-sm">{loadError}</p>
          </div>
        ) : (
          renderActiveTab()
        )}

        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-2 backdrop-blur-sm sm:items-center sm:p-4 md:p-6">
            <div className="flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-2xl sm:rounded-[2rem] md:flex-row">
              <div className="shrink-0 bg-primary p-5 text-white sm:p-8 md:w-72 md:p-10">
                <h3 className="font-headline text-xl font-black tracking-tight sm:text-2xl">Admin Course Creator</h3>
                <p className="mt-3 text-sm text-white/70">Upload official curriculum content for students.</p>
              </div>
              <div className="relative flex-grow space-y-6 overflow-y-auto p-4 sm:p-8 md:p-10">
                <button onClick={() => setShowUploadModal(false)} className="absolute right-4 top-4 text-on-surface-variant hover:text-primary sm:right-6 sm:top-6">
                  <XCircle size={24} />
                </button>
                <div className="space-y-4">
                  <h4 className="font-headline text-xl font-black text-primary">Basic Details</h4>
                  <input value={newCourseTitle} onChange={(event) => setNewCourseTitle(event.target.value)} placeholder="Course Title" className="w-full rounded-2xl bg-surface-container-low px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20" />
                  <textarea value={newCourseDescription} onChange={(event) => setNewCourseDescription(event.target.value)} placeholder="Course description" rows={3} className="w-full resize-none rounded-2xl bg-surface-container-low px-5 py-4 outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <div className="border-t border-outline-variant/10 pt-6">
                  <h4 className="mb-4 font-headline text-xl font-black text-primary">Course Content</h4>
                  <div className="mb-6 grid grid-cols-2 gap-3 sm:flex sm:gap-4">
                    <button type="button" onClick={() => setCourseType('video')} className={cn('flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 font-bold transition-all', courseType === 'video' ? 'border-primary bg-primary text-white' : 'border-outline-variant/20 text-on-surface-variant hover:border-primary/50')}><Video size={18} /> Video</button>
                    <button type="button" onClick={() => setCourseType('text')} className={cn('flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 font-bold transition-all', courseType === 'text' ? 'border-primary bg-primary text-white' : 'border-outline-variant/20 text-on-surface-variant hover:border-primary/50')}><FileText size={18} /> Text</button>
                  </div>
                  {courseType === 'video' ? (
                    <div onClick={() => document.getElementById('admin-video-upload')?.click()} className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant/20 bg-surface-container-lowest p-5 text-center transition-colors hover:border-primary/50 sm:p-8">
                      <Upload size={32} className="mb-4 text-primary/40" />
                      <p className="font-bold text-primary">{selectedVideo ? selectedVideo.name : 'Upload Video File'}</p>
                      <p className="mt-1 text-xs text-on-surface-variant">{selectedVideo ? `${(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB` : 'MP4, WebM or MOV'}</p>
                      <input id="admin-video-upload" type="file" className="hidden" accept="video/*" onChange={(event) => event.target.files?.[0] && setSelectedVideo(event.target.files[0])} />
                    </div>
                  ) : (
                    <textarea placeholder="Write the text lesson here." rows={8} className="w-full resize-none rounded-2xl bg-surface-container-low px-5 py-4 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <button onClick={() => setShowUploadModal(false)} className="px-4 py-3 font-bold text-on-surface-variant hover:text-primary">Cancel</button>
                  <button disabled={isUploading || !newCourseTitle.trim()} onClick={publishCourse} className="flex items-center justify-center gap-2 rounded-xl bg-secondary px-8 py-3 font-black text-white disabled:opacity-50">
                    {isUploading ? <><Loader2 size={18} className="animate-spin" /> Publishing...</> : <><CheckCircle size={18} /> Publish Course</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPayoutModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-2 backdrop-blur-sm sm:items-center sm:p-4 md:p-6">
            <div className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-[1.5rem] bg-white p-4 shadow-2xl sm:rounded-[2rem] sm:p-6 md:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-headline text-2xl font-black text-primary">Create Payout Record</h3>
                  <p className="mt-1 text-sm text-on-surface-variant">Record a creator payout for tracking and creator visibility.</p>
                </div>
                <button onClick={() => setShowPayoutModal(false)} className="text-on-surface-variant hover:text-primary">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest text-on-surface-variant">Creator</span>
                  <select
                    value={payoutCreatorId}
                    onChange={(event) => setPayoutCreatorId(event.target.value)}
                    className="w-full rounded-2xl bg-surface-container-low px-4 py-4 font-bold text-primary outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select creator</option>
                    {creators.map((creator) => (
                      <option key={creator.id} value={creator.id}>
                        {creator.name} - {creator.email}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest text-on-surface-variant">Amount</span>
                  <input
                    type="number"
                    min="1"
                    value={payoutAmount}
                    onChange={(event) => setPayoutAmount(event.target.value)}
                    placeholder="50000"
                    className="w-full rounded-2xl bg-surface-container-low px-4 py-4 font-bold text-primary outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest text-on-surface-variant">Method</span>
                  <input
                    value={payoutMethod}
                    onChange={(event) => setPayoutMethod(event.target.value)}
                    placeholder="Bank Transfer"
                    className="w-full rounded-2xl bg-surface-container-low px-4 py-4 font-bold text-primary outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest text-on-surface-variant">Status</span>
                  <select
                    value={payoutStatus}
                    onChange={(event) => setPayoutStatus(event.target.value as typeof payoutStatus)}
                    className="w-full rounded-2xl bg-surface-container-low px-4 py-4 font-bold text-primary outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </label>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button onClick={() => setShowPayoutModal(false)} className="rounded-xl px-5 py-3 text-sm font-black text-on-surface-variant hover:text-primary">Cancel</button>
                <button
                  onClick={createPayoutRecord}
                  disabled={isCreatingPayout || !payoutCreatorId || Number(payoutAmount) <= 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-black text-white disabled:opacity-50"
                >
                  {isCreatingPayout ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <><CheckCircle size={18} /> Save Payout</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-1 overflow-x-auto border-t border-outline-variant/10 bg-white px-2 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
        {tabs.map((item) => (
          <button key={item.name} onClick={() => setActiveTab(item.name)} className={cn('flex min-w-[64px] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-all', activeTab === item.name ? 'bg-primary/10 text-primary' : 'text-on-surface-variant/60')}>
            <item.icon size={18} strokeWidth={activeTab === item.name ? 2.5 : 1.5} />
            <span className={cn('text-[9px]', activeTab === item.name ? 'font-bold' : 'font-medium')}>{item.mobileName}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
