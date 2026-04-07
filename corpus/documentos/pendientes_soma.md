# Pendientes Casa Soma
*Pendientes técnicos, operativos e infraestructura del paradigma*
*Reemplaza la sección A6 de SESION.md para los pendientes SOMA*
*Paradigma Aleph · Reestructurado 06/04/2026*
*Pendientes activos al 07/04/2026: 13*

---

## Schema

Cada pendiente registra: **ID · Título · Descripción · Prioridad · Estado · Fecha · Dependencias**

**Prioridades:** P1 (urgente / fecha límite) · P2 (próxima sesión) · P3 (esta semana) · P4 (este mes) · P5 (horizonte)
**Estados:** Activo · En pausa · Bloqueado · En progreso
**Subcategorías:** Duende · Base de datos · Infraestructura · Aplicación

---

## Subcategoría: Duende

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

**S-AP-04**
**Título:** Materiales adicionales Quanam para IAC 2026
**Descripción:** Materiales adicionales a partir del collage `quanam_ia_collage.html` ya construido. Definir qué más se necesita para la convocatoria "Por este camino 2026".
**Prioridad:** P3
**Estado:** Activo
**Fecha:** 04/04/2026
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

**S-HIS-11 — Duende real activado** · Completado 07/04/2026
API route `app/api/duende/route.ts` + página `app/duende/page.tsx`. Cadena completa: interfaz → Anthropic claude-sonnet-4-6 → Supabase duende_chats → usuario. System prompt con Corpus Madre condensado. Build limpio, sin errores TS.

---

*Pendientes Casa Soma · Paradigma Aleph · Reestructurado 06/04/2026*
*Para pendientes conceptuales, ver: `pendientes_corpus.md`*
