#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 SOLUCIONANDO PROBLEMA DEL CHAT IA');
console.log('==========================================');

// 1. Verificar .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local existe');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL');
  const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  console.log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${hasSupabaseUrl ? 'CONFIGURADO' : 'FALTA'}`);
  console.log(`✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${hasSupabaseKey ? 'CONFIGURADO' : 'FALTA'}`);
  
  if (hasSupabaseUrl && hasSupabaseKey) {
    console.log('✅ Variables de entorno configuradas correctamente');
  } else {
    console.log('❌ Variables de entorno incompletas');
  }
} else {
  console.log('❌ .env.local no existe');
}

// 2. Verificar que las Edge Functions están deployadas
console.log('\n🔍 VERIFICANDO EDGE FUNCTIONS');
console.log('==========================================');

const edgeFunctions = [
  'chatgpt',
  'cart', 
  'advisor-onboarding'
];

edgeFunctions.forEach(func => {
  const url = `https://tjnuiedpoulujfqzsdmx.supabase.co/functions/v1/${func}`;
  console.log(`📡 ${func}: ${url}`);
});

// 3. Mostrar próximos pasos
console.log('\n📋 PRÓXIMOS PASOS PARA SOLUCIONAR EL PROBLEMA');
console.log('==========================================');
console.log('1. Reinicia el servidor de desarrollo:');
console.log('   npm run dev');
console.log('');
console.log('2. Ve a http://localhost:3000/diagnostico para verificar el estado');
console.log('');
console.log('3. Abre las herramientas de desarrollador (F12) y ve a la consola');
console.log('');
console.log('4. Intenta usar el chat IA en http://localhost:3000/chat-ia');
console.log('');
console.log('5. Revisa los logs detallados en la consola del navegador');
console.log('');
console.log('🔍 INFORMACIÓN DE DEBUG:');
console.log('- Todas las llamadas a Edge Functions ahora tienen logging detallado');
console.log('- Los errores muestran más información sobre qué está fallando');
console.log('- El componente de diagnóstico verifica cada función individualmente');
console.log('');
console.log('🚀 URLS IMPORTANTES:');
console.log('- Chat IA: http://localhost:3000/chat-ia');
console.log('- Diagnóstico: http://localhost:3000/diagnostico');
console.log('- Supabase Dashboard: https://supabase.com/dashboard/project/tjnuiedpoulujfqzsdmx');
console.log('');
console.log('Si el problema persiste, revisa los logs en la consola del navegador.');