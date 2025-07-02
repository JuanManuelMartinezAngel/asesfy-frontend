-- ================================================
-- SCRIPT SQL COMPLETO PARA ASESFY - ASESORÍA FISCAL
-- ================================================
-- Este script crea toda la base de datos necesaria para la aplicación AsesFy
-- Ejecutar en el SQL Editor de Supabase

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. TABLA USERS - Usuarios del sistema
-- ================================================
-- Extiende la tabla auth.users de Supabase con información adicional
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'advisor', 'admin')) DEFAULT 'client',
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 2. TABLA CLIENT_PROFILES - Perfiles de clientes
-- ================================================
-- Información específica de clientes (autónomos y empresas)
CREATE TABLE public.client_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    business_type VARCHAR(50) NOT NULL CHECK (business_type IN ('autonomo', 'sl', 'sa', 'cooperativa', 'otro')),
    company_name VARCHAR(255),
    cif_nif VARCHAR(20) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'España',
    fiscal_address TEXT,
    tax_regime VARCHAR(100), -- Régimen fiscal (general, simplificado, etc.)
    annual_revenue DECIMAL(15,2),
    employees_count INTEGER DEFAULT 0,
    activity_code VARCHAR(10), -- CNAE
    activity_description TEXT,
    assigned_advisor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ================================================
-- 3. TABLA ADVISOR_PROFILES - Perfiles de asesores
-- ================================================
-- Información específica de asesores fiscales
CREATE TABLE public.advisor_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    employee_id VARCHAR(50),
    specializations TEXT[], -- Array de especializaciones
    max_clients INTEGER DEFAULT 50,
    is_team_lead BOOLEAN DEFAULT FALSE,
    department VARCHAR(100),
    hire_date DATE,
    license_number VARCHAR(100), -- Número de colegiado
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ================================================
-- 4. TABLA TASKS - Tareas fiscales
-- ================================================
-- Tareas que los clientes envían a los asesores
CREATE TABLE public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(100) NOT NULL, -- tipo de tarea (modelo_303, irpf, constitucion, etc.)
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'in_progress', 'under_review', 'completed', 'cancelled')) DEFAULT 'pending',
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    advisor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2) DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    client_notes TEXT,
    advisor_notes TEXT,
    internal_notes TEXT, -- Notas internas solo para asesores
    billing_status VARCHAR(20) DEFAULT 'pending' CHECK (billing_status IN ('pending', 'billed', 'paid')),
    amount DECIMAL(10,2), -- Precio de la tarea
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 5. TABLA DOCUMENTS - Documentos de tareas
-- ================================================
-- Documentos subidos por clientes y asesores
CREATE TABLE public.documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    uploader_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL, -- Ruta en Supabase Storage
    file_size BIGINT,
    file_type VARCHAR(100),
    mime_type VARCHAR(100),
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('input', 'output', 'reference', 'template')),
    description TEXT,
    is_confidential BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1,
    replaces_document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 6. TABLA MESSAGES - Chat entre clientes y asesores
-- ================================================
-- Sistema de mensajería interno
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
    content TEXT NOT NULL,
    file_url TEXT, -- Si es un archivo adjunto
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    is_internal BOOLEAN DEFAULT FALSE, -- Mensajes internos entre asesores
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 7. TABLA NOTIFICATIONS - Notificaciones del sistema
-- ================================================
-- Sistema de notificaciones para usuarios
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('task_update', 'message', 'document', 'calendar', 'billing', 'system')),
    entity_type VARCHAR(50), -- 'task', 'message', 'document', etc.
    entity_id UUID, -- ID de la entidad relacionada
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    action_url TEXT, -- URL para la acción relacionada
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 8. TABLA CALENDAR_EVENTS - Eventos del calendario
-- ================================================
-- Sistema de calendario compartido
CREATE TABLE public.calendar_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('meeting', 'deadline', 'reminder', 'holiday', 'training')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location TEXT,
    online_meeting_url TEXT,
    organizer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    is_all_day BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT, -- RRULE para eventos recurrentes
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
    visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('private', 'shared', 'public')),
    reminder_minutes INTEGER[], -- Array de minutos para recordatorios
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 9. TABLA CALENDAR_ATTENDEES - Asistentes a eventos
-- ================================================
-- Relación muchos a muchos entre eventos y usuarios
CREATE TABLE public.calendar_attendees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES public.calendar_events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined', 'tentative')),
    response_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- ================================================
-- 10. TABLA CLIENT_ADVISOR_RELATIONSHIPS - Relaciones cliente-asesor
-- ================================================
-- Gestión de asignaciones cliente-asesor
CREATE TABLE public.client_advisor_relationships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    advisor_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    relationship_type VARCHAR(20) DEFAULT 'primary' CHECK (relationship_type IN ('primary', 'secondary', 'backup')),
    assigned_date TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'transferred')),
    notes TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    UNIQUE(client_id, advisor_id, relationship_type)
);

-- ================================================
-- 11. TABLA BILLING_CUSTOMERS - Clientes de facturación
-- ================================================
-- Información de facturación y Stripe
CREATE TABLE public.billing_customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    stripe_customer_id VARCHAR(255) UNIQUE,
    subscription_status VARCHAR(50) DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due', 'trialing')),
    subscription_id VARCHAR(255),
    price_id VARCHAR(255),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    billing_email VARCHAR(255),
    tax_id VARCHAR(50), -- ID fiscal para facturación
    billing_address JSONB, -- Dirección de facturación en formato JSON
    payment_method_id VARCHAR(255),
    trial_ends_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ================================================
-- 12. TABLA BILLING_INVOICES - Historial de facturas
-- ================================================
-- Registro de facturas y pagos
CREATE TABLE public.billing_invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES public.billing_customers(id) ON DELETE CASCADE NOT NULL,
    stripe_invoice_id VARCHAR(255) UNIQUE,
    invoice_number VARCHAR(100),
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(50) NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
    description TEXT,
    invoice_date TIMESTAMPTZ NOT NULL,
    due_date TIMESTAMPTZ,
    paid_date TIMESTAMPTZ,
    invoice_pdf_url TEXT,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    tax_rate DECIMAL(5,4) DEFAULT 0.21, -- IVA por defecto 21%
    subtotal DECIMAL(10,2) NOT NULL,
    metadata JSONB, -- Datos adicionales de Stripe
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 13. TABLA TASK_HISTORY - Historial de cambios en tareas
-- ================================================
-- Auditoría de cambios en tareas
CREATE TABLE public.task_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    changed_by UUID REFERENCES public.users(id) ON DELETE SET NULL NOT NULL,
    change_type VARCHAR(50) NOT NULL CHECK (change_type IN ('created', 'status_changed', 'assigned', 'updated', 'comment_added', 'document_added')),
    old_values JSONB,
    new_values JSONB,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 14. TABLA SYSTEM_SETTINGS - Configuración del sistema
-- ================================================
-- Configuraciones globales de la aplicación
CREATE TABLE public.system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE, -- Si es accesible desde el frontend
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ================================================

-- Índices para mejorar el rendimiento de consultas frecuentes
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_users_email ON public.users(email);

CREATE INDEX idx_tasks_client_id ON public.tasks(client_id);
CREATE INDEX idx_tasks_advisor_id ON public.tasks(advisor_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_tasks_created_at ON public.tasks(created_at);

CREATE INDEX idx_documents_task_id ON public.documents(task_id);
CREATE INDEX idx_documents_uploader_id ON public.documents(uploader_id);
CREATE INDEX idx_documents_document_type ON public.documents(document_type);

CREATE INDEX idx_messages_task_id ON public.messages(task_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX idx_messages_is_read ON public.messages(is_read);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

CREATE INDEX idx_calendar_events_organizer_id ON public.calendar_events(organizer_id);
CREATE INDEX idx_calendar_events_start_time ON public.calendar_events(start_time);
CREATE INDEX idx_calendar_events_status ON public.calendar_events(status);

CREATE INDEX idx_client_advisor_relationships_client_id ON public.client_advisor_relationships(client_id);
CREATE INDEX idx_client_advisor_relationships_advisor_id ON public.client_advisor_relationships(advisor_id);
CREATE INDEX idx_client_advisor_relationships_status ON public.client_advisor_relationships(status);

CREATE INDEX idx_billing_customers_user_id ON public.billing_customers(user_id);
CREATE INDEX idx_billing_customers_stripe_customer_id ON public.billing_customers(stripe_customer_id);
CREATE INDEX idx_billing_customers_subscription_status ON public.billing_customers(subscription_status);

-- ================================================
-- TRIGGERS PARA UPDATED_AT
-- ================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON public.client_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_advisor_profiles_updated_at BEFORE UPDATE ON public.advisor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_customers_updated_at BEFORE UPDATE ON public.billing_customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_invoices_updated_at BEFORE UPDATE ON public.billing_invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ================================================

-- Habilitar RLS en todas las tablas
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
-- POLÍTICAS PARA TABLA USERS
-- ================================================

-- Los usuarios pueden ver y actualizar su propio perfil
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Los asesores pueden ver perfiles de sus clientes
CREATE POLICY "Advisors can view client profiles" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.client_advisor_relationships car
            WHERE car.advisor_id = auth.uid()
            AND car.client_id = users.id
            AND car.status = 'active'
        )
    );

-- ================================================
-- POLÍTICAS PARA TABLA CLIENT_PROFILES
-- ================================================

-- Los clientes pueden ver y actualizar su propio perfil
CREATE POLICY "Clients can manage own profile" ON public.client_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Los asesores pueden ver perfiles de sus clientes asignados
CREATE POLICY "Advisors can view assigned client profiles" ON public.client_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.client_advisor_relationships car
            WHERE car.advisor_id = auth.uid()
            AND car.client_id = client_profiles.user_id
            AND car.status = 'active'
        )
    );

-- ================================================
-- POLÍTICAS PARA TABLA ADVISOR_PROFILES
-- ================================================

-- Los asesores pueden ver y actualizar su propio perfil
CREATE POLICY "Advisors can manage own profile" ON public.advisor_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Los clientes pueden ver el perfil de su asesor asignado
CREATE POLICY "Clients can view assigned advisor profile" ON public.advisor_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.client_advisor_relationships car
            WHERE car.client_id = auth.uid()
            AND car.advisor_id = advisor_profiles.user_id
            AND car.status = 'active'
        )
    );

-- ================================================
-- POLÍTICAS PARA TABLA TASKS
-- ================================================

-- Los clientes pueden ver sus propias tareas
CREATE POLICY "Clients can view own tasks" ON public.tasks
    FOR SELECT USING (auth.uid() = client_id);

-- Los clientes pueden crear nuevas tareas
CREATE POLICY "Clients can create tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Los clientes pueden actualizar sus tareas (con limitaciones)
CREATE POLICY "Clients can update own tasks" ON public.tasks
    FOR UPDATE USING (auth.uid() = client_id AND status IN ('pending', 'in_progress'));

-- Los asesores pueden ver y gestionar tareas asignadas
CREATE POLICY "Advisors can manage assigned tasks" ON public.tasks
    FOR ALL USING (auth.uid() = advisor_id);

-- Los asesores pueden ver tareas de sus clientes asignados
CREATE POLICY "Advisors can view client tasks" ON public.tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.client_advisor_relationships car
            WHERE car.advisor_id = auth.uid()
            AND car.client_id = tasks.client_id
            AND car.status = 'active'
        )
    );

-- ================================================
-- POLÍTICAS PARA TABLA DOCUMENTS
-- ================================================

-- Los usuarios pueden ver documentos de sus tareas
CREATE POLICY "Users can view task documents" ON public.documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = documents.task_id
            AND (t.client_id = auth.uid() OR t.advisor_id = auth.uid())
        )
    );

-- Los usuarios pueden subir documentos a sus tareas
CREATE POLICY "Users can upload documents" ON public.documents
    FOR INSERT WITH CHECK (
        auth.uid() = uploader_id
        AND EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = documents.task_id
            AND (t.client_id = auth.uid() OR t.advisor_id = auth.uid())
        )
    );

-- ================================================
-- POLÍTICAS PARA TABLA MESSAGES
-- ================================================

-- Los usuarios pueden ver mensajes donde son emisor o receptor
CREATE POLICY "Users can view own messages" ON public.messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Los usuarios pueden enviar mensajes
CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Los usuarios pueden marcar como leído sus mensajes recibidos
CREATE POLICY "Users can update received messages" ON public.messages
    FOR UPDATE USING (auth.uid() = receiver_id);

-- ================================================
-- POLÍTICAS PARA TABLA NOTIFICATIONS
-- ================================================

-- Los usuarios solo pueden ver sus propias notificaciones
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus notificaciones (marcar como leído)
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- ================================================
-- POLÍTICAS PARA TABLA CALENDAR_EVENTS
-- ================================================

-- Los usuarios pueden ver eventos donde son organizador o asistente
CREATE POLICY "Users can view accessible events" ON public.calendar_events
    FOR SELECT USING (
        auth.uid() = organizer_id
        OR EXISTS (
            SELECT 1 FROM public.calendar_attendees ca
            WHERE ca.event_id = calendar_events.id
            AND ca.user_id = auth.uid()
        )
        OR visibility = 'public'
    );

-- Los usuarios pueden crear eventos
CREATE POLICY "Users can create events" ON public.calendar_events
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

-- Los organizadores pueden actualizar sus eventos
CREATE POLICY "Organizers can update events" ON public.calendar_events
    FOR UPDATE USING (auth.uid() = organizer_id);

-- ================================================
-- POLÍTICAS PARA TABLA CALENDAR_ATTENDEES
-- ================================================

-- Los usuarios pueden ver asistentes de eventos accesibles
CREATE POLICY "Users can view event attendees" ON public.calendar_attendees
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.calendar_events ce
            WHERE ce.id = calendar_attendees.event_id
            AND (ce.organizer_id = auth.uid() OR calendar_attendees.user_id = auth.uid())
        )
    );

-- Los organizadores pueden gestionar asistentes
CREATE POLICY "Organizers can manage attendees" ON public.calendar_attendees
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.calendar_events ce
            WHERE ce.id = calendar_attendees.event_id
            AND ce.organizer_id = auth.uid()
        )
    );

-- Los usuarios pueden actualizar su propia respuesta
CREATE POLICY "Users can update own attendance" ON public.calendar_attendees
    FOR UPDATE USING (auth.uid() = user_id);

-- ================================================
-- POLÍTICAS PARA TABLA CLIENT_ADVISOR_RELATIONSHIPS
-- ================================================

-- Los usuarios pueden ver sus relaciones
CREATE POLICY "Users can view own relationships" ON public.client_advisor_relationships
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = advisor_id);

-- Solo admins pueden gestionar relaciones (implementar lógica de admin)
CREATE POLICY "Admins can manage relationships" ON public.client_advisor_relationships
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role = 'admin'
        )
    );

-- ================================================
-- POLÍTICAS PARA TABLA BILLING_CUSTOMERS
-- ================================================

-- Los usuarios pueden ver su propia información de facturación
CREATE POLICY "Users can view own billing" ON public.billing_customers
    FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios pueden actualizar su información de facturación
CREATE POLICY "Users can update own billing" ON public.billing_customers
    FOR UPDATE USING (auth.uid() = user_id);

-- ================================================
-- POLÍTICAS PARA TABLA BILLING_INVOICES
-- ================================================

-- Los usuarios pueden ver sus propias facturas
CREATE POLICY "Users can view own invoices" ON public.billing_invoices
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.billing_customers bc
            WHERE bc.id = billing_invoices.customer_id
            AND bc.user_id = auth.uid()
        )
    );

-- ================================================
-- POLÍTICAS PARA TABLA TASK_HISTORY
-- ================================================

-- Los usuarios pueden ver el historial de sus tareas
CREATE POLICY "Users can view task history" ON public.task_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            WHERE t.id = task_history.task_id
            AND (t.client_id = auth.uid() OR t.advisor_id = auth.uid())
        )
    );

-- ================================================
-- POLÍTICAS PARA TABLA SYSTEM_SETTINGS
-- ================================================

-- Solo configuraciones públicas son visibles para todos
CREATE POLICY "Public settings are viewable" ON public.system_settings
    FOR SELECT USING (is_public = true);

-- Solo admins pueden gestionar configuraciones
CREATE POLICY "Admins can manage settings" ON public.system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid()
            AND u.role = 'admin'
        )
    );

-- ================================================
-- FUNCIONES AUXILIARES
-- ================================================

-- Función para obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role FROM public.users
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario es asesor de un cliente
CREATE OR REPLACE FUNCTION is_advisor_of_client(advisor_uuid UUID, client_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.client_advisor_relationships
        WHERE advisor_id = advisor_uuid
        AND client_id = client_uuid
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear un perfil de usuario automáticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'client')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente cuando se registra un usuario
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================================
-- DATOS INICIALES DEL SISTEMA
-- ================================================

-- Insertar configuraciones iniciales del sistema
INSERT INTO public.system_settings (key, value, description, category, is_public) VALUES
('app_name', 'AsesFy', 'Nombre de la aplicación', 'general', true),
('app_version', '1.0.0', 'Versión de la aplicación', 'general', true),
('max_file_size', '10485760', 'Tamaño máximo de archivo en bytes (10MB)', 'files', false),
('allowed_file_types', '["pdf","doc","docx","xls","xlsx","jpg","jpeg","png"]', 'Tipos de archivo permitidos', 'files', false),
('default_task_priority', 'medium', 'Prioridad por defecto para nuevas tareas', 'tasks', false),
('notification_email', 'notificaciones@asesfy.com', 'Email para notificaciones del sistema', 'notifications', false),
('stripe_webhook_secret', '', 'Secret para webhooks de Stripe', 'billing', false),
('trial_period_days', '14', 'Días de periodo de prueba', 'billing', true);

-- ================================================
-- COMENTARIOS EXPLICATIVOS DE LAS TABLAS
-- ================================================

COMMENT ON TABLE public.users IS 'Tabla principal de usuarios que extiende auth.users de Supabase con información adicional del perfil';
COMMENT ON TABLE public.client_profiles IS 'Perfiles específicos para clientes con información fiscal y empresarial';
COMMENT ON TABLE public.advisor_profiles IS 'Perfiles específicos para asesores fiscales con información profesional';
COMMENT ON TABLE public.tasks IS 'Tareas fiscales enviadas por clientes a asesores, núcleo del sistema';
COMMENT ON TABLE public.documents IS 'Documentos relacionados con tareas, tanto subidos por clientes como por asesores';
COMMENT ON TABLE public.messages IS 'Sistema de mensajería interna entre clientes y asesores';
COMMENT ON TABLE public.notifications IS 'Sistema de notificaciones para mantener informados a los usuarios';
COMMENT ON TABLE public.calendar_events IS 'Eventos del calendario compartido para reuniones y recordatorios';
COMMENT ON TABLE public.calendar_attendees IS 'Asistentes a eventos del calendario, relación muchos a muchos';
COMMENT ON TABLE public.client_advisor_relationships IS 'Gestión de asignaciones entre clientes y asesores';
COMMENT ON TABLE public.billing_customers IS 'Información de facturación y integración con Stripe';
COMMENT ON TABLE public.billing_invoices IS 'Historial de facturas y pagos realizados';
COMMENT ON TABLE public.task_history IS 'Auditoría completa de cambios en tareas para trazabilidad';
COMMENT ON TABLE public.system_settings IS 'Configuraciones globales del sistema y parámetros operativos';

-- ================================================
-- SCRIPT COMPLETADO
-- ================================================
-- Este script crea toda la estructura necesaria para AsesFy
-- Incluye tablas, índices, triggers, RLS y datos iniciales
-- 
-- Para ejecutar: Copiar y pegar en el SQL Editor de Supabase
-- 
-- Funcionalidades implementadas:
-- ✅ Gestión completa de usuarios (clientes y asesores)
-- ✅ Sistema de tareas fiscales con estados y prioridades
-- ✅ Gestión de documentos con tipos y versiones
-- ✅ Chat interno entre usuarios
-- ✅ Sistema de notificaciones
-- ✅ Calendario compartido con eventos
-- ✅ Relaciones cliente-asesor
-- ✅ Facturación e integración con Stripe
-- ✅ Auditoría de cambios
-- ✅ Configuración del sistema
-- ✅ Seguridad RLS completa
-- ✅ Índices para optimización
-- ✅ Triggers automáticos
-- 
-- Próximos pasos:
-- 1. Configurar Supabase Storage para documentos
-- 2. Configurar webhooks de Stripe
-- 3. Implementar las funciones Edge para lógica de negocio
-- 4. Configurar email templates para notificaciones
-- ================================================ 