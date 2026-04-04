import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, Users, PlayCircle, ShieldCheck, Twitter, Linkedin, Globe, MapPin } from 'lucide-react';
import { CREATORS, COURSES } from '../constants';
import CourseCard from '../components/CourseCard';
import { GlowCard } from '../components/ui/spotlight-card';

export default function CreatorProfile() {
  const { id } = useParams<{ id: string }>();
  // Fall back to first creator if not found (MVP)
  const creator = CREATORS.find(c => c.id === id) || CREATORS[0];
  
  // Get courses by this creator (Mock: logic would normally match instructor ID)
  const creatorCourses = COURSES.filter(c => c.instructor.name === creator.name) || COURSES;

  return (
    <div className="bg-surface pb-24 min-h-screen">
      {/* 🚀 Cover Photo & Profile */}
      <section className="bg-primary pt-32 pb-48 relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
        <GlowCard 
          glowColor="blue"
          customSize={true}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 border border-outline-variant/10 h-auto"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            
            <div className="relative shrink-0">
              <img 
                src={creator.avatar} 
                alt={creator.name}
                className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
                referrerPolicy="no-referrer"
              />
              {creator.isVerified && (
                <div className="absolute bottom-2 right-2 w-10 h-10 bg-secondary rounded-full flex items-center justify-center border-4 border-white shadow-sm" title="Verified Creator">
                  <ShieldCheck size={20} className="text-white" fill="currentColor" />
                </div>
              )}
            </div>

            <div className="flex-grow space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="font-headline font-extrabold text-4xl text-primary mb-2">
                    {creator.name}
                  </h1>
                  <p className="text-xl text-secondary font-bold">{creator.role}</p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    Follow
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm font-medium text-on-surface-variant pt-2 border-t border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>Abuja, Nigeria (Global)</span>
                </div>
                <div className="flex items-center gap-2 text-amber-500">
                  <Star fill="currentColor" size={18} />
                  <span className="text-on-surface-variant">4.9 Average Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>24,500 Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <PlayCircle size={18} />
                  <span>{creatorCourses.length} Courses</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <a href="#" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-blue-400 hover:bg-blue-50 transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-blue-700 hover:bg-blue-50 transition-colors">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors">
                  <Globe size={18} />
                </a>
              </div>
            </div>
            
          </div>

          <div className="mt-12 pt-12 border-t border-outline-variant/10 max-w-4xl font-sans">
            <h3 className="font-headline font-bold text-2xl text-primary mb-4">About Me</h3>
            <div className="space-y-4 text-on-surface-variant leading-relaxed text-lg">
              <p>
                I am a passionate AI Researcher and Educator with over 10 years of experience 
                in building scalable machine learning systems. My goal is to make advanced AI 
                concepts accessible to engineers across Africa and the world.
              </p>
              <p>
                Currently, I lead AI initiatives at a top tech firm and dedicate my free time to 
                authoring hands-on courses focusing on Python, Neural Networks, and Generative AI.
              </p>
            </div>
          </div>
        </GlowCard>
      </section>

      {/* 📚 Creator's Courses */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-headline font-bold text-3xl text-primary border-l-4 border-secondary pl-4">
            Courses by {creator.name}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creatorCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
