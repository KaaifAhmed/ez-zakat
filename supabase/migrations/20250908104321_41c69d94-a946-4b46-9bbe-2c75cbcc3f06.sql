-- Remove the INSERT policy that conflicts with the handle_new_user trigger
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;