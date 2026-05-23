create table if not exists public.payments (
  id uuid default uuid_generate_v4() primary key,
  reference text not null unique,
  course_id uuid references public.courses(id) on delete restrict,
  student_id uuid references auth.users(id) on delete cascade,
  amount numeric not null,
  currency text not null default 'NGN',
  status text not null default 'pending' check (status in ('pending', 'success', 'failed', 'abandoned')),
  provider text not null default 'paystack',
  provider_transaction_id text,
  authorization_url text,
  paid_at timestamp with time zone,
  raw_response jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payments enable row level security;

drop policy if exists "Students can view their own payments" on public.payments;
drop policy if exists "Creators can view payments for their courses" on public.payments;

create policy "Students can view their own payments"
  on public.payments for select
  using ((select auth.uid()) = student_id);

create policy "Creators can view payments for their courses"
  on public.payments for select
  using (
    exists (
      select 1
      from public.courses
      where courses.id = payments.course_id
        and courses.instructor_id = (select auth.uid())
    )
  );

create table if not exists public.payment_events (
  id uuid default uuid_generate_v4() primary key,
  provider text not null default 'paystack',
  event_type text not null,
  reference text,
  payload jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payment_events enable row level security;

drop policy if exists "Admins can view payment events" on public.payment_events;

create policy "Admins can view payment events"
  on public.payment_events for select
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

create unique index if not exists payments_reference_idx on public.payments (reference);
create index if not exists payments_student_id_idx on public.payments (student_id);
create index if not exists payments_course_id_idx on public.payments (course_id);
create index if not exists payments_status_idx on public.payments (status);
create index if not exists payment_events_reference_idx on public.payment_events (reference);
create unique index if not exists enrollments_course_student_uidx on public.enrollments (course_id, student_id);

create or replace function public.refresh_course_enrollment_stats()
returns trigger
language plpgsql
as $$
declare
  target_course_id uuid;
begin
  target_course_id := coalesce(new.course_id, old.course_id);

  update public.courses
  set
    students = (
      select count(*)::integer
      from public.enrollments
      where enrollments.course_id = target_course_id
        and enrollments.status = 'active'
    ),
    revenue = (
      select coalesce(sum(enrollments.amount), 0)
      from public.enrollments
      where enrollments.course_id = target_course_id
        and enrollments.status = 'active'
    )
  where courses.id = target_course_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists refresh_course_enrollment_stats_on_enrollments on public.enrollments;
create trigger refresh_course_enrollment_stats_on_enrollments
  after insert or update or delete on public.enrollments
  for each row execute function public.refresh_course_enrollment_stats();
