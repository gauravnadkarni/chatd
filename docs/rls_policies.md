1. public.profiles Policies
   SQL

```sql
-- Enable RLS for public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Allow users to view their own profile (SELECT)
CREATE POLICY "Allow users to view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile (UPDATE)
CREATE POLICY "Allow users to update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

2. public.user_device_tokens Policies
   SQL

```sql
-- Enable RLS for public.user_device_tokens
ALTER TABLE public.user_device_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_device_tokens FORCE ROW LEVEL SECURITY;

-- Allow users to manage their own device tokens (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Allow users to manage their own device tokens"
ON public.user_device_tokens
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

```sql
3. public.contacts Policies
SQL

-- Enable RLS for public.contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts FORCE ROW LEVEL SECURITY;

-- Allow users to manage their own contacts (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Allow users to manage their own contacts"
ON public.contacts
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

```sql
4. public.contact_requests Policies
SQL

-- Enable RLS for public.contact_requests
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests FORCE ROW LEVEL SECURITY;

-- Allow users to manage their contact requests (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Allow users to manage their contact requests"
ON public.contact_requests
FOR ALL
TO authenticated
USING ((auth.uid() = sender_id) OR (auth.uid() = recipient_id))
WITH CHECK ((auth.uid() = sender_id) OR (auth.uid() = recipient_id));
```

```sql
5. public.groups Policies
SQL

-- Enable RLS for public.groups
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups FORCE ROW LEVEL SECURITY;

-- Allow group creators to view their groups (SELECT)
CREATE POLICY "Allow group creators to view their groups"
ON public.groups
FOR SELECT
TO authenticated
USING (auth.uid() = creator_id);

-- Allow group members to view their groups (SELECT)
CREATE POLICY "Allow group members to view their groups"
ON public.groups
FOR SELECT
TO authenticated
USING (auth.uid() IN (SELECT gm.member_id FROM public.group_members AS gm WHERE gm.group_id = groups.id));

-- Allow authenticated users to create groups (INSERT)
CREATE POLICY "Allow authenticated users to create groups"
ON public.groups
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);

-- Allow group creators to update their groups (UPDATE)
CREATE POLICY "Allow group creators to update their groups"
ON public.groups
FOR UPDATE
TO authenticated
USING (auth.uid() = creator_id)
WITH CHECK (auth.uid() = creator_id);

-- Allow group creators to delete their groups (DELETE)
CREATE POLICY "Allow group creators to delete their groups"
ON public.groups
FOR DELETE
TO authenticated
USING (auth.uid() = creator_id);
```

```sql
6. public.group_members Policies
SQL

-- Enable RLS for public.group_members
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members FORCE ROW LEVEL SECURITY;

-- Allow members to view group members (SELECT)
CREATE POLICY "Allow members to view group members"
ON public.group_members
FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM public.group_members AS gm_inner WHERE gm_inner.group_id = group_id AND gm_inner.member_id = auth.uid()));

-- Allow group creator to add members (INSERT) - NOTE: This policy caused an error before.
CREATE POLICY "Allow group creator to add members"
ON public.group_members
FOR INSERT
TO authenticated
WITH CHECK ((EXISTS ( SELECT 1
   FROM groups
  WHERE ((groups.id = group_members.group_id) AND (groups.creator_id = auth.uid())))));

-- Allow group creator to update member roles (UPDATE)
CREATE POLICY "Allow group creator to update member roles"
ON public.group_members
FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.groups WHERE id = group_id AND creator_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.groups WHERE id = group_id AND creator_id = auth.uid()));

-- Allow group creator to remove members or user to leave (DELETE)
CREATE POLICY "Allow group creator to remove members or user to leave"
ON public.group_members
FOR DELETE
TO authenticated
USING ((EXISTS (SELECT 1 FROM public.groups WHERE id = group_id AND creator_id = auth.uid())) OR (member_id = auth.uid()));
```

```sql
7. public.messages Policies
SQL

-- Enable RLS for public.messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages FORCE ROW LEVEL SECURITY;

-- Allow users to view relevant messages (SELECT)
CREATE POLICY "Allow users to view relevant messages"
ON public.messages
FOR SELECT
TO authenticated
USING ((group_id IS NOT NULL AND auth.uid() IN (SELECT gm.member_id FROM public.group_members AS gm WHERE gm.group_id = messages.group_id))
OR
(group_id IS NULL AND (sender_id = auth.uid() OR recipient_id = auth.uid())));

-- Allow authenticated users to send messages (INSERT) - NOTE: This policy is likely to cause an error.
CREATE POLICY "Allow authenticated users to send messages"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
    ((sender_id = auth.uid()) AND (((group_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM group_members gm
  WHERE ((gm.group_id = messages.group_id) AND (gm.member_id = auth.uid()))))) OR ((group_id IS NULL) AND (recipient_id IS NOT NULL))))
);

-- Allow sender to update their own messages (UPDATE)
CREATE POLICY "Allow sender to update their own messages"
ON public.messages
FOR UPDATE
TO authenticated
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

-- Allow sender to delete their own messages (DELETE)
CREATE POLICY "Allow sender to delete their own messages"
ON public.messages
FOR DELETE
TO authenticated
USING (sender_id = auth.uid());
```

```sql
8. public.user_conversation_status Policies
SQL

-- Enable RLS for public.user_conversation_status
ALTER TABLE public.user_conversation_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_conversation_status FORCE ROW LEVEL SECURITY;

-- Allow users to manage their own conversation status (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Allow users to manage their own conversation status"
ON public.user_conversation_status
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

## RLS policies on storage

1. Authenticated users are allowed to upload images

```sql
CREATE POLICY "Authenticated users are allowed to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-bucket');
```

2. Authenticated users are allowed to get images

```sql
CREATE POLICY "Authenticated users are allowed to get images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'user-bucket');
```
