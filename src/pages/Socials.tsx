import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Linkedin, Mail, MessageCircle, Music2, PlaySquare, Send, Share2, Twitter, Users } from 'lucide-react';
import { cn } from '../lib/utils';

const socialChannels = [
  {
    name: 'YouTube',
    handle: '@NigeriaAISchool',
    description: 'Course previews, practical tutorials, creator interviews, and product walkthroughs.',
    icon: PlaySquare,
    href: '#',
    accent: 'bg-red-600',
    tint: 'from-red-50 to-white',
  },
  {
    name: 'Instagram',
    handle: '@nigeriaaischool',
    description: 'Short lessons, behind-the-scenes updates, student wins, and launch announcements.',
    icon: Instagram,
    href: '#',
    accent: 'bg-rose-600',
    tint: 'from-rose-50 to-white',
  },
  {
    name: 'LinkedIn',
    handle: 'Nigeria AI School',
    description: 'Professional updates, creator opportunities, hiring notes, and AI career resources.',
    icon: Linkedin,
    href: '#',
    accent: 'bg-sky-700',
    tint: 'from-sky-50 to-white',
  },
  {
    name: 'X',
    handle: '@NigeriaAISchool',
    description: 'Fast AI news, live class notes, platform updates, and community threads.',
    icon: Twitter,
    href: '#',
    accent: 'bg-zinc-900',
    tint: 'from-zinc-50 to-white',
  },
  {
    name: 'TikTok',
    handle: '@nigeriaaischool',
    description: 'Quick AI demos, productivity tips, and short creator education clips.',
    icon: Music2,
    href: '#',
    accent: 'bg-primary',
    tint: 'from-blue-50 to-white',
  },
  {
    name: 'WhatsApp Community',
    handle: 'Nigeria AI School Updates',
    description: 'Class reminders, creator announcements, and learner support broadcasts.',
    icon: MessageCircle,
    href: '#',
    accent: 'bg-secondary',
    tint: 'from-emerald-50 to-white',
  },
];

export default function Socials() {
  return (
    <div className="bg-surface pb-24">
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:46px_46px]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
              <Share2 size={14} />
              Social hub
            </div>
            <h1 className="font-headline text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Follow the school beyond the classroom.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-white/72 md:text-lg">
              Find Nigeria AI School on the platforms where we share lessons, creator updates, community announcements, and AI career resources.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/blog" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-black text-primary transition-all hover:-translate-y-0.5 active:scale-95">
                Read the blog <ArrowRight size={18} />
              </Link>
              <a href="mailto:hello@nigeriaaischool.com" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-base font-black text-white transition-all hover:bg-white/15 active:scale-95">
                Contact team <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <div className="grid gap-3 sm:grid-cols-2">
              {['Tutorial drops', 'Creator calls', 'Community updates', 'Student wins'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/15 bg-white/10 p-5">
                  <Users className="mb-5 text-secondary-fixed-dim" size={24} />
                  <p className="font-headline text-lg font-black text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-black uppercase tracking-widest text-secondary">Channels</p>
          <h2 className="mt-2 font-headline text-3xl font-black text-primary md:text-4xl">Choose where you want to connect.</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {socialChannels.map((channel, index) => (
            <a
              key={channel.name}
              href={channel.href}
              className={cn(
                'group min-h-[260px] rounded-[2rem] border border-outline-variant/10 bg-gradient-to-br p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10',
                channel.tint,
                index === 1 && 'xl:translate-y-8',
                index === 4 && 'xl:-translate-y-4'
              )}
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className={cn('mb-7 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/10 transition-transform group-hover:rotate-3 group-hover:scale-105', channel.accent)}>
                    <channel.icon size={27} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{channel.handle}</p>
                  <h3 className="mt-2 font-headline text-2xl font-black text-primary">{channel.name}</h3>
                  <p className="mt-4 text-sm font-medium leading-relaxed text-on-surface-variant">{channel.description}</p>
                </div>
                <div className="mt-7 flex items-center justify-between border-t border-primary/10 pt-5">
                  <span className="text-xs font-black uppercase tracking-widest text-primary/70">Open channel</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm transition-all group-hover:bg-primary group-hover:text-white">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-5 rounded-[2rem] border border-secondary/15 bg-white p-6 md:grid-cols-[1fr_auto] md:items-center md:p-9">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-secondary">Newsletter</p>
            <h2 className="mt-2 font-headline text-2xl font-black text-primary">Get new lessons and creator updates by email.</h2>
            <p className="mt-2 text-sm font-medium text-on-surface-variant">A simple place for school announcements, blog drops, and new course launches.</p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="you@example.com"
              className="h-12 min-w-0 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 text-sm font-bold text-primary outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 sm:w-72"
            />
            <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-secondary px-5 text-sm font-black text-white transition-all hover:bg-secondary/90 active:scale-95">
              Join List <Send size={16} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
