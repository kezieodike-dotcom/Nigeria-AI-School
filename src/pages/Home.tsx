import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Code2,
  CreditCard,
  FileVideo,
  Globe,
  GraduationCap,
  Layers3,
  Rocket,
  ShieldCheck,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { COURSES, CREATORS } from '../constants';
import CourseCard from '../components/CourseCard';
import GlowCard from '../components/ui/spotlight-card';
import { cn } from '../lib/utils';

const categoryCards = [
  {
    title: 'Content Creation',
    kicker: 'Create with AI',
    description: 'Plan scripts, edit faster, design campaign assets, and turn ideas into polished media workflows.',
    icon: FileVideo,
    accent: 'bg-emerald-600',
    tint: 'from-emerald-50 to-white',
    border: 'border-emerald-600/15',
    stat: '14 creator workflows',
  },
  {
    title: 'Coding',
    kicker: 'Build software',
    description: 'Learn Python, web apps, automation, and AI-assisted development with practical Nigerian use cases.',
    icon: Code2,
    accent: 'bg-sky-700',
    tint: 'from-sky-50 to-white',
    border: 'border-sky-700/15',
    stat: '22 build projects',
  },
  {
    title: 'Productivity',
    kicker: 'Work smarter',
    description: 'Use AI to organize research, build repeatable systems, analyze tasks, and reclaim focused time.',
    icon: Layers3,
    accent: 'bg-amber-600',
    tint: 'from-amber-50 to-white',
    border: 'border-amber-600/15',
    stat: '18 practical systems',
  },
];

const processSteps = [
  {
    title: 'Learn',
    desc: 'Master AI, software, and digital skills through creator-led lessons built around real work.',
    icon: BookOpen,
  },
  {
    title: 'Create',
    desc: 'Turn your expertise into a course, publish it, and reach learners beyond your immediate network.',
    icon: Rocket,
  },
  {
    title: 'Earn',
    desc: 'Subscribe to skills, sell your knowledge, or grow income through referrals and creator tools.',
    icon: CreditCard,
  },
];

const creatorBenefits = [
  { text: 'Secure video hosting and protected learning access', icon: ShieldCheck },
  { text: 'Payments for Nigerian and global learners', icon: CreditCard },
  { text: 'Affiliate tools that help your audience spread the word', icon: Share2 },
];

export default function Home() {
  return (
    <div className="overflow-hidden bg-surface pb-20">
      <section className="relative min-h-[88dvh] overflow-hidden bg-[#f8fbf9]">
        <img
          src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1800"
          alt=""
          aria-hidden="true"
          className="absolute inset-y-0 right-0 hidden h-full w-[54%] object-cover opacity-90 lg:block"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#f8fbf9_0%,#f8fbf9_44%,rgba(248,251,249,0.84)_64%,rgba(248,251,249,0.38)_100%)]" />
        <div className="absolute inset-0 opacity-[0.45] bg-[linear-gradient(rgba(0,21,77,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(0,21,77,0.07)_1px,transparent_1px)] bg-[size:44px_44px]" />

        <div className="relative mx-auto grid min-h-[88dvh] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="max-w-3xl"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-secondary/15 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-widest text-secondary shadow-sm shadow-secondary/5 backdrop-blur">
              <Sparkles size={14} />
              Nigeria's practical AI learning hub
            </div>
            <h1 className="font-headline text-4xl font-black leading-[1.02] tracking-tight text-primary sm:text-5xl md:text-6xl">
              Learn AI skills that turn ambition into useful work.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-on-surface-variant md:text-lg">
              Nigeria AI School helps learners and creators build real capability in AI, coding, content creation, and productivity systems.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-4 text-base font-black text-white shadow-lg shadow-primary/15 transition-all hover:bg-primary-container hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Explore Courses
                <ArrowRight size={19} />
              </Link>
              <Link
                to="/become-creator"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/15 bg-white/80 px-7 py-4 text-base font-black text-primary shadow-sm transition-all hover:border-secondary/30 hover:text-secondary active:scale-[0.98]"
              >
                Become a Creator
                <ChevronRight size={19} />
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 divide-x divide-primary/10 rounded-3xl border border-primary/10 bg-white/75 p-4 shadow-sm backdrop-blur">
              {[
                ['47.2k', 'learning minutes'],
                ['3', 'core tracks'],
                ['30%', 'affiliate earning'],
              ].map(([value, label]) => (
                <div key={label} className="px-3 text-center first:pl-0 last:pr-0">
                  <p className="font-headline text-xl font-black text-primary md:text-2xl">{value}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.12 }}
            className="relative hidden lg:block"
          >
            <div className="ml-auto w-[min(460px,100%)] rounded-[2rem] border border-white/70 bg-white/82 p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl">
              <div className="aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                <img
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Students learning together"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-secondary">Current focus</p>
                  <h2 className="mt-1 font-headline text-2xl font-black tracking-tight text-primary">AI for real business tasks</h2>
                </div>
                <div className="rounded-2xl bg-secondary px-4 py-3 text-right text-white">
                  <p className="text-2xl font-black">86%</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-white/75">completion</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-2 w-64 rounded-3xl border border-white/70 bg-white/88 p-5 shadow-xl shadow-primary/10 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                  <BrainCircuit size={23} />
                </div>
                <div>
                  <p className="font-headline text-lg font-black text-primary">Live learning paths</p>
                  <p className="text-sm font-medium text-on-surface-variant">Built for Nigerian teams</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-secondary">Skill categories</p>
            <h2 className="mt-3 font-headline text-3xl font-black leading-tight tracking-tight text-primary md:text-5xl">
              Choose a path you can use this week.
            </h2>
          </div>
          <p className="max-w-2xl text-base font-medium leading-relaxed text-on-surface-variant lg:ml-auto">
            Start with focused categories that match the work people are already trying to do: create sharper content, write useful code, and build better systems.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-[1.12fr_0.88fr] lg:grid-cols-[1.1fr_0.9fr_1fr]">
          {categoryCards.map((category, index) => (
            <Link
              key={category.title}
              to="/courses"
              className={cn(
                'group relative min-h-[280px] overflow-hidden rounded-[2rem] border bg-gradient-to-br p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 active:scale-[0.99]',
                category.tint,
                category.border,
                index === 0 && 'lg:translate-y-8',
                index === 1 && 'md:min-h-[330px]',
              )}
            >
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/[0.04]" />
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <div className={cn('mb-8 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/10 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105', category.accent)}>
                    <category.icon size={27} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{category.kicker}</p>
                  <h3 className="mt-2 font-headline text-2xl font-black tracking-tight text-primary">{category.title}</h3>
                  <p className="mt-4 text-sm font-medium leading-relaxed text-on-surface-variant">{category.description}</p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-primary/10 pt-5">
                  <span className="text-xs font-black uppercase tracking-widest text-primary/70">{category.stat}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm transition-all group-hover:bg-primary group-hover:text-white">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-[2rem] border border-primary/10 bg-white p-6 shadow-sm md:p-10 lg:p-12">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-widest text-secondary">How it works</p>
            <h2 className="mt-3 font-headline text-3xl font-black leading-tight tracking-tight text-primary md:text-5xl">
              A simple system for learning, creating, and earning.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                className="rounded-[1.5rem] border border-outline-variant/15 bg-surface-container-lowest p-6"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                    <step.icon size={23} />
                  </div>
                  <span className="font-headline text-4xl font-black text-primary/[0.07]">0{index + 1}</span>
                </div>
                <h3 className="font-headline text-2xl font-black text-primary">{step.title}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-on-surface-variant">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-widest text-secondary">Featured courses</p>
            <h2 className="mt-3 font-headline text-3xl font-black tracking-tight text-primary md:text-4xl">Learn skills that compound.</h2>
            <p className="mt-4 text-base font-medium leading-relaxed text-on-surface-variant">
              Explore practical courses from approved creators and subscribe when you find your fit.
            </p>
          </div>
          <Link to="/courses" className="inline-flex items-center gap-2 rounded-2xl bg-primary/5 px-6 py-3 text-sm font-black text-primary transition-all hover:bg-primary hover:text-white active:scale-[0.98]">
            Explore all courses <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      <section className="bg-surface-container-low py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-secondary/10" />
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Creator teaching a small team"
              className="relative h-[420px] w-full rounded-[2rem] object-cover shadow-xl shadow-primary/10 md:h-[540px]"
            />
            <div className="absolute -bottom-8 right-6 hidden rounded-3xl border border-outline-variant/10 bg-white p-6 shadow-xl shadow-primary/10 lg:block">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-xl font-black text-primary">NGN 500k+</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">creator potential</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-widest text-secondary">For creators</p>
            <h2 className="mt-3 font-headline text-3xl font-black leading-tight tracking-tight text-primary md:text-5xl">
              Turn what you know into a learning product.
            </h2>
            <p className="mt-5 text-base font-medium leading-relaxed text-on-surface-variant md:text-lg">
              Teach the skills you use every day, package your knowledge for serious learners, and grow a revenue channel around your expertise.
            </p>
            <ul className="mt-8 space-y-4">
              {creatorBenefits.map((item) => (
                <li key={item.text} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-secondary shadow-sm">
                    <item.icon size={21} />
                  </div>
                  <span className="text-base font-bold text-on-surface">{item.text}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/become-creator"
              className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-black text-white shadow-lg shadow-primary/15 transition-all hover:bg-primary-container active:scale-[0.98]"
            >
              Start as a creator
              <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-5 rounded-[2rem] bg-secondary p-6 text-white md:grid-cols-[1fr_0.88fr] md:p-10 lg:p-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
              <Zap size={14} />
              Affiliate earning
            </div>
            <h2 className="mt-6 font-headline text-3xl font-black leading-tight tracking-tight md:text-5xl">
              Earn by helping people find the right course.
            </h2>
            <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/78">
              Share courses with your audience and earn commissions when learners subscribe through your link.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
            {['No inventory', 'Fast setup', 'Trackable links'].map((label) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <CheckCircle2 size={20} className="shrink-0 text-secondary-fixed-dim" />
                <span className="text-sm font-black">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 text-center sm:px-6">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface-container-high px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary">
          <Globe size={14} />
          Global reach
        </div>
        <h2 className="font-headline text-3xl font-black tracking-tight text-primary md:text-4xl">Built in Nigeria. Open to the world.</h2>
        <p className="mx-auto mt-5 max-w-3xl text-base font-medium leading-relaxed text-on-surface-variant md:text-lg">
          Learn from anywhere, sell to anywhere, and build skills that travel beyond borders.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-secondary">Community</p>
          <h2 className="mt-3 font-headline text-3xl font-black tracking-tight text-primary">Trusted by future builders</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          {CREATORS.map((creator) => (
            <motion.div key={creator.id} whileHover={{ y: -5 }} className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white p-1 shadow-lg shadow-primary/10">
                  <img src={creator.avatar} alt={creator.name} className="h-full w-full rounded-full object-cover" referrerPolicy="no-referrer" />
                </div>
                {creator.isVerified && (
                  <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-secondary-fixed-dim">
                    <ShieldCheck size={16} className="text-white" fill="currentColor" />
                  </div>
                )}
              </div>
              <h4 className="font-headline text-lg font-black text-primary">{creator.name}</h4>
              <p className="text-sm font-bold text-secondary">{creator.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <GlowCard glowColor="green" customSize className="overflow-hidden rounded-[2rem] border border-primary/10 bg-primary p-8 text-center md:p-14 lg:p-20">
          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
              <GraduationCap size={28} />
            </div>
            <h2 className="font-headline text-3xl font-black tracking-tight text-white md:text-5xl">Start building your AI advantage.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/72 md:text-lg">
              Whether you want to learn, teach, or earn from knowledge, Nigeria AI School gives you a focused place to begin.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/courses" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-black text-primary transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                Start learning
                <ArrowRight size={19} />
              </Link>
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary px-7 py-4 text-base font-black text-white transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                Create account
                <Users size={19} />
              </Link>
            </div>
          </div>
        </GlowCard>
      </section>
    </div>
  );
}
