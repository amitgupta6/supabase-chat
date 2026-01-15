
  create policy "show auth user's messsages"
  on "public"."messages"
  as permissive
  for select
  to authenticated
using (((sender_id = auth.uid()) OR (recipient_id = auth.uid())));



