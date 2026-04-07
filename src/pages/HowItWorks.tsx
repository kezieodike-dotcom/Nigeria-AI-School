import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Rocket, 
  CreditCard, 
  CheckCircle2, 
  Globe, 
  Zap, 
  Users, 
  TrendingUp, 
  Award,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GlowCard } from '../components/ui/spotlight-card';
import { useLocation } from 'react-router-dom';

export default function HowItWorks() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const sections = [
    {
      id: "learn",
      title: "The Learning Experience",
      subtitle: "Learn Level: Industry-Grade AI Mastery",
      icon: BookOpen,
      color: "blue",
      gradient: "from-blue-600 to-indigo-700",
      description: "Our curriculum is designed by professionals who build AI for a living. We don't just teach theory; we build engineers.",
      features: [
        { title: "Real-World Projects", desc: "Build fraud detection systems, NLP models, and generative AI agents.", icon: Zap },
        { title: "Global Curriculum", desc: "Covers Silicon Valley standards adapted for the African tech landscape.", icon: Globe },
        { title: "Personal Mentorship", desc: "Direct access to top-tier AI researchers and engineers.", icon: Users },
        { title: "Digital Certification", desc: "Earn verifiable certificates recognized by leading tech companies.", icon: Award }
      ],
      cta: "Explore Our Courses",
      link: "/courses"
    },
    {
      id: "create",
      title: "Empowering Creators",
      subtitle: "Create Level: Turn Your Knowledge Into Assets",
      icon: Rocket,
      color: "purple",
      gradient: "from-purple-600 to-fuchsia-700",
      description: "Join the elite 1% of AI experts who shape the next generation. We provide the infrastructure; you provide the genius.",
      features: [
        { title: "Creator Dashboard", desc: "Professional analytics to track student progress and course revenue.", icon: TrendingUp },
        { title: "Curriculum Design", desc: "Assistance in structuring high-retention technical training.", icon: ShieldCheck },
        { title: "Global Distribution", desc: "Your courses are available to students across 50+ countries.", icon: Globe },
        { title: "Automated Payouts", desc: "Stable, timely payouts in multiple currencies.", icon: CreditCard }
      ],
      cta: "Join as a Creator",
      link: "/become-creator"
    },
    {
      id: "earn",
      title: "The Referral Economy",
      subtitle: "Earn Level: Knowledge is Your Currency",
      icon: CreditCard,
      color: "green",
      gradient: "from-emerald-600 to-secondary",
      description: "You don't need to be a creator to earn. Our smart referral system turns every student into an earner.",
      features: [
        { title: "30% Commissions", desc: "Earn massive lifetime commissions on every referred checkout.", icon: TrendingUp },
        { title: "Smart Tracking", desc: "Industry-leading attribution logic that never misses a sale.", icon: ShieldCheck },
        { title: "Social Tools", desc: "One-click share tools for LinkedIn, Twitter, and WhatsApp.", icon: Globe },
        { title: "Instant Rewards", desc: "Watch your balance grow in real-time as your network learns.", icon: Zap }
      ],
      cta: "Start Referring",
      link: "/dashboard"
    }
  ];

  return (
    <div className="pb-24">
      {/* Hero Header */}
      <section className="bg-primary pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline font-black text-3xl md:text-7xl text-white mb-8 tracking-tight"
          >
            How the <span className="text-secondary">AI Economy</span> Works.
          </motion.h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Nigeria AI School is more than a platform. It's a triple-engine system designed for technical growth and financial independence.
          </p>
        </div>
      </section>

      {/* Dynamic Sections */}
      <div className="space-y-32 mt-24">
        {sections.map((section, idx) => (
          <section key={section.id} id={section.id} className="scroll-mt-32 max-w-7xl mx-auto px-6">
            <div className={cn("grid lg:grid-cols-2 gap-16 items-center", idx % 2 !== 0 && "lg:grid-flow-dense")}>
              <motion.div 
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={cn(idx % 2 !== 0 && "lg:col-start-2")}
              >
                <div className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs tracking-widest uppercase mb-8 border transition-all", `bg-${section.color}-500/10 text-${section.color}-600 border-${section.color}-500/20`)}>
                   <section.icon size={14} />
                   {section.subtitle}
                </div>
                <h2 className="font-headline font-black text-2xl md:text-5xl text-primary mb-6 md:mb-8 leading-tight">
                  {section.title}
                </h2>
                <p className="text-on-surface-variant text-lg md:text-xl leading-relaxed mb-10 md:mb-12 opacity-80">
                  {section.description}
                </p>
                
                <div className="grid sm:grid-cols-2 gap-8">
                   {section.features.map((feature, fIdx) => (
                     <div key={fIdx} className="space-y-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", `bg-${section.color}-500/10 text-${section.color}-600`)}>
                           <feature.icon size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-primary mb-2 uppercase text-xs tracking-widest">{feature.title}</h4>
                          <p className="text-sm text-on-surface-variant leading-relaxed">{feature.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-12">
                   <button className={cn("flex items-center gap-3 font-black text-primary hover:gap-5 transition-all group")}>
                      {section.cta} <ArrowRight size={20} />
                   </button>
                </div>
              </motion.div>

              <div className={cn(idx % 2 !== 0 && "lg:col-start-1")}>
                 <GlowCard 
                    glowColor={section.color as any} 
                    customSize={true} 
                    className="aspect-square bg-white rounded-[3rem] p-1 shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-surface-container-low/30" />
                    <div className="relative h-full flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden">
                       {/* Decorative UI elements */}
                       <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-[0.05] pointer-events-none")}>
                          <section.icon size={300} className="md:w-[500px] md:h-[500px]" />
                       </div>
                       
                       <div className="space-y-6 relative z-10 text-center">
                          <div className={cn("w-24 h-24 md:w-32 md:h-32 rounded-3xl md:rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl bg-gradient-to-br transition-transform duration-700 hover:scale-110", section.gradient)}>
                             <section.icon size={48} className="text-white md:w-16 md:h-16" />
                          </div>
                          <div className="h-2 w-24 mx-auto rounded-full bg-surface-container-high" />
                          <div className="space-y-3">
                             <div className="h-4 w-48 bg-surface-container-low rounded-full mx-auto" />
                             <div className="h-4 w-32 bg-surface-container-low rounded-full mx-auto opacity-50" />
                          </div>
                       </div>
                    </div>
                 </GlowCard>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA Final */}
      <section className="max-w-7xl mx-auto px-6 mt-48 mb-32">
          <GlowCard glowColor="orange" customSize={true} className="bg-white rounded-3xl md:rounded-[4rem] p-8 md:p-24 text-center border border-secondary/10 shadow-[0_32px_64px_-16px_rgba(255,165,0,0.15)] relative overflow-hidden h-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-30 pointer-events-none" />
            <div className="relative z-10 space-y-6 md:space-y-8">
              <h2 className="font-headline font-black text-3xl md:text-7xl text-primary tracking-tight">Start Your Journey <span className="text-secondary">Today.</span></h2>
              <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto font-medium opacity-80 leading-relaxed">Join 25,000+ students and creators building the future of African Artificial Intelligence.</p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-4 md:pt-6">
                 <button className="bg-secondary text-white px-10 md:px-16 py-4 md:py-6 rounded-xl md:rounded-[2rem] font-black text-xl md:text-2xl shadow-2xl shadow-secondary/40 hover:scale-105 hover:rotate-1 active:scale-95 transition-all">Get Started Now</button>
                 <button className="bg-white border-2 border-primary/10 text-primary px-8 md:px-12 py-3.5 md:py-5 rounded-xl md:rounded-[2rem] font-black text-lg md:text-xl hover:bg-surface-container-low transition-all">View Curriculum</button>
              </div>
            </div>
          </GlowCard>
      </section>
    </div>
  );
}
