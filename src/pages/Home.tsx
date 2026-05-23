import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  PlayCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { motion } from 'motion/react';
import { COURSES } from '../constants';
import CourseCard from '../components/CourseCard';

const proofPoints = ['AI Foundations', 'Creator Commerce', 'Affiliate Earnings', 'Career Projects'];

const process = [
  {
    title: 'Learn',
    desc: 'Follow structured AI, data, and software courses with project-first lessons built for real outcomes.',
    icon: BookOpen,
  },
  {
    title: 'Create',
    desc: 'Publish your expertise as a premium course, manage students, and grow a creator profile.',
    icon: Rocket,
  },
  {
    title: 'Earn',
    desc: 'Sell courses, share affiliate links, and track payouts from a single learning commerce dashboard.',
    icon: CreditCard,
  },
];

const metrics = [
  ['4', 'creator-ready courses'],
  ['30%', 'affiliate commission'],
  ['24/7', 'self-paced access'],
];

export default function Home() {
  const featuredCourses = COURSES.slice(0, 3);

  return (
    <div className="bg-white">
      <section className="relative min-h-[calc(100vh-64px)] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=85&w=1800"
          alt="Students learning technology"
          className="absolute inset-0 h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-white" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-10 min-h-[calc(100vh-64px)] flex flex-col justify-between">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl text-white"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/12 border border-white/20 px-4 py-2 text-sm font-medium backdrop-blur-md mb-8">
              <Sparkles size={16} className="text-secondary" />
              Built in Nigeria. Open to the world.
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-semibold leading-[1.05]">
              The AI learning platform for builders, creators, and earners.
            </h1>
            <p className="mt-6 max-w-2xl text-base md:text-lg leading-8 text-white/82">
              Nigeria AI School brings practical AI education, creator tools, and affiliate income into one polished learning workspace.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-primary hover:bg-secondary-fixed-dim active:scale-95 transition-all"
              >
                Start Learning <ArrowRight size={17} />
              </Link>
              <Link
                to="/become-creator"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-surface-container active:scale-95 transition-all"
              >
                Creator Info
              </Link>
            </div>
          </motion.div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-xl border border-white/20 bg-white/20 backdrop-blur-md">
            {proofPoints.map((point) => (
              <div key={point} className="bg-white/88 px-4 py-4 text-sm font-medium text-primary">
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <p className="text-sm font-mono text-secondary mb-4">learn.create.earn</p>
            <h2 className="font-headline text-3xl md:text-5xl font-semibold text-primary leading-tight">
              A complete path from skill-building to digital income.
            </h2>
            <p className="mt-5 text-on-surface-variant leading-7 max-w-xl">
              The interface is built like a serious product workspace: clear progress, concise course cards, visible outcomes, and fast routes into the work that matters.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {process.map((item) => (
              <div key={item.title} className="rounded-xl border border-outline-variant bg-white p-6">
                <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-lg bg-surface-container text-primary">
                  <item.icon size={22} />
                </div>
                <h3 className="font-headline text-xl font-semibold text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-container py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-sm font-mono text-secondary mb-4">course catalog</p>
              <h2 className="font-headline text-3xl md:text-5xl font-semibold text-primary">Start with practical AI courses.</h2>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-white hover:bg-primary-container active:scale-95 transition-all"
            >
              Browse Courses <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_0.9fr] gap-12 items-center">
          <div>
            <p className="text-sm font-mono text-secondary mb-4">creator operating system</p>
            <h2 className="font-headline text-3xl md:text-5xl font-semibold leading-tight">
              Teach what you know. Track what you earn.
            </h2>
            <p className="mt-5 text-white/70 leading-7 max-w-2xl">
              Creator dashboards, student insights, course publishing, and payout tracking are designed to feel like one calm workspace instead of scattered tools.
            </p>
            <div className="mt-8 grid sm:grid-cols-3 gap-3">
              {metrics.map(([value, label]) => (
                <div key={label} className="rounded-xl border border-white/12 bg-white/6 p-5">
                  <p className="text-3xl font-semibold">{value}</p>
                  <p className="mt-2 text-sm text-white/62">{label}</p>
                </div>
              ))}
            </div>
            <Link
              to="/creator-dashboard"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-surface-container active:scale-95 transition-all"
            >
              Open Creator Hub <LayoutDashboard size={17} />
            </Link>
          </div>

          <div className="rounded-xl border border-white/12 bg-[#1c1c1e] overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="font-mono text-xs text-white/55">creator-dashboard.tsx</span>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-primary">Live</span>
            </div>
            <div className="p-5 space-y-4">
              {[
                ['Course revenue', '₦0', TrendingIcon],
                ['Students enrolled', '0', Users],
                ['Published courses', '4', GraduationCap],
              ].map(([label, value, Icon]) => (
                <div key={label as string} className="flex items-center justify-between rounded-lg bg-white/[0.04] border border-white/8 p-4">
                  <div className="flex items-center gap-3">
                    {React.createElement(Icon as React.ElementType, { size: 18, className: 'text-secondary' })}
                    <span className="text-sm text-white/72">{label as string}</span>
                  </div>
                  <span className="font-mono text-sm text-white">{value as string}</span>
                </div>
              ))}
              <div className="rounded-lg bg-white p-4 text-primary">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck size={17} className="text-secondary" />
                  Creator profile ready
                </div>
                <p className="mt-2 text-sm text-on-surface-variant">Upload a photo, update your profile, and publish your expertise.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="rounded-xl border border-outline-variant bg-white p-8 md:p-12 text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
            <PlayCircle size={24} />
          </div>
          <h2 className="font-headline text-3xl md:text-5xl font-semibold text-primary">Ready to build your AI future?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-on-surface-variant leading-7">
            Learn deeply, create confidently, and earn from a platform designed for practical African AI education.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/signup" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-container active:scale-95 transition-all">
              Get Started
            </Link>
            <Link to="/courses" className="rounded-full border border-outline-variant px-6 py-3 text-sm font-semibold text-primary hover:bg-surface-container active:scale-95 transition-all">
              View Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function TrendingIcon(props: React.ComponentProps<typeof CheckCircle2>) {
  return <CheckCircle2 {...props} />;
}
