import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, PlayCircle, Clock, Video, FileText, CheckCircle2, ChevronDown, Share2, ShieldCheck, GraduationCap, Users } from 'lucide-react';
import { COURSES } from '../constants';
import { cn } from '../lib/utils';
import { GlowCard } from '../components/ui/spotlight-card';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  // For MVP, just find the course or fall back to the first one
  const course = COURSES.find(c => c.id === id) || COURSES[0];

  const [activeModule, setActiveModule] = React.useState<number | null>(0);

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
            
            <h1 className="font-headline font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1]">
              {course.title}
            </h1>
            
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-white/70">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star fill="currentColor" size={18} />
                <span className="text-white ml-1">{course.rating}</span>
                <span className="text-white/50 font-normal">({course.reviewsCount.toLocaleString()} ratings)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>{(course.reviewsCount * 3.5).toFixed(0).toLocaleString()} students enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>Last updated 10/2024</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <img 
                src={course.instructor.avatar} 
                alt={course.instructor.name}
                className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="font-medium text-white/70 text-sm">Created by</p>
                <Link to="/creator/1" className="font-bold text-secondary hover:text-white transition-colors">
                  {course.instructor.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12 -mt-12 lg:-mt-24 relative z-10">
        
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
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-headline font-bold text-3xl text-primary">Course Content</h2>
              <span className="text-on-surface-variant">{curriculum.length} modules • {course.duration}</span>
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
                           <li key={lesson} className="flex items-center justify-between group">
                             <div className="flex items-center gap-3">
                               <PlayCircle className="text-on-surface-variant group-hover:text-secondary transition-colors" size={18} />
                               <span className="text-on-surface hover:text-primary cursor-pointer transition-colors">
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

        </div>

        {/* 🚀 Sticky Sidebar Checkout */}
        <div className="lg:col-span-1">
          <GlowCard 
            glowColor="blue"
            customSize={true}
            className="bg-white rounded-3xl border border-outline-variant/20 shadow-xl overflow-hidden sticky top-28 !p-0 h-auto"
          >
            {/* Video Preview */}
            <div className="relative h-56 bg-primary cursor-pointer group">
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

            <div className="p-8">
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-black text-primary tracking-tight">
                   ₦{course.price.toLocaleString()}
                </span>
                {course.oldPrice && (
                  <span className="text-lg text-on-surface-variant line-through font-medium mb-1">
                    ₦{course.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20">
                  Add to Cart
                </button>
                <button className="w-full bg-white text-secondary border-2 border-secondary py-4 rounded-xl font-bold text-lg hover:bg-secondary hover:text-white transition-all">
                  Buy Now
                </button>
              </div>

              <div className="space-y-4 text-sm text-on-surface-variant border-b border-outline-variant/10 pb-6 mb-6">
                <div className="flex items-center gap-3">
                  <Video size={18} />
                  <span>{course.duration} on-demand video</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText size={18} />
                  <span>24 articles and downloadable resources</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} />
                  <span>Full lifetime access</span>
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
