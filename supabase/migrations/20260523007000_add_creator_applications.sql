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

create index if not exists creator_applications_applicant_id_idx
  on public.creator_applications (applicant_id);

create index if not exists creator_applications_status_idx
  on public.creator_applications (status, created_at desc);

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
