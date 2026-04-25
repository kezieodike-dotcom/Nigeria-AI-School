import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, BookOpen, CreditCard, Settings, LogOut, Search, Bell, Star, Clock, PlayCircle, ChevronRight, TrendingUp, Users, Share2, Rocket, User, Camera, UploadCloud, X } from 'lucide-react';
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


  const sidebarItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'My Courses', icon: BookOpen },
    { name: 'Earnings', icon: CreditCard },
    { name: 'Settings', icon: Settings },
    { name: 'Profile', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-12">
            {/* Stats Grid: Bento Box Style */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Earnings', value: '₦0', icon: CreditCard, color: 'text-primary', bg: 'bg-primary/10', glow: 'blue' as const, border: 'border-primary/20', span: 'lg:col-span-2' },
                { label: 'Active Students', value: '0', icon: Users, color: 'text-secondary', bg: 'bg-secondary/10', glow: 'green' as const, border: 'border-secondary/20', span: 'col-span-1' },
                { label: 'Course Rating', value: '0.0', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10', glow: 'orange' as const, border: 'border-amber-500/20', span: 'col-span-1' },
              ].map((stat) => (
                <GlowCard 
                  key={stat.label} 
                  glowColor={stat.glow}
                  customSize={true}
                  className={cn(
                    "bg-white p-7 rounded-[2rem] border flex items-center gap-6 group transition-all duration-500 h-auto",
                    stat.border,
                    stat.span
                  )}
                >
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500", stat.bg, stat.color)}>
                    <stat.icon size={32} className="drop-shadow-sm" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1.5 opacity-60">{stat.label}</p>
                    <h4 className="text-2xl font-headline font-black text-primary tracking-tight">{stat.value}</h4>
                  </div>
                </GlowCard>
              ))}

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
                      className="bg-white p-6 rounded-2xl border border-outline-variant/10 flex flex-col md:flex-row items-center gap-8 group transition-all h-auto"
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
                      <h3 className="text-2xl font-headline font-bold text-primary">₦1.2M</h3>
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
                    <Link to={`/course/${course.id}`} className="w-full">
                      <button className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">Resume Course</button>
                    </Link>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        );
      case 'Earnings':
        return (
          <div className="space-y-12">
            <div className="max-w-md">
              <GlowCard glowColor="green" className="bg-white p-8 h-auto">
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Wallet Balance</p>
                <h3 className="text-2xl font-black text-primary">₦1,245,000</h3>
                <button className="mt-6 w-full py-3 bg-secondary text-white rounded-xl font-bold">Withdraw Now</button>
              </GlowCard>

            </div>
            <div className="bg-white rounded-3xl border border-outline-variant/10 overflow-hidden">
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
                      <td className="px-8 py-6 text-on-surface font-medium">Course Sale: AI Mastery Course</td>
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
          <div className="max-w-2xl bg-white p-12 rounded-[2.5rem] border border-outline-variant/10 space-y-8">
            <h2 className="text-2xl font-headline font-bold text-primary">Account Settings</h2>
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
        );
      case 'Profile':
        return (
          <div className="max-w-2xl bg-white p-12 rounded-[2.5rem] border border-outline-variant/10 space-y-8">
            <h2 className="text-2xl font-headline font-bold text-primary">User Profile</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-outline-variant/10">
              <div className="w-24 h-24 rounded-3xl bg-surface-container flex items-center justify-center overflow-hidden border-2 border-primary/10 relative group">
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
              {activeTab === 'Overview' ? `Welcome back, ${userName}! 👋` : activeTab}
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant">Manage your learning and earning in one place.</p>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
              <button className="p-2.5 md:p-3 bg-white border border-outline-variant/10 rounded-xl text-on-surface-variant hover:text-primary relative group transition-all">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
             </button>
              <Link to="/creator-dashboard" className="bg-secondary text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm md:text-base">
                <Rocket size={16} />
                <span className="hidden sm:inline">Upload Course</span>
                <span className="sm:hidden">Upload</span>
              </Link>
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
