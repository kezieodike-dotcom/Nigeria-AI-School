import React from 'react'; 

import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, BookOpen, CreditCard, Settings, LogOut, Search, Bell, Star, Clock, PlayCircle, ChevronRight, TrendingUp, Users, Share2, Rocket, User, Camera, UploadCloud, X, CheckCircle2, Heart, DollarSign, Link as LinkIcon, Copy, Twitter, ArrowUpRight, BarChart3, Edit3, ArrowRight, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { COURSES } from '../constants';
import GlowCard from '../components/ui/spotlight-card';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = React.useState('Overview');
  const [userName, setUserName] = React.useState('Student');
  const [showCamera, setShowCamera] = React.useState(false);
  const [avatarImage, setAvatarImage] = React.useState<string | null>(null);
  const [firstNameInput, setFirstNameInput] = React.useState('');
  const [lastNameInput, setLastNameInput] = React.useState('');
  const [emailInput, setEmailInput] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      window.showToast("Could not access camera. Please check permissions.", "error");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setAvatarImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  React.useEffect(() => {
    if (user) {
      const firstName = user.user_metadata?.first_name || 'Student';
      setUserName(firstName);
      setFirstNameInput(user.user_metadata?.first_name || '');
      setLastNameInput(user.user_metadata?.last_name || '');
      setEmailInput(user.email || '');
      if (user.user_metadata?.avatar_url) {
        setAvatarImage(user.user_metadata.avatar_url);
      }
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      let finalAvatarUrl = avatarImage;

      // If the avatarImage is a new base64 string, upload it to Supabase Storage first
      if (avatarImage && avatarImage.startsWith('data:image')) {
        try {
          const fileExt = avatarImage.substring("data:image/".length, avatarImage.indexOf(";base64"));
          const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
          
          // Convert base64 to Blob
          const res = await fetch(avatarImage);
          const blob = await res.blob();

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, blob, {
              contentType: `image/${fileExt}`,
              upsert: true
            });

          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
            
          finalAvatarUrl = publicUrlData.publicUrl;
        } catch (uploadError: any) {
           throw new Error("Failed to upload image. Please ensure you have created an 'avatars' bucket in Supabase Storage. Details: " + uploadError.message);
        }
      }

      const updates: any = {
        data: {
          first_name: firstNameInput,
          last_name: lastNameInput,
          avatar_url: finalAvatarUrl
        }
      };
      
      if (emailInput !== user?.email) {
        updates.email = emailInput;
      }
      
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      
      setAvatarImage(finalAvatarUrl); // Update local state with the new URL
      window.showToast("Profile updated successfully!");
    } catch (error: any) {
      window.showToast(error.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpgradeToCreator = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { role: 'creator' }
      });
      if (error) throw error;
      window.showToast("Successfully upgraded to Creator Account!");
      // Need to reload window to force context refresh or manually navigate
      window.location.href = '/creator-dashboard';
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
                { label: 'Courses Enrolled', value: '2', icon: BookOpen, glow: 'blue' as const },
                { label: 'Courses Completed', value: '0', icon: CheckCircle2, glow: 'green' as const },
                { label: 'Learning Hours', value: '14.5', icon: Clock, glow: 'purple' as const },
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
                  <GlowCard glowColor="blue" className="bg-white p-6 md:p-8 rounded-[2rem] border border-primary/20 flex flex-col md:flex-row items-center gap-8 h-auto shadow-xl shadow-primary/5">
                    <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden relative shrink-0">
                      <img src={COURSES[0].thumbnail} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <PlayCircle size={48} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-grow w-full space-y-4">
                      <div>
                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest bg-secondary/10 px-2 py-1 rounded-lg">In Progress</span>
                        <h3 className="font-headline font-bold text-xl text-primary mt-2">{COURSES[0].title}</h3>
                        <p className="text-sm text-on-surface-variant">Module 4: Neural Networks Basics</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-primary">
                          <span>45% Completed</span>
                          <span>2h 15m left</span>
                        </div>
                        <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[45%] rounded-full" />
                        </div>
                      </div>
                      <button className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all">
                        Resume Course <ArrowRight size={18} />
                      </button>
                    </div>
                  </GlowCard>
                </div>

                {/* My Courses Snapshot */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-headline font-bold text-primary">My Courses</h2>
                    <button onClick={() => setActiveTab('My Courses')} className="text-sm font-bold text-secondary hover:underline">View All</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {COURSES.slice(1, 3).map(course => (
                      <div key={course.id} className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden hover:border-primary/30 transition-all group">
                        <img src={course.thumbnail} className="w-full h-32 object-cover group-hover:scale-105 transition-transform" />
                        <div className="p-5 space-y-4">
                          <h4 className="font-bold text-primary text-sm line-clamp-1">{course.title}</h4>
                          <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                            <div className="h-full bg-secondary w-[10%] rounded-full" />
                          </div>
                          <button className="w-full py-2 bg-surface-container-low text-primary rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-colors">Continue</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar content */}
              <div className="space-y-12">
                {/* Recommended Courses */}
                <div className="space-y-6">
                  <h2 className="text-xl font-headline font-bold text-primary">Recommended</h2>
                  <div className="space-y-4">
                    {COURSES.slice(3, 5).map(course => (
                      <div key={course.id} className="flex gap-4 p-3 bg-white rounded-2xl border border-outline-variant/10 hover:bg-surface-container-lowest transition-colors cursor-pointer">
                        <img src={course.thumbnail} className="w-16 h-16 rounded-xl object-cover" />
                        <div>
                          <h4 className="text-sm font-bold text-primary line-clamp-2 leading-tight">{course.title}</h4>
                          <span className="text-[10px] font-black text-secondary uppercase tracking-widest">₦{course.price.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'My Courses':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-headline font-bold text-primary">Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {COURSES.map((course) => (
                <GlowCard key={course.id} glowColor="blue" className="bg-white overflow-hidden flex flex-col h-auto group border border-outline-variant/10 hover:border-primary/30">
                  <div className="relative h-48 overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-6 space-y-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-headline font-bold text-primary mb-2 line-clamp-2">{course.title}</h3>
                      <p className="text-xs text-on-surface-variant flex items-center gap-2 mb-4"><User size={14} /> Chikezie Odike</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-primary">
                          <span>Progress</span>
                          <span>60%</span>
                        </div>
                        <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[60%] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <Link to={`/course/${course.id}`} className="w-full block">
                      <button className="w-full py-3.5 bg-primary text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform">
                        <PlayCircle size={18} /> Continue Learning
                      </button>
                    </Link>
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
              {COURSES.map(course => (
                <GlowCard key={course.id} glowColor="blue" className="bg-white overflow-hidden border border-outline-variant/10 h-auto">
                  <img src={course.thumbnail} className="w-full h-48 object-cover" />
                  <div className="p-6 space-y-4">
                    <h3 className="font-headline font-bold text-primary line-clamp-2">{course.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1"><Star size={14} className="text-amber-500 fill-amber-500"/> 4.8 (120)</span>
                      <span className="text-lg font-black text-secondary">₦{course.price.toLocaleString()}</span>
                    </div>
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => setAvatarImage(event.target?.result as string);
                        reader.readAsDataURL(file);
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
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="p-8 text-center space-y-6">
                      <h3 className="text-xl font-headline font-bold text-primary">Take a Profile Picture</h3>
                      <p className="text-sm text-on-surface-variant">Make sure your face is clearly visible in the frame.</p>
                      <button 
                        onClick={takePhoto}
                        className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all mx-auto"
                      >
                        <Camera size={32} />
                      </button>
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
