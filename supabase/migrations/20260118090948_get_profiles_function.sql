set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_profiles_with_last_message(user_id uuid)
 RETURNS TABLE(profile_id uuid, profile_name text, profile_bio text, profile_created_at timestamp with time zone, profile_avatar text, message_id bigint, message_sender_id uuid, message_recipient_id uuid, message_created_at timestamp with time zone, message text)
 LANGUAGE sql
 STABLE
AS $function$
  select
    p.id         as profile_id,
    p.name       as profile_name,
    p.bio        as profile_bio,
    p.created_at as profile_created_at,
    p.avatar     as profile_avatar,

    m.id         as message_id,
    m.sender_id  as message_sender_id,
    m.recipient_id as message_recipient_id,
    m.created_at as message_created_at,
    m.message    as message
  from
    public.profiles p
    left join lateral (
      select *
      from public.messages
      where
        (sender_id = user_id and recipient_id = p.id)
        or
        (sender_id = p.id and recipient_id = user_id)
      order by created_at desc
      limit 1
    ) m on true
  where
    p.id <> user_id
  order by
    m.created_at desc nulls last,
    p.id;
$function$
;


