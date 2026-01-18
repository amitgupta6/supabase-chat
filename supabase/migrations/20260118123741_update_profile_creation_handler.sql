set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, name, created_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),  -- <- name from signup
    now()
  )
  on conflict (id) do update
    set name = excluded.name;

  return new;
end;
$function$
;


