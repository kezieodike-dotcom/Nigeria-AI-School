create or replace function public.prevent_non_admin_profile_role_change()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role
    and coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') <> 'admin'
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
