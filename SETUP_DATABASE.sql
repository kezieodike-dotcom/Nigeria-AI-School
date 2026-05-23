-- NIGERIA AI SCHOOL - DATABASE SETUP SCRIPT
-- Copy and paste this into your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Profiles Table (Secure Role Management)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  avatar_url text,
  bio text,
  twitter text,
  linkedin text,
  website text,
  role text default 'student' check (role in ('student', 'creator', 'admin')),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can create their own profiles" on public.profiles;
drop policy if exists "Users can update their own profiles" on public.profiles;

create policy "Public profiles are viewable by everyone" on public.profiles
  for select
  using (true);

create policy "Users can create their own profiles" on public.profiles
  for insert
  with check ((select auth.uid()) = id);

create policy "Users can update their own profiles" on public.profiles
  for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.prevent_non_admin_profile_role_change()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role
    and coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') <> 'admin'
    and coalesce(current_setting('request.jwt.claim.role', true), '') <> 'service_role'
  then
    raise exception 'Profile role changes require admin approval';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_non_admin_profile_role_change_on_profiles on public.profiles;
create trigger prevent_non_admin_profile_role_change_on_profiles
  before update on public.profiles
  for each row execute function public.prevent_non_admin_profile_role_change();

-- 2. Courses Table
create table if not exists courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text default 'AI & ML',
  price numeric default 15000,
  thumbnail text default 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
  duration text default '12.5 hrs content',
  video_url text,
  type text default 'video',
  instructor_id uuid references auth.users(id),
  students integer default 0,
  rating numeric default 0,
  reviews_count integer default 0,
  revenue numeric default 0,
  views integer default 0,
  status text default 'published',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table courses enable row level security;

drop policy if exists "Courses are viewable by everyone" on courses;
drop policy if exists "Users can insert their own courses" on courses;
drop policy if exists "Users can update their own courses" on courses;
drop policy if exists "Users can delete their own courses" on courses;

create policy "Courses are viewable by everyone" on courses for select using (true);
create policy "Users can insert their own courses" on courses for insert with check (auth.uid() = instructor_id);
create policy "Users can update their own courses" on courses for all using (auth.uid() = instructor_id);
create policy "Users can delete their own courses" on courses for delete using (auth.uid() = instructor_id);

-- 3. Reviews Table
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.reviews enable row level security;
drop policy if exists "Reviews are viewable by everyone" on public.reviews;
drop policy if exists "Authenticated users can create reviews" on public.reviews;

create policy "Reviews are viewable by everyone" on public.reviews for select using (true);
create policy "Authenticated users can create reviews" on public.reviews for insert with check (auth.role() = 'authenticated');

-- 4. Automatic Profile Creation Trigger
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, avatar_url, role)
  values (
    new.id, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name', 
    new.raw_user_meta_data->>'avatar_url',
    case
      when lower(new.email) in ('mvpxlab@gmail.com', 'kezieodike@gmail.com', 'mvplabx@gmail.com') then 'admin'
      else 'student'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Enrollments Table
create table if not exists public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  student_id uuid references auth.users(id) on delete cascade,
  amount numeric not null,
  status text default 'active' check (status in ('active', 'completed', 'refunded')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.enrollments enable row level security;
drop policy if exists "Users can view their own enrollments" on public.enrollments;
drop policy if exists "Creators can view enrollments for their courses" on public.enrollments;

create policy "Users can view their own enrollments" on public.enrollments for select using (auth.uid() = student_id);
create policy "Creators can view enrollments for their courses" on public.enrollments for select using (exists (select 1 from public.courses where courses.id = enrollments.course_id and courses.instructor_id = auth.uid()));

-- 5. Payouts Table
create table if not exists public.payouts (
  id uuid default uuid_generate_v4() primary key,
  creator_id uuid references auth.users(id) on delete cascade,
  amount numeric not null,
  method text not null,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.payouts enable row level security;
drop policy if exists "Users can view their own payouts" on public.payouts;

create policy "Users can view their own payouts" on public.payouts for select using (auth.uid() = creator_id);

-- 6. Performance Indexes
create index if not exists courses_instructor_id_idx on courses (instructor_id);
create index if not exists courses_status_idx on courses (status);
create index if not exists courses_category_idx on courses (category);
create index if not exists courses_created_at_idx on courses (created_at desc);
create index if not exists enrollments_student_id_idx on enrollments (student_id);
create index if not exists enrollments_course_id_idx on enrollments (course_id);

-- 7. Payments and Monthly Subscriptions
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  course_id uuid references public.courses(id) on delete set null,
  student_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null,
  currency text not null default 'NGN',
  status text not null default 'pending',
  provider text not null default 'paystack',
  provider_transaction_id text,
  authorization_url text,
  payment_type text not null default 'course' check (payment_type in ('course', 'cart', 'subscription')),
  subscription_starts_at timestamptz,
  subscription_expires_at timestamptz,
  raw_response jsonb,
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.payments enable row level security;

drop policy if exists "Students can view their own payments" on public.payments;
drop policy if exists "Creators can view payments for their courses" on public.payments;

create policy "Students can view their own payments"
  on public.payments for select
  using (student_id = (select auth.uid()));

create policy "Creators can view payments for their courses"
  on public.payments for select
  using (
    exists (
      select 1 from public.courses
      where courses.id = payments.course_id
        and courses.instructor_id = (select auth.uid())
    )
  );

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'paystack',
  event_type text not null,
  reference text,
  payload jsonb not null,
  created_at timestamptz default now()
);

alter table public.payment_events enable row level security;

drop policy if exists "Admins can view payment events" on public.payment_events;
create policy "Admins can view payment events"
  on public.payment_events for select
  using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  payment_id uuid references public.payments(id) on delete set null,
  reference text unique,
  provider text not null default 'paystack',
  amount numeric not null default 0,
  currency text not null default 'NGN',
  status text not null default 'active',
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  raw_response jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "Students can view their own subscriptions" on public.subscriptions;
drop policy if exists "Admins can view all subscriptions" on public.subscriptions;

create policy "Students can view their own subscriptions"
  on public.subscriptions for select
  using (student_id = (select auth.uid()));

create policy "Admins can view all subscriptions"
  on public.subscriptions for select
  using (coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin');

create index if not exists payments_reference_idx on public.payments (reference);
create index if not exists payments_student_id_idx on public.payments (student_id);
create index if not exists payments_course_id_idx on public.payments (course_id);
create index if not exists payments_status_idx on public.payments (status);
create index if not exists payment_events_reference_idx on public.payment_events (reference);
create index if not exists subscriptions_student_expires_idx on public.subscriptions (student_id, expires_at desc);
create index if not exists subscriptions_status_idx on public.subscriptions (status);
create unique index if not exists enrollments_course_student_uidx on public.enrollments (course_id, student_id);

-- 8. Course Progress
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

create index if not exists course_progress_student_id_idx on public.course_progress (student_id);
create index if not exists course_progress_course_id_idx on public.course_progress (course_id);

-- 9. Creator Applications
create table if not exists public.creator_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  expertise text not null,
  experience text not null,
  course_idea text not null,
  portfolio_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.creator_applications enable row level security;

drop policy if exists "Applicants can view their own creator applications" on public.creator_applications;
drop policy if exists "Applicants can submit creator applications" on public.creator_applications;
drop policy if exists "Admins can view creator applications" on public.creator_applications;
drop policy if exists "Admins can update creator applications" on public.creator_applications;

create policy "Applicants can view their own creator applications"
  on public.creator_applications for select
  using (applicant_id = (select auth.uid()));

create policy "Applicants can submit creator applications"
  on public.creator_applications for insert
  with check (
    applicant_id = (select auth.uid())
    and status = 'pending'
  );

create policy "Admins can view creator applications"
  on public.creator_applications for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

create policy "Admins can update creator applications"
  on public.creator_applications for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
  );

create index if not exists creator_applications_applicant_id_idx on public.creator_applications (applicant_id);
create index if not exists creator_applications_status_idx on public.creator_applications (status, created_at desc);

-- 10. Storage Buckets & Policies
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public)
values ('courses', 'courses', false)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;
drop policy if exists "Creators can upload course media" on storage.objects;
drop policy if exists "Course media is publicly accessible" on storage.objects;
drop policy if exists "Authorized users can view course media" on storage.objects;
drop policy if exists "Creators and admins can upload course media" on storage.objects;

create policy "Avatar images are publicly accessible" on storage.objects
  for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar" on storage.objects
  for insert
  with check (
    bucket_id = 'avatars'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar" on storage.objects
  for update
  using (
    bucket_id = 'avatars'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'avatars'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own avatar" on storage.objects
  for delete
  using (
    bucket_id = 'avatars'
    and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "Authorized users can view course media" on storage.objects
  for select
  using (
    bucket_id = 'courses'
    and (select auth.uid()) is not null
    and (
      exists (
        select 1
        from public.subscriptions
        where subscriptions.student_id = (select auth.uid())
          and subscriptions.status = 'active'
          and subscriptions.expires_at > now()
      )
      or exists (
        select 1
        from public.profiles
        where profiles.id = (select auth.uid())
          and profiles.role = 'admin'
      )
      or (storage.foldername(name))[1] = (select auth.uid())::text
    )
  );

create policy "Creators and admins can upload course media" on storage.objects
  for insert
  with check (
    bucket_id = 'courses'
    and (select auth.uid()) is not null
    and (
      (
        (storage.foldername(name))[1] = (select auth.uid())::text
        and exists (
          select 1
          from public.profiles
          where profiles.id = (select auth.uid())
            and profiles.role in ('creator', 'admin')
        )
      )
      or (
        (storage.foldername(name))[1] = 'admin'
        and exists (
          select 1
          from public.profiles
          where profiles.id = (select auth.uid())
            and profiles.role = 'admin'
        )
      )
    )
  );
