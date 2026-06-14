import React from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, PlayCircle, Clock, Video, FileText, CheckCircle2, ChevronDown, Share2, ShieldCheck, GraduationCap, Users, Download, HardDrive, Loader2, Trash2, WifiOff, ClipboardCheck, Target, UploadCloud } from 'lucide-react';
import { COURSES } from '../constants';
import { Course } from '../types';
import { cn } from '../lib/utils';
import { GlowCard } from '../components/ui/spotlight-card';
import SecureVideo from '../components/SecureVideo';

import { supabase } from '../lib/supabase';
import { getSignedCourseVideoUrl } from '../lib/secureVideo';
import { ActiveSubscription, fetchActiveSubscription, monthlySubscriptionPrice, startMonthlySubscriptionCheckout } from '../lib/subscription';
import { deleteOfflineVideo, formatOfflineVideoSize, getOfflineVideo, isOfflineVideoPlayable, OfflineVideo, saveOfflineVideo } from '../lib/offlineVideos';
import { generateCourseAssignment } from '../lib/assignments';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = React.useState<Course & Record<string, any> | null>(null);
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [activeSubscription, setActiveSubscription] = React.useState<ActiveSubscription | null>(null);
  const [activeModule, setActiveModule] = React.useState<number | null>(0);
  const [activeVideo, setActiveVideo] = React.useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [offlineVideo, setOfflineVideo] = React.useState<OfflineVideo | null>(null);
  const [offlineVideoUrl, setOfflineVideoUrl] = React.useState<string | null>(null);
  const [offlineDownloadProgress, setOfflineDownloadProgress] = React.useState(0);
  const [offlineDownloadLoading, setOfflineDownloadLoading] = React.useState(false);

  React.useEffect(() => {
    fetchCourseData();
  }, [id]);

  React.useEffect(() => {
    return () => {
      if (offlineVideoUrl) URL.revokeObjectURL(offlineVideoUrl);
    };
  }, [offlineVideoUrl]);

  React.useEffect(() => {
    if (!currentUserId || !course?.id) {
      setOfflineVideo(null);
      setOfflineVideoUrl(null);
      return;
    }

    let cancelled = false;

    const loadOfflineVideo = async () => {
      try {
        const storedVideo = await getOfflineVideo(currentUserId, course.id);
        if (cancelled) return;
        setOfflineVideo(storedVideo || null);
        setOfflineVideoUrl((existingUrl) => {
          if (existingUrl) URL.revokeObjectURL(existingUrl);
          return storedVideo ? URL.createObjectURL(storedVideo.blob) : null;
        });
      } catch (error) {
        console.warn('Could not load offline video:', error);
      }
    };

    loadOfflineVideo();

    return () => {
      cancelled = true;
    };
  }, [course?.id, currentUserId]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get('payment_reference') || params.get('reference');
    if (!reference || !id) return;

    let cancelled = false;

    const verifyPayment = async () => {
      setCheckoutLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('verify-paystack-payment', {
          body: { reference },
        });

        if (error) throw error;

        if (!cancelled && data?.status === 'success') {
          window.showToast?.('Subscription confirmed. You now have one month access to all courses.', 'success');
          fetchCourseData();
        } else if (!cancelled) {
          window.showToast?.('Payment was not confirmed. Please contact support if you were debited.', 'error');
        }
      } catch (error: any) {
        if (!cancelled) {
          window.showToast?.(error.message || 'Unable to verify payment right now.', 'error');
        }
      } finally {
        if (!cancelled) {
          setCheckoutLoading(false);
          navigate(`/course/${id}`, { replace: true });
        }
      }
    };

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [id, location.search, navigate]);

  const fetchCourseData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const fallbackCourse = COURSES.find((item) => item.id === id);
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

      if (!isUuid) {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
        const subscription = await fetchActiveSubscription(user?.id);
        setActiveSubscription(subscription);
        setCourse(fallbackCourse || null);
        setReviews([]);
        return;
      }

      // 1. Fetch Course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*, instructor:profiles!instructor_id(first_name, last_name, avatar_url)')
        .eq('id', id)
        .single();

      if (courseError) throw courseError;
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      const subscription = await fetchActiveSubscription(user?.id);
      setActiveSubscription(subscription);
      setCourse({
        id: courseData.id,
        title: courseData.title,
        description: courseData.description || '',
        category: courseData.category || 'AI & ML',
        rating: courseData.rating || 0,
        reviewsCount: courseData.reviews_count || 0,
        price: courseData.price || 0,
        instructor: {
          name: `${courseData.instructor?.first_name || 'Expert'} ${courseData.instructor?.last_name || 'Instructor'}`.trim(),
          role: 'AI Specialist',
          avatar: courseData.instructor?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(courseData.instructor?.first_name || 'AI')}&background=1E40AF&color=fff`,
        },
        thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
        duration: courseData.duration || '0 hrs',
        videoUrl: await getSignedCourseVideoUrl(courseData.video_url),
        type: courseData.type || 'video',
        instructor_id: courseData.instructor_id,
        students: courseData.students || 0,
        created_at: courseData.created_at,
      });

      // 2. Fetch Reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*, profiles:user_id(first_name, last_name, avatar_url)')
        .eq('course_id', id)
        .order('created_at', { ascending: false });
      
      if (reviewsData) setReviews(reviewsData);

    } catch (error) {
      console.error('Error fetching course:', error);
      const fallbackCourse = COURSES.find((item) => item.id === id);
      setCourse(fallbackCourse || null);
    } finally {
      setLoading(false);
    }
  };

  const getCheckoutErrorMessage = async (error: any) => {
    const response = error?.context || error?.response;
    if (response?.json) {
      try {
        const body = await response.json();
        if (body?.error) return body.error;
      } catch {
        // Fall through to default message.
      }
    }

    if (/payment service is not configured/i.test(error?.message || '')) {
      return 'Payment is not fully configured yet. Please set PAYSTACK_SECRET_KEY to your Paystack live secret key in Supabase Edge Function secrets.';
    }

    return error?.message || 'Unable to start checkout. Please try again.';
  };

  const handleBuyNow = async () => {
    if (!course?.id) return;

    if (activeSubscription) {
      window.showToast?.('Your subscription is already active.', 'success');
      navigate('/dashboard');
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate(`/login?redirect=/course/${course.id}`);
      return;
    }

    setCheckoutLoading(true);
    try {
      const callbackUrl = `${window.location.origin}/course/${course.id}`;
      window.location.href = await startMonthlySubscriptionCheckout(callbackUrl);
    } catch (error: any) {
      window.showToast?.(await getCheckoutErrorMessage(error), 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const hasActiveSubscription = Boolean(activeSubscription);
  const canPlayOfflineVideo = isOfflineVideoPlayable(offlineVideo);
  const paidVideoSrc = canPlayOfflineVideo ? offlineVideoUrl : course?.videoUrl;
  const assignment = course ? (course.assignment || generateCourseAssignment(course)) : null;

  const handleDownloadForOffline = async () => {
    if (!course) return;

    if (!currentUserId) {
      navigate(`/login?redirect=/course/${course.id}`);
      return;
    }

    if (!activeSubscription) {
      window.showToast?.('Subscribe first, then you can save paid videos inside the app.', 'error');
      return;
    }

    if (!course.videoUrl) {
      window.showToast?.('This course video is not available for offline download yet.', 'error');
      return;
    }

    setOfflineDownloadLoading(true);
    setOfflineDownloadProgress(0);
    try {
      const storedVideo = await saveOfflineVideo({
        course,
        userId: currentUserId,
        sourceUrl: course.videoUrl,
        expiresAt: activeSubscription.expires_at,
        onProgress: setOfflineDownloadProgress,
      });

      setOfflineVideo(storedVideo);
      setOfflineVideoUrl((existingUrl) => {
        if (existingUrl) URL.revokeObjectURL(existingUrl);
        return URL.createObjectURL(storedVideo.blob);
      });
      window.showToast?.('Saved inside the app for offline viewing.', 'success');
    } catch (error: any) {
      window.showToast?.(error.message || 'Unable to save this video offline.', 'error');
    } finally {
      setOfflineDownloadLoading(false);
    }
  };

  const handleRemoveOfflineVideo = async () => {
    if (!course || !currentUserId) return;
    try {
      await deleteOfflineVideo(currentUserId, course.id);
      setOfflineVideo(null);
      setOfflineVideoUrl((existingUrl) => {
        if (existingUrl) URL.revokeObjectURL(existingUrl);
        return null;
      });
      if (activeVideo?.startsWith('blob:')) setActiveVideo(null);
      window.showToast?.('Offline copy removed from this device.', 'success');
    } catch (error: any) {
      window.showToast?.(error.message || 'Unable to remove offline video.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Course not found</h2>
        <Link to="/courses" className="text-secondary font-bold hover:underline">Back to Courses</Link>
      </div>
    );
  }
  
  // Mock Curriculum Data
  const curriculum = [
    { title: 'Module 1: Introduction to AI concepts', lessons: 5, duration: '2 hours of video' },
    { title: 'Module 2: Machine Learning Fundamentals', lessons: 8, duration: '3.5 hours of video' },
    { title: 'Module 3: Deep Learning & Neural Networks', lessons: 6, duration: '4 hours of video' },
    { title: 'Module 4: Real-world AI Projects', lessons: 4, duration: '2.5 hours of video' },
  ];
  return (
    <div className="bg-surface pb-24">
      {/* 🚀 Dark Header / Hero Section */}
      <section className="bg-primary text-white py-16 lg:py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12 relative">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full uppercase tracking-widest">
                {course.category}
              </span>
              {course.isBestseller && (
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold rounded-full">
                  BESTSELLER
                </span>
              )}
            </div>
            
            <h1 className="font-headline font-extrabold text-3xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
              {course.title}
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-white/70">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star fill="currentColor" size={18} />
                <span className="text-white ml-1">{course.rating || '0.0'}</span>
                <span className="text-white/50 font-normal">({reviews.length} ratings)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>{(course.students || 0).toLocaleString()} students enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>Last updated {course.created_at ? new Date(course.created_at).toLocaleDateString() : 'recently'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <img 
                src={course.instructor.avatar} 
                alt={course.instructor.name}
                className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
              />
              <div>
                <p className="font-medium text-white/70 text-sm">Created by</p>
                {course.instructor_id ? (
                  <Link to={`/creator/${course.instructor_id}`} className="font-bold text-secondary hover:text-white transition-colors">
                    {course.instructor.name}
                  </Link>
                ) : (
                  <span className="font-bold text-secondary">{course.instructor.name}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-8 lg:gap-12 -mt-10 md:-mt-12 lg:-mt-24 relative z-10">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* What you'll learn */}
          <GlowCard 
            glowColor="blue"
            customSize={true}
            className="bg-white p-8 rounded-3xl border border-outline-variant/20 shadow-sm mt-24 lg:mt-32 h-auto"
          >
            <h2 className="font-headline font-bold text-2xl text-primary mb-6">What you'll learn</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Understand the core mathematics behind Machine Learning",
                "Build practical AI applications using Python",
                "Deploy AI models to cloud infrastructure",
                "Integrate web3 concepts with intelligent agents",
                "Master prompt engineering for LLMs",
                "Earn a verified certificate of completion"
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <CheckCircle2 className="text-secondary shrink-0 mt-0.5" size={20} />
                  <span className="text-on-surface-variant">{item}</span>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Curriculum */}
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-6">
              <h2 className="font-headline font-bold text-2xl md:text-3xl text-primary">Course Content</h2>
              <span className="text-sm text-on-surface-variant">{curriculum.length} modules • {course.duration}</span>
            </div>
            
            <div className="space-y-4">
              {curriculum.map((mod, index) => (
                <div key={index} className="bg-white border border-outline-variant/20 rounded-2xl overflow-hidden">
                  <button 
                    onClick={() => setActiveModule(activeModule === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <ChevronDown 
                        className={cn("text-primary transition-transform duration-300", activeModule === index && "rotate-180")} 
                        size={20} 
                      />
                      <span className="font-bold text-primary text-lg">{mod.title}</span>
                    </div>
                    <span className="text-sm text-on-surface-variant hidden sm:block">
                      {mod.lessons} lessons • {mod.duration}
                    </span>
                  </button>
                  
                  {activeModule === index && (
                    <div className="px-6 py-4 border-t border-outline-variant/10 bg-white">
                       <ul className="space-y-3">
                         {[1, 2, 3].map((lesson) => (
                           <li 
                             key={lesson} 
                             className="flex items-center justify-between group cursor-pointer hover:bg-surface-container-lowest p-2 rounded-lg transition-colors"
                             onClick={() => {
                               if (!hasActiveSubscription) {
                                 window.showToast?.('Subscribe to watch paid lessons.', 'error');
                                 return;
                               }
                               if (!paidVideoSrc) {
                                 window.showToast?.('This lesson video is not available yet.', 'error');
                                 return;
                               }
                               setActiveVideo(paidVideoSrc);
                               window.scrollTo({ top: 0, behavior: 'smooth' });
                             }}
                           >
                             <div className="flex items-center gap-3">
                               <PlayCircle className={cn("transition-colors", activeVideo ? "text-secondary" : "text-on-surface-variant group-hover:text-secondary")} size={18} />
                               <span className={cn("transition-colors font-medium", activeVideo ? "text-primary" : "text-on-surface group-hover:text-primary")}>
                                 Lesson {lesson}: Deep dive into concepts
                               </span>
                             </div>
                             <span className="text-sm text-on-surface-variant">15:00</span>
                           </li>
                         ))}
                       </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {assignment && (
            <section className="rounded-3xl border border-secondary/15 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-secondary">
                    <ClipboardCheck size={14} />
                    Assignment / Project
                  </div>
                  <h2 className="font-headline text-2xl font-black text-primary md:text-3xl">{assignment.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-on-surface-variant">{assignment.brief}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center sm:w-56">
                  <div className="rounded-2xl bg-surface-container-low p-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Time</p>
                    <p className="mt-1 font-headline text-sm font-black text-primary">{assignment.estimatedTime}</p>
                  </div>
                  <div className="rounded-2xl bg-surface-container-low p-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Level</p>
                    <p className="mt-1 font-headline text-sm font-black text-primary">{assignment.difficulty}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-5">
                  <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-5">
                    <div className="mb-3 flex items-center gap-2 text-sm font-black text-primary">
                      <Target size={18} className="text-secondary" />
                      Scenario
                    </div>
                    <p className="text-sm font-medium leading-6 text-on-surface-variant">{assignment.scenario}</p>
                  </div>
                  <div>
                    <h3 className="mb-3 font-headline text-lg font-black text-primary">Milestones</h3>
                    <div className="space-y-3">
                      {assignment.milestones.map((milestone, index) => (
                        <div key={milestone} className="flex gap-3 rounded-2xl border border-outline-variant/10 bg-white p-4">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-black text-white">{index + 1}</span>
                          <p className="text-sm font-medium leading-6 text-on-surface-variant">{milestone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <h3 className="mb-3 font-headline text-lg font-black text-primary">Deliverables</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {assignment.deliverables.map((deliverable) => (
                        <div key={deliverable} className="flex gap-3 rounded-2xl bg-secondary/5 p-4">
                          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-secondary" />
                          <p className="text-sm font-bold leading-6 text-primary">{deliverable}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-5">
                    <h3 className="font-headline text-lg font-black text-primary">Submission</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-on-surface-variant">{assignment.submissionFormat}</p>
                    <textarea
                      placeholder="Paste your project link, notes, or reflection here"
                      className="mt-4 min-h-28 w-full resize-none rounded-2xl border border-outline-variant/20 bg-white p-4 text-sm font-medium text-primary outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10"
                    />
                    <button
                      onClick={() => window.showToast?.('Assignment submission saved locally for now. Connect storage/database when you are ready to accept files.', 'success')}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition-all hover:bg-primary-container active:scale-95"
                    >
                      <UploadCloud size={17} /> Save Submission
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="pt-8">
            <h2 className="font-headline font-bold text-2xl md:text-3xl text-primary mb-8">Student Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review) => {
                const studentName = review.profiles ? `${review.profiles.first_name} ${review.profiles.last_name}` : 'Student';
                const studentAvatar = review.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${studentName}&background=1E40AF&color=fff`;
                
                return (
                  <div key={review.id} className="bg-white p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={studentAvatar} alt={studentName} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-primary">{studentName}</p>
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                          ))}
                          <span className="text-xs text-on-surface-variant ml-2">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed italic">
                      "{review.content || review.comment}"
                    </p>
                  </div>
                );
              })}
              {reviews.length === 0 && (
                <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/20">
                  <Star className="mx-auto text-outline-variant mb-4" size={48} />
                  <p className="text-on-surface-variant font-medium">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* 🚀 Sticky Sidebar Checkout - Reordered for mobile to appear at top if needed, but keeping standard flow for now with optimized mobile padding */}
        <div className="lg:col-span-1 order-first lg:order-last">
          <GlowCard 
            glowColor="blue"
            customSize={true}
            className="bg-white rounded-3xl border border-outline-variant/20 shadow-xl overflow-hidden lg:sticky lg:top-28 !p-0 h-auto"
          >
            {/* Video Preview / Active Player */}
            {activeVideo ? (
              <div className="relative h-56 bg-black">
                <SecureVideo 
                  src={activeVideo} 
                  autoPlay 
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div 
                className="relative h-56 bg-primary cursor-pointer group"
                onClick={() => {
                  if (!hasActiveSubscription) {
                    window.showToast?.('Subscribe to watch paid lessons.', 'error');
                    return;
                  }
                  if (paidVideoSrc) setActiveVideo(paidVideoSrc);
                }}
              >
                <img 
                  src={course.thumbnail} 
                  alt="Course Preview" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur border-2 border-white rounded-full flex items-center justify-center group-hover:bg-secondary group-hover:border-secondary transition-all">
                    <PlayCircle className="text-white fill-white/10" size={32} />
                  </div>
                </div>
                <div className="absolute bottom-4 inset-x-0 text-center font-bold text-white tracking-widest text-sm drop-shadow-md">
                  PREVIEW COURSE
                </div>
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-black text-primary tracking-tight">
                   ₦{monthlySubscriptionPrice.toLocaleString()}
                </span>
                {course.oldPrice && (
                  <span className="text-lg text-on-surface-variant line-through font-medium mb-1">
                    ₦{course.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <button
                  disabled
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  One month access to all courses
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={hasActiveSubscription || checkoutLoading}
                  className="w-full bg-white text-secondary border-2 border-secondary py-4 rounded-xl font-bold text-lg hover:bg-secondary hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {hasActiveSubscription ? 'Subscription Active' : checkoutLoading ? 'Opening Checkout...' : 'Subscribe Now'}
                </button>
              </div>

              <div className="mb-8 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    {canPlayOfflineVideo ? <WifiOff size={21} /> : <HardDrive size={21} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-headline text-base font-black text-primary">In-app offline video</h3>
                    <p className="mt-1 text-xs font-medium leading-5 text-on-surface-variant">
                      {canPlayOfflineVideo
                        ? `Saved on this device. Expires ${new Date(offlineVideo!.expiresAt).toLocaleDateString()}.`
                        : 'Subscribers can save this video inside the app and watch it from this device without streaming.'}
                    </p>

                    {offlineDownloadLoading && (
                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between text-xs font-black text-primary">
                          <span>Saving video</span>
                          <span>{offlineDownloadProgress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white">
                          <div
                            className="h-full rounded-full bg-secondary transition-all"
                            style={{ width: `${offlineDownloadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      {canPlayOfflineVideo ? (
                        <>
                          <button
                            onClick={() => {
                              if (offlineVideoUrl) setActiveVideo(offlineVideoUrl);
                            }}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs font-black text-white transition-all hover:bg-primary-container active:scale-95"
                          >
                            <PlayCircle size={16} /> Watch Offline
                          </button>
                          <button
                            onClick={handleRemoveOfflineVideo}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-white px-4 py-3 text-xs font-black text-red-600 transition-all hover:bg-red-50 active:scale-95"
                          >
                            <Trash2 size={16} /> Remove
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleDownloadForOffline}
                          disabled={!hasActiveSubscription || offlineDownloadLoading || !course.videoUrl}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-xs font-black text-white transition-all hover:bg-secondary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-55"
                        >
                          {offlineDownloadLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                          {hasActiveSubscription ? 'Save In App' : 'Subscribe to Save'}
                        </button>
                      )}
                    </div>

                    {canPlayOfflineVideo && (
                      <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">
                        {formatOfflineVideoSize(offlineVideo!.size)} stored locally
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm text-on-surface-variant border-b border-outline-variant/10 pb-6 mb-6">
                <div className="flex items-center gap-3">
                  <Video size={18} />
                  <span>{course.duration} on-demand video</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText size={18} />
                  <span>24 articles and resources</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} />
                  <span>One month access to every course</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap size={18} />
                  <span>Certificate of completion</span>
                </div>
              </div>

              {/* Affiliate Teaser Segment */}
              <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/20 relative overflow-hidden group hover:bg-secondary transition-colors cursor-pointer">
                <div className="flex items-center gap-3 relative z-10 group-hover:text-white">
                  <Share2 className="text-secondary group-hover:text-white" size={24} />
                  <div>
                    <h4 className="font-bold text-primary group-hover:text-white text-sm">Share & Earn 30%</h4>
                    <p className="text-xs text-on-surface-variant group-hover:text-white/80">Get a referral link for this course</p>
                  </div>
                </div>
              </div>

            </div>
          </GlowCard>
        </div>

      </div>
    </div>
  );
}
