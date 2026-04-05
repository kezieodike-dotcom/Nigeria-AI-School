import React from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  MapPin, 
  PhoneCall, 
  Share2, 
  Globe, 
  Send, 
  Linkedin, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GlowCard } from '../components/ui/spotlight-card';

export default function ContactUs() {
  const [formStatus, setFormStatus] = React.useState<'idle' | 'submitting' | 'success'>('idle');

  const contactInfos = [
    { title: "Email Support", value: "hello@nigeriaaischool.com", icon: Mail, color: "blue", link: "mailto:hello@nigeriaaischool.com" },
    { title: "Voice & WhatsApp", value: "+234 812 000 0000", icon: PhoneCall, color: "green", link: "tel:+2348120000000" },
    { title: "Lagos Hub", value: "Victoria Island, Lagos, NG", icon: MapPin, color: "purple", link: "#" },
    { title: "Global Support", value: "Available 24/7", icon: Globe, color: "orange", link: "#" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     setFormStatus('submitting');
     setTimeout(() => setFormStatus('success'), 2000);
  };

  return (
    <div className="pb-24 bg-white">
      {/* 🌟 BRIGHT HERO SECTION */}
      <section className="bg-white pt-32 pb-40 relative overflow-hidden border-b border-primary/5 text-center">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary/5 rounded-full text-primary font-black text-xs tracking-widest uppercase mb-10 border border-primary/10 shadow-sm"
          >
            <Share2 size={16} className="text-secondary" />
            CONNECT WITH THE FUTURE
          </motion.div>
          <h1 className="font-headline font-black text-6xl md:text-8xl text-primary mb-10 tracking-tight leading-[1.05]">
            We're here to <br />
            <span className="text-secondary decoration-secondary/30 underline underline-offset-[16px]">Support You.</span>
          </h1>
          <p className="text-on-surface-variant text-2xl max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
             Direct access to the Nigeria AI School team. Let's build something brilliant together.
          </p>
        </div>
      </section>

      {/* Quick Contact Grid - BRIGHT & ELEVATED */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfos.map((info, i) => (
              <a key={i} href={info.link} className="group">
                <GlowCard glowColor={info.color as any} className="bg-white p-10 rounded-[3rem] border border-secondary/10 shadow-2xl transition-all h-auto flex flex-col items-center text-center hover:translate-y-[-8px]">
                   <div className={cn("w-20 h-20 rounded-3xl mb-8 flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg", `bg-${info.color === 'secondary' ? 'emerald' : info.color}-500 text-white`)}>
                      <info.icon size={36} />
                   </div>
                   <h3 className="text-[12px] font-black text-on-surface-variant uppercase tracking-widest mb-3 opacity-60 font-headline">{info.title}</h3>
                   <p className="text-lg font-black text-primary font-headline group-hover:text-secondary transition-colors line-clamp-1">{info.value}</p>
                </GlowCard>
              </a>
            ))}
         </div>
      </section>

      {/* Info Sections - BRIGHT CONTRAST */}
      <section className="max-w-7xl mx-auto px-6 py-40">
         <div className="grid lg:grid-cols-2 gap-32 items-start text-left">
            <div className="space-y-16">
               <div className="space-y-8">
                  <h2 className="font-headline font-black text-5xl md:text-6xl text-primary tracking-tight leading-tight">Need specific AI <br/><span className="text-secondary">Consultation?</span></h2>
                  <p className="text-2xl text-on-surface-variant leading-relaxed opacity-85">Our senior engineers provide technical support for high-impact AI integration and bespoke curriculum design.</p>
               </div>
               
               <div className="space-y-10">
                  {[
                    "Response Time: < 12 Hours",
                    "Custom Curriculum Design",
                    "Enterprise Volume Sales",
                    "Technical Creator Support"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-6">
                       <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                          <CheckCircle2 className="text-secondary" size={24} />
                       </div>
                       <span className="text-xl font-bold text-primary font-headline">{item}</span>
                    </div>
                  ))}
               </div>
               
               <div className="pt-16 border-t border-outline-variant/10">
                  <div className="p-10 bg-surface-container-low/50 backdrop-blur-md rounded-[3rem] flex items-center gap-8 border border-outline-variant/10 shadow-sm">
                     <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <Clock size={32} />
                     </div>
                     <div>
                        <h4 className="font-black text-primary uppercase text-xs tracking-widest mb-2">Operating Hours</h4>
                        <p className="text-xl text-on-surface-variant font-bold">Mon — Fri: 9am to 6pm WAT</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="relative">
               <GlowCard glowColor="orange" className="bg-white p-8 md:p-16 lg:p-20 rounded-[4rem] border border-secondary/10 shadow-2xl h-auto relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-secondary" />
                  
                  <div className="space-y-12">
                     <div className="text-left space-y-4">
                         <h3 className="font-headline font-black text-4xl text-primary tracking-tight">Send a Message</h3>
                         <p className="text-lg text-on-surface-variant font-medium opacity-70">Tell us about your goals and how we can help.</p>
                     </div>
                     
                     <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <label className="text-xs font-black uppercase text-on-surface-variant tracking-widest pl-2">Full Name</label>
                              <input placeholder="Ayo Kola" className="w-full px-8 py-5 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-secondary transition-all font-bold text-primary placeholder:opacity-30" required />
                           </div>
                           <div className="space-y-3">
                              <label className="text-xs font-black uppercase text-on-surface-variant tracking-widest pl-2">Work Email</label>
                              <input type="email" placeholder="ayo@company.com" className="w-full px-8 py-5 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-secondary transition-all font-bold text-primary placeholder:opacity-30" required />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-xs font-black uppercase text-on-surface-variant tracking-widest pl-2">Subject</label>
                           <select className="w-full px-8 py-5 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-secondary transition-all font-black text-primary">
                              <option>General Inquiry</option>
                              <option>Becoming a Creator</option>
                              <option>Corporate Training</option>
                              <option>Troubleshooting</option>
                           </select>
                        </div>
                        <div className="space-y-3">
                           <label className="text-xs font-black uppercase text-on-surface-variant tracking-widest pl-2">Your Message</label>
                           <textarea rows={5} placeholder="How can we help you succeed?" className="w-full px-8 py-5 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-secondary transition-all font-bold text-primary placeholder:opacity-30" required />
                        </div>
                        
                        <button 
                           disabled={formStatus !== 'idle'} 
                           className={cn("w-full py-6 rounded-[2rem] font-black text-2xl shadow-2xl transition-all flex items-center justify-center gap-3", formStatus === 'idle' ? "bg-secondary text-white hover:scale-105 hover:shadow-secondary/40" : "bg-surface-container-high text-primary opacity-50")}
                        >
                           {formStatus === 'idle' ? (
                             <>Send Message <Send size={24} /></>
                           ) : formStatus === 'submitting' ? (
                             "Launching Genius..."
                           ) : (
                             <>Message Sent! <CheckCircle2 size={24} className="text-white" /></>
                           )}
                        </button>
                     </form>
                  </div>
               </GlowCard>
            </div>
         </div>
      </section>
    </div>
  );
}
