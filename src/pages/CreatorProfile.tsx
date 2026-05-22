import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { GlowCard } from '../components/ui/spotlight-card';
import {
  Star, Users, PlayCircle, ShieldCheck, Twitter, Linkedin, Globe, MapPin, Award, BookOpen,
  Camera, X, Edit3, Save, ChevronLeft, ArrowRight, Video, Eye, DollarSign, Loader2, LayoutDashboard, UploadCloud
} from 'lucide-react';
import { cn } from '../lib/utils';
import CourseCard from '../components/CourseCard';
import { Course } from '../types';
import { imageFileToDataUrl, uploadProfileImage } from '../lib/profileImage';

export default function CreatorProfile() {
  const navigate = useNavigate();
  const { id: publicId } = useParams<{ id: string }>();
  const { user, profile, refreshProfile } = useAuth();
  const isPublic = !!publicId;

  // Public profile state
  const [publicCreator, setPublicCreator] = React.useState<any>(null);
  const [publicCourses, setPublicCourses] = React.useState<Course[]>([]);

  // Own profile state
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showCamera, setShowCamera] = React.useState(false);
  const [cameraStream, setCameraStream] = React.useState<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = React.useState(false);
  const [cameraError, setCameraError] = React.useState('');
  const [avatarImage, setAvatarImage] = React.useState<string | null>(null);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [twitter, setTwitter] = React.useState('');
  const [linkedin, setLinkedin] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [creatorCourses, setCreatorCourses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isCreatorAccount = profile?.role === 'creator' || profile?.role === 'admin';

  React.useEffect(() => {
    if (isPublic) {
      fetchPublicCreator();
      return;
    }
    if (!user) {
      navigate('/login');
      return;
    }
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setBio(profile.bio || '');
      setTwitter(profile.twitter || '');
      setLinkedin(profile.linkedin || '');
      setWebsite(profile.website || '');
      if (profile.avatar_url) setAvatarImage(profile.avatar_url);
    }
    fetchOwnCourses();
  }, [user, profile, publicId, isPublic]);

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

  const fetchPublicCreator = async () => {
    if (!publicId) return;
    setLoading(true);
    try {
      const { data: creatorData, error: creatorError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', publicId)
        .single();
      
      if (creatorError) throw creatorError;
      setPublicCreator(creatorData);

      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', publicId)
        .eq('status', 'published');
      
      if (!coursesError && coursesData) {
        const instructorName = `${creatorData.first_name || 'Creator'} ${creatorData.last_name || ''}`.trim();
        setPublicCourses(coursesData.map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description || '',
          category: course.category || 'AI & ML',
          rating: course.rating || 0,
          reviewsCount: course.reviews_count || 0,
          price: course.price || 0,
          instructor: {
            name: instructorName,
            role: creatorData.role || 'Creator',
            avatar: creatorData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorName || 'Creator')}&background=1E40AF&color=fff`,
          },
          thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
          duration: course.duration || '0 hrs',
          videoUrl: course.video_url,
          type: course.type || 'video',
        })));
      }
    } catch (e) {
      console.error('Error fetching public creator:', e);
    }
    setLoading(false);
  };

  const fetchOwnCourses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) setCreatorCourses(data);
    } catch (e) {
      console.error('Error fetching courses:', e);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      let finalAvatarUrl = avatarImage;
      if (avatarImage && avatarImage.startsWith('data:image')) {
        finalAvatarUrl = await uploadProfileImage(user.id, avatarImage);
      }

      const profileUpdates = {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        avatar_url: finalAvatarUrl,
        bio,
        twitter,
        linkedin,
        website,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('profiles').upsert(profileUpdates);

      if (error) {
        const isMissingOptionalColumn = /bio|twitter|linkedin|website/i.test(error.message);
        if (!isMissingOptionalColumn) throw error;

        const { error: fallbackError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            first_name: firstName,
            last_name: lastName,
            avatar_url: finalAvatarUrl,
            updated_at: new Date().toISOString()
          });

        if (fallbackError) throw fallbackError;
      }

      await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          avatar_url: finalAvatarUrl,
        },
      });

      await refreshProfile();
      setIsEditing(false);
      window.showToast('Profile updated successfully!');
    } catch (err: any) {
      const message = /row-level security|violates.*policy/i.test(err.message || '')
        ? 'Supabase profile permissions are not set up yet. Run the updated SETUP_DATABASE.sql script, then try saving again.'
        : err.message || 'Failed to update profile';
      window.showToast(message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

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
      console.error('Camera error:', err);
      const message = err?.name === 'NotAllowedError'
        ? 'Camera permission was blocked. Allow camera access in your browser settings, then try again.'
        : err?.name === 'NotFoundError'
          ? 'No camera was found on this device.'
          : err?.message || 'Could not access camera.';
      setCameraError(message);
      window.showToast(message, 'error');
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

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      setAvatarImage(canvasRef.current.toDataURL('image/png'));
      stopCamera();
    }
  };

  const handleImageUpload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.showToast('Please choose an image file.', 'error');
      return;
    }

    try {
      setAvatarImage(await imageFileToDataUrl(file));
    } catch (error: any) {
      window.showToast(error.message || 'Could not load that image.', 'error');
    }
  };

  const totalStudents = creatorCourses.reduce((acc, c) => acc + (c.students || 0), 0);
  const totalViews = creatorCourses.reduce((acc, c) => acc + (c.views || 0), 0);
  const avgRating = creatorCourses.length > 0
    ? (creatorCourses.reduce((acc, c) => acc + (c.rating || 0), 0) / creatorCourses.length).toFixed(1)
    : '0.0';

  const initials = `${firstName || 'C'} ${(lastName || 'R')}`.trim();

  // Public profile view
  if (isPublic && loading) {
    return (
      <div className="bg-surface-container-lowest min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="text-primary animate-spin" />
      </div>
    );
  }

  if (isPublic) {
    const creator = publicCreator;
    const courses = publicCourses;
    if (!creator) {
      return (
        <div className="bg-surface-container-lowest min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <h1 className="font-headline font-black text-3xl text-primary mb-3">Creator not found</h1>
          <p className="text-on-surface-variant mb-6">This creator profile is unavailable or no longer public.</p>
          <Link to="/courses" className="text-secondary font-bold hover:underline">Browse courses</Link>
        </div>
      );
    }
    const creatorName = `${creator.first_name || 'Creator'} ${creator.last_name || ''}`.trim();
    const creatorAvatar = creator.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=1E40AF&color=fff`;
    return (
      <div className="bg-surface min-h-screen">
        <div className="relative h-[280px] md:h-[360px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary z-10" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/30 rounded-full blur-[100px] z-0" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[80px] z-0" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent z-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-30 -mt-36 md:-mt-48 pb-24">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-outline-variant/10 mb-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary to-primary" />
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="shrink-0 relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-secondary to-primary rounded-full blur opacity-25 group-hover:opacity-50 transition" />
                <img src={creatorAvatar} alt={creatorName}
                  className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-[6px] border-white shadow-2xl object-cover" referrerPolicy="no-referrer" />
                {creator.role === 'creator' && (
                  <div className="absolute bottom-2 right-4 md:bottom-4 md:right-4 w-12 h-12 bg-secondary rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <ShieldCheck size={24} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-grow space-y-8 w-full">
                <div>
                  <h1 className="font-headline font-black text-4xl md:text-5xl text-primary tracking-tight mb-2">{creatorName}</h1>
                  <p className="text-xl md:text-2xl text-secondary font-bold">{creator.role || 'Creator'}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm font-bold">
                  <div className="flex items-center gap-2 bg-surface-container px-4 py-2.5 rounded-full text-on-surface-variant">
                    <MapPin size={16} className="text-primary" /><span>{creator.location || 'Abuja, NG'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-50 px-4 py-2.5 rounded-full text-amber-700">
                    <Star fill="currentColor" size={16} className="text-amber-500" /><span>{creator.rating || '4.9'} Rating</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2.5 rounded-full text-blue-700">
                    <Users size={16} className="text-blue-500" /><span>{creator.students ? `${(creator.students / 1000).toFixed(1)}k` : '24.5k'} Students</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 px-4 py-2.5 rounded-full text-green-700">
                    <PlayCircle size={16} className="text-green-500" /><span>{courses.length} Courses</span>
                  </div>
                </div>
                <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">{creator.bio || 'Passionate AI Researcher and Educator making advanced AI concepts accessible across Africa.'}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen size={24} />
              </div>
              <div>
                <h2 className="font-headline font-black text-3xl text-primary">Courses</h2>
                <p className="text-on-surface-variant">by {creatorName}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Own profile view
  if (!user && !loading) return null;
  const dashboardHref = isCreatorAccount ? '/creator-dashboard' : '/dashboard';
  const dashboardLabel = isCreatorAccount ? 'Back to Hub' : 'Back to Dashboard';
  const roleLabel = isCreatorAccount ? 'AI Course Creator' : 'AI Student';

  return (
    <div className="bg-surface-container-lowest min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[280px] md:h-[360px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary z-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/30 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[80px] z-0" />
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] z-10" style={{ backgroundSize: '32px 32px' }} />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-container-lowest to-transparent z-20" />
        <Link to={dashboardHref} className="absolute top-6 left-6 z-30 flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl text-white font-bold hover:bg-white/30 transition-colors border border-white/10">
          <ChevronLeft size={16} /> {dashboardLabel}
        </Link>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-30 -mt-36 md:-mt-48 pb-24">

        {/* Main Profile Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-outline-variant/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary via-primary to-secondary" />

          {/* Avatar & Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 md:p-10">
            {/* Avatar */}
            <div className="relative shrink-0 group">
              <div className="absolute -inset-1.5 bg-gradient-to-br from-secondary to-primary rounded-full blur opacity-30 group-hover:opacity-50 transition" />
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-[5px] border-white shadow-2xl overflow-hidden bg-surface-container">
                {avatarImage ? (
                  <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl md:text-5xl font-headline font-black text-primary/20">{initials.charAt(0)}</span>
                  </div>
                )}
                {isEditing && (
                  <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <UploadCloud size={24} className="text-white" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  capture="user"
                  onChange={(event) => handleImageUpload(event.target.files?.[0])}
                />
              </div>
              {isEditing && (
                <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 rounded-full bg-white text-primary shadow-lg border border-outline-variant/10 flex items-center justify-center hover:bg-surface-container-low transition-colors"
                    title="Upload profile picture"
                  >
                    <UploadCloud size={18} />
                  </button>
                  <button
                    onClick={startCamera}
                    className="w-10 h-10 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                    title="Take profile picture"
                  >
                    <Camera size={24} className="text-white" />
                  </button>
                </div>
              )}
              {isCreatorAccount && (
                <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <ShieldCheck size={20} className="text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name"
                      className="flex-1 px-5 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-bold text-primary" />
                    <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name"
                      className="flex-1 px-5 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-bold text-primary" />
                  </div>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Write a short bio about yourself..."
                    rows={3}
                    className="w-full px-5 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium text-on-surface-variant resize-none" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative">
                      <Twitter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                      <input value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="Twitter URL"
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium" />
                    </div>
                    <div className="relative">
                      <Linkedin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                      <input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="LinkedIn URL"
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium" />
                    </div>
                    <div className="relative">
                      <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                      <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="Website URL"
                        className="w-full pl-10 pr-4 py-3 bg-surface-container-low rounded-xl border border-outline-variant/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium" />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center md:justify-start">
                    <button onClick={handleSave} disabled={isSaving}
                      className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-70">
                      {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      {isSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button onClick={() => setIsEditing(false)}
                      className="bg-surface-container-low text-on-surface-variant px-6 py-3 rounded-xl font-bold hover:bg-surface-container-high transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h1 className="font-headline font-black text-3xl md:text-4xl text-primary tracking-tight mb-1">
                        {firstName || 'Creator'} {lastName}
                      </h1>
                      <p className="text-lg md:text-xl text-secondary font-bold">{roleLabel}</p>
                    </div>
                    <button onClick={() => setIsEditing(true)}
                      className="w-full md:w-auto bg-primary/10 text-primary px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors">
                      <Edit3 size={16} /> Edit Profile
                    </button>
                  </div>
                  {bio && (
                    <p className="mt-4 text-on-surface-variant leading-relaxed max-w-2xl">{bio}</p>
                  )}
                  <div className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start">
                    <div className="flex items-center gap-2 bg-surface-container px-4 py-2.5 rounded-full text-sm font-bold text-on-surface-variant">
                      <MapPin size={16} className="text-primary" />
                      <span>Nigeria</span>
                    </div>
                    {isCreatorAccount ? (
                      <>
                        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2.5 rounded-full text-sm font-bold text-amber-700">
                          <Star size={16} className="text-amber-500 fill-amber-500" />
                          <span>{avgRating} Rating</span>
                        </div>
                        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2.5 rounded-full text-sm font-bold text-blue-700">
                          <Users size={16} className="text-blue-500" />
                          <span>{totalStudents.toLocaleString()} Students</span>
                        </div>
                        <div className="flex items-center gap-2 bg-green-50 px-4 py-2.5 rounded-full text-sm font-bold text-green-700">
                          <BookOpen size={16} className="text-green-500" />
                          <span>{creatorCourses.length} Courses</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2.5 rounded-full text-sm font-bold text-blue-700">
                        <BookOpen size={16} className="text-blue-500" />
                        <span>Learning profile</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {isCreatorAccount && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {[
            { label: 'Total Revenue', value: `₦${creatorCourses.reduce((a, c) => a + (c.revenue || 0), 0).toLocaleString()}`, icon: DollarSign, color: 'green' },
            { label: 'Total Students', value: totalStudents.toLocaleString(), icon: Users, color: 'blue' },
            { label: 'Course Views', value: totalViews.toLocaleString(), icon: Eye, color: 'purple' },
            { label: 'Avg. Rating', value: avgRating, icon: Star, color: 'amber' },
          ].map((stat, i) => (
            <GlowCard key={i} glowColor={stat.color as any}
              className="bg-white p-4 sm:p-6 rounded-2xl border border-outline-variant/10 h-auto">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                stat.color === 'green' && "bg-green-500/10 text-green-600",
                stat.color === 'blue' && "bg-primary/10 text-primary",
                stat.color === 'amber' && "bg-amber-500/10 text-amber-600",
                stat.color === 'purple' && "bg-purple-500/10 text-purple-600"
              )}>
                <stat.icon size={20} />
              </div>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-1">{stat.label}</p>
              <h4 className="text-xl sm:text-2xl font-headline font-black text-primary">{stat.value}</h4>
            </GlowCard>
          ))}
        </div>
        )}

        {/* Connect Section (when not editing) */}
        {!isEditing && (twitter || linkedin || website) && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {twitter && (
              <a href={twitter} target="_blank" rel="noopener noreferrer"
                className="bg-white p-5 rounded-2xl border border-outline-variant/10 flex items-center gap-4 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Twitter size={20} />
                </div>
                <div>
                  <p className="font-bold text-primary">Twitter</p>
                  <p className="text-xs text-on-surface-variant">Follow for AI tips</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer"
                className="bg-white p-5 rounded-2xl border border-outline-variant/10 flex items-center gap-4 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                  <Linkedin size={20} />
                </div>
                <div>
                  <p className="font-bold text-primary">LinkedIn</p>
                  <p className="text-xs text-on-surface-variant">Connect professionally</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </a>
            )}
            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer"
                className="bg-white p-5 rounded-2xl border border-outline-variant/10 flex items-center gap-4 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="font-bold text-primary">Website</p>
                  <p className="text-xs text-on-surface-variant">Visit my portfolio</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </a>
            )}
          </div>
        )}

        {/* Courses Section */}
        {isCreatorAccount && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen size={24} />
              </div>
              <div>
                <h2 className="font-headline font-black text-2xl md:text-3xl text-primary">My Courses</h2>
                <p className="text-on-surface-variant text-sm">{creatorCourses.length} courses published</p>
              </div>
            </div>
            <button onClick={() => navigate('/creator-dashboard')}
              className="text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1">
              Manage <ChevronLeft size={14} className="rotate-180" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="text-primary animate-spin" />
            </div>
          ) : creatorCourses.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-outline-variant/20 p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-headline font-bold text-primary mb-2">No courses yet</h3>
              <p className="text-on-surface-variant mb-6">Start creating your first course and share your knowledge</p>
              <button onClick={() => navigate('/creator-dashboard')}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:scale-105 transition-transform">
                Go to Creator Hub <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {creatorCourses.map((course) => (
                <GlowCard key={course.id} glowColor="blue"
                  className="bg-white overflow-hidden flex flex-col h-auto border border-outline-variant/10 group hover:border-primary/30">
                  <div className="relative h-44 overflow-hidden">
                    <img src={course.thumbnail || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 left-3">
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold",
                        course.status === 'published' ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                      )}>
                        {course.status || 'published'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-4 flex-grow">
                    <h3 className="font-bold text-primary line-clamp-2">{course.title}</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-surface-container-low rounded-lg">
                        <Users size={14} className="mx-auto mb-1 text-primary" />
                        <p className="text-xs font-black text-primary">{course.students || 0}</p>
                      </div>
                      <div className="text-center p-2 bg-surface-container-low rounded-lg">
                        <Eye size={14} className="mx-auto mb-1 text-secondary" />
                        <p className="text-xs font-black text-primary">{course.views || 0}</p>
                      </div>
                      <div className="text-center p-2 bg-surface-container-low rounded-lg">
                        <Star size={14} className="mx-auto mb-1 text-amber-500 fill-amber-500" />
                        <p className="text-xs font-black text-primary">{course.rating || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                      <span className="text-lg font-black text-secondary">₦{(course.price || 0).toLocaleString()}</span>
                      <span className="text-sm font-bold text-green-600">₦{(course.revenue || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="bg-white rounded-[2.5rem] overflow-hidden max-w-xl w-full relative">
              <button onClick={stopCamera} className="absolute top-6 right-6 z-10 p-3 bg-black/10 hover:bg-black/20 rounded-full text-white">
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
              <div className="p-8 text-center">
                <h3 className="text-xl font-headline font-bold text-primary mb-2">Take a Profile Picture</h3>
                <p className="text-sm text-on-surface-variant mb-6">
                  {cameraError ? 'After allowing camera access, try again or upload a photo instead.' : 'Make sure your face is clearly visible.'}
                </p>
                {cameraError ? (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={startCamera}
                      className="bg-primary text-white px-5 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                      <Camera size={18} /> Try Camera Again
                    </button>
                    <button onClick={() => {
                      stopCamera();
                      fileInputRef.current?.click();
                    }}
                      className="bg-surface-container-low text-primary px-5 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
                      <UploadCloud size={18} /> Upload Photo
                    </button>
                  </div>
                ) : (
                  <button onClick={takePhoto} disabled={!cameraReady}
                    className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all mx-auto disabled:opacity-60 disabled:hover:scale-100">
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
}
