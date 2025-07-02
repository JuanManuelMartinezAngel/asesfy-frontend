import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, title, message, type, entityType, entityId, actionUrl, priority = 'normal' } = await req.json()

    // Validar datos requeridos
    if (!userId || !title || !message || !type) {
      throw new Error('Faltan campos requeridos: userId, title, message, type')
    }

    // Insertar notificación
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        entity_type: entityType,
        entity_id: entityId,
        action_url: actionUrl,
        priority
      })
      .select()
      .single()

    if (error) throw error

    // Enviar notificación en tiempo real
    await supabase
      .channel('notifications')
      .send({
        type: 'broadcast',
        event: 'new_notification',
        payload: {
          userId,
          notification
        }
      })

    // TODO: Aquí puedes añadir lógica adicional para:
    // - Enviar email con Resend
    // - Enviar push notification
    // - Integrar con sistemas externos

    return new Response(
      JSON.stringify({ success: true, notification }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error sending notification:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
}) 