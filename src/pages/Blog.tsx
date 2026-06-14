import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays, Clock, PenLine, Search, Sparkles, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

const featuredPosts = [
  {
    title: 'How to use AI to plan a full week of content',
    category: 'Content Creation',
    readTime: '6 min read',
    date: 'May 2026',
    description: 'A practical workflow for turning one idea into scripts, captions, thumbnails, and posting notes.',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    title: 'Beginner coding projects that teach real AI skills',
    category: 'Coding',
    readTime: '8 min read',
    date: 'May 2026',
    description: 'Start with small useful builds: prompt tools, dashboards, automations, and simple AI assistants.',
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    title: 'The AI productivity stack for students and creators',
    category: 'Productivity',
    readTime: '5 min read',
    date: 'May 2026',
    description: 'Use AI to organize research, summarize lessons, track projects, and protect deep-work time.',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
];

const categories = ['All', 'AI Basics', 'Content Creation', 'Coding', 'Productivity', 'Creator Business'];

export default function Blog() {
  return (
    <div className="bg-surface pb-24">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.42] bg-[linear-gradient(rgba(0,21,77,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(0,21,77,0.07)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-secondary/15 bg-secondary/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-secondary">
              <PenLine size={14} />
              Nigeria AI School Blog
            </div>
            <h1 className="font-headline text-4xl font-black leading-tight tracking-tight text-primary md:text-6xl">
              Ideas, tutorials, and field notes for practical AI learning.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-on-surface-variant md:text-lg">
              A home for guides on content creation, coding, productivity, creator income, and how Nigerians can apply AI in real work.
            </p>
          </div>

          <div className="mt-10 max-w-3xl rounded-2xl border border-outline-variant/15 bg-white/80 p-3 shadow-sm backdrop-blur">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
              <input
                type="text"
                placeholder="Search articles, guides, and creator notes"
                className="h-12 w-full rounded-xl border border-outline-variant/15 bg-surface-container-lowest pl-11 pr-4 text-sm font-bold text-primary outline-none transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/10"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full gap-2">
            {categories.map((category, index) => (
              <button
                key={category}
                className={cn(
                  'shrink-0 rounded-full border px-4 py-2.5 text-sm font-black transition-all active:scale-95',
                  index === 0
                    ? 'border-primary bg-primary text-white'
                    : 'border-outline-variant/20 bg-white text-on-surface-variant hover:border-secondary/30 hover:text-secondary'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[1.12fr_0.88fr]">
        <article className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-sm">
          <div className="grid min-h-[420px] lg:grid-cols-2">
            <div className="relative min-h-[260px] overflow-hidden bg-primary">
              <img
                src={featuredPosts[0].image}
                alt={featuredPosts[0].title}
                className="h-full w-full object-cover opacity-88"
              />
            </div>
            <div className="flex flex-col justify-between p-7 md:p-10">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-secondary">
                  <Sparkles size={13} />
                  Featured
                </div>
                <h2 className="font-headline text-3xl font-black leading-tight tracking-tight text-primary md:text-4xl">
                  {featuredPosts[0].title}
                </h2>
                <p className="mt-5 text-base font-medium leading-relaxed text-on-surface-variant">
                  {featuredPosts[0].description}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/10 pt-6">
                <PostMeta post={featuredPosts[0]} />
                <Link to="/courses" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition-all hover:bg-primary-container active:scale-95">
                  Learn the skill <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </article>

        <aside className="rounded-[2rem] border border-outline-variant/10 bg-white p-7 shadow-sm">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/5 text-primary">
              <BookOpen size={22} />
            </div>
            <div>
              <h3 className="font-headline text-xl font-black text-primary">Editorial Tracks</h3>
              <p className="text-sm font-medium text-on-surface-variant">What we will publish often.</p>
            </div>
          </div>
          <div className="space-y-3">
            {['Beginner AI guides', 'Creator growth playbooks', 'Coding project breakdowns', 'Productivity systems'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-4">
                <span className="text-sm font-black text-primary">{item}</span>
                <ArrowRight size={16} className="text-secondary" />
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-secondary">Latest posts</p>
            <h2 className="mt-2 font-headline text-3xl font-black text-primary">Fresh from the school</h2>
          </div>
          <Link to="/socials" className="inline-flex items-center gap-2 text-sm font-black text-primary hover:text-secondary">
            Follow updates <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredPosts.map((post) => (
            <article key={post.title} className="overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
              <div className="h-48 overflow-hidden bg-primary">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover opacity-90" />
              </div>
              <div className="p-6">
                <PostMeta post={post} />
                <h3 className="mt-5 font-headline text-xl font-black leading-tight text-primary">{post.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-on-surface-variant">{post.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function PostMeta({ post }: { post: (typeof featuredPosts)[number] }) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-wide text-on-surface-variant">
      <span className="inline-flex items-center gap-1.5"><Tag size={13} /> {post.category}</span>
      <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {post.readTime}</span>
      <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> {post.date}</span>
    </div>
  );
}
