import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Rocket, DollarSign, Users, CheckCircle2, ArrowRight, PlayCircle, Globe, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function BecomeCreator() {
  const benefits = [
    {
      title: "Earn Globally",
      description: "Reach students across Africa and the world. Get paid in multiple currencies including Naira and USD.",
      icon: DollarSign,
      color: "text-secondary",
      bg: "bg-secondary/10"
    },
    {
      title: "Build Your Brand",
      description: "Establish yourself as an industry leader in the AI space. We help you market your expertise.",
      icon: Sparkles,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      title: "Impact Lives",
      description: "Empower the next generation of African engineers with high-demand AI skills.",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Apply to Join",
      description: "Fill out our creator application form with your expertise and course ideas."
    },
    {
      number: "02",
      title: "Create Content",
      description: "Use our professional guidelines and tools to record high-quality AI curriculum."
    },
    {
      number: "03",
      title: "Launch & Earn",
      description: "Publish your course to thousands of students and start earning immediately."
    }
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-full mb-8 border border-white/10">
              <Rocket size={14} className="text-secondary-fixed-dim" />
              JOIN THE ELITE AI CREATORS
            </span>
            <h1 className="font-headline font-extrabold text-5xl md:text-7xl text-white tracking-tight leading-[1.1] mb-8 max-w-4xl mx-auto">
              Turn Your Knowledge Into <span className="text-secondary-fixed-dim">Income.</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
              Teach what you know. Reach a global audience. Earn without limits. You teach. We handle the platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-secondary text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Become a Creator →
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2">
                <PlayCircle size={20} />
                Watch Creator Stories
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Payouts", value: "₦50M+", icon: Globe },
            { label: "Active Creators", value: "120+", icon: Users },
            { label: "Student Reach", value: "25k+", icon: ShieldCheck }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-xl border border-outline-variant/10 flex items-center gap-6 group hover:shadow-2xl transition-all">
              <div className="w-14 h-14 bg-surface-container-low rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
                <h4 className="text-3xl font-headline font-bold text-primary">{stat.value}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Teach With Us */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-20">
          <h2 className="font-headline font-bold text-4xl text-primary mb-4">Why Teach at Nigeria AI School?</h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            We provide the platform, the audience, and the tools. You provide the expertise.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {benefits.map((benefit, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/10 hover:shadow-xl transition-all"
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8", benefit.bg, benefit.color)}>
                <benefit.icon size={32} />
              </div>
              <h3 className="font-headline font-bold text-2xl text-primary mb-4">{benefit.title}</h3>
              <p className="text-on-surface-variant leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-surface-container-low py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-headline font-bold text-4xl text-primary mb-8">Your Journey to Becoming a Top AI Creator</h2>
              <div className="space-y-12">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-xl text-primary mb-2">{step.title}</h3>
                      <p className="text-on-surface-variant leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-12 flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all group">
                Start Your Application <ArrowRight size={20} />
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/10 rounded-[2.5rem] rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&h=1000" 
                alt="Creator working" 
                className="relative z-10 rounded-[2.5rem] shadow-2xl object-cover w-full h-[600px]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Trust Section */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-12">
        <h2 className="font-headline font-bold text-4xl text-primary">Everything You Need to Succeed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          {[
            "Professional Video Editing Support",
            "Curriculum Design Assistance",
            "Marketing & Global Promotion",
            "Creator Community Access",
            "Dedicated Support Manager",
            "Transparent Payout System"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-outline-variant/10">
              <CheckCircle2 className="text-secondary" size={20} />
              <span className="font-medium text-on-surface">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-secondary rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          </div>
          <h2 className="font-headline font-bold text-4xl md:text-5xl text-white mb-8 relative z-10">Ready to share your knowledge?</h2>
          <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto relative z-10">Join Africa's most prestigious AI creator community today.</p>
          <div className="flex justify-center relative z-10">
            <button className="bg-white text-secondary px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all">
              Apply Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
