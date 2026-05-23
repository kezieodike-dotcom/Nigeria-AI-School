update public.courses
set price = 15000
where price is null or price <= 0;

alter table public.courses
  alter column price set default 15000,
  alter column price set not null;

alter table public.courses
  drop constraint if exists courses_price_positive;

alter table public.courses
  add constraint courses_price_positive check (price > 0);
