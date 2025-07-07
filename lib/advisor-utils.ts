import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

// ✅ Lista de correos de asesores autorizados
export const AUTHORIZED_ADVISOR_EMAILS = [
  'asesor1@demo.com',
  'asesor2@demo.com',
  'asesor3@demo.com',
  'asesor4@demo.com',
  'asesor5@demo.com'
];

// ✅ Función para validar si un correo es de asesor
export const isAdvisorEmail = (email: string): boolean => {
  // Verificar si está en la lista de autorizados
  if (AUTHORIZED_ADVISOR_EMAILS.includes(email.toLowerCase())) {
    return true;
  }
  
  // Verificar si sigue el patrón asesor[número]@demo.com
  const advisorPattern = /^asesor\d+@demo\.com$/i;
  return advisorPattern.test(email);
};

// ✅ Función para determinar el rol basado en el email
export const determineRoleFromEmail = (email: string): 'advisor' | 'client' => {
  return isAdvisorEmail(email) ? 'advisor' : 'client';
};

// ✅ Función para obtener el asesor con menos carga de trabajo
export const getAdvisorWithLeastLoad = async (): Promise<string | null> => {
  try {
    // Obtener todos los asesores
    const { data: advisors, error: advisorsError } = await supabase
      .from('users')
      .select('id, email')
      .in('email', AUTHORIZED_ADVISOR_EMAILS);

    if (advisorsError) {
      console.error('Error getting advisors:', advisorsError);
      return null;
    }

    if (!advisors || advisors.length === 0) {
      console.warn('No advisors found in database');
      return null;
    }

    // Contar clientes asignados a cada asesor
    const advisorLoads = await Promise.all(
      advisors.map(async (advisor) => {
        const { data: clients, error } = await supabase
          .from('client_profiles')
          .select('id')
          .eq('assigned_advisor_id', advisor.id);

        if (error) {
          console.error(`Error getting clients for advisor ${advisor.email}:`, error);
          return { advisor, clientCount: 0 };
        }

        return { advisor, clientCount: clients?.length || 0 };
      })
    );

    // Encontrar el asesor con menos clientes
    const advisorWithLeastLoad = advisorLoads.reduce((min, current) => 
      current.clientCount < min.clientCount ? current : min
    );

    return advisorWithLeastLoad.advisor.id;
  } catch (error) {
    console.error('Error in getAdvisorWithLeastLoad:', error);
    return null;
  }
};

// ✅ Función para asignar un cliente a un asesor automáticamente
export const assignClientToAdvisor = async (clientId: string): Promise<boolean> => {
  try {
    // Verificar si el cliente ya tiene un asesor asignado
    const { data: existingProfile, error: checkError } = await supabase
      .from('client_profiles')
      .select('assigned_advisor_id')
      .eq('user_id', clientId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing advisor:', checkError);
      return false;
    }

    // Si ya tiene asesor asignado, no hacer nada
    if (existingProfile?.assigned_advisor_id) {
      return true;
    }

    // Obtener el asesor con menos carga
    const advisorId = await getAdvisorWithLeastLoad();
    
    if (!advisorId) {
      console.error('No advisor available for assignment');
      return false;
    }

    // Asignar el cliente al asesor
    const { error: assignError } = await supabase
      .from('client_profiles')
      .upsert({
        user_id: clientId,
        assigned_advisor_id: advisorId,
        updated_at: new Date().toISOString()
      });

    if (assignError) {
      console.error('Error assigning client to advisor:', assignError);
      return false;
    }

    console.log(`Client ${clientId} assigned to advisor ${advisorId}`);
    return true;
  } catch (error) {
    console.error('Error in assignClientToAdvisor:', error);
    return false;
  }
};

// ✅ Función para crear notificación para el asesor
export const createAdvisorNotification = async (
  advisorId: string,
  title: string,
  message: string,
  type: 'document' | 'task' | 'client' = 'document'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: advisorId,
        title,
        message,
        type,
        is_read: false,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error creating advisor notification:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in createAdvisorNotification:', error);
    return false;
  }
};

// ✅ Función para notificar al asesor cuando un cliente sube un documento
export const notifyAdvisorOfClientDocument = async (
  clientId: string,
  documentName: string
): Promise<void> => {
  try {
    // Obtener el asesor asignado al cliente
    const { data: clientProfile, error: clientError } = await supabase
      .from('client_profiles')
      .select('assigned_advisor_id, users!client_profiles_user_id_fkey(full_name)')
      .eq('user_id', clientId)
      .single();

    if (clientError || !clientProfile?.assigned_advisor_id) {
      console.warn('Client has no assigned advisor or error getting profile:', clientError);
      return;
    }

    // Obtener el nombre del cliente
    const clientName = (clientProfile as any).users?.full_name || 'Cliente';

    // Crear notificación para el asesor
    await createAdvisorNotification(
      clientProfile.assigned_advisor_id,
      'Nuevo documento subido',
      `${clientName} ha subido un nuevo documento: ${documentName}`,
      'document'
    );

    // Crear tarea automática para revisar el documento
    await createDocumentReviewTask(
      clientProfile.assigned_advisor_id,
      clientId,
      documentName
    );

  } catch (error) {
    console.error('Error in notifyAdvisorOfClientDocument:', error);
  }
};

// ✅ Función para crear tarea automática de revisión de documento
export const createDocumentReviewTask = async (
  advisorId: string,
  clientId: string,
  documentName: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .insert({
        title: `Revisar documento: ${documentName}`,
        description: `Revisar y procesar el documento "${documentName}" subido por el cliente.`,
        status: 'pending',
        priority: 'medium',
        advisor_id: advisorId,
        client_id: clientId,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error creating document review task:', error);
    }
  } catch (error) {
    console.error('Error in createDocumentReviewTask:', error);
  }
};

// ✅ Función para obtener estadísticas de carga de asesores
export const getAdvisorLoadStats = async (): Promise<Array<{
  advisor: { id: string; email: string; full_name: string };
  clientCount: number;
  pendingTasks: number;
  unreadNotifications: number;
}>> => {
  try {
    // Obtener todos los asesores
    const { data: advisors, error: advisorsError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .in('email', AUTHORIZED_ADVISOR_EMAILS);

    if (advisorsError || !advisors) {
      console.error('Error getting advisors:', advisorsError);
      return [];
    }

    // Obtener estadísticas para cada asesor
    const stats = await Promise.all(
      advisors.map(async (advisor) => {
        // Contar clientes asignados
        const { data: clients } = await supabase
          .from('client_profiles')
          .select('id')
          .eq('assigned_advisor_id', advisor.id);

        // Contar tareas pendientes
        const { data: tasks } = await supabase
          .from('tasks')
          .select('id')
          .eq('advisor_id', advisor.id)
          .in('status', ['pending', 'in_progress']);

        // Contar notificaciones no leídas
        const { data: notifications } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', advisor.id)
          .eq('is_read', false);

        return {
          advisor,
          clientCount: clients?.length || 0,
          pendingTasks: tasks?.length || 0,
          unreadNotifications: notifications?.length || 0,
        };
      })
    );

    return stats;
  } catch (error) {
    console.error('Error in getAdvisorLoadStats:', error);
    return [];
  }
};

// ✅ Función para manejar el onboarding automático de nuevos usuarios
export const handleUserOnboarding = async (
  userId: string,
  email: string,
  fullName: string
): Promise<void> => {
  try {
    const role = determineRoleFromEmail(email);

    // Actualizar el rol del usuario en los metadatos
    const { error: updateError } = await supabase.auth.updateUser({
      data: { role, full_name: fullName }
    });

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
    }

    // Si es un cliente, asignarlo automáticamente a un asesor
    if (role === 'client') {
      await assignClientToAdvisor(userId);
      
      // Crear notificación de bienvenida
      await createWelcomeNotification(userId);
    }

    console.log(`User ${email} onboarded as ${role}`);
  } catch (error) {
    console.error('Error in handleUserOnboarding:', error);
  }
};

// ✅ Función para crear notificación de bienvenida
const createWelcomeNotification = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: '¡Bienvenido a Asesfy!',
        message: 'Te hemos asignado un asesor fiscal que te ayudará con todas tus consultas. Puedes subir tus documentos y hacer preguntas cuando lo necesites.',
        type: 'client',
        is_read: false,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error creating welcome notification:', error);
    }
  } catch (error) {
    console.error('Error in createWelcomeNotification:', error);
  }
};

// ✅ Función para validar acceso a rutas de asesor
export const validateAdvisorAccess = (userEmail: string): boolean => {
  return isAdvisorEmail(userEmail);
};

// ✅ Función para obtener el nombre del asesor por ID
export const getAdvisorNameById = async (advisorId: string): Promise<string> => {
  try {
    const { data: advisor, error } = await supabase
      .from('users')
      .select('full_name, email')
      .eq('id', advisorId)
      .single();

    if (error || !advisor) {
      return 'Asesor no encontrado';
    }

    return advisor.full_name || advisor.email;
  } catch (error) {
    console.error('Error getting advisor name:', error);
    return 'Asesor no encontrado';
  }
};

export default {
  isAdvisorEmail,
  determineRoleFromEmail,
  assignClientToAdvisor,
  notifyAdvisorOfClientDocument,
  createAdvisorNotification,
  getAdvisorWithLeastLoad,
  getAdvisorLoadStats,
  handleUserOnboarding,
  validateAdvisorAccess,
  getAdvisorNameById,
  AUTHORIZED_ADVISOR_EMAILS
};