-- ================================================
-- DATOS DE PRUEBA PARA ASESFY
-- ================================================
-- Este script crea datos de prueba seguros para el sistema
-- IMPORTANTE: Solo ejecutar DESPUÉS de haber creado usuarios reales
-- en el sistema de autenticación de Supabase

-- ================================================
-- INSTRUCCIONES DE USO
-- ================================================
-- 1. Primero crea usuarios reales usando Supabase Auth:
--    - Ve a Authentication > Users en tu dashboard de Supabase
--    - Crea usuarios manualmente o usa el registro normal
--    - Anota los UUIDs reales generados por Supabase
-- 
-- 2. Luego reemplaza los UUIDs de ejemplo en este script
-- 3. Ejecuta este script completo en el SQL Editor

-- ================================================
-- DATOS DE EJEMPLO PARA DESARROLLO
-- ================================================
-- NOTA: Estos UUIDs son de ejemplo - debes reemplazarlos
-- con los UUIDs reales de usuarios creados en auth.users

-- Ejemplo de cómo insertar usuarios demo (usa UUIDs reales)
-- REEMPLAZA estos UUIDs con los reales de tu sistema:

/*
-- EJEMPLO DE USO CON USUARIOS REALES:
-- Después de crear usuarios en Authentication, usa algo como:

-- Insertar datos en tabla users (extendiendo auth.users)
INSERT INTO public.users (id, email, full_name, role, phone, avatar_url, status) VALUES
('UUID-REAL-DEL-CLIENTE-1', 'demo@asesfy.com', 'Cliente Demo', 'client', '+34600123456', null, 'active'),
('UUID-REAL-DEL-ASESOR-1', 'asesor@asesfy.com', 'Asesor Demo', 'advisor', '+34600654321', null, 'active');

-- Insertar perfil de cliente
INSERT INTO public.client_profiles (user_id, company_name, tax_id, industry, company_size, fiscal_year_end) VALUES
('UUID-REAL-DEL-CLIENTE-1', 'Empresa Demo SL', 'B12345678', 'tecnologia', '1-10', '2024-12-31');

-- Insertar perfil de asesor
INSERT INTO public.advisor_profiles (user_id, specializations, years_experience, certifications, hourly_rate, availability_status) VALUES
('UUID-REAL-DEL-ASESOR-1', 
 ARRAY['declaracion_renta', 'contabilidad_empresarial', 'iva'], 
 8, 
 ARRAY['Colegio de Economistas de Madrid', 'Experto en Fiscalidad'], 
 75.00, 
 'available');

-- Crear relación cliente-asesor
INSERT INTO public.client_advisor_relationships (client_id, advisor_id, assigned_date, status, assignment_reason) VALUES
('UUID-REAL-DEL-CLIENTE-1', 'UUID-REAL-DEL-ASESOR-1', NOW(), 'active', 'Asignación inicial del sistema');
*/

-- ================================================
-- DATOS DE PRUEBA GENÉRICOS (SEGUROS)
-- ================================================
-- Estos datos no requieren usuarios específicos

-- Configuraciones adicionales del sistema
INSERT INTO public.system_settings (key, value, description, category, is_public) VALUES
('max_tasks_per_client', '50', 'Máximo número de tareas activas por cliente', 'tasks', false),
('notification_retention_days', '30', 'Días que se conservan las notificaciones', 'notifications', false),
('document_retention_months', '24', 'Meses que se conservan los documentos', 'files', false),
('auto_assign_advisors', 'true', 'Asignación automática de asesores basada en especialización', 'assignments', false),
('maintenance_mode', 'false', 'Modo de mantenimiento del sistema', 'general', true);

-- ================================================
-- SCRIPT PARA CREAR USUARIOS DE PRUEBA AUTOMÁTICAMENTE
-- ================================================
-- Usar este bloque solo si quieres crear usuarios demo programáticamente
-- (Requiere permisos especiales en Supabase)

/*
-- Crear usuarios demo en auth.users (solo si tienes permisos de administrador)
-- Esto es solo para entornos de desarrollo

DO $$
DECLARE
    client_uuid UUID;
    advisor_uuid UUID;
BEGIN
    -- Crear usuario cliente
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'demo@asesfy.com',
        crypt('demo123456', gen_salt('bf')),
        NOW(),
        NULL,
        NULL,
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Cliente Demo", "role": "client"}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ) RETURNING id INTO client_uuid;

    -- Crear usuario asesor
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'asesor@asesfy.com',
        crypt('asesor123456', gen_salt('bf')),
        NOW(),
        NULL,
        NULL,
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Asesor Demo", "role": "advisor"}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ) RETURNING id INTO advisor_uuid;

    -- Los perfiles se crearán automáticamente por el trigger handle_new_user()
    
    -- Actualizar perfiles con datos adicionales
    UPDATE public.client_profiles SET
        company_name = 'Empresa Demo SL',
        tax_id = 'B12345678',
        industry = 'tecnologia',
        company_size = '1-10',
        fiscal_year_end = '2024-12-31'
    WHERE user_id = client_uuid;

    UPDATE public.advisor_profiles SET
        specializations = ARRAY['declaracion_renta', 'contabilidad_empresarial', 'iva'],
        years_experience = 8,
        certifications = ARRAY['Colegio de Economistas de Madrid', 'Experto en Fiscalidad'],
        hourly_rate = 75.00,
        availability_status = 'available'
    WHERE user_id = advisor_uuid;

    -- Crear relación cliente-asesor
    INSERT INTO public.client_advisor_relationships (client_id, advisor_id, assigned_date, status, assignment_reason) VALUES
    (client_uuid, advisor_uuid, NOW(), 'active', 'Asignación inicial del sistema');

    -- Crear una tarea de ejemplo
    INSERT INTO public.tasks (
        client_id, 
        advisor_id, 
        title, 
        description, 
        task_type, 
        priority, 
        status, 
        due_date
    ) VALUES (
        client_uuid,
        advisor_uuid,
        'Declaración de la Renta 2024',
        'Revisión y presentación de la declaración anual de IRPF con deducciones por vivienda habitual y actividades económicas.',
        'declaracion_renta',
        'high',
        'pending',
        NOW() + INTERVAL '15 days'
    );

    RAISE NOTICE 'Usuarios demo creados exitosamente';
    RAISE NOTICE 'Cliente UUID: %', client_uuid;
    RAISE NOTICE 'Asesor UUID: %', advisor_uuid;
    RAISE NOTICE 'Email cliente: demo@asesfy.com / Password: demo123456';
    RAISE NOTICE 'Email asesor: asesor@asesfy.com / Password: asesor123456';

END $$;
*/

-- ================================================
-- MÉTODO RECOMENDADO: REGISTRO MANUAL
-- ================================================

-- La forma más segura es:
-- 1. Ir a tu dashboard de Supabase > Authentication > Users
-- 2. Crear usuarios manualmente con estos datos:
--    
--    Usuario Cliente:
--    - Email: demo@asesfy.com
--    - Password: demo123456
--    - Metadata: {"full_name": "Cliente Demo", "role": "client"}
--    
--    Usuario Asesor:
--    - Email: asesor@asesfy.com  
--    - Password: asesor123456
--    - Metadata: {"full_name": "Asesor Demo", "role": "advisor"}
--
-- 3. Los perfiles se crearán automáticamente gracias al trigger
-- 4. Luego ejecutar las queries de datos adicionales con los UUIDs reales

-- ================================================
-- VERIFICACIÓN DE DATOS
-- ================================================

-- Para verificar que todo funciona correctamente:
/*
-- Ver usuarios creados
SELECT id, email, full_name, role, status FROM public.users;

-- Ver perfiles de clientes
SELECT u.email, cp.company_name, cp.tax_id, cp.industry 
FROM public.users u
JOIN public.client_profiles cp ON u.id = cp.user_id
WHERE u.role = 'client';

-- Ver perfiles de asesores
SELECT u.email, ap.specializations, ap.years_experience, ap.hourly_rate
FROM public.users u  
JOIN public.advisor_profiles ap ON u.id = ap.user_id
WHERE u.role = 'advisor';

-- Ver relaciones cliente-asesor
SELECT 
    uc.email as cliente_email,
    ua.email as asesor_email,
    car.status,
    car.assigned_date
FROM public.client_advisor_relationships car
JOIN public.users uc ON car.client_id = uc.id
JOIN public.users ua ON car.advisor_id = ua.id;

-- Ver tareas
SELECT 
    t.title,
    t.task_type,
    t.priority,
    t.status,
    uc.email as cliente,
    ua.email as asesor
FROM public.tasks t
JOIN public.users uc ON t.client_id = uc.id
JOIN public.users ua ON t.advisor_id = ua.id;
*/

-- ================================================
-- SCRIPT COMPLETADO
-- ================================================
-- Usa el método que prefieras:
-- 1. Crear usuarios manualmente en el dashboard (RECOMENDADO)
-- 2. Ejecutar el bloque DO $$ para crear automáticamente (requiere permisos)
-- 
-- Los datos se insertarán automáticamente gracias a los triggers configurados 