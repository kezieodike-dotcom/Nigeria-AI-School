import React from 'react';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { COURSES } from '../constants';
import CourseCard from '../components/CourseCard';
import { cn } from '../lib/utils';

export default function Courses() {
  const [activeCategory, setActiveCategory] = React.useState('All Courses');
  const categories = ['All Courses', 'AI & ML', 'Data Science', 'Web Development', 'Automation', 'Programming'];

  return (
    <div className="bg-white">
      <section className="border-b border-outline-variant bg-[radial-gradient(circle_at_20%_20%,rgba(0,212,164,0.16),transparent_28%),linear-gradient(180deg,#f5e9d8_0%,#ffffff_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20 lg:py-24">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_390px] gap-8 lg:gap-16 items-end">
            <div className="max-w-5xl">
              <h1 className="font-headline text-[2.35rem] sm:text-5xl md:text-[3.75rem] lg:text-[4.25rem] font-semibold text-primary leading-[1.04] max-w-5xl">
                Courses built for practical AI fluency.
              </h1>
              <p className="mt-5 max-w-[62ch] text-base md:text-lg text-on-surface-variant leading-7">
                From beginner foundations to creator-ready technical skills, every course is structured for clarity, practice, and measurable progress.
              </p>
            </div>
            <div className="rounded-xl border border-outline-variant bg-white/88 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input
                  type="text"
                  placeholder="Search courses"
                  className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-low pl-11 pr-4 text-sm outline-none focus:border-secondary focus:bg-white"
                />
              </div>
              <button className="mt-3 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-container active:scale-95 transition-all">
                Find Your Course
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="-mx-4 sm:mx-0 mb-8 overflow-x-auto px-4 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors active:scale-[0.98]',
                  activeCategory === cat
                    ? 'border-primary bg-primary text-white'
                    : 'border-outline-variant bg-white text-on-surface-variant hover:text-primary hover:bg-surface-container'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[224px_minmax(0,1fr)] gap-8 xl:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-outline-variant bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-5">
                <SlidersHorizontal size={16} />
                Filters
              </div>
              <div className="space-y-7">
                <FilterGroup title="Difficulty" options={['Beginner', 'Intermediate', 'Advanced']} />
                <FilterGroup title="Price" options={['Free', 'Under NGN 50k', 'Premium']} />
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-primary">Ratings</h3>
                  {[4.5, 4.0].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 py-1.5 text-sm text-on-surface-variant">
                      <input type="checkbox" className="h-4 w-4 rounded border-outline-variant accent-primary" />
                      <Star size={15} fill="#00d4a4" className="text-secondary" />
                      {rating} and up
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="space-y-6 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-on-surface-variant">Showing {COURSES.length} courses</p>
              <select className="h-10 w-full sm:w-auto rounded-lg border border-outline-variant bg-white px-3 text-sm font-medium text-primary outline-none">
                <option>Most Popular</option>
                <option>Newest First</option>
                <option>Price: Low to High</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5">
              {COURSES.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-primary">{title}</h3>
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 py-1.5 text-sm text-on-surface-variant">
          <input type="checkbox" className="h-4 w-4 rounded border-outline-variant accent-primary" />
          {option}
        </label>
      ))}
    </div>
  );
}
