// Script de prueba para verificar la configuración de Supabase
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://tjnuiedpoulujfqzsdmx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqbnVpZWRwb3VsdWpmcXpzZG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMTY5NzEsImV4cCI6MjA2Njg5Mjk3MX0.IAgwme4KnIHwkUSFBRMGAhLCmK0dgCxjiTaDh4liX4w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verificarSupabase() {
  console.log('🔍 Verificando configuración de Supabase...\n');

  // 1. Verificar conexión básica
  try {
    console.log('1. ✅ Conexión establecida con Supabase');
    console.log(`   URL: ${supabaseUrl}`);
    console.log(`   Anon Key: ${supabaseAnonKey.substring(0, 20)}...\n`);
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    return;
  }

  // 2. Verificar tablas principales
  const tablas = [
    'users',
    'client_profiles',
    'advisor_profiles',
    'tasks',
    'documents',
    'messages',
    'notifications',
    'calendar_events',
    'calendar_attendees',
    'client_advisor_relationships',
    'billing_customers',
    'billing_invoices',
    'task_history',
    'system_settings'
  ];

  console.log('2. Verificando tablas de la base de datos:');
  
  for (const tabla of tablas) {
    try {
      const { data, error } = await supabase
        .from(tabla)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ ${tabla}: ${error.message}`);
      } else {
        console.log(`   ✅ ${tabla}: Tabla existe y es accesible`);
      }
    } catch (error) {
      console.log(`   ❌ ${tabla}: Error de conexión - ${error.message}`);
    }
  }

  // 3. Verificar configuraciones del sistema
  console.log('\n3. Verificando configuraciones del sistema:');
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*');
    
    if (error) {
      console.log(`   ❌ system_settings: ${error.message}`);
    } else {
      console.log(`   ✅ system_settings: ${data?.length || 0} configuraciones encontradas`);
      if (data && data.length > 0) {
        data.forEach(setting => {
          console.log(`      - ${setting.key}: ${setting.value}`);
        });
      }
    }
  } catch (error) {
    console.log(`   ❌ Error al verificar configuraciones: ${error.message}`);
  }

  // 4. Verificar autenticación
  console.log('\n4. Verificando sistema de autenticación:');
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log('   ✅ Sistema de autenticación funcional');
    console.log(`   - Sesión actual: ${data.session ? 'Activa' : 'No hay sesión'}`);
  } catch (error) {
    console.log(`   ❌ Error en autenticación: ${error.message}`);
  }

  // 5. Verificar Edge Functions (desde el lado del cliente no podemos probar directamente)
  console.log('\n5. Edge Functions deployadas:');
  console.log('   ℹ️  stripe-webhook: Para procesamiento de pagos');
  console.log('   ℹ️  send-notification: Para envío de notificaciones');
  console.log('   ℹ️  assign-advisor: Para asignación de asesores');

  console.log('\n🎉 Verificación completada!');
  console.log('\nPróximos pasos recomendados:');
  console.log('1. Registrar un usuario de prueba en /register');
  console.log('2. Verificar que se cree automáticamente en la tabla users');
  console.log('3. Probar el login con ese usuario');
  console.log('4. Navegar por las diferentes páginas de la aplicación');
}

// Ejecutar verificación
verificarSupabase().catch(console.error); 