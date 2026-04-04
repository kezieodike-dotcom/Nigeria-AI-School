import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, PlayCircle, Clock, Users } from 'lucide-react';
import { Course } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { GlowCard } from './ui/spotlight-card';

interface CourseCardProps {
  course: Course;
  className?: string;
  key?: string | number;
}

export default function CourseCard({ course, className }: CourseCardProps) {
  const getCategoryStyles = (category: string) => {
    switch (category.toUpperCase()) {
      case 'AI & ML':
        return {
          glowColor: 'purple' as const,
          tag: 'bg-ai-purple/10 text-ai-purple border-ai-purple/20',
          gradientText: 'from-ai-purple to-indigo-500',
          button: 'bg-ai-purple text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)]',
          badge: 'bg-gradient-to-r from-ai-purple to-indigo-600 text-white',
          border: 'border-ai-purple/10',
          iconGlow: 'bg-ai-purple/10 text-ai-purple'
        };
      case 'DATA SCIENCE':
        return {
          glowColor: 'green' as const,
          tag: 'bg-data-teal/10 text-data-teal border-data-teal/20',
          gradientText: 'from-data-teal to-sky-500',
          button: 'bg-data-teal text-white shadow-[0_4px_15px_rgba(20,184,166,0.3)]',
          badge: 'bg-gradient-to-r from-data-teal to-sky-600 text-white',
          border: 'border-data-teal/10',
          iconGlow: 'bg-data-teal/10 text-data-teal'
        };
      case 'WEB DEV':
        return {
          glowColor: 'orange' as const,
          tag: 'bg-web-gold/10 text-web-gold border-web-gold/20',
          gradientText: 'from-web-gold to-orange-500',
          button: 'bg-web-gold text-white shadow-[0_4px_15px_rgba(245,158,11,0.3)]',
          badge: 'bg-gradient-to-r from-web-gold to-orange-600 text-white',
          border: 'border-web-gold/10',
          iconGlow: 'bg-web-gold/10 text-web-gold'
        };
      default:
        return {
          glowColor: 'blue' as const,
          tag: 'bg-primary/5 text-primary border-primary/10',
          gradientText: 'from-primary to-primary-container',
          button: 'bg-primary text-white shadow-[0_4px_15px_rgba(0,21,77,0.2)]',
          badge: 'bg-primary text-white',
          border: 'border-primary/5',
          iconGlow: 'bg-primary/5 text-primary'
        };
    }
  };

  const styles = getCategoryStyles(course.category);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        y: -12,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      className={cn("group h-full", className)}
    >
      <GlowCard 
        glowColor={styles.glowColor}
        customSize={true}
        className={cn(
          "h-full !p-0 border overflow-hidden flex flex-col bg-white shadow-xl shadow-black/[0.03] hover:shadow-2xl hover:shadow-black/[0.06] transition-all duration-500",
          styles.border
        )}
      >
        {/* Course Thumbnail Image */}
        <Link to={`/course/${course.id}`} className="block h-56 relative overflow-hidden shrink-0">
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          
          {/* Animated Overlay Glow */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-tr opacity-0 group-hover:opacity-40 transition-opacity duration-500",
            `from-${styles.glowColor}-600/20 via-transparent to-white/10`
          )} />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30"
            >
              <PlayCircle className="text-white w-10 h-10 drop-shadow-lg" fill="currentColor" />
            </motion.div>
          </div>
          
          {/* Glassmorphic Badges */}
          {course.isBestseller && (
            <div className={cn(
              "absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black shadow-lg backdrop-blur-md border border-white/30 tracking-widest", 
              styles.badge
            )}>
              BESTSELLER
            </div>
          )}
          {course.isNew && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black text-primary shadow-lg border border-primary/10 tracking-widest">
              NEW
            </div>
          )}
        </Link>

        {/* Course Info Content */}
        <div className="p-7 relative flex-grow flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className={cn(
              "px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border", 
              styles.tag
            )}>
              {course.category}
            </span>
            <div className="flex items-center text-amber-500 text-[11px] font-black bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <Star size={12} fill="currentColor" className="mr-1.5" />
              {course.rating}
            </div>
          </div>

          <Link to={`/course/${course.id}`}>
            <h3 className={cn(
              "font-headline font-extrabold text-xl mb-3 line-clamp-2 transition-all duration-300 group-hover:tracking-tight bg-clip-text text-transparent bg-gradient-to-r", 
              styles.gradientText
            )}>
              {course.title}
            </h3>
          </Link>
          
          <p className="text-sm text-on-surface-variant font-medium mb-6 line-clamp-2 leading-relaxed opacity-80">
            {course.description}
          </p>

          <div className="flex items-center gap-6 text-[11px] font-bold text-on-surface-variant mb-6 border-t border-b border-outline-variant/10 py-3 mt-auto">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-on-surface-variant/50" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-on-surface-variant/50" />
              <span>{(course.reviewsCount * 1.5).toFixed(0)} Students</span>
            </div>
          </div>

          {/* Instructor & Price Area */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img 
                  src={course.instructor.avatar} 
                  alt={course.instructor.name} 
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-surface border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full ring-1 ring-green-100 animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-black text-primary leading-tight">
                  {course.instructor.name}
                </span>
                <span className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-tighter">Instructor</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end shrink-0">
               <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-2xl font-black text-primary tracking-tighter">
                  ₦{course.price.toLocaleString()}
                </span>
               </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "p-3 rounded-2xl transition-all duration-300 flex items-center justify-center", 
                  styles.button
                )}
              >
                <ShoppingCart size={20} className="drop-shadow-sm" />
              </motion.button>
            </div>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}
