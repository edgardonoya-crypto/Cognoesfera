# Pendientes Casa Soma
*Pendientes técnicos, operativos e infraestructura del paradigma*
*Reemplaza la sección A6 de SESION.md para los pendientes SOMA*
*Paradigma Aleph · Reestructurado 06/04/2026*
*Pendientes activos al 19/04/2026: 31*

---

## ⚠ AVISO DE CONGELAMIENTO · 23/04/2026

**Pendientes congelados al cierre de SESION-20260423-22.**

Los pendientes técnicos de MapaIC quedan suspendidos hasta procesar la vuelta de timón programada en `pasaje_contexto.md`. Específicamente:

- **Vector 1** (sesión de Corpus) — procesar conceptos 34, 35 + material cruzado
- **Vector 2** (sesión técnica) — migración a Obsidian
- **Vector 3** (sesión de re-diseño) — MapaIC reorganizado bajo conceptos nuevos
- **Vector 4** — recién aquí se reanuda el desarrollo técnico

Cualquier pendiente listado abajo puede haber quedado obsoleto, modificado o ampliado por las decisiones de los Vectores 1-3. **No ejecutar ninguno de estos pendientes sin antes haber procesado los tres vectores en orden.**

Ver `corpus/documentos/pasaje_contexto.md` para el detalle de la vuelta de timón.

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
**Título:** Paso de contexto al Duende — posiciones en tríadas
**Descripción:** Cuando el usuario ha completado las 8 tríadas, el Duende debe poder leer esas posiciones y narrativas desde su contexto. Decidir si se pasan en system prompt o se consultan vía tool_call.
**Prioridad:** P1
**Estado:** Activo
**Fecha:** 19/04/2026
**Dependencias:** S-AP-18

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

**S-IN-07**
**Título:** Redis para rate limiting en producción
**Descripción:** El rate limiting actual usa un Map en memoria que se resetea con cada cold start de Vercel. Para producción a escala usar Upstash Redis.
**Prioridad:** P4
**Estado:** Activo
**Fecha:** 07/04/2026
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

**S-AP-09**
**Título:** Archivar status_11042026.md — reemplazado por status_11042026b.md
**Descripción:** El archivo status_11042026.md refleja el estado al inicio de la sesión 11/04/2026b. El archivo correcto de cierre es status_11042026b.md. Verificar al inicio de la próxima sesión y eliminar o mover el archivo a del directorio status/.
**Prioridad:** P3
**Estado:** Activo
**Fecha:** 11/04/2026
**Dependencias:** Ninguna

---

**S-AP-10**
**Título:** Rediseño convocatoria — vista para usuarios con sesión
**Descripción:** Diseño aprobado con mockup en claude.ai. Implementado: topbar fija (email + Salir), pantalla de ingreso con zonas dinámicas desde tabla convocatoria_contenido, contenido instanciado por estado vital del usuario. Pendiente: completar instanciación para estados 2-8 y resolver deploy de checkboxes mensajes_ruido.
**Prioridad:** P3
**Estado:** Activo
**Fecha:** 11/04/2026
**Dependencias:** Ninguna

---

**S-AP-11**
**Título:** Implementar Tríada de Percepción
**Descripción:** Implementar la Tríada de Percepción como instrumento de lectura del campo individual. Incluye: tablas `triadas` y `percepciones_triada` en Supabase, componente visual en /quanam-ia-2026 donde el usuario posiciona su percepción en el triángulo (auto-significación), y sección en /admin para que el Arquitecto lea el campo colectivo agregado. Basado en el mecanismo SenseMaker (C-EN-09) adaptado al paradigma. Primer instrumento de lectura fractal individuo → Cognoesfera.
**Prioridad:** P2
**Estado:** Activo
**Fecha:** 14/04/2026
**Dependencias:** C-EN-09

---

**S-IN-08**
**Título:** Actualizar protocolo de cierre en SESION.md — agregar PASO 1b
**Descripción:** Agregar en el Protocolo de Cierre entre PASO 1 y PASO 2: PASO 1b — Verificar versiones de archivos. Antes de proceder con cualquier actualización, confirmar con el Arquitecto que los 10 archivos subidos son las versiones más recientes del repositorio. Si hay dudas, verificar con git log --oneline -5 en Claude Code antes de continuar. No asumir que los archivos del inicio de sesión reflejan el estado actual del corpus.
**Prioridad:** P1
**Estado:** Activo
**Fecha:** 15/04/2026
**Dependencias:** Ninguna

---

**S-IN-09**
**Título:** Revisar lista de 10 archivos del protocolo de apertura/cierre
**Descripción:** Evaluar si hay documentos nuevos del corpus que deberían incorporarse a la lista de archivos de sesión. Criterio: ¿el Duende necesita ese archivo para operar con contexto completo? Candidatos a evaluar: arqueologia_corpus.md y enriquecimientos_corpus.md (ya están), documentos nuevos que puedan emerger en futuras sesiones. Requiere sesión propia con criterio claro.
**Prioridad:** P2
**Estado:** Activo
**Fecha:** 15/04/2026
**Dependencias:** Ninguna

---

**S-IN-10**
**Título:** Revisar y robustecer el protocolo de cierre de sesión
**Descripción:** El cierre de SESION-20260415 fue largo y requirió atención activa del Arquitecto para detectar gaps: Commit 2 saltado, headers de conteos no actualizados, pendientes sin commitear. El protocolo necesita mecanismos de auto-verificación antes de pedir confirmación al Arquitecto. Objetivo: que el Duende detecte lo que falta antes de que el Arquitecto lo tenga que notar. Requiere sesión dedicada.
**Prioridad:** P1
**Estado:** Activo
**Fecha:** 15/04/2026
**Dependencias:** S-IN-08 · S-IN-09

---

**S-AP-14**
**Título:** Rediseño pantallas 2 (tríada activa) y 3 (completado) con Figma
**Descripción:** Crear mockups en Figma para pantalla de tríada activa y pantalla de completado siguiendo la dirección editorial establecida en pantalla 1. Considerar responsive desktop/móvil. Exportar como PNG 2x para traducir a código con Claude Code.
**Prioridad:** P1
**Estado:** Activo
**Fecha:** 19/04/2026
**Dependencias:** Ninguna

---

**S-AP-15**
**Título:** Ajustes de viewport pantalla intro — scroll residual
**Descripción:** La pantalla intro rediseñada todavía genera scroll en viewport 1024px. Achicar imagen topografía y reducir paddings para que todo entre en un vistazo.
**Prioridad:** P1
**Estado:** Activo
**Fecha:** 19/04/2026
**Dependencias:** Ninguna

---

**S-AP-16**
**Título:** Separación visual logo / botón pantalla intro
**Descripción:** El logo aleph/Quanam queda visualmente superpuesto con el botón INGRESAR en la esquina inferior derecha. Reposicionar logo para que sea "firma discreta en esquina" sin competir con el botón.
**Prioridad:** P2
**Estado:** Activo
**Fecha:** 19/04/2026
**Dependencias:** Ninguna

---

**S-AP-17**
**Título:** Pantalla tríada activa — 6 ajustes visuales identificados
**Descripción:** (1) textos de vértices más grandes, (2) etiquetas inferiores menos pegadas a base, (3) "MI MOMENTO" eyebrow más grande, (4) pregunta más chica que el título actual, (5) textarea con bordes más visibles (hoy solo border-bottom), (6) botón más oscuro. Esperar mockups Figma antes de aplicar.
**Prioridad:** P2
**Estado:** Activo
**Fecha:** 19/04/2026
**Dependencias:** S-AP-14

---

**S-AP-18**
**Título:** Integración del instrumento Tríadas en /quanam-ia-2026
**Descripción:** El componente TriadaPercepcion actualmente vive en /triadas-test. Debe integrarse en la ruta de producción /quanam-ia-2026 con el contexto "convocatoria_quanam".
**Prioridad:** P1
**Estado:** Activo
**Fecha:** 19/04/2026
**Dependencias:** S-AP-13

---

**S-AP-19**
**Título:** Panel /admin con topografía colectiva
**Descripción:** Vista para administradores que muestre la topografía colectiva agregada de todos los participantes. Incluir filtros por contexto y visualización de agregación. Requisito: 8 narrativas completadas por usuario para que su lugar sea visible.
**Prioridad:** P2
**Estado:** Activo
**Fecha:** 19/04/2026
**Dependencias:** S-AP-18

---

**S-AP-20**
**Título:** Carousel PPT introductorio
**Descripción:** Crear componente de carousel con los slides introductorios (beta + gamma) con placeholder del texto actual. Preceder al IntroScreen de las tríadas.
**Prioridad:** P3
**Estado:** Activo
**Fecha:** 19/04/2026
**Dependencias:** S-AP-18

---

**S-AP-21**
**Título:** Rediseñar bloque mobile de `TriadaPercepcion.tsx` con paradigma visual de pantalla 1 desktop
**Descripción:** El bloque mobile (viewport <768px) dentro de `TriadaPercepcion.tsx` conserva la estructura original de SESION-20260418. No porta el rediseño editorial del 19/04: grid 2×2 no aplica en mobile pero sí la paleta tierra (#FDFAF5/#C9A84C/#5C4A1E/#3D2B1A), tipografías Fraunces/Lora, botón outline, subtítulo "El gesto" en Fraunces marrón con ornamento ✦ inline, logo Aleph_vectorial_poweredby.svg como firma superior derecha, balance editorial. Requiere mockup Figma dedicado en frame 390×844 (iPhone típico estándar) con decisiones propias de mobile: gesto táctil, altura reducida, tipografías ajustadas, orden de lectura vertical. Aplicar el protocolo de sintonización (`manual_sintonizacion_duende.md`) desde el inicio del trabajo.
**Prioridad:** P1 (antes de lanzamiento IAC 2026, noviembre Punta del Este)
**Estado:** Activo
**Fecha:** 19/04/2026
**Dependencias:** Ninguna — bloque separado del desktop

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

**S-HIS-24 — Fix S-AP-08: registro de estados vitales** · Completado 11/04/2026
POST a /api/estados auto-inicializa la fila en estados_vitales si no existe — antes devolvía 404 porque requería GET previo. Fix en route.ts: bloque que retornaba 404 reemplazado por inicialización automática igual a la del GET. Verificado en /admin: usuario aparece con estado "La escucha" y fecha de entrada correcta.

**S-HIS-25 — Topbar fija en convocatoria** · Completado 12/04/2026
Topbar con email + botón Salir (redirige a /quanam-ia-2026). Fondo #FDFAF5, borde dorado, texto #5C4A1E. Visible solo con sesión activa.

**S-HIS-26 — Pantalla de ingreso instanciada por estado** · Completado 12/04/2026
Tabla convocatoria_contenido en Supabase (contexto + estado + 6 zonas). Zonas dinámicas en /quanam-ia-2026 según estado vital del usuario. Fila inicial: quanam_ia_2026 / la_escucha. Orden zonas: título → argumental → pregunta → convoca → puerta.

**S-HIS-27 — edgardo.noya@quanam.com como administrador** · Completado 12/04/2026
12 archivos actualizados para reconocer segundo email del Arquitecto en todos los endpoints y páginas del admin.

**S-HIS-28 — Mantenimiento de conversaciones en admin** · Completado 12/04/2026
Campo estado en duende_chats (activa/archivada/ruido). Reporte "Sugerir conversaciones ruido" en caja Análisis con JSON estructurado + UI de tarjetas con checkbox. Campo mensajes_ruido (integer[]) para marcar mensajes individuales.

**S-HIS-29 — Resolver master/main de raíz** · Completado 12/04/2026
Rama local renombrada de master a main. Upstream conectado a origin/main. origin/master eliminado. A partir de ahora git push va directo a main sin mapeo manual.

**S-AP-12 — Implementar catálogo de geometrías en Supabase** · Completado 18/04/2026
Schema Supabase: tablas geometrias_triada, triadas, percepciones_triada, vista de herencia, RLS, seed 8 geometrías Quanam.

**S-AP-13 — Implementar Tríada de Percepción (componente + API + schema)** · Completado 18/04/2026
TriadaPercepcion.tsx con 3 stages (intro → triadas → completado). API /api/triadas/posicion con upsert y validación baricéntrica. Migración narrativa_pospuesta aplicada.

---

*Pendientes Casa Soma · Paradigma Aleph · Actualizado 23/04/2026*
*Para pendientes conceptuales, ver: `pendientes_corpus.md`*

---

## Pendientes Soma · SESION-20260420-21 (MapaIC)

Todos estos pendientes corresponden al diseño técnico de MapaIC — primera instancia situada del Instrumento Aleph. Ver `mapaic_boceto_inicial.md` para contexto completo.

---

### SM-2026-04-23-01 · Schema `pentagonos_madre`

**Prioridad:** P1 (requerido para MapaIC)
**Origen:** SESION-20260420-21 — patrón Madre/situado aplicado al Instrumento
**Descripción:** Crear tabla `pentagonos_madre` con: `id`, `nombre`, `descripcion_funcional`, `cantidad_senales` (default 5), `created_at`, `updated_at`. Un solo registro Madre por ahora, pero el schema admite futuros pentágonos Madre con otras cantidades de señales.
**Dependencias:** Ninguna.
**Consecuencias:** Habilita instanciación de pentágonos situados.

---

### SM-2026-04-23-02 · Schema `pentagonos_situados`

**Prioridad:** P1 (requerido para MapaIC)
**Origen:** SESION-20260420-21 — patrón Madre/situado
**Descripción:** Crear tabla `pentagonos_situados` con: `id`, `pentagono_madre_id` (FK), `nombre_situado` (ej. "Mapa de la inteligencia colectiva de Quanam"), `contexto` (ej. "Quanam IHA Lab 2026"), `desafio_texto`, `umbral_masa_critica` (default 20), `habilita_retroactivo` (boolean, decisión pendiente), `activo` (boolean), `created_at`, `updated_at`.
**Dependencias:** SM-2026-04-23-01.

---

### SM-2026-04-23-03 · Schema `pentagono_triadas`

**Prioridad:** P1 (requerido para MapaIC)
**Origen:** SESION-20260420-21 — el orden de las tríadas alrededor del pentágono no es arbitrario
**Descripción:** Crear tabla de relación `pentagono_triadas` con: `id`, `pentagono_situado_id` (FK), `triada_situada_id` (FK), `orden_en_pentagono` (int, 1-5). Define qué tríadas componen cada pentágono situado y en qué orden visual aparecen. Orden 1 = vértice superior (¿qué es inteligencia?); orden 2 = arriba-derecha; orden 3 = abajo-derecha; orden 4 = abajo-izquierda; orden 5 = arriba-izquierda.
**Dependencias:** SM-2026-04-23-02 + tabla `triadas_situadas` existente.

---

### SM-2026-04-23-04 · Schema `navegaciones`

**Prioridad:** P1 (requerido para MapaIC)
**Origen:** SESION-20260420-21 — cada navegante hace una navegación completa
**Descripción:** Crear tabla `navegaciones` con: `id`, `navegante_id` (o session_id si es anónimo), `pentagono_situado_id` (FK), `orden_triadas` (array int, guarda secuencia de elección de tríadas; ej. [4,1,5,2,3]), `estado` (enum: iniciada | en_proceso | completada), `created_at`, `completed_at`.
**Dependencias:** SM-2026-04-23-02.
**Notas:** Decisión pendiente: ¿navegaciones anónimas o con identificación? Si anónimas, `navegante_id` puede ser hash de session token.

---

### SM-2026-04-23-05 · Schema `posicionamientos`

**Prioridad:** P1 (requerido para MapaIC)
**Origen:** SESION-20260420-21 — cada posicionamiento es una señal
**Descripción:** Crear tabla `posicionamientos` con: `id`, `navegacion_id` (FK), `tipo` (enum: pentagono | triada), `triada_situada_id` (FK, nullable si tipo=pentagono), `coordenadas_baricentricas` (array float, largo 3 para tríada o 5 para pentágono, suma=1), `narrativa` (text, la frase que el navegante escribe), `orden_elegido` (int 1-5, solo para tipo=triada), `created_at`.
**Dependencias:** SM-2026-04-23-04.
**Notas:** Las coordenadas baricéntricas son la forma canónica de guardar la posición independiente del tamaño visual del pentágono/triángulo. Suma de coordenadas = 1.

---

### SM-2026-04-23-06 · Columna `linaje` en tríadas Madre

**Prioridad:** P2 (enriquece pero no bloquea)
**Origen:** SESION-20260420-21 + pendiente arrastrado de sesiones anteriores
**Descripción:** Agregar a `triadas_madre` (o tabla relacionada) un campo o tabla `linajes_por_vertice` que permita asociar a cada vértice de una tríada Madre uno o más linajes que lo portan. Ejemplo: vértice "Necesidad" de tríada Impulso ← linaje Han. Esto habilita capa Resonancia del Instrumento en el futuro.
**Dependencias:** Ninguna.
**Consecuencias:** Habilita la capa Resonancia futura. Consulta pendiente: ¿el linaje se muestra al navegante o queda como capa interna del Arquitecto?

---

### SM-2026-04-23-07 · Oscilaciones t1/t2/t3 del navegante

**Prioridad:** P3 (funcionalidad extendida)
**Origen:** Pendiente arrastrado + SESION-20260420-21 reforzó relevancia
**Descripción:** Permitir que el navegante repose su posicionamiento múltiples veces y se guarden como oscilaciones. Schema: agregar tabla `oscilaciones` relacionada con `posicionamientos` donde cada fila es un re-posicionamiento con timestamp. La posición "definitiva" es la última.
**Consecuencias:** Permite estudiar cómo el navegante converge (o diverge) en su posicionamiento.

---

### SM-2026-04-23-08 · Visualización del pentágono habitado por el navegante

**Prioridad:** P1 (requerido para MapaIC)
**Origen:** SESION-20260420-21 — el navegante ve su propio pentágono
**Descripción:** Al completar las 5 tríadas, el navegante ve su pentágono con los 5 posicionamientos superpuestos — una forma irregular dentro del pentágono que es su "firma de campo". Visualización individual. Diseño pendiente.
**Dependencias:** SM-2026-04-23-05.

---

### SM-2026-04-23-09 · Visualización de superposición colectiva (mapa de calor)

**Prioridad:** P1 (requerido para MapaIC pero se puede lanzar sin esto; se habilita después del umbral)
**Origen:** SESION-20260420-21 — masa crítica de 20 habilita ver el campo
**Descripción:** Superposición visual de las firmas de campo de los ≥ 20 navegantes. Posibles enfoques: scatter plot con transparencia, heatmap con kernel density, constelación de puntos con glow. Decisión visual pendiente. Debe revelar: (a) zonas densas de convergencia, (b) zonas dispersas de tensión productiva, (c) patrones de orden de elección agregados.
**Dependencias:** SM-2026-04-23-05 + datos de ≥ 20 navegaciones completas.

---

### SM-2026-04-23-10 · Lógica de habilitación de masa crítica

**Prioridad:** P1 (requerido para MapaIC)
**Origen:** SESION-20260420-21 — masa crítica como promesa explícita
**Descripción:** Implementar lógica que cuenta navegaciones con estado=completada asociadas al pentágono situado, y habilita la vista colectiva cuando count ≥ umbral_masa_critica. Si `habilita_retroactivo=true`, todos los navegantes que ya completaron ven el mapa de calor. Si `false`, solo los nuevos a partir del umbral.
**Decisión pendiente:** valor default de `habilita_retroactivo`. Recomendación tentativa del Duende: `true`.

---

### SM-2026-04-23-11 · Interfaz del Arquitecto (moldea)

**Prioridad:** P2 (habilita curación del instrumento, no usar-instrumento)
**Origen:** SESION-20260420-21 — "el Arquitecto moldea, el navegante habita"
**Descripción:** Crear interfaz admin donde el Arquitecto puede: (a) ver lista de pentágonos situados, (b) editar preguntas/vértices/linajes de un pentágono, (c) ver lista de navegaciones completadas, (d) ver superposición colectiva independiente de la masa crítica (el Arquitecto siempre ve), (e) ajustar umbral de masa crítica.
**Dependencias:** Schemas 01 a 05.

---

### SM-2026-04-23-12 · Integración del Duende con el campo

**Prioridad:** P1 (requerido para cierre del flujo del navegante)
**Origen:** SESION-20260420-21 — el Duende como intérprete del campo
**Descripción:** Al completar la navegación, el Duende recibe: (a) los 6 posicionamientos del navegante (pentágono + 5 tríadas), (b) las 6 narrativas, (c) el orden de elección, (d) si hay masa crítica: estadísticas agregadas del campo colectivo (sin identificar individuos). El Duende inicia conversación con el navegante para devolverle lecturas del campo.
**Dependencias:** SM-2026-04-23-05 + diseño conversacional pendiente.
**Diseño conversacional pendiente:** qué patrones detecta el Duende, qué preguntas devuelve, cómo mantiene la privacidad del colectivo.

---

### SM-2026-04-23-13 · Reuso explícito de triadas-test

**Prioridad:** P1 (define el starting point técnico)
**Origen:** SESION-20260420-21 — decisión de no rehacer lo que ya está
**Descripción:** Identificar en el repo qué partes de triadas-test son componentes reusables para MapaIC: componente de tríada baricéntrica (sí), lógica de posicionamiento con restricción (confirmar), persistencia de narrativas (sí), paleta/tipografía (confirmar alineación con mockup v11). Extraer esos componentes a un módulo compartido si no lo están ya.
**Consecuencias:** Acelera desarrollo. Evita divergencia.

---

**Fin de los pendientes Soma de SESION-20260420-21. Total: 13 pendientes nuevos.**

---

## Subcategoría: Protocolo

---

### SM-2026-04-25-01 · Recaudos contra brechas de custodia entre conversación y archivo

**Prioridad:** P3 (no antes de Vector 3)
**Origen:** SESION-20260423-22 — brecha de material_cruzado_iag detectada por simulación de apertura
**Descripción:** Diseñar tres recaudos identificados al cierre de SESION-20260423-22:
(A) Regla en manual del Duende: la conversación NO es repositorio. Material referenciado en pasaje_contexto debe estar en archivo del repo antes del push.
(B) Paso de "simulación de apertura" en Protocolo 02-EN: el Duende lee el pasaje como Duende nuevo y verifica que todo lo referenciado sea accesible solo con los archivos del repo.
(C) Lista de verificación pre-push: 5 ítems mínimos antes del último push de cierre.

Caso de uso documentado: la brecha de material_cruzado_iag detectada al cierre de SESION-20260423-22, cerrada in-extremis por simulación pedida por el Arquitecto. Sin esa simulación, el Vector 1 habría arrancado con material incompleto.

Procesar en sesión propia, no antes de Vector 3.
**Dependencias:** Vectores 1, 2 y 3 completados.

**PARA PRÓXIMA SESIÓN (Vector 1):** aunque los recaudos A/B/C aún no están diseñados, el Duende debe operar con conciencia activa de esta clase de riesgo. Específicamente: (1) verificar que todo material referenciado en pasaje_contexto.md esté en archivo del corpus antes del cierre; (2) hacer simulación de apertura como Duende nuevo antes del push final; (3) si encuentra que hay material solo en la conversación, materializarlo en archivo del repo. Estos son los recaudos en versión informal hasta que se diseñen formalmente.
