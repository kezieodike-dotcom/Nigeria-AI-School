create table if not exists public.payment_items (
  id uuid default uuid_generate_v4() primary key,
  payment_id uuid not null references public.payments(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  amount numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payment_items enable row level security;

drop policy if exists "Students can view their own payment items" on public.payment_items;
drop policy if exists "Creators can view payment items for their courses" on public.payment_items;

create policy "Students can view their own payment items"
  on public.payment_items for select
  using (
    exists (
      select 1
      from public.payments
      where payments.id = payment_items.payment_id
        and payments.student_id = (select auth.uid())
    )
  );

create policy "Creators can view payment items for their courses"
  on public.payment_items for select
  using (
    exists (
      select 1
      from public.courses
      where courses.id = payment_items.course_id
        and courses.instructor_id = (select auth.uid())
    )
  );

create unique index if not exists payment_items_payment_course_uidx
  on public.payment_items (payment_id, course_id);

create index if not exists payment_items_course_id_idx
  on public.payment_items (course_id);
