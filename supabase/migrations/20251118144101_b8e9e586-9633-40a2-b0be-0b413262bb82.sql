-- RLS POLICIES FOR CIMFORM
-- Comprehensive security policies based on RBAC system

-- Fix search_path warning for update trigger
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate all update triggers
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_formateurs_updated_at BEFORE UPDATE ON public.formateurs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_formateur_availabilities_updated_at BEFORE UPDATE ON public.formateur_availabilities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_training_sessions_updated_at BEFORE UPDATE ON public.training_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_attendances_updated_at BEFORE UPDATE ON public.attendances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_training_matrices_updated_at BEFORE UPDATE ON public.training_matrices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 1. USER_ROLES POLICIES
-- ============================================

-- Super admins can see all roles
CREATE POLICY "Super admins can view all user roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'super_admin'));

-- DRH can view roles for their site
CREATE POLICY "DRH can view user roles for their site"
ON public.user_roles FOR SELECT
USING (
  public.has_role(auth.uid(), 'drh') AND
  site_id IN (SELECT site_id FROM public.profiles WHERE id = auth.uid())
);

-- HR can view roles for their site
CREATE POLICY "HR can view user roles for their site"
ON public.user_roles FOR SELECT
USING (
  public.has_role(auth.uid(), 'hr') AND
  site_id IN (SELECT site_id FROM public.profiles WHERE id = auth.uid())
);

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

-- Super admins can manage all roles
CREATE POLICY "Super admins can manage user roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- 2. SITES POLICIES
-- ============================================

-- Everyone can view sites
CREATE POLICY "Authenticated users can view sites"
ON public.sites FOR SELECT
TO authenticated
USING (true);

-- Only super admins can manage sites
CREATE POLICY "Super admins can manage sites"
ON public.sites FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'));

-- ============================================
-- 3. PROFILES POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid());

-- Admins, DRH, HR can view all profiles
CREATE POLICY "Admins and HR can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'drh', 'hr']::app_role[]));

-- Super admins and HR can manage profiles
CREATE POLICY "Super admins and HR can manage profiles"
ON public.profiles FOR ALL
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'hr']::app_role[]));

-- ============================================
-- 4. FORMATEURS POLICIES
-- ============================================

-- Formateurs can view their own data
CREATE POLICY "Formateurs can view their own data"
ON public.formateurs FOR SELECT
USING (user_id = auth.uid());

-- Formateurs can update their own data
CREATE POLICY "Formateurs can update their own data"
ON public.formateurs FOR UPDATE
USING (user_id = auth.uid());

-- HR, Managers can view all formateurs
CREATE POLICY "HR and Managers can view all formateurs"
ON public.formateurs FOR SELECT
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'drh', 'hr', 'manager']::app_role[]));

-- HR can manage formateurs
CREATE POLICY "HR can manage formateurs"
ON public.formateurs FOR ALL
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'hr']::app_role[]));

-- ============================================
-- 5. FORMATEUR AVAILABILITIES POLICIES
-- ============================================

-- Formateurs can manage their own availabilities
CREATE POLICY "Formateurs can manage their own availabilities"
ON public.formateur_availabilities FOR ALL
USING (
  formateur_id IN (SELECT id FROM public.formateurs WHERE user_id = auth.uid())
);

-- HR and Managers can view and approve availabilities
CREATE POLICY "HR and Managers can view availabilities"
ON public.formateur_availabilities FOR SELECT
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'drh', 'hr', 'manager']::app_role[]));

CREATE POLICY "HR and Managers can update availabilities"
ON public.formateur_availabilities FOR UPDATE
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'hr', 'manager']::app_role[]));

-- ============================================
-- 6. TRAINING SESSIONS POLICIES
-- ============================================

-- Everyone can view sessions
CREATE POLICY "Authenticated users can view sessions"
ON public.training_sessions FOR SELECT
TO authenticated
USING (true);

-- HR can create sessions
CREATE POLICY "HR can create sessions"
ON public.training_sessions FOR INSERT
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin', 'drh', 'hr']::app_role[]));

-- HR can update sessions
CREATE POLICY "HR can update sessions"
ON public.training_sessions FOR UPDATE
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'drh', 'hr']::app_role[]));

-- HR can delete sessions
CREATE POLICY "HR can delete sessions"
ON public.training_sessions FOR DELETE
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'drh', 'hr']::app_role[]));

-- Formateurs can update their assigned sessions (limited fields)
CREATE POLICY "Formateurs can update their assigned sessions"
ON public.training_sessions FOR UPDATE
USING (
  formateur_id IN (SELECT id FROM public.formateurs WHERE user_id = auth.uid())
);

-- ============================================
-- 7. ENROLLMENTS POLICIES
-- ============================================

-- Users can view their own enrollments
CREATE POLICY "Users can view their own enrollments"
ON public.enrollments FOR SELECT
USING (user_id = auth.uid());

-- HR can view all enrollments
CREATE POLICY "HR can view all enrollments"
ON public.enrollments FOR SELECT
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'drh', 'hr']::app_role[]));

-- HR can create enrollments
CREATE POLICY "HR can create enrollments"
ON public.enrollments FOR INSERT
WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin', 'drh', 'hr']::app_role[]));

-- Users can enroll themselves
CREATE POLICY "Users can enroll themselves"
ON public.enrollments FOR INSERT
WITH CHECK (user_id = auth.uid());

-- HR can manage all enrollments
CREATE POLICY "HR can manage enrollments"
ON public.enrollments FOR ALL
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'drh', 'hr']::app_role[]));

-- Users can cancel their own enrollments
CREATE POLICY "Users can cancel their own enrollments"
ON public.enrollments FOR UPDATE
USING (user_id = auth.uid());

-- ============================================
-- 8. ATTENDANCES POLICIES
-- ============================================

-- Users can view their own attendance
CREATE POLICY "Users can view their own attendance"
ON public.attendances FOR SELECT
USING (user_id = auth.uid());

-- Formateurs can view attendance for their sessions
CREATE POLICY "Formateurs can view session attendances"
ON public.attendances FOR SELECT
USING (
  session_id IN (
    SELECT id FROM public.training_sessions 
    WHERE formateur_id IN (SELECT id FROM public.formateurs WHERE user_id = auth.uid())
  )
);

-- Formateurs can manage attendance for their sessions
CREATE POLICY "Formateurs can manage session attendances"
ON public.attendances FOR ALL
USING (
  session_id IN (
    SELECT id FROM public.training_sessions 
    WHERE formateur_id IN (SELECT id FROM public.formateurs WHERE user_id = auth.uid())
  )
);

-- HR can view and manage all attendances
CREATE POLICY "HR can view all attendances"
ON public.attendances FOR SELECT
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'drh', 'hr']::app_role[]));

CREATE POLICY "HR can manage all attendances"
ON public.attendances FOR ALL
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'drh', 'hr']::app_role[]));

-- ============================================
-- 9. TRAINING MATRICES POLICIES
-- ============================================

-- Everyone can view active matrices for their site
CREATE POLICY "Users can view active matrices"
ON public.training_matrices FOR SELECT
USING (active = true);

-- DRH, HR, HSE can view all matrices
CREATE POLICY "DRH, HR, HSE can view all matrices"
ON public.training_matrices FOR SELECT
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'drh', 'hr', 'hse']::app_role[]));

-- DRH, HR can manage matrices
CREATE POLICY "DRH, HR can manage matrices"
ON public.training_matrices FOR ALL
USING (public.has_any_role(auth.uid(), ARRAY['super_admin', 'drh', 'hr']::app_role[]));

-- ============================================
-- 10. MESSAGES POLICIES
-- ============================================

-- Users can view messages in rooms they're part of
CREATE POLICY "Users can view their messages"
ON public.messages FOR SELECT
USING (
  sender_id = auth.uid() OR
  room_id LIKE '%' || auth.uid()::text || '%'
);

-- Users can send messages
CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (sender_id = auth.uid());

-- Users can update their own messages
CREATE POLICY "Users can update their own messages"
ON public.messages FOR UPDATE
USING (sender_id = auth.uid());

-- ============================================
-- 11. NOTIFICATIONS POLICIES
-- ============================================

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

-- System can create notifications (via service role)
CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- ============================================
-- 12. AUDIT LOGS POLICIES
-- ============================================

-- Only super admins can view audit logs
CREATE POLICY "Super admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.has_role(auth.uid(), 'super_admin'));

-- System can create audit logs (via service role)
CREATE POLICY "System can create audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (true);

-- ============================================
-- 13. SETTINGS POLICIES
-- ============================================

-- Everyone can view settings
CREATE POLICY "Users can view settings"
ON public.settings FOR SELECT
TO authenticated
USING (true);

-- Super admins can manage settings
CREATE POLICY "Super admins can manage settings"
ON public.settings FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'));