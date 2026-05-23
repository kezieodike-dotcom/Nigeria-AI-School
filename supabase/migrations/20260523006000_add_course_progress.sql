create table if not exists public.course_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  watched_seconds numeric not null default 0,
  total_seconds numeric not null default 0,
  progress_percent integer not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  completed boolean not null default false,
  last_watched_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (student_id, course_id)
);

alter table public.course_progress enable row level security;

drop policy if exists "Students can view their own course progress" on public.course_progress;
drop policy if exists "Students can insert their own course progress" on public.course_progress;
drop policy if exists "Students can update their own course progress" on public.course_progress;

create policy "Students can view their own course progress"
  on public.course_progress for select
  using (student_id = (select auth.uid()));

create policy "Students can insert their own course progress"
  on public.course_progress for insert
  with check (student_id = (select auth.uid()));

create policy "Students can update their own course progress"
  on public.course_progress for update
  using (student_id = (select auth.uid()))
  with check (student_id = (select auth.uid()));

create index if not exists course_progress_student_id_idx
  on public.course_progress (student_id);

create index if not exists course_progress_course_id_idx
  on public.course_progress (course_id);
