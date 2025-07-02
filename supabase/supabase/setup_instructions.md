# 🚀 Instrucciones de Configuración Completa para AsesFy en Supabase

## 📋 Pasos para Configurar el Backend Completo

### 1. 🗄️ Ejecutar el Script de Base de Datos

1. Ve al **SQL Editor** en tu dashboard de Supabase
2. Copia y pega todo el contenido de `create_asesfy_database.sql`
3. Ejecuta el script completo
4. Verifica que todas las tablas se han creado correctamente

### 2. 📁 Configurar Supabase Storage

```sql
-- Crear buckets para diferentes tipos de archivos
INSERT INTO storage.buckets (id, name, public) VALUES 
('documents', 'documents', false),
('avatars', 'avatars', true),
('invoices', 'invoices', false);

-- Políticas para bucket de documentos
CREATE POLICY "Users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND
  (SELECT auth.uid()) IS NOT NULL AND
  (SELECT auth.uid()) = (metadata->>'uploadedBy')::uuid
);

CREATE POLICY "Users can view own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND
  (SELECT auth.uid()) IS NOT NULL AND
  (
    (metadata->>'uploadedBy')::uuid = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.tasks t 
      WHERE t.id = (metadata->>'taskId')::uuid 
      AND (t.client_id = auth.uid() OR t.advisor_id = auth.uid())
    )
  )
);

-- Políticas para bucket de avatares (público)
CREATE POLICY "Public avatars are viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND
  (SELECT auth.uid()) IS NOT NULL
);

-- Políticas para bucket de facturas
CREATE POLICY "Users can view own invoices" ON storage.objects
FOR SELECT USING (
  bucket_id = 'invoices' AND
  (SELECT auth.uid()) IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.billing_customers bc
    WHERE bc.user_id = auth.uid()
    AND bc.stripe_customer_id = (metadata->>'customerId')
  )
);
```

### 3. ⚡ Crear Funciones Edge

#### A. Función para Notificaciones
```typescript
// supabase/functions/send-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, title, message, type, entityType, entityId } = await req.json()

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        entity_type: entityType,
        entity_id: entityId
      })

    if (error) throw error

    // Aquí puedes añadir lógica para enviar email, push notifications, etc.

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
```

#### B. Función para Webhooks de Stripe
```typescript
// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.9.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )

    switch (event.type) {
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object)
        break
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

async function handleSubscriptionUpdate(subscription: any) {
  await supabase
    .from('billing_customers')
    .update({
      subscription_status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('stripe_customer_id', subscription.customer)
}

async function handlePaymentSucceeded(invoice: any) {
  await supabase
    .from('billing_invoices')
    .update({
      status: 'paid',
      paid_date: new Date().toISOString(),
      amount_paid: invoice.amount_paid / 100
    })
    .eq('stripe_invoice_id', invoice.id)
}

async function handlePaymentFailed(invoice: any) {
  await supabase
    .from('billing_invoices')
    .update({ status: 'uncollectible' })
    .eq('stripe_invoice_id', invoice.id)
}
```

#### C. Función para Asignación Automática de Asesores
```typescript
// supabase/functions/assign-advisor/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  try {
    const { clientId } = await req.json()

    // Buscar asesor con menos clientes asignados
    const { data: advisors, error } = await supabase
      .from('advisor_profiles')
      .select(`
        user_id,
        max_clients,
        users!inner(status)
      `)
      .eq('users.status', 'active')

    if (error) throw error

    // Contar clientes actuales por asesor
    const { data: relationships } = await supabase
      .from('client_advisor_relationships')
      .select('advisor_id')
      .eq('status', 'active')

    const advisorCounts = relationships?.reduce((acc, rel) => {
      acc[rel.advisor_id] = (acc[rel.advisor_id] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Encontrar asesor con menor carga
    const availableAdvisor = advisors
      ?.filter(advisor => (advisorCounts[advisor.user_id] || 0) < advisor.max_clients)
      .sort((a, b) => (advisorCounts[a.user_id] || 0) - (advisorCounts[b.user_id] || 0))[0]

    if (!availableAdvisor) {
      throw new Error('No hay asesores disponibles')
    }

    // Crear relación cliente-asesor
    const { data: relationship, error: relationshipError } = await supabase
      .from('client_advisor_relationships')
      .insert({
        client_id: clientId,
        advisor_id: availableAdvisor.user_id,
        relationship_type: 'primary',
        status: 'active'
      })
      .select()
      .single()

    if (relationshipError) throw relationshipError

    // Actualizar perfil del cliente
    await supabase
      .from('client_profiles')
      .update({ assigned_advisor_id: availableAdvisor.user_id })
      .eq('user_id', clientId)

    return new Response(
      JSON.stringify({ success: true, relationship }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### 4. 📧 Configurar Email Templates

En la sección **Authentication** > **Email Templates** de Supabase:

#### Template de Confirmación:
```html
<h2>¡Bienvenido a AsesFy!</h2>
<p>Hola {{ .Email }},</p>
<p>Gracias por unirte a AsesFy. Confirma tu cuenta haciendo clic en el enlace:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar cuenta</a></p>
<p>¡Comenzaremos a ayudarte con tu gestión fiscal!</p>
```

#### Template de Recuperación:
```html
<h2>Recuperar contraseña - AsesFy</h2>
<p>Hola {{ .Email }},</p>
<p>Recibimos una solicitud para restablecer tu contraseña.</p>
<p><a href="{{ .ConfirmationURL }}">Restablecer contraseña</a></p>
<p>Si no solicitaste esto, ignora este email.</p>
```

### 5. 🔧 Variables de Entorno

En **Settings** > **Environment Variables**:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
OPENAI_API_KEY=sk-...
```

### 6. 🛡️ Configuración de Seguridad

#### A. Configurar dominios permitidos:
- Añadir tu dominio en **Authentication** > **URL Configuration**

#### B. Configurar proveedores OAuth (opcional):
- Google, GitHub, etc. en **Authentication** > **Providers**

### 7. 📊 Configurar Real-time

```sql
-- Habilitar real-time para tablas críticas
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_events;
```

### 8. 🧪 Datos de Prueba

```sql
-- Insertar usuarios de prueba
INSERT INTO auth.users (id, email, email_confirmed_at, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@asesfy.com', NOW(), NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'asesor@asesfy.com', NOW(), NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'cliente@asesfy.com', NOW(), NOW(), NOW());

-- Insertar perfiles
INSERT INTO public.users (id, email, full_name, role) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@asesfy.com', 'Administrador Sistema', 'admin'),
('22222222-2222-2222-2222-222222222222', 'asesor@asesfy.com', 'María García Rodríguez', 'advisor'),
('33333333-3333-3333-3333-333333333333', 'cliente@asesfy.com', 'Juan Pérez Empresa SL', 'client');

-- Crear perfil de asesor
INSERT INTO public.advisor_profiles (user_id, specializations, department) VALUES
('22222222-2222-2222-2222-222222222222', '{"IRPF", "IVA", "Sociedades"}', 'Fiscal');

-- Crear perfil de cliente
INSERT INTO public.client_profiles (user_id, business_type, company_name, cif_nif) VALUES
('33333333-3333-3333-3333-333333333333', 'sl', 'Empresa Ejemplo SL', 'B12345678');

-- Asignar asesor a cliente
INSERT INTO public.client_advisor_relationships (client_id, advisor_id) VALUES
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222');
```

### 9. ✅ Verificación Final

1. **Tablas creadas**: Verificar que todas las 14 tablas existen
2. **RLS habilitado**: Todas las tablas deben tener RLS activo
3. **Políticas aplicadas**: Verificar políticas con consultas de prueba
4. **Storage configurado**: Buckets creados y políticas aplicadas
5. **Funciones Edge**: Deployadas y funcionando
6. **Real-time**: Habilitado para tablas críticas

### 10. 🚀 Siguientes Pasos

1. **Integración Frontend**: Conectar las páginas existentes con Supabase
2. **Testing**: Probar flujos completos de usuario
3. **Optimización**: Añadir índices adicionales según uso
4. **Monitoreo**: Configurar alertas y logs
5. **Backup**: Configurar respaldos automáticos

## 📞 Soporte

Si encuentras algún problema durante la configuración:
1. Revisa los logs en Supabase Dashboard
2. Verifica las políticas RLS
3. Comprueba las variables de entorno
4. Testea las funciones Edge individualmente

¡Tu backend de AsesFy estará listo para gestionar miles de clientes y asesores! 🎉 