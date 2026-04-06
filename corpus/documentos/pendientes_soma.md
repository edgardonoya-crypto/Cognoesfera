# Pendientes Casa Soma
*Pendientes técnicos, operativos e infraestructura del paradigma*
*Reemplaza la sección A6 de SESION.md para los pendientes SOMA*
*Paradigma Aleph · Reestructurado 06/04/2026*

---

## Schema

Cada pendiente registra: **ID · Título · Descripción · Prioridad · Estado · Fecha · Dependencias**

**Prioridades:** P1 (urgente / fecha límite) · P2 (próxima sesión) · P3 (esta semana) · P4 (este mes) · P5 (horizonte)
**Estados:** Activo · En pausa · Bloqueado · En progreso
**Subcategorías:** Duende · Base de datos · Infraestructura · Aplicación

---

## Subcategoría: Duende

---

**S-DU-01**
**Título:** Crear API route `/api/duende`
**Descripción:** Endpoint server-side que recibe el mensaje del usuario y llama a la Anthropic API con el SDK instalado. El Duende cobra vida en la aplicación.
**Prioridad:** P2
**Estado:** Activo
**Fecha:** 30/03/2026
**Dependencias:** Infraestructura Anthropic ✅ configurada (API key, SDK, ANTHROPIC_API_KEY en Vercel)

---

**S-DU-02**
**Título:** Crear página `/duende`
**Descripción:** Interfaz de conversación con el Duende real: campo de texto, respuesta en tiempo real, historial en `duende_chats`.
**Prioridad:** P2
**Estado:** Activo
**Fecha:** 30/03/2026
**Dependencias:** S-DU-01

---

**S-DU-03**
**Título:** Prueba end-to-end del Duende real
**Descripción:** Confirmar que la cadena completa opera: interfaz → API route → Anthropic → Supabase → usuario.
**Prioridad:** P2
**Estado:** Activo
**Fecha:** 30/03/2026
**Dependencias:** S-DU-01 · S-DU-02

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

---

*Pendientes Casa Soma · Paradigma Aleph · Reestructurado 06/04/2026*
*Para pendientes conceptuales, ver: `pendientes_corpus.md`*
