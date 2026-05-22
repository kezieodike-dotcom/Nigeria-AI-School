import React from 'react'; 

import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { LayoutDashboard, BookOpen, CreditCard, Settings, LogOut, Search, Bell, Star, Clock, PlayCircle, ChevronRight, TrendingUp, Users, Share2, Rocket, User, Camera, UploadCloud, X, CheckCircle2, Heart, DollarSign, Link as LinkIcon, Copy, Twitter, ArrowUpRight, BarChart3, Edit3, ArrowRight, Trash2, Video, FileText, ChevronDown, ShieldCheck, GraduationCap, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { Course } from '../types';
import GlowCard from '../components/ui/spotlight-card';
import { imageFileToDataUrl, uploadProfileImage } from '../lib/profileImage';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = React.useState('Overview');
  const [userName, setUserName] = React.useState('Student');
  const [showCamera, setShowCamera] = React.useState(false);
  const [cameraStream, setCameraStream] = React.useState<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = React.useState(false);
  const [cameraError, setCameraError] = React.useState('');
  const [avatarImage, setAvatarImage] = React.useState<string | null>(null);
  const [firstNameInput, setFirstNameInput] = React.useState('');
  const [lastNameInput, setLastNameInput] = React.useState('');
  const [emailInput, setEmailInput] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [showCourseOverview, setShowCourseOverview] = React.useState(false);
  const [showLesson, setShowLesson] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!showCamera || !cameraStream || !videoRef.current) return;

    const video = videoRef.current;
    video.srcObject = cameraStream;
    video.play().catch(() => {
      window.showToast('Tap the video or allow camera autoplay to start the preview.', 'error');
    });

    return () => {
      video.srcObject = null;
    };
  }, [showCamera, cameraStream]);

  React.useEffect(() => {
    return () => {
      cameraStream?.getTracks().forEach((track) => track.stop());
    };
  }, [cameraStream]);

  const startCamera = async () => {
    setShowCamera(true);
    setCameraReady(false);
    setCameraError('');

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera is not available in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      setCameraStream(stream);
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      const message = err?.name === 'NotAllowedError'
        ? 'Camera permission was blocked. Allow camera access in your browser settings, then try again.'
        : err?.name === 'NotFoundError'
          ? 'No camera was found on this device.'
          : err?.message || 'Could not access camera. Please check permissions.';
      setCameraError(message);
      window.showToast(message, "error");
    }
  };

  const stopCamera = () => {
    cameraStream?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraStream(null);
    setCameraReady(false);
    setCameraError('');
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (!cameraReady || videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      window.showToast('Camera is still starting. Please try again in a moment.', 'error');
      return;
    }

    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setAvatarImage(dataUrl);
      stopCamera();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  React.useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, description, category, rating, reviews_count, price, thumbnail, video_url, type, duration')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedCourses = (data || []).map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || '',
        category: course.category || 'AI & ML',
        rating: course.rating || 0,
        reviewsCount: course.reviews_count || 0,
        price: course.price || 0,
        thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
        duration: course.duration || '0 hrs',
        videoUrl: course.video_url,
        type: course.type || 'video',
        instructor: {
          name: 'Expert Instructor',
          role: 'AI Specialist',
          avatar: 'https://ui-avatars.com/api/?name=AI&background=00154d&color=fff'
        }
      }));

      if (formattedCourses.length > 0) {
        setCourses(formattedCourses);
      } else {
        setCourses([]);
      }
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (profile) {
      const firstName = profile.first_name || 'Student';
      setUserName(firstName);
      setFirstNameInput(profile.first_name || '');
      setLastNameInput(profile.last_name || '');
      setEmailInput(user?.email || '');
      if (profile.avatar_url) {
        setAvatarImage(profile.avatar_url);
      }
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      if (!user) throw new Error('You must be logged in to update your profile.');

      let finalAvatarUrl = avatarImage;

      if (avatarImage && avatarImage.startsWith('data:image')) {
        try {
          finalAvatarUrl = await uploadProfileImage(user.id, avatarImage);
        } catch (uploadError: any) {
           throw new Error("Failed to upload image. Please ensure you have created an 'avatars' bucket in Supabase Storage. Details: " + uploadError.message);
        }
      }

      // Update user metadata for first/last name (useful for emails etc)
      await supabase.auth.updateUser({
        data: {
          first_name: firstNameInput,
          last_name: lastNameInput,
          avatar_url: finalAvatarUrl
        }
      });

      // Update Secure Profiles Table. Upsert also repairs accounts whose profile row
      // was not created by the signup trigger.
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          first_name: firstNameInput,
          last_name: lastNameInput,
          avatar_url: finalAvatarUrl,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) throw error;
      
      await refreshProfile();
      setAvatarImage(finalAvatarUrl);
      window.showToast("Profile updated successfully!");
    } catch (error: any) {
      const message = /row-level security|violates.*policy/i.test(error.message || '')
        ? 'Supabase profile permissions are not set up yet. Run the updated SETUP_DATABASE.sql script, then try saving again.'
        : error.message;
      window.showToast(message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpgradeToCreator = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'creator' })
        .eq('id', user?.id);

      if (error) throw error;
      
      // Also update metadata for convenience, but the profile table is the truth
      await supabase.auth.updateUser({
        data: { role: 'creator' }
      });

      await refreshProfile();
      window.showToast("Successfully upgraded to Creator Account!");
      navigate('/creator-dashboard');
    } catch (error: any) {
      window.showToast(error.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const sidebarItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'My Courses', icon: BookOpen },
    { name: 'Explore', icon: Search },
    { name: 'My Links', icon: LinkIcon },
    { name: 'Settings', icon: Settings },
    { name: 'Profile', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-12">
            {/* Quick Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Courses Enrolled', value: courses.length.toString(), icon: BookOpen, glow: 'blue' as const },
                { label: 'Courses Completed', value: '0', icon: CheckCircle2, glow: 'green' as const },
                { label: 'Learning Hours', value: '0', icon: Clock, glow: 'purple' as const },
              ].map((stat, i) => (
                <GlowCard 
                  key={i} 
                  glowColor={stat.glow}
                  customSize={true}
                  className="bg-white p-7 rounded-[2rem] border border-outline-variant/10 flex items-center gap-6 group transition-all duration-500 h-auto"
                >
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500", `bg-${stat.glow}-500/10`, `text-${stat.glow}-500`)}>
                    <stat.icon size={32} />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1.5">{stat.label}</p>
                    <h4 className="text-2xl font-headline font-black text-primary tracking-tight">{stat.value}</h4>
                  </div>
                </GlowCard>
              ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                {/* Continue Learning - Most Important */}
                <div className="space-y-6">
                  <h2 className="text-xl font-headline font-bold text-primary">Continue Learning</h2>
                  {courses.length > 0 ? (
                    <GlowCard glowColor="blue" className="bg-white p-6 md:p-8 rounded-[2rem] border border-primary/20 flex flex-col md:flex-row items-center gap-8 h-auto shadow-xl shadow-primary/5">
                      <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden relative shrink-0 bg-black">
                        {courses[0].videoUrl ? (
                          <video 
                            src={courses[0].videoUrl} 
                            className="w-full h-full object-cover opacity-80" 
                            muted 
                            preload="metadata"
                          />
                        ) : (
                          <img src={courses[0].thumbnail} className="w-full h-full object-cover opacity-80" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle size={40} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="flex-grow space-y-4 text-center md:text-left">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-secondary uppercase tracking-widest">Next Lesson: Getting Started</p>
                          <h3 className="text-2xl font-headline font-black text-primary leading-tight">{courses[0].title}</h3>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold text-on-surface-variant">
                          <span className="flex items-center gap-1.5"><Clock size={16} /> {courses[0].duration}</span>
                          <span className="flex items-center gap-1.5 text-secondary">0% Complete</span>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedCourse(courses[0] as any);
                            setShowCourseOverview(true);
                          }}
                          className="px-8 py-3.5 bg-primary text-white rounded-xl font-black text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 mx-auto md:mx-0"
                        >
                          <PlayCircle size={18} fill="white" /> Start Course
                        </button>
                      </div>
                    </GlowCard>
                  ) : (
                    <div className="bg-white p-12 rounded-[2rem] border border-outline-variant/10 border-dashed text-center space-y-4">
                      <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center mx-auto text-on-surface-variant/30">
                        <BookOpen size={32} />
                      </div>
                      <div>
                        <p className="font-bold text-primary">No courses enrolled yet</p>
                        <p className="text-sm text-on-surface-variant">Explore our AI courses to start learning.</p>
                      </div>
                      <button onClick={() => setActiveTab('Explore')} className="text-sm font-bold text-primary hover:underline">Explore Courses</button>
                    </div>
                  )}
                </div>

                {/* Recommended Courses - Directly under Continue Learning */}
                {courses.length > 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-headline font-bold text-primary">Recommended for You</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {courses.slice(1, 3).map(course => (
                        <div key={course.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-outline-variant/10 hover:border-secondary/30 hover:bg-surface-container-lowest transition-all cursor-pointer" onClick={() => { setSelectedCourse(course as any); setShowCourseOverview(true); }}>
                          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                            {course.videoUrl ? (
                              <video src={course.videoUrl} className="w-full h-full object-cover" muted />
                            ) : (
                              <img src={course.thumbnail} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="text-sm font-bold text-primary line-clamp-2 leading-tight">{course.title}</h4>
                            <span className="text-[10px] font-black text-secondary uppercase tracking-widest mt-1">₦{course.price.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* My Courses Snapshot */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-headline font-bold text-primary">My Courses</h2>
                    <button onClick={() => setActiveTab('My Courses')} className="text-sm font-bold text-secondary hover:underline">View All</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {courses.slice(0, 2).map(course => (
                      <div key={course.id} className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden hover:border-primary/30 transition-all group cursor-pointer" onClick={() => { setSelectedCourse(course as any); setShowCourseOverview(true); }}>
                        <div className="w-full h-32 bg-black relative overflow-hidden">
                          {course.videoUrl ? (
                            <video src={course.videoUrl} className="w-full h-full object-cover opacity-80" muted />
                          ) : (
                            <img src={course.thumbnail} className="w-full h-full object-cover opacity-80" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle size={32} className="text-white" />
                          </div>
                        </div>
                        <div className="p-5 space-y-4">
                          <h4 className="font-bold text-primary text-sm line-clamp-1">{course.title}</h4>
                          <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                            <div className="h-full bg-secondary w-[0%] rounded-full" />
                          </div>
                          <button className="w-full py-2 bg-surface-container-low text-primary rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-colors">Start Learning</button>
                        </div>
                      </div>
                    ))}
                    {courses.length === 0 && (
                      <div className="col-span-full py-12 text-center border border-outline-variant/10 border-dashed rounded-2xl">
                         <p className="text-sm text-on-surface-variant">No enrolled courses yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar content */}
              <div className="space-y-12">
              </div>
            </div>
          </div>
        );

      case 'My Courses':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-headline font-bold text-primary">Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <GlowCard key={course.id} glowColor="blue" className="bg-white overflow-hidden flex flex-col h-auto group border border-outline-variant/10 hover:border-primary/30">
                  <div className="relative h-48 overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-6 space-y-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-headline font-bold text-primary mb-2 line-clamp-2">{course.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-4">
                        <span className="flex items-center gap-1"><User size={14} /> Chikezie Odike</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-primary">
                          <span>Progress</span>
                          <span>0%</span>
                        </div>
                        <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[0%] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedCourse(course as any);
                        setShowCourseOverview(true);
                      }}
                      className="w-full py-3.5 bg-primary text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform"
                    >
                      <PlayCircle size={18} /> Continue Learning
                    </button>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        );

      case 'Explore':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-headline font-bold text-primary">Explore Courses</h2>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                <input type="text" placeholder="Search for AI courses..." className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['All', 'AI Development', 'Data Science', 'Generative AI', 'Web Development'].map(filter => (
                <button key={filter} className="px-6 py-2 bg-white border border-outline-variant/20 rounded-full text-sm font-bold text-on-surface-variant whitespace-nowrap hover:border-primary hover:text-primary transition-colors">{filter}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
                <GlowCard key={course.id} glowColor="blue" className="bg-white overflow-hidden border border-outline-variant/10 h-auto">
                  <div className="w-full h-48 bg-black overflow-hidden relative">
                    {course.videoUrl ? (
                      <video 
                        src={course.videoUrl} 
                        className="w-full h-full object-cover opacity-80" 
                        muted 
                        preload="metadata"
                      />
                    ) : (
                      <img src={course.thumbnail} className="w-full h-full object-cover opacity-80" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle size={32} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="font-headline font-bold text-primary line-clamp-2">{course.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1"><Star size={14} className="text-amber-500 fill-amber-500"/> 4.8 (120)</span>
                      <span className="text-lg font-black text-secondary">₦{course.price.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedCourse(course as any);
                        setShowCourseOverview(true);
                      }}
                      className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm"
                    >
                      View Course
                    </button>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        );

      case 'My Links':
        return (
          <div className="space-y-8 max-w-3xl">
            <h2 className="text-2xl font-headline font-bold text-primary">My Referral Links</h2>
            <div className="bg-white p-8 rounded-3xl border border-outline-variant/10 space-y-6">
              <p className="text-on-surface-variant">Share your unique link with friends. When they purchase a course, you earn a 20% commission!</p>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  readOnly 
                  value="nigeriaai.com/?ref=chikezie" 
                  className="flex-grow px-5 py-4 bg-surface-container-low rounded-xl font-mono text-sm border-none focus:ring-0" 
                />
                <button className="px-6 py-4 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shrink-0">
                  <Copy size={18} /> Copy
                </button>
              </div>
              <div className="pt-6 border-t border-outline-variant/10 flex items-center gap-4">
                <span className="text-sm font-bold text-on-surface-variant">Share quickly:</span>
                <button className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366] hover:text-white transition-colors"><Share2 size={20} /></button>
                <button className="p-3 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-colors"><Twitter size={20} /></button>
              </div>
            </div>
          </div>
        );

      case 'Settings':
        return (
          <div className="max-w-2xl space-y-8">
            <h2 className="text-2xl font-headline font-bold text-primary">Account Settings</h2>
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-outline-variant/10 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-on-surface-variant">Change Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-primary">Email Notifications</p>
                    <p className="text-xs text-on-surface-variant">Receive updates about your courses</p>
                  </div>
                  <div className="w-12 h-6 bg-secondary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <button className="w-full py-4 bg-primary text-white rounded-xl font-bold">Save Settings</button>
              </div>
            </div>
          </div>
        );

      case 'Profile':
        return (
          <div className="max-w-2xl space-y-8">
            <h2 className="text-2xl font-headline font-bold text-primary">User Profile</h2>
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-outline-variant/10 space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-outline-variant/10">
                <div className="w-24 h-24 rounded-3xl bg-surface-container flex items-center justify-center overflow-hidden border-2 border-primary/10 relative group shrink-0">
                  {avatarImage ? (
                    <img src={avatarImage} alt="User Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-primary/20" />
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      className="flex items-center gap-2 text-sm font-bold bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-container transition-colors"
                    >
                      <UploadCloud size={16} /> Upload Photo
                    </button>
                    <button 
                      onClick={startCamera}
                      className="flex items-center gap-2 text-sm font-bold bg-surface-container text-on-surface-variant px-4 py-2 rounded-xl hover:bg-surface-container-high transition-colors"
                    >
                      <Camera size={16} /> Take Photo
                    </button>
                  </div>
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/*" 
                    capture="user"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        imageFileToDataUrl(file)
                          .then(setAvatarImage)
                          .catch((error) => window.showToast(error.message, 'error'));
                      }
                    }} 
                  />
                  <p className="text-xs text-on-surface-variant">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-on-surface-variant">First Name</label>
                    <input value={firstNameInput} onChange={(e) => setFirstNameInput(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-on-surface-variant">Last Name</label>
                    <input value={lastNameInput} onChange={(e) => setLastNameInput(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-on-surface-variant">Email Address</label>
                  <input value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="w-full px-4 py-3 bg-surface-container-low rounded-xl border-none focus:ring-2 focus:ring-primary/20" />
                </div>
                
                <button onClick={handleUpdateProfile} disabled={isUpdating} className="w-full py-4 bg-primary text-white rounded-xl font-bold disabled:opacity-50">
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </button>

                <div className="pt-6 mt-6 border-t border-outline-variant/10">
                  <h3 className="text-lg font-headline font-bold text-primary mb-2">Creator Account</h3>
                  <p className="text-sm text-on-surface-variant mb-4">Want to upload courses and earn money? Upgrade your account to become a creator.</p>
                  <button 
                    onClick={handleUpgradeToCreator} 
                    disabled={isUpdating} 
                    className="w-full py-4 bg-secondary text-white rounded-xl font-bold disabled:opacity-50 hover:bg-secondary/90 transition-colors"
                  >
                    Upgrade to Creator Account
                  </button>
                </div>
              </div>
              {/* CAMERA MODAL */}
              {showCamera && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden max-w-xl w-full relative">
                    <button onClick={stopCamera} className="absolute top-6 right-6 z-10 p-3 bg-black/10 hover:bg-black/20 rounded-full transition-colors text-white">
                      <X size={24} />
                    </button>
                    <div className="aspect-square bg-black relative">
                      {cameraError ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
                          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-5">
                            <Camera size={30} />
                          </div>
                          <h3 className="font-headline font-bold text-xl mb-2">Camera Access Needed</h3>
                          <p className="text-sm text-white/75 leading-relaxed max-w-sm">{cameraError}</p>
                        </div>
                      ) : (
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          playsInline
                          onCanPlay={() => setCameraReady(true)}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="p-8 text-center space-y-6">
                      <h3 className="text-xl font-headline font-bold text-primary">Take a Profile Picture</h3>
                      <p className="text-sm text-on-surface-variant">
                        {cameraError ? 'After allowing camera access, try again or upload a photo instead.' : 'Make sure your face is clearly visible in the frame.'}
                      </p>
                      {cameraError ? (
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            onClick={startCamera}
                            className="bg-primary text-white px-5 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                          >
                            <Camera size={18} /> Try Camera Again
                          </button>
                          <button
                            onClick={() => {
                              stopCamera();
                              document.getElementById('avatar-upload')?.click();
                            }}
                            className="bg-surface-container-low text-primary px-5 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2 hover:bg-surface-container transition-colors"
                          >
                            <UploadCloud size={18} /> Upload Photo
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={takePhoto}
                          disabled={!cameraReady}
                          className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all mx-auto disabled:opacity-60 disabled:hover:scale-100"
                        >
                          {cameraReady ? <Camera size={32} /> : <Loader2 size={32} className="animate-spin" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-container-low">
      {/* Sidebar - Desktop only */}
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
                      ? "bg-primary text-white" 
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

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-12 space-y-8 lg:space-y-12 overflow-x-hidden pb-24 lg:pb-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-primary mb-1 md:mb-2">
              {activeTab === 'Overview' ? `Welcome back, ${userName} 👋` : activeTab}
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant">
              {activeTab === 'Overview' ? 'Continue your AI journey today.' : 'Manage your learning and earning in one place.'}
            </p>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <button className="p-2.5 md:p-3 bg-white border border-outline-variant/10 rounded-xl text-on-surface-variant hover:text-primary relative group transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        {renderContent()}

        {/* Course Overview Modal — Perfectly matching CourseDetail.tsx design */}
        {showCourseOverview && selectedCourse && (
          <div className="fixed inset-0 z-[100] bg-surface overflow-y-auto animate-[fadeIn_0.4s_ease]">
            {/* 🚀 Dark Header / Hero Section */}
            <section className="bg-primary text-white py-16 lg:py-24 border-b border-white/10 relative">
              {/* Back button */}
              <button
                onClick={() => setShowCourseOverview(false)}
                className="absolute top-8 left-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-all border border-white/10 text-white flex items-center gap-2 font-bold z-20"
              >
                <ChevronRight size={18} className="rotate-180" /> Back to Dashboard
              </button>

              <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12 relative">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full uppercase tracking-widest">
                      {selectedCourse.category || 'AI & ML'}
                    </span>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-full">
                      IN PROGRESS
                    </span>
                  </div>
                  
                  <h1 className="font-headline font-extrabold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
                    {selectedCourse.title}
                  </h1>
                  
                  <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl">
                    {selectedCourse.description || 'Master cutting-edge skills with our expert-led curriculum. Build real-world projects and earn a verified certificate.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-white/70">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star fill="currentColor" size={18} />
                      <span className="text-white ml-1">{selectedCourse.rating || '4.8'}</span>
                      <span className="text-white/50 font-normal">({(selectedCourse.reviewsCount || 120).toLocaleString()} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={18} />
                      <span>1,240 students enrolled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} />
                      <span>{selectedCourse.duration || '12.5 hrs content'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-6">
                    <img 
                      src={selectedCourse.instructor?.avatar || 'https://ui-avatars.com/api/?name=AI&background=00154d&color=fff'} 
                      alt="Instructor"
                      className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
                    />
                    <div>
                      <p className="font-medium text-white/70 text-sm">Course Instructor</p>
                      <p className="font-bold text-secondary">{selectedCourse.instructor?.name || 'Expert Instructor'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-8 lg:gap-12 pb-24 -mt-10 md:-mt-12 lg:-mt-24 relative z-10">
              
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-12">
                
                {/* What you'll learn */}
                <GlowCard 
                  glowColor="blue"
                  customSize={true}
                  className="bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm mt-24 lg:mt-32 h-auto relative z-10"
                >
                  <h2 className="font-headline font-bold text-2xl text-primary mb-6">Course Objectives</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      "Master core concepts and theoretical foundations",
                      "Build hands-on practical projects from scratch",
                      "Deploy real-world applications to production",
                      "Learn industry best practices and standards",
                      "Master advanced tools and technologies",
                      "Earn a verified certificate of completion"
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <CheckCircle2 className="text-secondary shrink-0 mt-0.5" size={20} />
                        <span className="text-on-surface-variant font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </GlowCard>

                {/* Progress Tracking */}
                <section className="space-y-6">
                  <h2 className="font-headline font-bold text-2xl text-primary">Your Learning Progress</h2>
                  <div className="bg-white p-8 rounded-3xl border border-outline-variant/10 space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-on-surface-variant mb-1">Overall Completion</p>
                        <h4 className="text-2xl font-black text-primary">0% Complete</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-on-surface-variant mb-1">Time Remaining</p>
                        <h4 className="text-2xl font-black text-secondary">{selectedCourse.duration || '0 hrs'}</h4>
                      </div>
                    </div>
                    <div className="h-4 bg-surface-container-low rounded-full overflow-hidden p-1 border border-outline-variant/5">
                      <div className="h-full bg-gradient-to-r from-primary via-secondary to-secondary-fixed-dim w-[0%] rounded-full shadow-[0_0_15px_rgba(0,108,73,0.3)]" />
                    </div>
                  </div>
                </section>

                {/* Curriculum / Content */}
                <section className="space-y-6">
                  <div className="flex justify-between items-end">
                    <h2 className="font-headline font-bold text-2xl text-primary">Course Curriculum</h2>
                    <span className="text-sm text-on-surface-variant font-bold">12 Lessons • {selectedCourse.duration || '12.5 hrs'}</span>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { title: 'Module 1: Getting Started & Foundations', duration: '2.5 hrs' },
                      { title: 'Module 2: Core Concepts & Architecture', duration: '4 hrs' },
                      { title: 'Module 3: Advanced Implementation', duration: '3.5 hrs' },
                      { title: 'Module 4: Final Project & Deployment', duration: '2.5 hrs' }
                    ].map((mod, i) => (
                      <div key={i} className="bg-white border border-outline-variant/10 rounded-2xl overflow-hidden group">
                        <div className="w-full px-6 py-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors cursor-pointer">
                          <div className="flex items-center gap-4">
                            <ChevronDown className="text-primary group-hover:translate-y-0.5 transition-transform" size={20} />
                            <span className="font-bold text-primary text-lg">{mod.title}</span>
                          </div>
                          <span className="text-sm text-on-surface-variant font-bold">{mod.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sticky Sidebar */}
              <div className="lg:col-span-1 order-first lg:order-last">
                <GlowCard 
                  glowColor="blue"
                  customSize={true}
                  className="bg-white rounded-[2.5rem] border border-outline-variant/20 shadow-2xl overflow-hidden lg:sticky lg:top-24 !p-0 h-auto relative z-20"
                >
                  <div className="relative aspect-video bg-black group cursor-pointer" onClick={() => { setShowCourseOverview(false); setShowLesson(true); }}>
                    {selectedCourse.videoUrl ? (
                      <video src={selectedCourse.videoUrl} className="w-full h-full object-cover opacity-80" muted preload="metadata" />
                    ) : (
                      <img src={selectedCourse.thumbnail} className="w-full h-full object-cover opacity-70" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-md border-2 border-white rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-500">
                        <PlayCircle className="text-white fill-white/10" size={40} />
                      </div>
                    </div>
                    <div className="absolute bottom-4 inset-x-0 text-center font-black text-white tracking-widest text-xs uppercase drop-shadow-lg">
                      Preview Course Content
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          setShowCourseOverview(false);
                          setShowLesson(true);
                        }}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
                      >
                        <PlayCircle size={24} fill="white" /> Start Watching
                      </button>
                      <button className="w-full bg-white text-on-surface-variant border-2 border-outline-variant/20 py-5 rounded-2xl font-bold text-lg hover:bg-surface-container-low transition-colors">
                        View Resources
                      </button>
                    </div>

                    <div className="space-y-5 text-sm text-on-surface-variant font-medium border-t border-outline-variant/10 pt-8">
                      <div className="flex items-center gap-3">
                        <Video size={20} className="text-primary" />
                        <span>{selectedCourse.duration || '12.5 hrs'} on-demand video</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-primary" />
                        <span>24 articles and resources</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <ShieldCheck size={20} className="text-secondary" />
                        <span>Lifetime access to updates</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <GraduationCap size={20} className="text-primary" />
                        <span>Professional Certificate</span>
                      </div>
                    </div>

                    {/* Affiliate Teaser */}
                    <div className="bg-secondary/10 p-5 rounded-2xl border border-secondary/20 group hover:bg-secondary transition-all cursor-pointer">
                      <div className="flex items-center gap-4 group-hover:text-white">
                        <Share2 className="text-secondary group-hover:text-white" size={24} />
                        <div>
                          <h4 className="font-bold text-primary group-hover:text-white text-sm">Share & Earn ₦15k</h4>
                          <p className="text-xs text-on-surface-variant group-hover:text-white/80">Affiliate program available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </div>
            </div>
          </div>
        )}

        {/* Video Player Modal — opened from Course Overview */}
        {showLesson && selectedCourse && (
          <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-10">
            <div className="w-full max-w-6xl h-full max-h-[90vh] bg-white md:rounded-[2.5rem] overflow-hidden flex flex-col relative">
              <button 
                onClick={() => { setShowLesson(false); }}
                className="absolute top-5 right-5 z-10 p-2.5 bg-black/20 hover:bg-black/40 rounded-full transition-colors text-white"
              >
                <X size={22} />
              </button>
              
              {/* Video Player */}
              <div className="aspect-video bg-black flex items-center justify-center shrink-0">
                {selectedCourse.videoUrl ? (
                  <video 
                    autoPlay 
                    controlsList="nodownload nofullscreen" 
                    disablePictureInPicture 
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full"
                    src={selectedCourse.videoUrl}
                  />
                ) : (
                  <div className="text-center text-white space-y-4">
                    <PlayCircle size={64} className="mx-auto opacity-20" />
                    <p className="font-bold">No video content available for this lesson.</p>
                  </div>
                )}
              </div>
              
              {/* Course Info under video */}
              <div className="flex-grow p-6 md:p-10 space-y-5 overflow-y-auto">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-headline font-bold text-primary mb-1">{selectedCourse.title}</h2>
                    <p className="text-sm text-on-surface-variant">{selectedCourse.description || 'No description provided.'}</p>
                  </div>
                  <button
                    onClick={() => setShowLesson(false)}
                    className="shrink-0 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
                  >
                    Back to overview
                  </button>
                </div>
                
                <div className="pt-5 border-t border-outline-variant/10">
                  <h3 className="font-headline font-bold text-primary mb-4">Course Progress</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-surface-container-low rounded-2xl">
                      <p className="text-xs font-black uppercase text-on-surface-variant mb-1">Current Module</p>
                      <p className="font-bold text-primary">Introduction to AI</p>
                    </div>
                    <div className="p-4 bg-surface-container-low rounded-2xl">
                      <p className="text-xs font-black uppercase text-on-surface-variant mb-1">Time Spent</p>
                      <p className="font-bold text-primary">2h 45m</p>
                    </div>
                    <div className="p-4 bg-surface-container-low rounded-2xl">
                      <p className="text-xs font-black uppercase text-on-surface-variant mb-1">Next Lesson</p>
                      <p className="font-bold text-secondary">Neural Networks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-outline-variant/10 flex items-center justify-around px-2 py-2 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {sidebarItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[60px]",
              activeTab === item.name
                ? "text-primary"
                : "text-on-surface-variant/60"
            )}
          >
            <item.icon size={20} strokeWidth={activeTab === item.name ? 2.5 : 1.5} />
            <span className={cn("text-[10px]", activeTab === item.name ? "font-bold" : "font-medium")}>{item.name === 'My Courses' ? 'Courses' : item.name}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-red-400 min-w-[60px]"
        >
          <LogOut size={20} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
}
