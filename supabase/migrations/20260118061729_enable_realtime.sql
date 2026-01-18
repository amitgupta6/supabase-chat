alter table "public"."profiles" add column "avatar" text;


  create policy "User can update their profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((id = auth.uid()))
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Allow listening to their own channels"
  on "realtime"."messages"
  as permissive
  for select
  to authenticated
using (((extension = 'broadcast'::text) AND (realtime.topic() ~~ (('%'::text || ( SELECT auth.uid() AS uid)) || '%'::text))));



  create policy "authenticated users can broadcast"
  on "realtime"."messages"
  as permissive
  for insert
  to authenticated
with check (true);


drop policy "Give anon users access to JPG images in folder 1oj01fe_0" on "storage"."objects";

drop policy "Give anon users access to JPG images in folder 1oj01fe_1" on "storage"."objects";

drop policy "Give anon users access to JPG images in folder 1oj01fe_2" on "storage"."objects";

drop policy "Give anon users access to JPG images in folder 1oj01fe_3" on "storage"."objects";


  create policy "Give users access to own folder 1oj01fe_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'avatars'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));



  create policy "Give users access to own folder 1oj01fe_1"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'avatars'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));



  create policy "Give users access to own folder 1oj01fe_2"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)))
with check (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));



  create policy "Give users access to own folder 1oj01fe_3"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'avatars'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));



