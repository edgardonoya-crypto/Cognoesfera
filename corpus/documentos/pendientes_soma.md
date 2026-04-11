# Pendientes Casa Soma
*Pendientes técnicos, operativos e infraestructura del paradigma*
*Reemplaza la sección A6 de SESION.md para los pendientes SOMA*
*Paradigma Aleph · Reestructurado 06/04/2026*
*Pendientes activos al 11/04/2026: 16*

---

## Schema

Cada pendiente registra: **ID · Título · Descripción · Prioridad · Estado · Fecha · Dependencias**

**Prioridades:** P1 (urgente / fecha límite) · P2 (próxima sesión) · P3 (esta semana) · P4 (este mes) · P5 (horizonte)
**Estados:** Activo · En pausa · Bloqueado · En progreso
**Subcategorías:** Duende · Base de datos · Infraestructura · Aplicación

---

## Subcategoría: Duende

---

## Subcategoría: Seguridad

---

**S-SE-01**
**Título:** Seguridad y hardening del sistema
**Descripción:** Revisión de seguridad completa antes de escalar la convocatoria. Puntos identificados: política RLS de duende_chats abierta (USING true — cualquier autenticado lee todo), variables de entorno documentadas, rutas protegidas, acceso al panel /admin. Incluye también corrección de detalles menores que surgieron en SESION-20260407.
**Prioridad:** P1
**Estado:** En progreso
**Fecha:** 07/04/2026
**Dependencias:** S-IN-04
*Completado parcialmente en SESION-20260408: RLS duende_chats, rutas middleware, createBrowserClient. Pendiente: variables de entorno (S-IN-04).*

---

## Subcategoría: Base de datos

---

**S-BD-01**
**Título:** Crear tabla de status acumulativo en Supabase
**Descripción:** Una fila por sesión con métricas comparables: señales, conceptos, acciones soberanas/supervivencia, tiempo, emergencias del entre. Habilita al Duende futuro a leer tendencias como contexto de sesión.
**Prioridad:** P3
**Estado:** Activo
**Fecha:** 30/03/2026
**Dependencias:** Ninguna

---

**S-BD-02**
**Título:** Diseñar tablas BD para catálogo de protocolos de actos de cuidado
**Descripción:** Tablas: `protocolos_cuidado` (registro maestro), `protocolo_actos_cuidado` (relación con actos de cuidado), `protocolo_estados_vitales` (estados recomendados y no recomendados), `protocolo_matriz_dimensiones` (dimensiones de la Matriz que activa), `aplicaciones_protocolo` (registros de uso real en Cognoesferas).
**Prioridad:** P4
**Estado:** Activo
**Fecha:** 30/03/2026
**Dependencias:** Ninguna

---

**S-BD-03**
**Título:** Implementar identificador SESION-YYYYMMDD
**Descripción:** Campo `sesion_id` en tabla Supabase y referencia cruzada en status_DDMMYYYY.md. Habilitará trazabilidad completa entre el registro en Supabase y la conversación de Claude que lo originó.
**Prioridad:** P3
**Estado:** Activo
**Fecha:** 30/03/2026
**Dependencias:** S-BD-01

---

## Subcategoría: Infraestructura

---

**S-IN-03**
**Título:** Documentar schema completo de Supabase
**Descripción:** Registro de tablas, columnas, tipos y propósito de cada una. Base para que el Duende y futuras sesiones puedan operar con contexto completo del schema sin exploración manual.
**Prioridad:** P3
**Estado:** Activo
**Fecha:** 06/04/2026
**Dependencias:** Ninguna

---

**S-IN-04**
**Título:** Documentar variables de entorno activas
**Descripción:** Registro completo de variables en `.env.local` y en Vercel: nombre, propósito, dónde se usa. Evita pérdida de contexto entre sesiones.
**Prioridad:** P3
**Estado:** Activo
**Fecha:** 06/04/2026
**Dependencias:** Ninguna

---

**S-IN-05**
**Título:** Construir corpus/documentos/decisiones_arquitecturales.md
**Descripción:** Reconstruir las decisiones de diseño tomadas chat por chat, desde el inicio del proyecto. Para cada decisión: qué se decidió, por qué, y qué alternativas se descartaron. Luego mantener al cierre de cada sesión técnica. Garantiza que cualquier Duende futuro pueda entender el criterio detrás del código, no solo el código.
**Prioridad:** P2
**Estado:** Activo
**Fecha:** 06/04/2026
**Fecha límite:** 17/04/2026 (EDHUCA)
**Dependencias:** Ninguna

---

**S-IN-01**
**Título:** Configurar GitHub Action
**Descripción:** `.github/workflows/corpus-update.yml` para automatización del corpus. Reduce la fricción de commitear archivos manualmente.
**Prioridad:** P3
**Estado:** Activo
**Fecha:** 29/03/2026
**Dependencias:** Ninguna

---

**S-IN-02**
**Título:** Verificar /corpus-form en producción
**Descripción:** Confirmar que el formulario commitea correctamente desde Vercel con GITHUB_TOKEN activo.
**Prioridad:** P3
**Estado:** Activo
**Fecha:** 30/03/2026
**Dependencias:** Ninguna

---

## Subcategoría: Aplicación

---

**S-AP-01**
**Título:** Migrar `arquitectura_paradigma_aleph.html` a Next.js
**Descripción:** Crear `app/arquitectura/page.tsx` y deployar en Vercel. Actualmente el HTML existe como archivo standalone.
**Prioridad:** P4
**Estado:** Activo
**Fecha:** 30/03/2026
**Dependencias:** Ninguna

---

**S-AP-02**
**Título:** Generar `consejo_asesor.html`
**Descripción:** Página standalone interactiva similar a `arquitectura_paradigma_aleph.html`, para convocar al Consejo Asesor sin fricción desde cualquier sesión.
**Prioridad:** P4
**Estado:** Activo
**Fecha:** 30/03/2026
**Dependencias:** Ninguna

---

**S-AP-03**
**Título:** Exportar diagrama de arquitectura como SVG descargable
**Descripción:** Versión vectorial del diagrama para uso externo y presentaciones (IAC 2026).
**Prioridad:** P4
**Estado:** Activo
**Fecha:** 30/03/2026
**Dependencias:** Ninguna

---

**S-AP-05**
**Título:** Documentar mapa de rutas de la aplicación
**Descripción:** Tabla con todas las rutas activas: ruta, propósito, tipo de acceso (público / autenticado / solo Arquitecto). Referencia rápida para sesiones técnicas y para el Duende.
**Prioridad:** P3
**Estado:** Activo
**Fecha:** 06/04/2026
**Dependencias:** Ninguna

---

**S-AP-06**
**Título:** Mapa del Momento con señales débiles agregadas
**Descripción:** Incorporar las señales débiles más recientes al Mapa del Momento. Actualización visual y conceptual del estado del sistema.
**Prioridad:** P4
**Estado:** Activo
**Fecha:** 09/04/2026
**Dependencias:** Ninguna

---

**S-AP-07**
**Título:** Ficha Aleph con los 8 estados vitales
**Descripción:** Documento/ficha de referencia rápida con los 8 estados vitales (Latente → Ecosistémico), sus definiciones, funciones y señales de transición. Para uso en sesiones y como referencia del Duende.
**Prioridad:** P4
**Estado:** Activo
**Fecha:** 09/04/2026
**Dependencias:** Ninguna

---

**S-AP-04**
**Título:** Materiales adicionales Quanam para IAC 2026
**Descripción:** Materiales adicionales a partir del collage `quanam_ia_collage.html` ya construido. Definir qué más se necesita para la convocatoria "Por este camino 2026".
**Prioridad:** P3
**Estado:** Activo
**Fecha:** 04/04/2026
**Dependencias:** Ninguna

---

**S-IN-07**
**Título:** Redis para rate limiting en producción
**Descripción:** El rate limiting actual usa un Map en memoria que se resetea con cada cold start de Vercel. Para producción a escala usar Upstash Redis.
**Prioridad:** P4
**Estado:** Activo
**Fecha:** 07/04/2026
**Dependencias:** Ninguna

---

## Archivo histórico

*Pendientes Soma completados · Preservados como registro del proceso*

---

**S-HIS-01 — Infraestructura Anthropic configurada** · Completado 30/03/2026
Cuenta Anthropic activa · API key `casa-soma` · SDK instalado · ANTHROPIC_API_KEY en .env.local y Vercel · tabla `duende_chats` en Supabase con RLS.

**S-HIS-02 — Sistema B explorado** · Completado 29/03/2026
Payload CMS + PostgreSQL + Next.js · 16 colecciones · schema completo relevado y documentado en `arquitectura_soma.md`.

**S-HIS-03 — arquitectura_paradigma_aleph.html construido** · Completado 30/03/2026
Diagrama interactivo standalone navegable. Commiteado al repositorio.

**S-HIS-04 — Reestructura arquitectural ejecutada** · Completado 06/04/2026
Las tres propuestas aprobadas implementadas: `senales_activas.md` + `senales_incorporadas.md` + `pendientes_soma.md` + `pendientes_corpus.md` + nuevo template status + SESION.md actualizado + protocolos actualizados.

**S-HIS-05 — Pestaña Resonancias Quanam IHA Lab 2026** · Completado 06/04/2026
Pestaña visible solo en Quanam IHA Lab, mostrando respuestas agrupadas por lente sin nombre ni email. Funcionando con datos reales (Leonardo y Ana).

**S-HIS-06 — Panel /admin con respondentes y contactos** · Completado 06/04/2026
Página protegida por auth + email del Arquitecto. Sección A: respondentes con detalle expandible por persona. Sección B: contactos Aleph con columna origen.

**S-HIS-07 — Fix Cognoesfera cargando infinito** · Completado 06/04/2026
En Next.js 16, `params` es una Promise. `params.id` devolvía `undefined` → query Supabase sin resultado → estado loading permanente. Fix: `useParams()` hook + `<Suspense>` para `useSearchParams`.

**S-HIS-08 — Cookie y Enter en bienvenida Quanam** · Completado 06/04/2026
Campos nombre/email precargados desde cookie al montar. Focus automático en email cuando nombre ya está cargado, para que Enter funcione sin interacción previa.

**S-HIS-09 — Navegación consistente ← Volver + Salir** · Completado 06/04/2026
Todas las páginas interiores tienen "← Volver" (→ /dashboard) y "Salir" (signOut → /login) en posición consistente.

**S-HIS-10 — Renombrado de Cognoesferas** · Completado 06/04/2026
Quanam Lab → Quanam IHA Lab (código + Supabase). Menthor → IHA - Menthor: Comunidad de Práctica (Supabase).


**S-HIS-12 — Migración UUID edgardo completada** · Completado 08/04/2026
FK constraint resuelto con DROP/UPDATE/RESTORE. id 'edgardo' migrado a UUID real. Membresias actualizadas. Admin funcionando.

**S-HIS-13 — OTP en convocatoria Quanam** · Completado 08/04/2026
Flujo email → OTP → acceso en /quanam-ia-2026. Nombre eliminado. Aviso spam. Tabla convocatoria_accesos creada. Log de accesos en /admin.

**S-HIS-14 — Middleware protege todas las rutas autenticadas** · Completado 08/04/2026
/dashboard, /cognoesfera/*, /corpus-form, /duende protegidas server-side. createBrowserClient fix: sesión en cookies, middleware funciona.

**S-HIS-15 — Consolidación cliente Supabase** · Completado 08/04/2026
lib/supabase.ts eliminado. Un solo cliente en app/lib/supabase.ts con createBrowserClient de @supabase/ssr.

**S-HIS-16 — Archivos adjuntos en el Duende** · Completado 09/04/2026
Botón + en DuendeChat y DuendeFragmento. Soporte imágenes (JPEG, PNG, GIF, WebP) y PDFs vía FileReader + Anthropic content blocks. Tabla archivos_curaduria creada. Panel de curación en /admin con estados (pendiente/aprobado/descartado/señal), notas del curador y acciones.

**S-HIS-17 — Fix OTP emails nuevos** · Completado 09/04/2026
createUser con email_confirm:true antes de signInWithOtp para garantizar que cualquier email reciba OTP de 6 dígitos. send-otp route reemplazado de createBrowserClient a createClient estándar (server-side).

**S-HIS-18 — Resonancias muestra conversaciones Duende** · Completado 09/04/2026
La sección Resonancias en /cognoesfera/[id] ahora lee de duende_chats agrupadas por contexto_origen (lente), mostrando el primer mensaje del usuario en cada conversación sin nombre ni email.

**S-HIS-11 — Duende real activado** · Completado 07/04/2026
API route `app/api/duende/route.ts` + página `app/duende/page.tsx`. Cadena completa: interfaz → Anthropic claude-sonnet-4-6 → Supabase duende_chats → usuario. System prompt con Corpus Madre condensado. Build limpio, sin errores TS.

**S-HIS-19 — Fix OTP validación estándar** · Completado 11/04/2026
Errores diferenciados por código (expirado / incorrecto / genérico), trim en token, max 6 chars, estado de carga en botón Verificar, foco automático al textarea del token. UX robusta y sin fricciones.

**S-HIS-20 — Modal del Duende flotante centrado** · Completado 11/04/2026
DuendeChat y DuendeFragmento con modal centrado sobre overlay oscuro vía createPortal. Botón dinámico: "Profundizar con el Duende" (sin historial) / "Retomar conversación" (con historial). zIndex: 350 sobre modales de contexto.

**S-HIS-21 — Persistencia del historial por lente y por fragmento** · Completado 11/04/2026
/api/duende/history devuelve historial agrupado por contexto_origen. Al abrir el Duende se carga el historial previo y se obtiene el sesion_id para UPDATE en lugar de INSERT. historyLoaded guard previene envío prematuro.

**S-HIS-22 — Sistema de iniciativas completo** · Completado 11/04/2026
Tablas `iniciativas` + `intereses_iniciativas` en Supabase. API /api/admin/iniciativas (GET/POST/PATCH con auth). Panel /admin: edición inline, toggle visible_convocatoria, dropdown responsable desde accesosConv. API pública /api/iniciativas-publicas. Convocatoria: lista dinámica desde Supabase. Detección de interés por keyword matching al cerrar modal del Duende.

**S-HIS-23 — Persistencia de sesión 7 días** · Completado 11/04/2026
supabase.auth.getSession() al montar la página detecta sesión activa en cookies. Si hay sesión válida, salta directamente al contenido sin mostrar formulario de login/OTP. handleVerifyOtp usa cliente compartido. Refresh token válido 7 días por defecto.

---

*Pendientes Casa Soma · Paradigma Aleph · Actualizado 11/04/2026*
*Para pendientes conceptuales, ver: `pendientes_corpus.md`*
