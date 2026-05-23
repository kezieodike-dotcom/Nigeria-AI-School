update storage.buckets
set public = false
where id = 'courses';

drop policy if exists "Course media is publicly accessible" on storage.objects;
drop policy if exists "Creators can upload course media" on storage.objects;
drop policy if exists "Authorized users can view course media" on storage.objects;
drop policy if exists "Creators and admins can upload course media" on storage.objects;

create policy "Authorized users can view course media"
  on storage.objects for select
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

create policy "Creators and admins can upload course media"
  on storage.objects for insert
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
