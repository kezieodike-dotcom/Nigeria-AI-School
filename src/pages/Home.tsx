import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Share2, TrendingUp, ShieldCheck, CreditCard, ChevronRight, BookOpen, Rocket, Globe, Zap, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { COURSES, CREATORS } from '../constants';
import CourseCard from '../components/CourseCard';
import GlowCard from '../components/ui/spotlight-card';
import { cn } from '../lib/utils';

export default function Home() {
  return (
    <div className="space-y-24 pb-24">
      {/* 🏠 HERO SECTION */}
      <section className="relative overflow-hidden py-16 md:py-32 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="z-10 flex flex-col items-center"
          >
            <h1 className="font-headline font-extrabold text-3xl md:text-6xl text-primary tracking-tight leading-[1.1]">
              Learn AI.<br />
              Build Skills.<br />
              <span className="text-secondary">Earn Globally.</span>
            </h1>
            <p className="mt-2 text-base md:text-lg text-on-surface-variant max-w-lg mb-8 md:mb-10 leading-relaxed">
              Nigeria AI School is where the world comes to learn cutting-edge tech skills, create powerful courses, and earn from knowledge — all in one platform.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link 
                to="/courses" 
                className="flex-grow sm:flex-grow-0 text-center bg-primary text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-bold text-base md:text-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                🚀 Start Learning
              </Link>
              <Link 
                to="/become-creator" 
                className="flex-grow sm:flex-grow-0 text-center bg-surface-container-high text-primary px-6 md:px-8 py-3.5 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-surface-container-highest active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                💼 Become a Creator
              </Link>
            </div>
            <p className="text-sm text-on-surface-variant font-medium flex items-center gap-2">
              <Users size={16} className="text-secondary" />
              Join a growing community of learners, creators, and innovators shaping the future with AI.
            </p>
          </motion.div>

        </div>
      </section>


      {/* 🎯 HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 overflow-visible">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary/5 rounded-full text-primary font-black text-xs tracking-widest uppercase mb-6 border border-primary/10"
          >
            <Sparkles size={14} className="text-secondary" />
            THE NIGERIA AI SCHOOL PROCESS
          </motion.div>
          <h2 className="font-headline font-black text-2xl md:text-5xl text-primary mb-4 md:mb-6 leading-tight tracking-tight">Simple. Powerful. <span className="text-secondary decoration-secondary/30 underline underline-offset-[8px] md:underline-offset-[12px]">Profitable.</span></h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-sm md:text-lg font-medium opacity-80 leading-relaxed px-4">Three simple steps to build your technical arsenal and join the global AI economy.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {[
            {
              title: "Learn",
              desc: "Master cutting-edge AI, Machine Learning, and Software Engineering from industry titans.",
              icon: BookOpen,
              glow: "blue" as const,
              gradient: "from-blue-600 via-indigo-600 to-violet-700",
              secondaryGradient: "from-blue-50 to-indigo-50",
              accent: "bg-blue-600",
              border: "border-blue-600/20",
              shadow: "shadow-blue-600/20"
            },
            {
              title: "Create",
              desc: "Design, build, and publish your own courses. Reach a hungry global audience of learners.",
              icon: Rocket,
              glow: "purple" as const,
              gradient: "from-purple-600 via-fuchsia-600 to-pink-700",
              secondaryGradient: "from-purple-50 to-fuchsia-50",
              accent: "bg-purple-600",
              border: "border-purple-600/20",
              shadow: "shadow-purple-600/20"
            },
            {
              title: "Earn",
              desc: "Monetize your knowledge directly or earn lifetime commissions through smart referrals.",
              icon: CreditCard,
              glow: "green" as const,
              gradient: "from-emerald-600 via-secondary to-teal-700",
              secondaryGradient: "from-emerald-50 to-secondary-fixed-dim/20",
              accent: "bg-secondary",
              border: "border-secondary/20",
              shadow: "shadow-secondary/20"
            }
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8, type: "spring" }}
              whileHover={{ y: -20 }}
              className="relative group"
            >
              {/* Outer Decorative Glow */}
              <div className={cn(
                "absolute -inset-4 bg-gradient-to-r opacity-0 group-hover:opacity-40 transition-all duration-700 blur-[40px] rounded-[3.5rem] z-0",
                step.gradient
              )} />
              
              <GlowCard 
                glowColor={step.glow}
                customSize={true}
                className={cn(
                  "text-center p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-white border transition-all duration-500 h-auto z-10 relative overflow-hidden",
                  step.border
                )}
              >
                {/* Internal Mesh-like Decorative Accent */}
                <div className={cn(
                  "absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br opacity-[0.08] group-hover:opacity-20 transition-opacity duration-700 rounded-full blur-2xl",
                  step.gradient
                )} />

                <div className={cn(
                  "w-20 h-20 md:w-24 md:h-24 rounded-3xl md:rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 md:mb-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 relative z-10",
                  step.accent
                )}>
                  <div className="absolute inset-0 bg-white/20 rounded-3xl md:rounded-[2.5rem] animate-pulse" />
                  <step.icon size={40} className="text-white drop-shadow-xl relative z-20 md:w-12 md:h-12" strokeWidth={2.5} />
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-center gap-3">
                    <div className={cn("h-px w-8 bg-gradient-to-r from-transparent", step.gradient)} />
                    <h3 className={cn("font-headline font-black text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-br tracking-tight", step.gradient)}>
                      {step.title}
                    </h3>
                    <div className={cn("h-px w-8 bg-gradient-to-l from-transparent", step.gradient)} />
                  </div>
                  
                  <p className="text-on-surface-variant leading-relaxed text-base md:text-lg font-bold opacity-75 min-h-[4rem] md:min-h-[5rem]">
                    {step.desc}
                  </p>
                  
                  <div className="pt-4 flex justify-center">
                    <Link 
                      to={`/how-it-works#${step.title.toLowerCase()}`}
                      className={cn("flex items-center gap-2 font-black text-sm uppercase tracking-widest cursor-pointer hover:translate-x-2 transition-transform", `text-${step.glow}-600`)}
                    >
                      Learn More <ChevronRight size={18} strokeWidth={3} />
                    </Link>
                  </div>
                </div>

                {/* Numbering Badge */}
                <div className="absolute bottom-6 right-8 text-8xl font-black opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none select-none">
                  0{i + 1}
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-24"
        >
          <Link 
            to="/courses" 
            className="group relative inline-flex items-center gap-4 bg-primary text-white px-8 md:px-16 py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            🚀 Ready to Begin? <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300 md:w-7 md:h-7" strokeWidth={3} />
          </Link>
        </motion.div>
      </section>

      {/* 🎥 FOR STUDENTS (Featured Courses) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-left">
          <div className="max-w-2xl">
            <h2 className="font-headline font-bold text-2xl md:text-3xl text-primary mb-6">Learn Skills That <span className="text-ai-purple">Matter</span></h2>
            <p className="text-on-surface-variant text-base md:text-lg leading-relaxed font-medium">
              Join thousands of students mastering AI from the ground up. Our curriculum is built by industry experts to ensure you're ready for the global market.
            </p>
          </div>
          <Link to="/courses" className="bg-primary/5 text-primary px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-primary hover:text-white transition-all group whitespace-nowrap">
            Explore All Courses <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* 🎓 FOR CREATORS */}
      <section className="bg-surface-container-low py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-secondary/20 rounded-[3rem] rotate-3 group-hover:rotate-6 transition-transform duration-700" />
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
              alt="Creator teaching" 
              className="relative z-10 rounded-[3rem] object-cover w-full h-[550px] transition-transform duration-700 group-hover:-translate-y-2"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2rem] z-20 hidden lg:block border border-outline-variant/10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-primary">₦500k+</p>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Avg. Monthly Earnings</p>
                  </div>
               </div>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="font-headline font-black text-2xl md:text-4xl text-primary leading-tight">Turn Your Knowledge Into <span className="text-secondary">Generational Income</span></h2>
            <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed font-medium">
              Teach what you know. Reach a global audience. Earn without limits. We provide the ecosystem, you provide the expertise.
            </p>
            <ul className="space-y-6">
              {[
                { text: "Institutional Video Hosting & Security", icon: ShieldCheck },
                { text: "Global Payment Processing (USD/NGN)", icon: CreditCard },
                { text: "Automated Affiliate Marketing Network", icon: Share2 }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white border border-outline-variant/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all shadow-sm">
                    <item.icon size={20} />
                  </div>
                  <span className="text-on-surface font-bold text-lg">{item.text}</span>
                </li>
              ))}
            </ul>
            <div className="pt-6">
              <Link 
                to="/become-creator" 
                className="inline-flex bg-primary text-white px-10 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-lg md:text-xl hover:scale-105 active:scale-95 transition-all"
              >
                Become a Creator →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🔗 AFFILIATE / EARNING SYSTEM */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-secondary rounded-[3rem] p-8 md:p-16 lg:p-24 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="font-headline font-black text-2xl md:text-4xl mb-8 leading-tight">Earn Daily Even Without <br/><span className="text-secondary-fixed-dim italic">Creating Courses</span></h2>
            <p className="text-white/80 text-base md:text-lg mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
              Not a creator? No problem. Share any course using your personalized link and earn <span className="text-white font-black underline decoration-secondary-fixed-dim underline-offset-8">up to 30% commission</span> every time someone buys.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
              {[
                { label: "No inventory needed", icon: ShieldCheck, glow: "indigo" },
                { label: "Instant Payouts", icon: Zap, glow: "amber" },
                { label: "Zero stress setup", icon: TrendingUp, glow: "emerald" }
              ].map((item, i) => (
                <GlowCard 
                  key={i} 
                  glowColor="blue"
                  customSize={true}
                  className="bg-white/10 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/20 flex flex-col items-center gap-6 h-auto transition-transform hover:-translate-y-2 duration-500"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-secondary">
                    <item.icon size={28} className="md:w-8 md:h-8" />
                  </div>
                  <span className="font-black text-base md:text-lg tracking-tight leading-tight">{item.label}</span>
                </GlowCard>
              ))}
            </div>
            
            <div className="flex flex-col items-center gap-8">
              <p className="text-xl md:text-2xl font-headline font-black italic color-secondary-fixed-dim drop-shadow-md">
                Your network is your net worth.
              </p>
              <Link 
                to="/dashboard" 
                className="inline-flex bg-white text-secondary px-10 md:px-14 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-lg md:text-xl hover:scale-105 active:scale-95 transition-all"
              >
                Start Earning Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🌍 GLOBAL POSITIONING */}
      <section className="max-w-7xl mx-auto px-6 text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high rounded-full text-primary text-xs font-bold mb-6">
          <Globe size={14} />
          GLOBAL REACH
        </div>
        <h2 className="font-headline font-bold text-3xl text-primary mb-6">Built in Nigeria. Open to the World.</h2>
        <p className="text-on-surface-variant text-lg max-w-3xl mx-auto leading-relaxed">
          Nigeria AI School is designed to empower Africans and connect them to global opportunities. Learn from anywhere. Sell to anywhere. Earn from everywhere.
        </p>
      </section>

      {/* 🏆 SOCIAL PROOF */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-headline font-bold text-3xl text-primary mb-4">Trusted by Future Builders</h2>
          <p className="text-on-surface-variant text-lg">Thousands of learners and creators are already building their future with Nigeria AI School.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-12">
          {CREATORS.map((creator) => (
            <motion.div 
              key={creator.id}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center group"
            >
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container p-1 group-hover:border-secondary transition-colors duration-300">
                  <img 
                    src={creator.avatar} 
                    alt={creator.name} 
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {creator.isVerified && (
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-secondary-fixed-dim rounded-full flex items-center justify-center border-2 border-white">
                    <ShieldCheck size={16} className="text-white" fill="currentColor" />
                  </div>
                )}
              </div>
              <h4 className="font-headline font-bold text-lg text-primary">{creator.name}</h4>
              <p className="text-sm text-secondary font-medium">{creator.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🚀 FINAL CTA SECTION */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-primary rounded-[3rem] p-8 md:p-12 lg:p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          </div>
          <h2 className="font-headline font-bold text-2xl md:text-4xl text-white mb-8 relative z-10">Your Future in Tech Starts Here</h2>
          <p className="text-white/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto relative z-10">
            Whether you want to learn, teach, or earn — this is your platform. Don’t just watch the future happen. Be part of it.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 relative z-10">
            <Link 
              to="/courses" 
              className="bg-white text-primary px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg md:text-xl hover:scale-105 transition-all"
            >
              Start Learning Now
            </Link>
            <Link 
              to="/become-creator" 
              className="bg-secondary text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg md:text-xl hover:scale-105 transition-all"
            >
              Become a Creator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckCircle2({ size, className }: { size?: number, className?: string }) {
  return <ShieldCheck size={size} className={className} />;
}
