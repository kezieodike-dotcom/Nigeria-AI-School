import React from 'react';
import { BookOpen, Search, SlidersHorizontal, Star } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { cn } from '../lib/utils';
import { Course } from '../types';
import { fetchPaidCourses } from '../lib/courses';

export default function Courses() {
  const [activeCategory, setActiveCategory] = React.useState('All Courses');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(true);
  const categories = React.useMemo(() => {
    const courseCategories = [...new Set(courses.map((course) => course.category).filter(Boolean))];
    return ['All Courses', ...courseCategories];
  }, [courses]);

  React.useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      setCourses(await fetchPaidCourses());
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      window.showToast?.(error.message || 'Unable to load courses.', 'error');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const visibleCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === 'All Courses' || course.category === activeCategory;
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term || [course.title, course.description, course.category, course.instructor.name]
      .some((value) => value.toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-surface">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-surface to-secondary/5 border-b border-outline-variant/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase tracking-widest mb-6 border border-secondary/20">
              <BookOpen size={14} />
              Creator-led AI courses
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-headline tracking-tight text-primary mb-5 leading-[1.1]">
              Learn AI skills from practical courses built for Nigerians.
            </h1>
            <p className="max-w-2xl text-base md:text-lg text-on-surface-variant leading-relaxed">
              Browse paid courses from approved creators, search by skill area, and subscribe when you find the right path.
            </p>
          </div>

          <div className="glass-effect mt-8 p-4 md:p-5 rounded-2xl max-w-4xl shadow-xl shadow-primary/5">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input
                  type="text"
                  placeholder="Search by title, category, or instructor"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full h-12 rounded-xl border border-outline-variant/20 bg-white pl-11 pr-4 text-sm font-medium outline-none transition-colors focus:border-secondary focus:ring-4 focus:ring-secondary/10"
                />
              </div>
              <button
                onClick={() => setActiveCategory('All Courses')}
                className="h-12 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-container active:scale-95"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
        <div className="-mx-4 sm:mx-0 overflow-x-auto px-4 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold transition-all active:scale-95',
                  activeCategory === cat
                    ? 'border-primary bg-primary text-white shadow-lg shadow-primary/15'
                    : 'border-outline-variant/20 bg-white text-on-surface-variant hover:border-primary/30 hover:text-primary'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[224px_minmax(0,1fr)] gap-8 xl:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-outline-variant/10 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-black text-primary mb-5 font-headline">
                <SlidersHorizontal size={16} />
                Filters
              </div>
              <div className="space-y-7">
                <FilterGroup title="Difficulty" options={['Beginner', 'Intermediate', 'Advanced']} />
                <FilterGroup title="Price" options={['Under NGN 50k', 'Premium']} />
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
              <p className="text-sm font-medium text-on-surface-variant">
                Showing <span className="font-black text-primary">{visibleCourses.length}</span> paid courses
              </p>
              <select className="h-10 w-full sm:w-auto rounded-xl border border-outline-variant/20 bg-white px-3 text-sm font-bold text-primary outline-none">
                <option>Most Popular</option>
                <option>Newest First</option>
                <option>Price: Low to High</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {visibleCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            {!loading && visibleCourses.length === 0 && (
              <div className="rounded-2xl border border-dashed border-outline-variant/30 bg-white p-10 text-center shadow-sm">
                <BookOpen className="mx-auto mb-4 text-secondary/60" size={42} />
                <h3 className="font-headline text-xl font-semibold text-primary">No paid courses found</h3>
                <p className="mt-2 text-sm text-on-surface-variant">Published creator courses will appear here automatically.</p>
              </div>
            )}
            {loading && (
              <div className="rounded-2xl border border-outline-variant/10 bg-white p-10 text-center text-sm font-bold text-on-surface-variant shadow-sm">
                Loading paid courses...
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-black text-primary">{title}</h3>
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 py-1.5 text-sm text-on-surface-variant">
          <input type="checkbox" className="h-4 w-4 rounded border-outline-variant accent-secondary" />
          {option}
        </label>
      ))}
    </div>
  );
}
