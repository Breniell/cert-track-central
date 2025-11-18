-- CIMFORM Database Schema
-- Complete training management system for industrial company

-- ============================================
-- 1. ROLES & PERMISSIONS (RBAC)
-- ============================================

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM (
  'super_admin',
  'drh',
  'hr',
  'hse',
  'manager',
  'formateur',
  'apprenant'
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  site_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role, site_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;

-- Function to check if user has any of the roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles app_role[])
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = ANY(_roles)
  )
$$;

-- ============================================
-- 2. SITES (Multi-plant management)
-- ============================================

CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  address TEXT,
  city TEXT,
  region TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. USER PROFILES
-- ============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  department TEXT,
  position TEXT,
  site_id UUID REFERENCES public.sites(id),
  avatar_url TEXT,
  language TEXT DEFAULT 'fr',
  timezone TEXT DEFAULT 'Africa/Douala',
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Assign default 'apprenant' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'apprenant');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 4. FORMATEURS (Trainers)
-- ============================================

CREATE TYPE public.habilitation_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.formateurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  certifications TEXT[] NOT NULL DEFAULT '{}',
  cv_url TEXT,
  certificate_urls TEXT[] DEFAULT '{}',
  habilitation_status habilitation_status NOT NULL DEFAULT 'pending',
  habilitation_requested_at TIMESTAMPTZ,
  habilitation_approved_by UUID REFERENCES auth.users(id),
  habilitation_approved_at TIMESTAMPTZ,
  habilitation_notes TEXT,
  total_hours_taught DECIMAL(10,2) DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.formateurs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. FORMATEUR AVAILABILITIES
-- ============================================

CREATE TYPE public.availability_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.formateur_availabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  formateur_id UUID REFERENCES public.formateurs(id) ON DELETE CASCADE NOT NULL,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  status availability_status NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_datetime_range CHECK (end_datetime > start_datetime)
);

ALTER TABLE public.formateur_availabilities ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. TRAINING SESSIONS
-- ============================================

CREATE TYPE public.training_type AS ENUM ('HSE', 'Métier');
CREATE TYPE public.session_status AS ENUM ('planned', 'validated_hr', 'validated_hse', 'ongoing', 'completed', 'cancelled');

CREATE TABLE public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type training_type NOT NULL,
  site_id UUID REFERENCES public.sites(id) NOT NULL,
  location TEXT NOT NULL,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  duration_hours DECIMAL(10,2) NOT NULL,
  formateur_id UUID REFERENCES public.formateurs(id),
  capacity INTEGER NOT NULL DEFAULT 20,
  status session_status NOT NULL DEFAULT 'planned',
  urgent BOOLEAN NOT NULL DEFAULT false,
  
  -- Validation tracking
  validated_hr_by UUID REFERENCES auth.users(id),
  validated_hr_at TIMESTAMPTZ,
  validated_hse_by UUID REFERENCES auth.users(id),
  validated_hse_at TIMESTAMPTZ,
  
  -- QR Code for attendance
  qr_code TEXT,
  qr_code_generated_at TIMESTAMPTZ,
  
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_session_datetime CHECK (end_datetime > start_datetime)
);

ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

-- Create index for better query performance
CREATE INDEX idx_training_sessions_site ON public.training_sessions(site_id);
CREATE INDEX idx_training_sessions_formateur ON public.training_sessions(formateur_id);
CREATE INDEX idx_training_sessions_dates ON public.training_sessions(start_datetime, end_datetime);

-- ============================================
-- 7. ENROLLMENTS
-- ============================================

CREATE TYPE public.enrollment_status AS ENUM ('enrolled', 'waitlist', 'cancelled', 'completed');

CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status enrollment_status NOT NULL DEFAULT 'enrolled',
  enrolled_by UUID REFERENCES auth.users(id) NOT NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  certificate_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, user_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_enrollments_session ON public.enrollments(session_id);
CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);

-- ============================================
-- 8. ATTENDANCES
-- ============================================

CREATE TYPE public.attendance_mode AS ENUM ('qr_code', 'manual', 'mobile_offline');

CREATE TABLE public.attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  checkin_at TIMESTAMPTZ,
  checkout_at TIMESTAMPTZ,
  mode attendance_mode NOT NULL DEFAULT 'manual',
  hours_attended DECIMAL(10,2),
  late BOOLEAN DEFAULT false,
  absent BOOLEAN DEFAULT false,
  notes TEXT,
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, user_id)
);

ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_attendances_session ON public.attendances(session_id);
CREATE INDEX idx_attendances_user ON public.attendances(user_id);

-- ============================================
-- 9. TRAINING MATRICES
-- ============================================

CREATE TABLE public.training_matrices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES public.sites(id) NOT NULL,
  name TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT false,
  competencies JSONB NOT NULL DEFAULT '[]'::jsonb,
  positions JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  archived BOOLEAN NOT NULL DEFAULT false,
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES auth.users(id),
  
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.training_matrices ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_matrices_site ON public.training_matrices(site_id);
CREATE INDEX idx_matrices_active ON public.training_matrices(site_id, active) WHERE active = true;

-- ============================================
-- 10. MESSAGES (Instant messaging)
-- ============================================

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  attachment_urls TEXT[] DEFAULT '{}',
  read_by UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_messages_room ON public.messages(room_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ============================================
-- 11. NOTIFICATIONS
-- ============================================

CREATE TYPE public.notification_type AS ENUM ('email', 'sms', 'in_app');
CREATE TYPE public.notification_status AS ENUM ('pending', 'sent', 'failed', 'read');

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status notification_status NOT NULL DEFAULT 'pending',
  related_entity_type TEXT,
  related_entity_id UUID,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_notifications_user ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_status ON public.notifications(status) WHERE status = 'pending';

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ============================================
-- 12. AUDIT LOGS
-- ============================================

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- ============================================
-- 13. SETTINGS
-- ============================================

CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  category TEXT NOT NULL,
  site_id UUID REFERENCES public.sites(id),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 14. TRIGGER FUNCTIONS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply update triggers to all tables
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