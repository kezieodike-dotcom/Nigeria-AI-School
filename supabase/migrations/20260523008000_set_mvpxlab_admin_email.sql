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
      when lower(new.email) = 'mvpxlab@gmail.com' then 'admin'
      else 'student'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

update public.profiles
set role = 'admin'
where id in (
  select id
  from auth.users
  where lower(email) = 'mvpxlab@gmail.com'
);
