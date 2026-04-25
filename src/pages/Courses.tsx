import React from 'react';
import { Search, Star, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { COURSES } from '../constants';
import CourseCard from '../components/CourseCard';
import { cn } from '../lib/utils';

export default function Courses() {
  const [activeCategory, setActiveCategory] = React.useState('All Courses');
  const categories = ['All Courses', 'AI & ML', 'Data Science', 'Web Development', 'Automation', 'Programming'];
  const [displayText, setDisplayText] = React.useState('');
  const fullText = "From beginner to advanced, our courses are designed to help you understand AI from the ground up, build real-world tech projects, and stay ahead in a rapidly evolving digital world.";
  
  React.useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-12 md:space-y-16">
      {/* Hero & Search */}
      <section className="space-y-8">
        <h1 className="text-3xl md:text-6xl font-extrabold font-headline tracking-tight text-primary mb-4 md:mb-6 leading-[1.1]">
          Learn Skills That <br className="hidden md:block" /><span className="text-secondary italic">Matter.</span>
        </h1>
        <p className="text-on-surface-variant text-base md:text-lg max-w-2xl mb-8 md:mb-10 leading-relaxed min-h-[4rem] font-medium">
          {displayText}
          <span className="inline-block w-1.5 h-5 ml-1 bg-secondary animate-pulse align-middle" />
        </p>

        <div className="glass-effect p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] space-y-6 md:space-y-8 border border-white/40">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={22} />
              <input 
                type="text" 
                placeholder="Search for AI, ML, Data Science..." 
                className="w-full pl-12 md:pl-14 pr-6 py-3.5 md:py-5 bg-white/50 backdrop-blur-sm border border-outline-variant/10 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/30 transition-all text-on-surface text-sm md:text-base font-medium placeholder:text-on-surface-variant/50"
              />
            </div>
            <button className="bg-primary text-white px-8 md:px-10 py-3.5 md:py-5 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20">
              Find Your Course
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border",
                  activeCategory === cat 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                    : "bg-white/50 text-on-surface-variant border-outline-variant/10 hover:bg-white hover:border-primary/20 hover:text-primary"
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
            <span className="text-on-surface-variant font-medium">Showing {COURSES.length} courses</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-on-surface-variant">Sort by:</span>
              <select className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer">
                <option>Most Popular</option>
                <option>Newest First</option>
                <option>Price: Low to High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
