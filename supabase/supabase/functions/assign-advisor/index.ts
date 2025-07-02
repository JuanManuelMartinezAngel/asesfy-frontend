import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface AdvisorProfile {
  user_id: string;
  max_clients: number;
  specializations: string[] | null;
  users: {
    status: string;
    full_name: string;
  };
}

interface Relationship {
  advisor_id: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { clientId, businessType, specialization } = await req.json()

    if (!clientId) {
      throw new Error('Client ID is required')
    }

    // Verificar que el cliente existe y no tiene asesor asignado
    const { data: client, error: clientError } = await supabase
      .from('client_profiles')
      .select('user_id, business_type, assigned_advisor_id')
      .eq('user_id', clientId)
      .single()

    if (clientError || !client) {
      throw new Error('Cliente no encontrado')
    }

    if (client.assigned_advisor_id) {
      throw new Error('Cliente ya tiene un asesor asignado')
    }

    // Buscar asesores disponibles
    const { data: advisors, error: advisorsError } = await supabase
      .from('advisor_profiles')
      .select(`
        user_id,
        max_clients,
        specializations,
        users!inner(status, full_name)
      `)
      .eq('users.status', 'active')

    if (advisorsError || !advisors?.length) {
      throw new Error('No hay asesores disponibles')
    }

    // Contar clientes actuales por asesor
    const { data: relationships } = await supabase
      .from('client_advisor_relationships')
      .select('advisor_id')
      .eq('status', 'active')

    const advisorCounts = (relationships as Relationship[])?.reduce((acc: Record<string, number>, rel: Relationship) => {
      acc[rel.advisor_id] = (acc[rel.advisor_id] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Filtrar asesores disponibles (que no hayan alcanzado su máximo)
    const availableAdvisors = (advisors as AdvisorProfile[]).filter((advisor: AdvisorProfile) => 
      (advisorCounts[advisor.user_id] || 0) < advisor.max_clients
    )

    if (!availableAdvisors.length) {
      throw new Error('No hay asesores disponibles en este momento')
    }

    // Lógica de asignación inteligente
    let bestAdvisor = availableAdvisors[0]

    // 1. Priorizar por especialización si se especifica
    if (specialization) {
      const specializedAdvisors = availableAdvisors.filter((advisor: AdvisorProfile) =>
        advisor.specializations?.includes(specialization)
      )
      if (specializedAdvisors.length > 0) {
        bestAdvisor = specializedAdvisors.sort((a: AdvisorProfile, b: AdvisorProfile) => 
          (advisorCounts[a.user_id] || 0) - (advisorCounts[b.user_id] || 0)
        )[0]
      }
    }

    // 2. Si no hay especialización específica, buscar por tipo de negocio
    if (!specialization) {
      const businessTypeAdvisors = availableAdvisors.filter((advisor: AdvisorProfile) => {
        const specs = advisor.specializations || []
        if (businessType === 'autonomo') {
          return specs.includes('IRPF') || specs.includes('Autónomos')
        } else if (['sl', 'sa'].includes(businessType)) {
          return specs.includes('Sociedades') || specs.includes('IVA')
        }
        return true
      })

      if (businessTypeAdvisors.length > 0) {
        bestAdvisor = businessTypeAdvisors.sort((a: AdvisorProfile, b: AdvisorProfile) => 
          (advisorCounts[a.user_id] || 0) - (advisorCounts[b.user_id] || 0)
        )[0]
      }
    }

    // 3. Como último recurso, elegir el asesor con menos carga (siempre aplicar para optimizar)
    bestAdvisor = availableAdvisors.sort((a: AdvisorProfile, b: AdvisorProfile) => 
      (advisorCounts[a.user_id] || 0) - (advisorCounts[b.user_id] || 0)
    )[0]

    // Crear relación cliente-asesor
    const { data: relationship, error: relationshipError } = await supabase
      .from('client_advisor_relationships')
      .insert({
        client_id: clientId,
        advisor_id: bestAdvisor.user_id,
        relationship_type: 'primary',
        status: 'active',
        notes: `Asignación automática basada en ${specialization || businessType || 'disponibilidad'}`
      })
      .select()
      .single()

    if (relationshipError) throw relationshipError

    // Actualizar perfil del cliente
    const { error: updateError } = await supabase
      .from('client_profiles')
      .update({ assigned_advisor_id: bestAdvisor.user_id })
      .eq('user_id', clientId)

    if (updateError) throw updateError

    // Enviar notificaciones
    await Promise.all([
      // Notificar al cliente
      supabase.from('notifications').insert({
        user_id: clientId,
        title: '¡Asesor asignado!',
        message: `Te hemos asignado a ${bestAdvisor.users.full_name} como tu asesor fiscal. Pronto se pondrá en contacto contigo.`,
        type: 'system',
        entity_type: 'advisor',
        entity_id: bestAdvisor.user_id,
        priority: 'high'
      }),
      
      // Notificar al asesor
      supabase.from('notifications').insert({
        user_id: bestAdvisor.user_id,
        title: 'Nuevo cliente asignado',
        message: `Se te ha asignado un nuevo cliente. Revisa su perfil y ponte en contacto cuando sea conveniente.`,
        type: 'system',
        entity_type: 'client',
        entity_id: clientId,
        priority: 'normal'
      })
    ])

    // Registrar en el historial (si fuera necesario)
    const response = {
      success: true,
      relationship,
      advisor: {
        id: bestAdvisor.user_id,
        name: bestAdvisor.users.full_name,
        specializations: bestAdvisor.specializations,
        current_clients: advisorCounts[bestAdvisor.user_id] || 0
      },
      assignment_reason: specialization || businessType || 'availability'
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error assigning advisor:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}) 