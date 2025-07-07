# 🔧 COMANDOS ESPECÍFICOS PARA MIGRACIÓN A SUPABASE

## 🎯 **RESUMEN**
He migrado todas las APIs del frontend a **Supabase Edge Functions** para mayor seguridad. Aquí tienes los comandos exactos para completar la migración.

---

## 📋 **PASO A PASO**

### **1. 📦 Instalar Supabase CLI**
```bash
# Instalar globalmente
npm install -g supabase

# O como dependencia del proyecto
npm install supabase --save-dev
```

### **2. 🔑 Autenticarse en Supabase**
```bash
# Login en Supabase
supabase login

# Verificar autenticación
supabase projects list
```

### **3. 🏗️ Inicializar proyecto (si es necesario)**
```bash
# Solo si no tienes configuración de Supabase
supabase init
```

### **4. 🚀 Deploy de Edge Functions**
```bash
# Opción A: Deploy individual
supabase functions deploy chatgpt
supabase functions deploy cart
supabase functions deploy advisor-onboarding

# Opción B: Deploy automatizado
chmod +x scripts/deploy-edge-functions.sh
./scripts/deploy-edge-functions.sh

# Opción C: Deploy todas de una vez
supabase functions deploy
```

### **5. 🔐 Configurar variables de entorno en Supabase**
```bash
# Configurar OpenAI API Key
supabase secrets set OPENAI_API_KEY=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

# Verificar secrets
supabase secrets list
```

### **6. 🔗 Actualizar variables de entorno del frontend**
```bash
# En tu .env.local, asegurar que tienes:
echo "NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key" >> .env.local
```

---

## 🧪 **TESTING**

### **Verificar Edge Functions funcionando**
```bash
# Ver logs en tiempo real
supabase functions logs chatgpt --follow
supabase functions logs cart --follow
supabase functions logs advisor-onboarding --follow

# Test rápido desde terminal
curl -X POST \
  'https://tu-proyecto.supabase.co/functions/v1/chatgpt' \
  -H 'Content-Type: application/json' \
  -d '{"messages": [{"role": "user", "content": "test"}]}'
```

### **Test desde el frontend**
```typescript
// Añadir en algún componente para testing
import { checkEdgeFunctionsHealth } from '@/lib/supabase-functions';

const testEdgeFunctions = async () => {
  const health = await checkEdgeFunctionsHealth();
  console.log('Edge Functions status:', health);
};
```

---

## 🎯 **LO QUE YA ESTÁ HECHO**

### ✅ **Archivos creados**
- `supabase/functions/chatgpt/index.ts` - API ChatGPT migrada
- `supabase/functions/cart/index.ts` - API Carrito migrada
- `supabase/functions/advisor-onboarding/index.ts` - API Advisor migrada
- `lib/supabase-functions.ts` - Helper para frontend
- `supabase/config.toml` - Configuración Supabase
- `scripts/deploy-edge-functions.sh` - Script deployment

### ✅ **Frontend actualizado**
- `app/chat-ia/page.tsx` - Ya usa Edge Function para ChatGPT

---

## ⚠️ **PENDIENTE DE COMPLETAR**

### **1. Actualizar useCartStore para usar Edge Functions**
```typescript
// En store/useCartStore.ts, reemplazar:

// ❌ Antes
const response = await fetch('/api/cart', { ... });

// ✅ Después
import { getCartItems, saveCartItems, deleteCartItem } from '@/lib/supabase-functions';
const data = await getCartItems(userId, sessionId);
```

### **2. Actualizar advisor onboarding calls**
```typescript
// En componentes que usen /api/advisor/onboarding, reemplazar:

// ❌ Antes
const response = await fetch('/api/advisor/onboarding', { ... });

// ✅ Después
import { createAdvisorProfile } from '@/lib/supabase-functions';
const data = await createAdvisorProfile({ fullName, nif, phone });
```

---

## 🔧 **COMANDOS ÚTILES**

### **Debugging**
```bash
# Ver logs detallados
supabase functions logs chatgpt --level debug

# Verificar configuración
supabase functions list

# Ver secrets configurados
supabase secrets list
```

### **Desarrollo local**
```bash
# Ejecutar Supabase localmente
supabase start

# Las functions estarán en:
# http://localhost:54321/functions/v1/chatgpt
# http://localhost:54321/functions/v1/cart
# http://localhost:54321/functions/v1/advisor-onboarding
```

### **Actualizar funciones**
```bash
# Redeploy después de cambios
supabase functions deploy chatgpt

# Ver diferencias
supabase functions diff chatgpt
```

---

## 🎉 **RESULTADOS ESPERADOS**

### **Después de completar la migración:**

1. ✅ **APIs protegidas** - No más API keys en el frontend
2. ✅ **Escalabilidad automática** - Edge Functions escalan según demanda
3. ✅ **Performance mejorada** - Ejecución en edge locations
4. ✅ **Costos optimizados** - Pay-per-use model
5. ✅ **Mantenimiento simplificado** - Todo centralizado en Supabase

### **URLs finales:**
- ChatGPT: `https://tu-proyecto.supabase.co/functions/v1/chatgpt`
- Cart: `https://tu-proyecto.supabase.co/functions/v1/cart`
- Advisor: `https://tu-proyecto.supabase.co/functions/v1/advisor-onboarding`

---

## 🚀 **COMANDO RÁPIDO PARA EMPEZAR**

```bash
# Un solo comando para hacer todo
git clone tu-repo && cd tu-repo
npm install -g supabase
supabase login
supabase functions deploy
supabase secrets set OPENAI_API_KEY=tu-key
```

---

## 📞 **Si algo falla**

### **Problemas comunes:**
1. **"Command not found"** → Instalar Supabase CLI
2. **"Not authenticated"** → Ejecutar `supabase login`
3. **"Function deploy failed"** → Verificar sintaxis en archivos .ts
4. **"API key not working"** → Verificar secrets con `supabase secrets list`

### **Logs para debugging:**
```bash
# Ver todos los logs
supabase functions logs

# Ver logs específicos
supabase functions logs chatgpt --follow
```

---

## ✅ **CHECKLIST FINAL**

- [ ] Supabase CLI instalado
- [ ] Autenticado en Supabase (`supabase login`)
- [ ] Edge Functions deployadas (`supabase functions deploy`)
- [ ] OpenAI API Key configurada (`supabase secrets set`)
- [ ] Variables de entorno del frontend actualizadas
- [ ] Frontend testeado con Edge Functions
- [ ] useCartStore actualizado (pendiente)
- [ ] Advisor onboarding actualizado (pendiente)

---

**¡Con estos comandos tendrás todas las APIs protegidas en Supabase!** 🎉