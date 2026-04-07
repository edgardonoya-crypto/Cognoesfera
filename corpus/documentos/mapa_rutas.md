# Mapa de Rutas — Cognoesfera
*Registro de rutas activas · Última actualización: 07/04/2026*

---

## Páginas

| Ruta | Propósito | Acceso |
|---|---|---|
| `/` | Redirect automático a `/login` | Público |
| `/login` | Autenticación OTP en dos pasos (email → código de 6 dígitos) | Público |
| `/dashboard` | Panel principal con lista de Cognoesferas del usuario | Autenticado |
| `/cognoesfera/[id]` | Vista de una Cognoesfera específica — resonancias y detalle | Autenticado |
| `/duende` | Interfaz de conversación con el Duende (corpus completo) | Autenticado |
| `/quanam-ia-2026` | Convocatoria interactiva Quanam IHA Lab 2026 — lentes, drawer contexto, Duende | Público |
| `/corpus-form` | Formulario para registrar conceptos, señales, pendientes y actualizaciones al corpus vía GitHub API | Autenticado |
| `/admin` | Panel de administración — respondentes, contactos Aleph, conversaciones Duende | Solo Arquitecto |

---

## API Routes

| Ruta | Método | Propósito | Acceso |
|---|---|---|---|
| `/api/auth/send-otp` | POST | Pre-confirma usuario y dispara OTP via Supabase | Público |
| `/api/duende` | POST | Envía mensaje al Duende (Anthropic) y guarda en `duende_chats` | Público* |
| `/api/quanam-respuesta` | POST | Guarda respuesta de lente en `quanam_respuestas` | Público* |
| `/api/aleph-contacto` | POST | Guarda contacto en `aleph_contacto` | Público* |
| `/api/corpus-commit` | POST | Commitea documento al repositorio GitHub vía API | Autenticado† |
| `/api/admin/duende-chats` | GET | Lee todas las conversaciones de `duende_chats` (bypass RLS) | Solo Arquitecto‡ |

*Público en el sentido de que no requiere sesión — están pensadas para ser llamadas desde páginas públicas de la convocatoria. No hay validación de autenticación explícita.

†Requiere `GITHUB_TOKEN` configurado en el servidor. Sin token devuelve error.

‡Verifica que el Bearer token corresponda al email del Arquitecto antes de devolver datos.

---

## Protección de rutas

| Mecanismo | Cubre | Cómo |
|---|---|---|
| **Middleware** (`middleware.ts`) | `/admin` | Verifica sesión server-side con `@supabase/ssr`. Sin sesión → `/login`. Sesión no-Arquitecto → `/dashboard`. |
| **Client-side** | `/dashboard`, `/duende`, `/corpus-form`, `/cognoesfera/[id]` | `supabase.auth.getSession()` al montar — sin sesión redirige a `/login` |
| **API route** | `/api/admin/duende-chats` | Verifica Bearer token con `getUser()` y compara email |
| **Sin protección** | `/api/duende`, `/api/quanam-respuesta`, `/api/aleph-contacto`, `/api/auth/send-otp` | Rutas públicas de la convocatoria y del login |

---

## Pendientes de seguridad (S-SE-01)

- `/api/duende`, `/api/quanam-respuesta`, `/api/aleph-contacto` no tienen validación de autenticación — evaluar si agregar rate limiting antes de escalar la convocatoria
- `/corpus-form` tiene protección client-side únicamente — la API route `/api/corpus-commit` no verifica sesión

---

*Mapa de Rutas · Cognoesfera · 07/04/2026*
