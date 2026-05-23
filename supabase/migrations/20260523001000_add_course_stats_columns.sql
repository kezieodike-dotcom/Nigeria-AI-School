alter table public.courses
  add column if not exists revenue numeric default 0 not null,
  add column if not exists views integer default 0 not null,
  add column if not exists reviews_count integer default 0 not null;

update public.courses
set
  revenue = coalesce(revenue, 0),
  views = coalesce(views, 0),
  reviews_count = coalesce(reviews_count, 0);
