# Variables de Entorno — Cognoesfera
*Registro de variables activas · Última actualización: 07/04/2026*
*No incluye valores — solo nombres, propósitos y ubicaciones*

---

## Variables activas

---

### NEXT_PUBLIC_SUPABASE_URL

**Propósito:** URL base del proyecto Supabase. Usada para inicializar todos los clientes de Supabase — tanto el cliente público como el admin.

**Dónde se usa:**
- `lib/supabase.ts` — cliente público singleton
- `app/lib/supabase.ts` — cliente público singleton (copia en app/)
- `middleware.ts` — cliente SSR para verificar sesión server-side
- `app/api/duende/route.ts` — cliente admin del Duende
- `app/api/quanam-respuesta/route.ts` — cliente admin de la convocatoria
- `app/api/aleph-contacto/route.ts` — cliente admin de contactos
- `app/api/admin/duende-chats/route.ts` — clientes admin y público
- `app/api/auth/send-otp/route.ts` — cliente admin del OTP

**Prefijo NEXT_PUBLIC_:** sí — expuesta al browser (el valor es público en Supabase)

**Ubicación:** `.env.local` + Vercel

---

### NEXT_PUBLIC_SUPABASE_ANON_KEY

**Propósito:** Clave pública de Supabase (anon key). Usada para el cliente que opera con RLS activo — las operaciones están restringidas por las políticas de seguridad de cada tabla.

**Dónde se usa:**
- `lib/supabase.ts` — cliente público singleton
- `app/lib/supabase.ts` — cliente público singleton (copia en app/)
- `middleware.ts` — cliente SSR para verificar sesión server-side
- `app/api/admin/duende-chats/route.ts` — verificar identidad del usuario

**Prefijo NEXT_PUBLIC_:** sí — diseñada para ser pública (no da acceso elevado)

**Ubicación:** `.env.local` + Vercel

---

### SUPABASE_SERVICE_ROLE_KEY

**Propósito:** Clave de servicio de Supabase con privilegios de administrador. Bypasea todas las políticas RLS. Usada exclusivamente en API routes server-side para escritura y lectura sin restricciones.

**Dónde se usa:**
- `app/api/duende/route.ts` — guardar conversaciones en `duende_chats`
- `app/api/quanam-respuesta/route.ts` — guardar respuestas en `quanam_respuestas`
- `app/api/aleph-contacto/route.ts` — guardar contactos en `aleph_contacto`
- `app/api/admin/duende-chats/route.ts` — leer todas las conversaciones
- `app/api/auth/send-otp/route.ts` — operaciones admin de autenticación

**Prefijo NEXT_PUBLIC_:** no — exclusivamente server-side. Nunca exponer al browser.

**Ubicación:** `.env.local` + Vercel

---

### ANTHROPIC_API_KEY

**Propósito:** Clave de la API de Anthropic. Usada para enviar mensajes al modelo claude-sonnet-4-6 desde la API route del Duende.

**Dónde se usa:**
- `app/api/duende/route.ts` — llamadas al SDK de Anthropic (`@anthropic-ai/sdk`)

**Prefijo NEXT_PUBLIC_:** no — exclusivamente server-side.

**Cuenta:** `casa-soma` · Auto-reload configurado · $50 crédito inicial

**Ubicación:** `.env.local` + Vercel

---

### GITHUB_TOKEN

**Propósito:** Token de acceso a GitHub. Usado por la API route `/corpus-form` para commitear documentos del corpus directamente al repositorio vía GitHub API sin pasar por la terminal.

**Dónde se usa:**
- `app/api/corpus-commit/route.ts` — commits vía GitHub API

**Prefijo NEXT_PUBLIC_:** no — exclusivamente server-side.

**Permisos requeridos:** `repo` (lectura y escritura al repositorio)

**Ubicación:** `.env.local` + Vercel

---

## Resumen

| Variable | Tipo | Server | Client | .env.local | Vercel |
|---|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | ✓ | ✓ | ✓ | ✓ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública | ✓ | ✓ | ✓ | ✓ |
| `SUPABASE_SERVICE_ROLE_KEY` | Secreta | ✓ | — | ✓ | ✓ |
| `ANTHROPIC_API_KEY` | Secreta | ✓ | — | ✓ | ✓ |
| `GITHUB_TOKEN` | Secreta | ✓ | — | ✓ | ✓ |

---

## Notas de seguridad

- Las variables `NEXT_PUBLIC_*` son visibles en el bundle del browser — nunca usarlas para claves privadas
- `SUPABASE_SERVICE_ROLE_KEY` bypasea RLS completamente — usarla solo en rutas protegidas server-side
- Si alguna variable secreta se expone, rotarla inmediatamente en el dashboard correspondiente (Supabase / Anthropic / GitHub)
- Verificar que `.env.local` esté en `.gitignore` — nunca commitear valores

---

*Variables de Entorno · Cognoesfera · 07/04/2026*
