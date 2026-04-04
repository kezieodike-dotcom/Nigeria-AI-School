import React from 'react';
import { Search, Star, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { COURSES } from '../constants';
import CourseCard from '../components/CourseCard';
import { cn } from '../lib/utils';

export default function Courses() {
  const [activeCategory, setActiveCategory] = React.useState('All Courses');
  const categories = ['All Courses', 'AI & ML', 'Data Science', 'Web Development', 'Automation', 'Programming'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Hero & Search */}
      <section className="space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold font-headline tracking-tight text-primary mb-6">
          Learn Skills That <span className="text-secondary">Matter.</span>
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mb-10 leading-relaxed">
          From beginner to advanced, our courses are designed to help you understand AI from the ground up, build real-world tech projects, and stay ahead in a rapidly evolving digital world.
        </p>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-6 border border-outline-variant/10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
              <input 
                type="text" 
                placeholder="Search for courses, tools, or instructors..." 
                className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-on-surface"
              />
            </div>
            <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity">
              Find Course
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  activeCategory === cat 
                    ? "bg-primary text-white" 
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block space-y-10">
          <div>
            <h3 className="font-headline font-bold text-lg mb-6 text-primary">Difficulty</h3>
            <div className="space-y-4">
              {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <label key={level} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20" />
                  <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-headline font-bold text-lg mb-6 text-primary">Price Range</h3>
            <div className="space-y-4">
              {['Free', 'Paid (Under ₦50k)', 'Premium'].map((range) => (
                <label key={range} className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="price" className="w-5 h-5 border-outline-variant text-primary focus:ring-primary/20" />
                  <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">{range}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-headline font-bold text-lg mb-6 text-primary">Ratings</h3>
            <div className="space-y-4">
              {[4.5, 4.0].map((rating) => (
                <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                  <Star size={18} fill="#eab308" className="text-yellow-500" />
                  <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">{rating} & up</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Course Grid */}
        <div className="lg:col-span-3 space-y-12">
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant font-medium">Showing 248 courses</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-on-surface-variant">Sort by:</span>
              <select className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer">
                <option>Most Popular</option>
                <option>Newest First</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
            {/* Duplicate for visual effect */}
            {COURSES.map((course) => (
              <CourseCard key={course.id + '-dup'} course={course} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 pt-12">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-primary">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-primary font-bold">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-primary font-bold">3</button>
            <span className="text-on-surface-variant">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-primary font-bold">12</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-primary">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
