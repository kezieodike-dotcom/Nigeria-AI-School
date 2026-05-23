import React from 'react';
import { Link } from 'react-router-dom';
import { Star, PlayCircle, Clock, Users, CreditCard } from 'lucide-react';
import { Course } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import GlowCard from './ui/spotlight-card';
import SecureVideo from './SecureVideo';

interface CourseCardProps {
  course: Course;
  className?: string;
  key?: React.Key;
}

export default function CourseCard({ course, className }: CourseCardProps) {
  const getCategoryStyles = (category: string) => {
    switch (category.toUpperCase()) {
      case 'AI & ML':
        return {
          glowColor: 'purple' as const,
          tag: 'bg-ai-purple/10 text-ai-purple border-ai-purple/20',
          gradientText: 'from-ai-purple to-indigo-500',
          button: 'bg-ai-purple text-white',
          badge: 'bg-gradient-to-r from-ai-purple to-indigo-600 text-white',
          border: 'border-ai-purple/10'
        };
      case 'DATA SCIENCE':
        return {
          glowColor: 'green' as const,
          tag: 'bg-data-teal/10 text-data-teal border-data-teal/20',
          gradientText: 'from-data-teal to-sky-500',
          button: 'bg-data-teal text-white',
          badge: 'bg-gradient-to-r from-data-teal to-sky-600 text-white',
          border: 'border-data-teal/10'
        };
      case 'WEB DEV':
        return {
          glowColor: 'orange' as const,
          tag: 'bg-web-gold/10 text-web-gold border-web-gold/20',
          gradientText: 'from-web-gold to-orange-500',
          button: 'bg-web-gold text-white',
          badge: 'bg-gradient-to-r from-web-gold to-orange-600 text-white',
          border: 'border-web-gold/10'
        };
      default:
        return {
          glowColor: 'blue' as const,
          tag: 'bg-primary/5 text-primary border-primary/10',
          gradientText: 'from-primary to-primary-container',
          button: 'bg-primary text-white',
          badge: 'bg-primary text-white',
          border: 'border-primary/5'
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
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      className={cn('group h-full', className)}
    >
      <GlowCard
        glowColor={styles.glowColor}
        customSize={true}
        className={cn(
          'h-full !p-0 border overflow-hidden flex flex-col bg-white transition-all duration-500',
          styles.border
        )}
      >
        <Link to={`/course/${course.id}`} className="block h-48 md:h-56 relative overflow-hidden shrink-0 bg-black">
          {course.videoUrl ? (
            <SecureVideo
              src={course.videoUrl}
              poster={course.thumbnail}
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              muted
              preload="metadata"
            />
          ) : (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              referrerPolicy="no-referrer"
            />
          )}

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30"
            >
              <PlayCircle className="text-white w-10 h-10 drop-shadow-lg" fill="currentColor" />
            </motion.div>
          </div>

          {course.isBestseller && (
            <div className={cn(
              'absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black backdrop-blur-md border border-white/30 tracking-widest',
              styles.badge
            )}>
              BESTSELLER
            </div>
          )}
          {course.isNew && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black text-primary border border-primary/10 tracking-widest">
              NEW
            </div>
          )}
        </Link>

        <div className="p-5 md:p-7 relative flex-grow flex flex-col">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <span className={cn(
              'px-2 md:px-3 py-1 text-[9px] md:text-[10px] font-black rounded-full uppercase tracking-widest border',
              styles.tag
            )}>
              {course.category}
            </span>
            <div className="flex items-center text-amber-500 text-[10px] md:text-[11px] font-black bg-amber-500/10 px-2 md:px-2.5 py-1 rounded-full border border-amber-500/20">
              <Star size={10} fill="currentColor" className="mr-1 md:mr-1.5" />
              {course.rating}
            </div>
          </div>

          <Link to={`/course/${course.id}`}>
            <h3 className={cn(
              'font-headline font-extrabold text-base md:text-lg mb-2 md:mb-3 line-clamp-2 transition-all duration-300 group-hover:tracking-tight bg-clip-text text-transparent bg-gradient-to-r',
              styles.gradientText
            )}>
              {course.title}
            </h3>
          </Link>

          <p className="text-xs md:text-sm text-on-surface-variant font-medium mb-4 md:mb-6 line-clamp-2 leading-relaxed opacity-80">
            {course.description}
          </p>

          <div className="flex items-center gap-4 md:gap-6 text-[10px] md:text-[11px] font-bold text-on-surface-variant mb-4 md:mb-6 border-t border-b border-outline-variant/10 py-2 md:py-3 mt-auto">
            <div className="flex items-center gap-1 md:gap-1.5">
              <Clock size={12} className="text-on-surface-variant/50" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1 md:gap-1.5">
              <Users size={12} className="text-on-surface-variant/50" />
              <span>{(course.reviewsCount * 1.5).toFixed(0)} Students</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-surface border-2 border-white group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-black text-primary leading-tight truncate">
                  {course.instructor.name}
                </span>
                <span className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-tighter">Instructor</span>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="text-[10px] font-black text-primary tracking-tighter mb-1">
                Monthly access
              </span>
              <Link
                to={`/course/${course.id}`}
                className={cn(
                  'px-3 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 justify-center text-xs font-black',
                  styles.button
                )}
              >
                <CreditCard size={15} />
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}
