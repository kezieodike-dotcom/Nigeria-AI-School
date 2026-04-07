import React from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Lightbulb, 
  ShieldCheck, 
  Users, 
  Globe, 
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GlowCard } from '../components/ui/spotlight-card';

export default function AboutUs() {
  const missionValues = [
    {
      title: "Democratic AI",
      desc: "Making cutting-edge artificial intelligence education accessible and affordable across the African continent.",
      icon: Globe,
      color: "blue"
    },
    {
      title: "Economic Impact",
      desc: "Creating 1 million digital entrepreneurs by 2030 through specialized knowledge sharing and creation tools.",
      icon: TrendingUp,
      color: "purple"
    },
    {
      title: "Trust & Safety",
      desc: "Building a verified community of top-tier creators and learners where knowledge transfer is secure.",
      icon: ShieldCheck,
      color: "green"
    }
  ];

  return (
    <div className="pb-24">
      {/* Hero Header */}
      <section className="bg-primary pt-32 pb-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black tracking-widest uppercase border border-white/10 mb-8"
          >
            <Target size={14} className="text-secondary" />
            OUR MISSION & VISION
          </motion.div>
          <h1 className="font-headline font-black text-3xl md:text-8xl text-white mb-8 tracking-tight leading-[1.05]">
            Bridging the Gap<br />
            <span className="text-secondary">Between AI & Africa.</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Nigeria AI School is at the forefront of the African AI revolution. We are building the infrastructure for knowledge transfer in a digital-first economy.
          </p>
        </div>
      </section>

      {/* Core Mission Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {missionValues.map((val, i) => (
             <GlowCard key={i} glowColor={val.color as any} className="bg-white p-10 rounded-[2.5rem] border border-outline-variant/10 shadow-xl min-h-[300px] flex flex-col justify-center text-center">
               <div className={cn("w-16 h-16 rounded-2xl mx-auto mb-8 flex items-center justify-center", `bg-${val.color}-500/10 text-${val.color}-600`)}>
                  <val.icon size={32} />
               </div>
               <h3 className="font-headline font-black text-2xl text-primary mb-4">{val.title}</h3>
               <p className="text-on-surface-variant font-medium opacity-80 leading-relaxed">{val.desc}</p>
             </GlowCard>
           ))}
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-5xl mx-auto px-6 py-32 text-center space-y-12">
         <h2 className="font-headline font-black text-4xl md:text-5xl text-primary tracking-tight">Why We Built Nigeria AI School</h2>
         <div className="space-y-8 text-xl text-on-surface-variant leading-relaxed opacity-90 text-left md:text-center">
            <p>
               In a world increasingly driven by automation and intelligent algorithms, we noticed a critical lag in how this information was reaching African markets. Traditional education is too slow, and foreign platforms are often priced out of reach or lack the context required for local impact.
            </p>
            <p>
               We built Nigeria AI School to solve three things: **Access**, **Opportunity**, and **Incentive**. By allowing experts to create their own curriculum and rewarding students who share their knowledge, we've created a self-sustaining ecosystem for technical growth.
            </p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-outline-variant/10">
            {[
              { label: "Founded", value: "2023" },
              { label: "Community", value: "25k+" },
              { label: "Global Payouts", value: "₦50M+" },
              { label: "Countries", value: "12+" }
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-black text-primary mb-1">{stat.value}</p>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Values Grid */}
      <section className="bg-surface-container-low py-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
               <h2 className="font-headline font-black text-4xl text-primary">Our Operating Principles</h2>
               <p className="text-on-surface-variant font-medium">The non-negotiables that drive our platform.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               {[
                 { title: "Radical Transparency", desc: "Creators see every kobo they earn, and learners know exactly what they are paying for.", icon: ShieldCheck },
                 { title: "Continuous Innovation", desc: "We update our platform and curriculum monthly to keep pace with global AI releases.", icon: Lightbulb },
                 { title: "Community First", desc: "Our product decisions are driven by our Discord community and creator feedback.", icon: Users },
                 { title: "Excellence in Execution", desc: "We value high-fidelity learning experiences and professional-grade technical content.", icon: Award },
                 { title: "Open Education", desc: "We believe knowledge should be decentralized and rewarded, not gatekept.", icon: BookOpen }
               ].map((p, i) => (
                 <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-outline-variant/10 group-hover:bg-primary group-hover:text-white transition-all">
                       <p.icon size={24} />
                    </div>
                    <div>
                       <h4 className="font-black text-primary mb-2 uppercase text-xs tracking-widest">{p.title}</h4>
                       <p className="text-sm text-on-surface-variant leading-relaxed opacity-80">{p.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
