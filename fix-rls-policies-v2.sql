-- ================================================
-- SCRIPT PARA CORREGIR POLÍTICAS RLS (Versión 2)
-- ================================================
-- Este script arregla la recursión infinita eliminando TODAS las políticas primero

-- DESHABILITAR RLS temporalmente para hacer limpieza
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_attendees DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_advisor_relationships DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings DISABLE ROW LEVEL SECURITY;

-- ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
DO $$
DECLARE
    pol RECORD;
BEGIN
    -- Eliminar todas las políticas de todas las tablas
    FOR pol IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      pol.policyname, pol.schemaname, pol.tablename);
    END LOOP;
END $$;

-- ================================================
-- POLÍTICAS SIMPLIFICADAS SIN RECURSIÓN
-- ================================================

-- TABLA USERS - Políticas básicas
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- TABLA CLIENT_PROFILES
CREATE POLICY "client_profiles_select_own" ON public.client_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "client_profiles_update_own" ON public.client_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "client_profiles_insert_own" ON public.client_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- TABLA ADVISOR_PROFILES
CREATE POLICY "advisor_profiles_select_own" ON public.advisor_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "advisor_profiles_update_own" ON public.advisor_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "advisor_profiles_insert_own" ON public.advisor_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- TABLA TASKS
CREATE POLICY "tasks_select_participant" ON public.tasks
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = advisor_id);

CREATE POLICY "tasks_insert_as_client" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "tasks_update_participant" ON public.tasks
    FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = advisor_id);

-- TABLA DOCUMENTS
CREATE POLICY "documents_select_task_participant" ON public.documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = documents.task_id
            AND (t.client_id = auth.uid() OR t.advisor_id = auth.uid())
        )
    );

CREATE POLICY "documents_insert_uploader" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = uploader_id);

-- TABLA MESSAGES
CREATE POLICY "messages_select_participant" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "messages_insert_sender" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "messages_update_receiver" ON public.messages
    FOR UPDATE USING (auth.uid() = receiver_id);

-- TABLA NOTIFICATIONS
CREATE POLICY "notifications_select_own" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- TABLA CALENDAR_EVENTS
CREATE POLICY "calendar_events_select_organizer_or_public" ON public.calendar_events
    FOR SELECT USING (auth.uid() = organizer_id OR visibility = 'public');

CREATE POLICY "calendar_events_insert_organizer" ON public.calendar_events
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "calendar_events_update_organizer" ON public.calendar_events
    FOR UPDATE USING (auth.uid() = organizer_id);

-- TABLA CALENDAR_ATTENDEES
CREATE POLICY "calendar_attendees_select_participant" ON public.calendar_attendees
    FOR SELECT USING (
        auth.uid() = user_id 
        OR EXISTS (
            SELECT 1 FROM public.calendar_events ce
            WHERE ce.id = calendar_attendees.event_id
            AND ce.organizer_id = auth.uid()
        )
    );

CREATE POLICY "calendar_attendees_manage_own" ON public.calendar_attendees
    FOR ALL USING (auth.uid() = user_id);

-- TABLA CLIENT_ADVISOR_RELATIONSHIPS
CREATE POLICY "relationships_select_participant" ON public.client_advisor_relationships
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = advisor_id);

-- TABLA BILLING_CUSTOMERS
CREATE POLICY "billing_customers_select_own" ON public.billing_customers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "billing_customers_update_own" ON public.billing_customers
    FOR UPDATE USING (auth.uid() = user_id);

-- TABLA BILLING_INVOICES
CREATE POLICY "billing_invoices_select_customer" ON public.billing_invoices
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.billing_customers bc
            WHERE bc.id = billing_invoices.customer_id
            AND bc.user_id = auth.uid()
        )
    );

-- TABLA TASK_HISTORY
CREATE POLICY "task_history_select_participant" ON public.task_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = task_history.task_id
            AND (t.client_id = auth.uid() OR t.advisor_id = auth.uid())
        )
    );

-- TABLA SYSTEM_SETTINGS
CREATE POLICY "system_settings_select_public" ON public.system_settings
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
-- Todas las políticas han sido recreadas con nombres únicos
-- Sin recursión infinita y con seguridad mantenida 