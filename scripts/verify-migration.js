#!/usr/bin/env node

// 🔍 Script de Verificación de Migración a Supabase Edge Functions
// Asesfy Platform

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICANDO MIGRACIÓN A SUPABASE EDGE FUNCTIONS');
console.log('===============================================');

const checkFile = (filePath, description) => {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description}`);
    return false;
  }
};

const checkFileContent = (filePath, searchTerm, description) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchTerm)) {
      console.log(`✅ ${description}`);
      return true;
    } else {
      console.log(`❌ ${description}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description} (archivo no encontrado)`);
    return false;
  }
};

let totalChecks = 0;
let passedChecks = 0;

const check = (result) => {
  totalChecks++;
  if (result) passedChecks++;
  return result;
};

console.log('\n📁 VERIFICANDO EDGE FUNCTIONS...');
check(checkFile('supabase/functions/chatgpt/index.ts', 'ChatGPT Edge Function'));
check(checkFile('supabase/functions/cart/index.ts', 'Cart Edge Function'));
check(checkFile('supabase/functions/advisor-onboarding/index.ts', 'Advisor Onboarding Edge Function'));
check(checkFile('supabase/config.toml', 'Configuración de Supabase'));

console.log('\n🛠️ VERIFICANDO HELPER FRONTEND...');
check(checkFile('lib/supabase-functions.ts', 'Helper de Supabase Functions'));
check(checkFileContent('lib/supabase-functions.ts', 'callChatGPT', 'Función callChatGPT'));
check(checkFileContent('lib/supabase-functions.ts', 'getCartItems', 'Función getCartItems'));
check(checkFileContent('lib/supabase-functions.ts', 'createAdvisorProfile', 'Función createAdvisorProfile'));

console.log('\n🔧 VERIFICANDO FRONTEND ACTUALIZADO...');
check(checkFileContent('app/chat-ia/page.tsx', 'callChatGPT', 'Chat-IA usa Edge Function'));
check(checkFileContent('store/useCartStore.ts', 'saveCartItems', 'Cart Store usa Edge Functions'));
check(checkFileContent('app/onboarding/page.tsx', 'createAdvisorProfile', 'Onboarding usa Edge Function'));

console.log('\n📋 VERIFICANDO SCRIPTS Y CONFIGURACIÓN...');
check(checkFile('scripts/deploy-edge-functions.sh', 'Script de deployment'));
check(checkFile('.env.example', 'Ejemplo de variables de entorno'));

console.log('\n📖 VERIFICANDO DOCUMENTACIÓN...');
check(checkFile('MIGRACION_SUPABASE_EDGE_FUNCTIONS.md', 'Guía completa de migración'));
check(checkFile('COMANDOS_MIGRACION_SUPABASE.md', 'Comandos específicos'));
check(checkFile('RESUMEN_MIGRACION_APIS_SUPABASE.md', 'Resumen ejecutivo'));

console.log('\n🔍 VERIFICANDO QUE NO HAY APIS LOCALES...');
const hasLocalAPIs = checkFileContent('app/chat-ia/page.tsx', '/api/chatgpt', 'NO debe usar /api/chatgpt') ||
                   checkFileContent('store/useCartStore.ts', '/api/cart', 'NO debe usar /api/cart') ||
                   checkFileContent('app/onboarding/page.tsx', '/api/advisor', 'NO debe usar /api/advisor');

if (!hasLocalAPIs) {
  console.log('✅ No se encontraron llamadas a APIs locales (correcto)');
  check(true);
} else {
  console.log('❌ Aún hay llamadas a APIs locales');
  check(false);
}

// Resumen final
console.log('\n🎯 RESUMEN DE VERIFICACIÓN');
console.log('========================');
console.log(`Verificaciones pasadas: ${passedChecks}/${totalChecks}`);
console.log(`Progreso: ${Math.round((passedChecks/totalChecks)*100)}%`);

if (passedChecks === totalChecks) {
  console.log('🎉 ¡MIGRACIÓN COMPLETADA AL 100%!');
  console.log('✅ Todas las APIs han sido migradas a Supabase Edge Functions');
  console.log('🚀 Listo para deployment con: ./scripts/deploy-edge-functions.sh');
} else {
  console.log('⚠️  Migración parcialmente completada');
  console.log('📋 Revisar elementos faltantes arriba');
}

console.log('\n📖 PRÓXIMOS PASOS:');
console.log('1. Ejecutar: npm install -g supabase');
console.log('2. Ejecutar: supabase login');
console.log('3. Ejecutar: ./scripts/deploy-edge-functions.sh');
console.log('4. Configurar: supabase secrets set OPENAI_API_KEY=tu-key');

console.log('\n✅ Verificación completada.');