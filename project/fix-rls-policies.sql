-- ================================================
-- SCRIPT PARA CORREGIR POLÍTICAS RLS
-- ================================================
-- Este script arregla la recursión infinita en las políticas

-- Eliminar todas las políticas existentes que causan recursión
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Clients can view own profile" ON public.client_profiles;
DROP POLICY IF EXISTS "Clients can update own profile" ON public.client_profiles;
DROP POLICY IF EXISTS "Advisors can view own profile" ON public.advisor_profiles;
DROP POLICY IF EXISTS "Advisors can update own profile" ON public.advisor_profiles;
DROP POLICY IF EXISTS "Users can view own relationships" ON public.client_advisor_relationships;
DROP POLICY IF EXISTS "Admins can manage relationships" ON public.client_advisor_relationships;
DROP POLICY IF EXISTS "Users can view accessible tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Task owners can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view task documents" ON public.documents;
DROP POLICY IF EXISTS "Users can upload documents" ON public.documents;
DROP POLICY IF EXISTS "Users can view accessible events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can create events" ON public.calendar_events;
DROP POLICY IF EXISTS "Organizers can update events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can view event attendees" ON public.calendar_attendees;
DROP POLICY IF EXISTS "Organizers can manage attendees" ON public.calendar_attendees;
DROP POLICY IF EXISTS "Users can update own attendance" ON public.calendar_attendees;
DROP POLICY IF EXISTS "Users can view task history" ON public.task_history;
DROP POLICY IF EXISTS "Public settings are viewable" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.system_settings;

-- ================================================
-- POLÍTICAS SIMPLIFICADAS SIN RECURSIÓN
-- ================================================

-- TABLA USERS - Políticas básicas
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- TABLA CLIENT_PROFILES - Solo el usuario puede ver su perfil
CREATE POLICY "Clients can view own profile" ON public.client_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Clients can update own profile" ON public.client_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- TABLA ADVISOR_PROFILES - Solo el usuario puede ver su perfil
CREATE POLICY "Advisors can view own profile" ON public.advisor_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Advisors can update own profile" ON public.advisor_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- TABLA TASKS - Los usuarios pueden ver tareas donde participan
CREATE POLICY "Users can view own tasks" ON public.tasks
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = advisor_id);

CREATE POLICY "Clients can create tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Task participants can update tasks" ON public.tasks
    FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = advisor_id);

-- TABLA DOCUMENTS - Documentos relacionados con tareas accesibles
CREATE POLICY "Users can view task documents" ON public.documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = documents.task_id
            AND (t.client_id = auth.uid() OR t.advisor_id = auth.uid())
        )
    );

CREATE POLICY "Users can upload documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = uploader_id);

-- TABLA CALENDAR_EVENTS - Eventos visibles para organizador
CREATE POLICY "Users can view own events" ON public.calendar_events
    FOR SELECT USING (auth.uid() = organizer_id OR visibility = 'public');

CREATE POLICY "Users can create events" ON public.calendar_events
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update events" ON public.calendar_events
    FOR UPDATE USING (auth.uid() = organizer_id);

-- TABLA CALENDAR_ATTENDEES - Asistentes visibles para organizador y participantes
CREATE POLICY "Users can view attendees" ON public.calendar_attendees
    FOR SELECT USING (
        auth.uid() = user_id 
        OR EXISTS (
            SELECT 1 FROM public.calendar_events ce
            WHERE ce.id = calendar_attendees.event_id
            AND ce.organizer_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage own attendance" ON public.calendar_attendees
    FOR ALL USING (auth.uid() = user_id);

-- TABLA CLIENT_ADVISOR_RELATIONSHIPS - Solo los usuarios en la relación pueden verla
CREATE POLICY "Users can view own relationships" ON public.client_advisor_relationships
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = advisor_id);

-- TABLA TASK_HISTORY - Historial visible para participantes de la tarea
CREATE POLICY "Users can view task history" ON public.task_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = task_history.task_id
            AND (t.client_id = auth.uid() OR t.advisor_id = auth.uid())
        )
    );

-- TABLA SYSTEM_SETTINGS - Configuraciones públicas visibles para todos
CREATE POLICY "Public settings are viewable" ON public.system_settings
    FOR SELECT USING (is_public = true);

-- ================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_advisor_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- ================================================
-- SCRIPT COMPLETADO
-- ================================================
-- Las políticas RLS han sido simplificadas para evitar recursión infinita
-- Ahora las tablas deberían ser accesibles correctamente 