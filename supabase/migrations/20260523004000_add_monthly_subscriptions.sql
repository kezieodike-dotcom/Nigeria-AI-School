alter table public.payments
  alter column course_id drop not null,
  add column if not exists payment_type text not null default 'course',
  add column if not exists subscription_starts_at timestamptz,
  add column if not exists subscription_expires_at timestamptz;

do $$
begin
  alter table public.payments
    drop constraint if exists payments_payment_type_check;

  alter table public.payments
    add constraint payments_payment_type_check
    check (payment_type in ('course', 'cart', 'subscription'));
end $$;

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

create index if not exists subscriptions_student_expires_idx
  on public.subscriptions (student_id, expires_at desc);

create index if not exists subscriptions_status_idx
  on public.subscriptions (status);
