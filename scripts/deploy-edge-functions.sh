#!/bin/bash

# 🚀 Script de Deployment para Supabase Edge Functions
# Asesfy Platform - APIs Protegidas

echo "🚀 Deployando Edge Functions de Asesfy Platform..."
echo "================================================="

# Verificar que Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI no está instalado"
    echo "📦 Instalando Supabase CLI..."
    npm install -g supabase
fi

# Verificar login
echo "🔐 Verificando autenticación con Supabase..."
if ! supabase projects list &> /dev/null; then
    echo "❌ No estás autenticado en Supabase"
    echo "🔑 Por favor ejecuta: supabase login"
    exit 1
fi

echo "✅ Autenticación verificada"

# Función para deploy individual con verificación
deploy_function() {
    local function_name=$1
    echo "📤 Deployando función: $function_name"
    
    if supabase functions deploy $function_name; then
        echo "✅ $function_name deployada exitosamente"
    else
        echo "❌ Error deployando $function_name"
        return 1
    fi
}

# Deploy todas las funciones
echo "📦 Deployando todas las Edge Functions..."
echo ""

# 1. ChatGPT Function
deploy_function "chatgpt"
echo ""

# 2. Cart Function  
deploy_function "cart"
echo ""

# 3. Advisor Onboarding Function
deploy_function "advisor-onboarding"
echo ""

# Configurar secrets si están disponibles
echo "🔑 Configurando secrets..."

# OpenAI API Key
read -p "🤖 ¿Quieres configurar la OpenAI API Key? (y/N): " configure_openai
if [[ $configure_openai =~ ^[Yy]$ ]]; then
    read -p "🔑 Ingresa tu OpenAI API Key: " openai_key
    if [ ! -z "$openai_key" ]; then
        supabase secrets set OPENAI_API_KEY="$openai_key"
        echo "✅ OpenAI API Key configurada"
    fi
fi

echo ""
echo "🎉 ¡Deployment completado!"
echo "=========================="
echo ""
echo "📋 Funciones deployadas:"
echo "  🤖 chatgpt - API de ChatGPT especializada en fiscalidad"
echo "  🛒 cart - API de gestión del carrito de compras"
echo "  👨‍💼 advisor-onboarding - API de onboarding de asesores"
echo ""
echo "🔗 URLs de las funciones:"
echo "  https://your-project.supabase.co/functions/v1/chatgpt"
echo "  https://your-project.supabase.co/functions/v1/cart"
echo "  https://your-project.supabase.co/functions/v1/advisor-onboarding"
echo ""
echo "📖 Documentación: MIGRACION_SUPABASE_EDGE_FUNCTIONS.md"
echo ""
echo "🔧 Próximos pasos:"
echo "  1. Configurar variables de entorno en Supabase Dashboard"
echo "  2. Actualizar NEXT_PUBLIC_SUPABASE_URL en tu frontend"
echo "  3. Testing de las funciones"
echo "  4. Actualizar useCartStore para usar Edge Functions"
echo ""
echo "✅ ¡Asesfy Platform ahora tiene APIs protegidas y escalables!"