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
    coalesce(new.raw_user_meta_data->>'role', 'student')
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

-- 7. Storage Buckets & Policies
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
values ('courses', 'courses', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;
drop policy if exists "Course media is publicly accessible" on storage.objects;
drop policy if exists "Creators can upload course media" on storage.objects;

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

create policy "Course media is publicly accessible" on storage.objects
  for select
  using (bucket_id = 'courses');

create policy "Creators can upload course media" on storage.objects
  for insert
  with check (
    bucket_id = 'courses'
    and (select auth.role()) = 'authenticated'
  );
