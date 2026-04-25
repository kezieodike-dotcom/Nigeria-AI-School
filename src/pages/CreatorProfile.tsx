import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, Users, PlayCircle, ShieldCheck, Twitter, Linkedin, Globe, MapPin, Award, BookOpen } from 'lucide-react';
import { CREATORS, COURSES } from '../constants';
import CourseCard from '../components/CourseCard';

export default function CreatorProfile() {
  const { id } = useParams<{ id: string }>();
  // Fall back to first creator if not found (MVP)
  const creator = CREATORS.find(c => c.id === id) || CREATORS[0];
  
  // Get courses by this creator
  const creatorCourses = COURSES.filter(c => c.instructor.name === creator.name) || COURSES;

  return (
    <div className="bg-surface-container-lowest min-h-screen font-sans">
      {/* Premium Hero Banner */}
      <div className="relative h-[360px] bg-primary overflow-hidden">
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80 z-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/30 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-surface-container-lowest to-transparent z-20" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10 mix-blend-overlay" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 relative z-30 -mt-48 pb-24">
        
        {/* Profile Card Container */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-outline-variant/10 mb-16 relative overflow-hidden">
          
          {/* Subtle accent line at top */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary to-primary" />

          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Avatar Section */}
            <div className="shrink-0 relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-secondary to-primary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <img 
                src={creator.avatar} 
                alt={creator.name}
                className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-[6px] border-white shadow-2xl object-cover"
                referrerPolicy="no-referrer"
              />
              {creator.isVerified && (
                <div className="absolute bottom-2 right-4 md:bottom-4 md:right-4 w-12 h-12 bg-secondary rounded-full flex items-center justify-center border-4 border-white shadow-lg" title="Verified Expert">
                  <ShieldCheck size={24} className="text-white" fill="currentColor" />
                </div>
              )}
            </div>

            {/* Profile Info Section */}
            <div className="flex-grow space-y-8 w-full">
              {/* Header Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                <div>
                  <h1 className="font-headline font-black text-4xl md:text-5xl text-primary tracking-tight mb-2">
                    {creator.name}
                  </h1>
                  <p className="text-xl md:text-2xl text-secondary font-bold tracking-wide">{creator.role}</p>
                </div>
                <button className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-xl font-black shadow-xl hover:shadow-primary/20 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2">
                  Follow Expert
                </button>
              </div>

              {/* Stats Metrics (Pills) */}
              <div className="flex flex-wrap gap-4 text-sm font-bold">
                <div className="flex items-center gap-2 bg-surface-container px-4 py-2.5 rounded-full text-on-surface-variant">
                  <MapPin size={16} className="text-primary" />
                  <span>Global (Abuja, NG)</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2.5 rounded-full text-amber-700">
                  <Star fill="currentColor" size={16} className="text-amber-500" />
                  <span>4.9 Instructor Rating</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2.5 rounded-full text-blue-700">
                  <Users size={16} className="text-blue-500" />
                  <span>24.5k Students</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2.5 rounded-full text-green-700">
                  <PlayCircle size={16} className="text-green-500" />
                  <span>{creatorCourses.length} Courses</span>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 pt-12 border-t border-outline-variant/10">
            {/* About Section */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-headline font-black text-2xl text-primary flex items-center gap-3">
                <Award className="text-secondary" /> About {creator.name.split(' ')[0]}
              </h3>
              <div className="space-y-4 text-on-surface-variant text-lg leading-relaxed">
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

            {/* Social & Connect Section */}
            <div className="bg-surface-container-low p-8 rounded-[2rem] h-fit">
              <h4 className="font-headline font-black text-lg text-primary mb-6">Connect</h4>
              <div className="flex flex-col gap-4">
                <a href="#" className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-all group border border-outline-variant/5">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Twitter size={18} />
                  </div>
                  <span className="font-bold text-on-surface">Twitter Profile</span>
                </a>
                <a href="#" className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-all group border border-outline-variant/5">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                    <Linkedin size={18} />
                  </div>
                  <span className="font-bold text-on-surface">LinkedIn Network</span>
                </a>
                <a href="#" className="flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-all group border border-outline-variant/5">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Globe size={18} />
                  </div>
                  <span className="font-bold text-on-surface">Personal Website</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Creator's Courses Section */}
        <div>
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="font-headline font-black text-3xl text-primary">Masterclasses</h2>
              <p className="text-on-surface-variant font-medium">Taught by {creator.name}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {creatorCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
