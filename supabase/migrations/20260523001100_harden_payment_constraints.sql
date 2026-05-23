alter table public.payments
  alter column course_id set not null,
  alter column student_id set not null;

alter table public.enrollments
  alter column course_id set not null,
  alter column student_id set not null;

create unique index if not exists payments_provider_transaction_uidx
  on public.payments (provider, provider_transaction_id)
  where provider_transaction_id is not null;
