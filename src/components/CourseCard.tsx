import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CreditCard, PlayCircle, Star, Users } from 'lucide-react';
import { Course } from '../types';
import { cn } from '../lib/utils';
import SecureVideo from './SecureVideo';

interface CourseCardProps {
  course: Course;
  className?: string;
  key?: React.Key;
}

export default function CourseCard({ course, className }: CourseCardProps) {
  return (
    <article className={cn('group h-full rounded-xl border border-outline-variant bg-white overflow-hidden transition-colors hover:border-primary/25', className)}>
      <Link to={`/course/${course.id}`} className="block relative h-44 sm:h-48 bg-primary overflow-hidden">
        <img
          src={course.thumbnail}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-78 transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {course.videoUrl ? (
          <SecureVideo
            src={course.videoUrl}
            poster={course.thumbnail}
            className="absolute inset-0 h-full w-full object-cover opacity-72 transition-transform duration-500 group-hover:scale-105"
            muted
            preload="metadata"
          />
        ) : (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="absolute inset-0 h-full w-full object-cover opacity-78 transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary">{course.category}</span>
          {course.isNew && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">New</span>}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="flex items-center gap-2 text-white">
            <PlayCircle size={18} fill="currentColor" />
            <span className="text-sm font-medium">Preview lesson</span>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/14 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            <Star size={12} fill="currentColor" className="text-secondary" />
            {course.rating}
          </div>
        </div>
      </Link>

      <div className="p-4 sm:p-5 flex min-h-[248px] sm:min-h-[260px] flex-col">
        <Link to={`/course/${course.id}`}>
          <h3 className="font-headline text-lg font-semibold leading-6 text-primary line-clamp-2">
            {course.title}
          </h3>
        </Link>
        <p className="mt-3 text-sm leading-6 text-on-surface-variant line-clamp-2">
          {course.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 border-y border-outline-variant py-3 text-xs text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} />
            {course.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} />
            {(course.reviewsCount * 1.5).toFixed(0)} students
          </span>
        </div>

        <div className="mt-auto pt-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="h-9 w-9 rounded-full object-cover border border-outline-variant"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-primary">{course.instructor.name}</p>
              <p className="text-xs text-on-surface-variant">Instructor</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-sm font-semibold text-primary">Monthly access</span>
            <Link
              to={`/course/${course.id}`}
              className="h-9 rounded-full bg-primary px-3 text-white inline-flex items-center gap-1.5 justify-center hover:bg-primary-container active:translate-y-px active:scale-[0.98] transition-all"
              aria-label={`Subscribe to access ${course.title}`}
            >
              <CreditCard size={15} />
              <span className="text-xs font-bold">Subscribe</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
