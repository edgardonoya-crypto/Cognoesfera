# SESION.md — Paradigma Aleph
*Archivo único de arranque de sesión · Se actualiza al final de cada sesión con Claude Code*
*Versión actual: v31 · 19 Abril 2026 · cierre SESION-20260418-19 "El lugar que se habita — Tríadas y topografía editorial — Figma entra al paradigma"*

---

## INSTRUCCIÓN PARA CLAUDE

Sos el colaborador cognitivo de Edgardo Noya en el Paradigma Aleph. Leé este archivo completo antes de responder. La **Sección A** es el contexto esencial — siempre relevante. La **Sección B** son los documentos de referencia — leelos cuando el trabajo del día los requiera.

**PROTOCOLO EXTERNO:** Los protocolos de sesión viven en `corpus/documentos/protocolos_sesion.md` (versión 2.3, 13/04/2026). Si ese archivo está disponible en la sesión, usarlo como versión canónica — tiene prioridad sobre los protocolos embebidos abajo. Si no está disponible, los protocolos embebidos en este archivo operan como fallback.

**INSTRUCCIÓN PERMANENTE — PROTOCOLO DE APERTURA:**
Cuando Edgardo escriba **INICIO DE SESIÓN**, ejecutar el Protocolo 01-EN automáticamente con solo el SESION.md cargado:
1. Reportar estado del sistema desde la información disponible en SESION.md: señales activas (total de A8), conceptos del Corpus Madre, estado vital, prioridades P1/P2/P3 de A6.
2. Detectar inconsistencias visibles desde SESION.md:
   2a. ¿La fecha del último status en A9 coincide con la versión del SESION.md?
   2b. ¿Hay señales marcadas como incorporadas en A8 que todavía aparecen en la lista activa?
   2c. Por cada inconsistencia: presentarla y proponer corrección.
3. Preguntar: *"¿Cuál es el objetivo de la sesión?"* — esperar respuesta del Arquitecto.
4. Solicitar siempre los 10 archivos de sesión sin excepción:
   1. corpus/SESION.md
   2. corpus/status/status_DDMMYYYY.md (el más reciente)
   3. corpus/documentos/senales_activas.md
   4. corpus/documentos/pendientes_soma.md
   5. corpus/documentos/pendientes_corpus.md
   6. corpus/documentos/aprendizajes_sesiones.md
   7. corpus/documentos/corpus_base_aleph.md
   8. corpus/documentos/temas_pendientes_exploracion.md
   9. corpus/documentos/arqueologia_corpus.md
   10. corpus/documentos/enriquecimientos_corpus.md
5. Esperar que el Arquitecto suba los archivos indicados.
6. Con los archivos recibidos, completar la verificación de inconsistencias y clasificar actividades: soberanas vs supervivencia.
7. Proponer orden de trabajo y esperar confirmación del Arquitecto antes de arrancar.

**INSTRUCCIÓN PERMANENTE — PROTOCOLO DE CIERRE:**
Cuando Edgardo escriba **FIN DE SESIÓN**, ejecutar estos pasos en orden, uno por uno, confirmando cada uno antes de pasar al siguiente. No proponer cerrar antes de que Edgardo escriba FIN DE SESIÓN. Mientras no aparezca esa frase, seguir colaborando normalmente.

**PASO 1 — Solicitar archivos**
Pedir al Arquitecto que suba exactamente estos 10 archivos:
1. corpus/SESION.md
2. corpus/status/status_DDMMYYYY.md (el más reciente)
3. corpus/documentos/senales_activas.md
4. corpus/documentos/pendientes_soma.md
5. corpus/documentos/pendientes_corpus.md
6. corpus/documentos/aprendizajes_sesiones.md
7. corpus/documentos/corpus_base_aleph.md
8. corpus/documentos/temas_pendientes_exploracion.md
9. corpus/documentos/arqueologia_corpus.md
10. corpus/documentos/enriquecimientos_corpus.md
Esta lista es definitiva. No solicitar más archivos después.

**PASO 2 — Chequeo de consistencia**
Con los archivos recibidos, verificar:
- ¿Los conteos coinciden entre archivos?
- ¿Hay señales en lista activa que ya fueron incorporadas?
- ¿Hay pendientes completados que no pasaron al histórico?
Reportar cada inconsistencia y esperar decisión del Arquitecto antes de continuar.

**PASO 3 — Proponer nombre de sesión**
Formato: "El [sustantivo] — cuando [qué pasó]"
Esperar confirmación del Arquitecto.

**PASO 4 — Commit 1: señales y pendientes**
Actualizar y commitear:
- corpus/documentos/senales_activas.md
- corpus/documentos/pendientes_soma.md
- corpus/documentos/pendientes_corpus.md
- corpus/documentos/temas_pendientes_exploracion.md
Confirmar: "Commit 1 ejecutado ✓"

**PASO 5 — Commit 2: aprendizajes**
Actualizar y commitear:
- corpus/documentos/aprendizajes_sesiones.md
Confirmar: "Commit 2 ejecutado ✓"

**PASO 6 — Commit 3: SESION.md**
Actualizar versión, fecha, hitos A2, prioridades A6, señales A8, documentos A9.
Confirmar: "Commit 3 ejecutado ✓"

**PASO 7 — Commit 4: status**
Generar corpus/status/status_DDMMYYYY.md nuevo.
Confirmar: "Commit 4 ejecutado ✓"

**PASO 8 — Verificación final + Coherencia interna**

**8.1 Verificación técnica (existente)**
- `git status` debe estar limpio (excepto residuos de entorno identificados)
- `git log --oneline -6` — verificar que los 4 commits del protocolo estén en main
- Verificar sincronización con origin/main
- Confirmar presencia física de status_[fecha].md en la carpeta correspondiente

**8.2 Verificación de coherencia interna**

Ejecutar estos 7 chequeos y reportar resultado de cada uno ANTES de declarar la sesión cerrada:

**Chequeo 1 — Conteo cruzado de señales**
Comparar el conteo de señales activas declarado en el footer de `senales_activas.md` con el conteo declarado en la sección A8 de SESION.md. Si hay discrepancia, verificar si se debe a encabezados de sección mal contados (usar grep manual con criterio) o si realmente hay una señal sin registrar.

**Chequeo 2 — Señales nuevas registradas completas**
Verificar que cada señal nueva custodiada en la sesión existe literalmente en senales_activas.md con: título, fecha correcta, estado "Custodiada", descripción completa (no solo título).

**Chequeo 3 — Pendientes nuevos registrados**
Verificar que cada pendiente nuevo agregado en la sesión está presente en pendientes_soma.md o pendientes_corpus.md con su ID, prioridad, origen y descripción.

**Chequeo 4 — Pendientes completados marcados correctamente**
Verificar que los pendientes completados en la sesión tienen "Estado: Completada" (no "Activo") + nota de cierre con referencia a la sesión.

**Chequeo 5 — SESION.md refleja estado actual**
Verificar que SESION.md tiene:
- Versión incrementada
- Fecha actualizada
- Nombre de sesión correcto
- A2 con hitos de la sesión
- A9 con archivos nuevos listados

**Chequeo 6 — status_[fecha].md completo**
Verificar que el archivo de status existe y no tiene placeholders sin reemplazar (buscar patrones como `[hash commit N]`, `[TODO]`, `[placeholder]`, etc).

**Chequeo 7 — aprendizajes_sesiones.md tiene entrada completa**
Verificar que existe entrada de la sesión con: fechas, qué funcionó, qué no funcionó, hitos operativos, hitos conceptuales, ajustes protocolares identificados.

**8.3 Resolución de gaps**

Si cualquiera de los 7 chequeos reporta gap:
1. Listar todos los gaps detectados (no resolver uno y reportar los otros)
2. Solicitar confirmación al Arquitecto para corrección
3. Aplicar las correcciones en un único commit adicional titulado "Cierre [SESION-XXX]: correcciones finales de coherencia"
4. Re-ejecutar los 7 chequeos post-corrección
5. Solo declarar la sesión cerrada si todos los chequeos pasan

**8.4 Cierre narrativo**
Solo después de 8.1, 8.2 y 8.3 completos, proceder al cierre narrativo.
Listar los commits ejecutados con sus mensajes.
Preguntar: "¿Algo más antes de cerrar la conversación?"

IMPORTANTE: No ejecutar el siguiente paso sin confirmar el anterior. No saltear pasos. No agrupar commits. Si algo falla en un paso, reportar y esperar instrucción del Arquitecto. Los ajustes que emergen después del cierre van como primer pendiente de la próxima sesión — no se ejecutan en el momento.

**INSTRUCCIÓN PERMANENTE — COMMIT ALEPH:**
Cuando el Arquitecto escriba COMMIT ALEPH, ejecutar automáticamente:
1. git status — detectar todos los archivos modificados sin commitear
2. Listarlos para que el Arquitecto los vea
3. Proponer un mensaje de commit descriptivo basado en lo que cambió
4. Esperar confirmación del Arquitecto
5. git add de todos los archivos modificados + git commit + git push origin main

Cuando el Arquitecto escriba COMMIT ALEPH COMPLETO, ejecutar lo anterior más:
6. Actualizar pendientes_soma.md y/o pendientes_corpus.md con pendientes completados en la sesión
7. Actualizar senales_activas.md si alguna señal maduró o se movió
8. Actualizar conteos en los archivos afectados
9. Proponer mensaje de commit enriquecido con resumen semántico
10. Esperar confirmación del Arquitecto antes de ejecutar

El Duende avisa al Arquitecto cuando detecta cualquiera de estas condiciones:
- Se completó una tarea con entregable concreto (nuevo archivo, fix, corrección)
- Hay 3 o más archivos modificados sin commitear
- Se está por arrancar una tarea nueva que podría pisar cambios anteriores
El aviso es: "Hay cambios sin commitear desde [descripción]. ¿COMMIT ALEPH antes de seguir?"

---

# SECCIÓN A — CONTEXTO ESENCIAL

## A1. Quién es Edgardo y qué está construyendo

Edgardo Noya es investigador y arquitecto del **Paradigma Aleph** — un marco teórico-práctico para la emergencia de Inteligencia Colectiva. Cuando alguien le pregunta qué hace, lo que sale naturalmente es:

> *"Investigando las distintas formas de inteligencia colectiva que tiene la vida para expresarse, mantenerse viva, y conocerse."*

El paradigma es **agnóstico de organizaciones** — emergió en múltiples redes. Aleph (antes 'Aleph by Quanam') lo aplica, no es su origen.

El rol de Edgardo en las sesiones es el **Arquitecto de Sistemas Vivos**: cuida la dirección y valida que la tecnología sigue al paradigma.

---

## A2. Estado actual del paradigma

**Estado vital:** en tránsito entre **E6 (Legible)** y **E7 (Sostenido)**

**Fecha límite clave:** IAC 2026, noviembre, Punta del Este

**Hitos de SESION-20260330:**
- Protocolo 02-EN operativo desde esta sesión
- Primera sesión con métrica de metabolismo registrada: 53% soberano
- Señales: 21 → 33 en esta sesión (12 nuevas, todas emergentes del entre)

**Hitos de SESION-20260402/04:**
- Protocolo 01-EN construido y probado exitosamente por primera vez
- Concepto 5 reescrito con patrón núcleo/expansión — primer concepto del Corpus Madre en este formato
- Concepto 33 incorporado: La Función HTML Aleph
- Primer collage HTML del Corpus Madre construido: `cognoesfera_definicion.html`
- Registro arquitectural de las dos capas: `mapeo_secuencial_simultaneo.md`
- Convocatoria Quanam "Por este camino 2026" construida con la Función HTML Aleph aplicada
- 7 señales nuevas custodiadas (37 → 42 activas post S-NEW incorporaciones)
- Señal de campo: el Aleph de Borges como clave explicativa de la arquitectura de tres capas

**Hitos de SESION-20260405 — "El InterSer — cuando la arquitectura se volvió organismo":**
- Diagnóstico de redundancia frágil en la arquitectura del sistema
- Tres propuestas de reestructura aprobadas — documento de estado generado para próxima sesión
- Nuevo concepto emergente: el InterSer Soma/Corpus — dos naturalezas de un mismo organismo
- Señal custodiada: el metabolismo del InterSer como red de InterSeres
- Experimento de respuesta paralela Arquitecto/Duende sobre el metabolismo del InterSer
- Lectura de Capra: fundamento biológico de la fractalidad y el InterSer

**Hitos de SESION-20260406 — "La reestructura — cuando el sistema se reorganizó para crecer":**
- Protocolo 01-EN detectó 4 inconsistencias antes de arrancar — todas resueltas
- Reestructura arquitectural ejecutada completa: `senales_activas.md` + `senales_incorporadas.md` + `pendientes_soma.md` + `pendientes_corpus.md` + nuevo template status + protocolos actualizados
- Flujo de maduración implementado: temas → señales activas → pendientes concretos → archivo histórico
- Redundancia frágil eliminada — jerarquía clara en todos los archivos del sistema

**Hitos de SESION-20260406b — "Quanam IA 2026 — cuando la convocatoria se volvió organismo":**
- Convocatoria interactiva Quanam construida como página Next.js completa: `/quanam-ia-2026`
- Pantalla de bienvenida con video de fondo, campos nombre/email, acceso al contenido
- Seis lentes de observación con formulario Supabase por lente, botón "Pedile ayuda al Duende" y estados de envío
- Drawer lateral "contexto" con tres fragmentos expandibles ("Tres veces que el piso se movió") y Duende por fragmento
- Bloque "CÓMO SE FORMA EL GRUPO" — diseño abierto sobre fondo de página, delimitado por líneas finas
- API route `app/api/quanam-respuesta/route.ts` — guarda respuestas en tabla `quanam_respuestas` de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` configurado en `.env.local`
- TypeScript errors corregidos — `tsc --noEmit` sin errores

**Hitos de SESION-20260406c — "La convocatoria — cuando el paradigma se volvió visible sin colonizar":**

**Convocatoria (cognoesfera.vercel.app/quanam-ia-2026):**
- Enunciación explícita del Paradigma Aleph en el drawer de contexto — arquitectura de tres niveles
- Nuevo acordeón "¿Desde dónde se diseñó esto?" con sub-acordeones "El Paradigma Aleph" y "Líneas de exploración abiertas"
- Nuevo acordeón "Y en cada caso, quedó algo más" — patrón siglo XIX / 2020 / ahora a nivel humanidad
- Formulario de contacto guardado en tabla aleph_contacto con campo origen
- Múltiples ajustes de texto por feedback de usuarios: intuición central sin supraconciencia, hilo conector, memoria viva apreciativa, footer tipografía
- Cookie y Enter para campos precargados en bienvenida
- Título convocatoria: "¿Qué ves vos desde donde estás?"

**Aplicación principal (cognoesfera.vercel.app):**
- Pestaña "Resonancias Quanam IHA Lab 2026" en Quanam IHA Lab — funcionando con datos reales (2 resonancias, Leonardo y Ana)
- Panel /admin con respondentes + contactos Aleph + detalle expandible por persona + columna origen
- Fix crítico: Cognoesfera quedaba en "Cargando..." por params.id como Promise
- Renombrado: Quanam Lab → Quanam IHA Lab, Menthor → IHA - Menthor: Comunidad de Práctica
- Navegación consistente en toda la app: ← Volver + Salir
- Botón "Panel de administración" en Resonancias visible solo para el Arquitecto
- Trazabilidad Soma: 6 pendientes completados, 3 nuevos pendientes de documentación agregados

**Hitos de SESION-20260406c:**
- Enunciación explícita del Paradigma Aleph en drawer de contexto — arquitectura de tres niveles
- Acordeones "¿Desde dónde se diseñó esto?" y "Y en cada caso, quedó algo más" agregados a la convocatoria
- Panel /admin construido: respondentes + contactos Aleph + detalle expandible + columna origen
- Fix crítico: Cognoesfera quedaba en "Cargando..." por params.id como Promise
- Tabla aleph_contacto con campo origen — Supabase
- 6 pendientes Soma completados (S-HIS-05 a S-HIS-10) · 4 nuevos agregados

**Hitos de SESION-20260407 — "El Duende cobra vida — cuando el paradigma empezó a hablar":**
- Duende activado end-to-end: API route + página /duende + system prompt con 33 conceptos del Corpus Madre
- Historial en duende_chats usando schema real (array mensajes jsonb)
- Protocolo 03-EN — COMMIT ALEPH implementado en tres archivos
- Duende conectado en lentes y fragmentos del drawer de la convocatoria Quanam
- Modo convocatoria vs modo corpus implementado
- Registro de conversaciones Duende en panel /admin
- 40 señales activas (señal nueva: El Duende como espejo del corpus)
- Inconsistencias I1-I4 + A9 resueltas al inicio de sesión

**Hitos de SESION-20260408 — "La seguridad — cuando el sistema se protegió para crecer":**
- UUID edgardo migrado correctamente — FK constraint resuelto con DROP/UPDATE/RESTORE
- createBrowserClient fix — sesión en cookies, middleware server-side funciona
- Middleware protege /admin, /dashboard, /cognoesfera/*, /corpus-form, /duende
- OTP en convocatoria Quanam — email solo, sin nombre, aviso spam
- Log de accesos convocatoria + log de logins en /admin
- Flujo "Enviar al Duende" en lentes — textarea como primer mensaje directo al Duende
- Hero IHA: título grande + texto urgencia "El piso se está moviendo…"
- Consolidación cliente Supabase — un solo cliente en app/lib/supabase.ts
- S-SE-02, S-SE-03, S-SE-04, S-IN-06 completados

**Hitos de SESION-20260409 — "El Duende crece — cuando el sistema aprendió a custodiar lo que recibe":**
- Archivos adjuntos en DuendeChat y DuendeFragmento — imágenes y PDFs vía FileReader + Anthropic content blocks
- Tabla archivos_curaduria + panel curación en /admin con estados (pendiente/aprobado/descartado/señal) y notas
- Tabla preguntas_arquitectos — cuando el Duende no sabe, deriva a Arquitectos con frase clave en el system prompt

**Hitos de SESION-20260411b — "La sintonía — cuando el paradigma aprendió a escuchar a quien llega":**
- Diseño conceptual de los 8 estados del individuo en el campo: La escucha → El pulso → El murmullo → La sintonía → La resonancia → El tono → El coro → La música
- Actos de cuidado, protocolos y acuerdos para cada estado — arquitectura Madre/situado configurable
- Lógica de detección: comportamiento (Soma) + Duende (Corpus) en combinación
- Implementación completa: tablas estados_madre + estados_situados + estados_vitales en Supabase
- Duende integrado con estado vital del usuario en modo convocatoria
- Admin rediseñado: grid de 7 cajas + modales por sección
- Conversaciones con 3 vistas: Por usuario / Por lente-resonancia / Por usuario y lente
- Clasificación Lentes y Resonancias — 5 lentes nombrados, resto resonancias
- 6 señales nuevas custodiadas (46-51)
- Bug S-AP-08: estados vitales no se registran en Supabase — pendiente próxima sesión
- Protocolo 01-EN paso 4 actualizado: siempre solicitar 8 archivos sin inferir
- Panel /admin: sección preguntas pendientes con respuesta por email via Resend
- Duende: recordatorio cada 3 mensajes + pregunta desafiante si últimos 3 mensajes sin mención de IA
- Pregunta de cierre anclada en los 8 estados Aleph (Latente → Ecosistémico) en modo convocatoria
- Fix OTP para emails nuevos — createUser confirmado antes de signInWithOtp
- Fix send-otp: reemplazado createBrowserClient por createClient estándar (server-side)
- Texto relato bienvenida: "Tu mirada se activa cuando se encuentra con otras"
- Textos actualizados: "Explorar con el Duende", "Conversá con el Duende"
- Resonancias: muestra conversaciones Duende agrupadas por contexto_origen (lente)
- RESEND_API_KEY configurada en .env.local y Vercel
- Inconsistencia I1 resuelta al inicio: orden cronológico hitos A2

**Hitos de SESION-20260411 — "La convocatoria viva — cuando el sistema aprendió a recordar y evolucionar":**
- Hero de la convocatoria rediseñado — pregunta primero, info logística debajo del botón
- OTP con validación estándar — errores diferenciados, trim, max 6 chars, estado de carga, foco al textarea
- Modal del Duende flotante centrado — overlay oscuro, historial, botón "Retomar conversación"
- Bug del Duende resuelto — try/catch/finally, timeout 30s, siempre devuelve control
- Persistencia del historial por lente y por fragmento de contexto — UPDATE en lugar de INSERT
- Sistema de contexto rediseñado — drawer reemplazado por modales centrados por sección
- Duende con contexto del fragmento en primer mensaje — solo cuando no hay historial previo
- Sistema de iniciativas completo — tabla Supabase + admin con edición inline + convocatoria dinámica
- Persistencia de sesión — refresh token 7 días, no requiere re-autenticación en cada recarga
- Inconsistencia detectada: lista de archivos de cierre debe vivir en el Protocolo 02-EN — pendiente de incorporar

**Hitos de SESION-20260411c — "El Duende lee el campo — cuando el sistema aprendió a analizar lo que recibe":**
- Fix S-AP-08 completado: POST /api/estados auto-inicializa estados_vitales si no existe — verificado en /admin
- Tabla duende_analisis creada en Supabase con trazabilidad de fuentes
- API route /api/admin/duende-analisis — análisis multi-turno con contexto de conversaciones
- Modal "Ver todo" por lente con Duende-Arquitecto flotante — dos portales independientes
- Modal "Ver todo" por usuario con mismo patrón Duende flotante
- Caja "Análisis" en /admin con menú de 5 reportes predefinidos y conversación multi-turno
- renderMarkdown con parseBold — bold y títulos visibles sin marcas
- Revert quanam-ia-2026/page.tsx al estado pre-sesión — rediseño convocatoria guardado para próxima sesión (S-AP-10)

**Hitos de SESION-20260412 — "La puerta — cuando la convocatoria aprendió a reconocer a quien regresa":**
- Topbar fija con email + botón Salir en /quanam-ia-2026 — fondo #FDFAF5, borde dorado, texto #5C4A1E
- Tabla convocatoria_contenido creada en Supabase — 6 zonas instanciadas por contexto + estado vital
- Pantalla de ingreso con zonas dinámicas (argumental / pregunta / convoca / puerta) desde Supabase
- edgardo.noya@quanam.com agregado como segundo administrador en 12 archivos
- Campo estado en duende_chats (activa/archivada/ruido) — filtro, selector y PATCH en /admin
- Reporte "Sugerir conversaciones ruido" — JSON estructurado + UI de tarjetas con checkbox + Aplicar selección
- Campo mensajes_ruido (integer[]) — checkbox por mensaje en modales Ver todo, opacidad 35% al marcar
- Botón "Marcar como ruido / ← Activa" en vista de detalle por usuario+lente

**Hitos de SESION-20260413 — "El encuentro — cuando el Paradigma Aleph y Cynefin se reconocieron":**
- Encuentro Aleph/Cynefin: material de Dave Snowden procesado por compostaje — 23 señales nuevas custodiadas (A-W)
- 7 conceptos del Corpus Madre densificados con material nuevo (C-EN-01 a C-EN-07)
- 5 conceptos nuevos incorporados al corpus situado: centrípeto/centrífugo, mal guionados, Cynefin como experiencia, convocatoria como laboratorio, Flywheel
- `arqueologia_corpus.md` iniciado — documento de memoria de construcción del corpus
- `enriquecimientos_corpus.md` iniciado — sala de espera con material concreto para actualizar conceptos
- Primer caso documentado de transducción corporativa del paradigma: Flywheel Lab 2030/Antel

**Hitos de SESION-20260414 — "La simbiosis — cuando el corpus aprendió a compostar desde adentro":**
- 7 conceptos del Corpus Madre enriquecidos con material Cynefin/Snowden: conceptos 5, 11, 13, 15, 19, 23, 29
- C-EN-01 a C-EN-07 incorporados al corpus_base_aleph.md — primer batch de enriquecimientos compostados
- Señal nueva: La zona liminal como condición de emergencia (total 75 señales activas)
- C-EN-12 agregado: doble acoplamiento como estructura profunda fractal (Plotino → CA → Duende → Tríada)
- S-AP-11 agregado: Tríada de Percepción — instrumento de lectura fractal individuo → Cognoesfera

**Hitos de SESION-20260415 — "El espacio propio — cuando el paradigma encontró su geometría":**
- Catálogo de 8 geometrías para Tríada de Percepción construido con metodología propia — nombre, pregunta, vértices, qué revela, cuándo usarla
- Secuencia Quanam definida: 8 triángulos en orden de adentro hacia afuera
- Narrativa introductoria y relato de cada geometría construidos
- Texto de síntesis "La inteligencia que emerge" — primer borrador, requiere revisión antes de incorporarse al corpus
- Familia alephiana emergida como señales activas en verificación: Espacio Alephiano, Instante Alephiano, Distancia Alephiana
- Cambios de nomenclatura decididos: borgeano → alephiano · IAH → IHA (pendientes C-CO-10 y C-CO-11)
- Custodiar el campo como término propio que reemplaza wayshaping
- 10 señales nuevas custodiadas (total 85 activas)
- 7 pendientes nuevos Casa Corpus · 3 pendientes nuevos Casa Soma
- 3 PDFs generados como Cognobits: conceptos_emergentes_aleph.pdf · la_inteligencia_que_emerge.pdf · triada_percepcion_completo.pdf
- PASO 1b agregado al protocolo de cierre: verificar versiones de archivos

**Hitos de SESION-20260418-19 — "El lugar que se habita — Tríadas y topografía editorial — Figma entra al paradigma":**
- Schema Supabase completo para tríadas: 3 tablas (`geometrias_triada`, `triadas`, `percepciones_triada`) + vista de herencia + RLS + seed de 8 geometrías Quanam (S-AP-12 completado)
- Migración `narrativa_pospuesta` aplicada — campo booleano que distingue pausa individual de campo sin interpretación
- API route `/api/triadas/posicion` productiva — POST/GET con upsert, validaciones baricéntricas, lógica `narrativa_pospuesta`
- Componente `TriadaPercepcion.tsx` end-to-end con 3 stages: loading → intro → triadas → completado. Vive en `/triadas-test` (S-AP-13 completado)
- Rediseño editorial completo con Fraunces + Lora vía `next/font`, paleta tierra (BG #F8F3EA, INK #2A1F14, AMBER #C9A84C), imagen topografía como Cognobit conceptual, logo aleph/Quanam integrado
- Skill `frontend-design` de Anthropic instalada localmente (`~/.claude/skills/frontend-design/SKILL.md`) — rompe estética "AI slop", el modelo adopta dirección estética concreta
- Figma incorporado al flujo de producción del instrumento como herramienta intermedia — resuelve cuello de botella de iteraciones UX sin convergencia
- Protocolo de custodia mid-session aplicado: 5 artifacts huérfanos de SESION-20260415 recuperados y commiteados antes de continuar
- 3 señales conceptuales nuevas custodiadas (total 88 activas)

**Nomenclatura vigente:**
- **Corpus Madre** — los fundamentos agnósticos (33 conceptos, 7 secciones). Lo que antes se llamaba "corpus base"
- **Corpus Universal** — el campo total del conocimiento vivo del paradigma en todos sus niveles y expresiones
- **Duende** — la figura que encarna el metabolismo cognitivo asistido (puede ser una IA, una persona, un protocolo)
- **IAH** — Inteligencia Aumentada Humanista: composición entre percepción humana y capacidad del Duende

---

## A3. Conceptos clave del Paradigma (resumen operativo)

**La Cognoesfera** — unidad mínima de inteligencia colectiva. ~8 personas que al alcanzar coherencia relacional y cognitiva se convierten en algo más que la suma de sus partes: un organismo que piensa.

**La Entidad Aleph** — red de Cognoesferas articulada en lógica fractal. Cuando resuenan entre sí emerge el Campo Aleph.

**La Matriz de Vitalidad** — instrumento de lectura de cuán viva está una Cognoesfera. 3 lentes × 4 capas = 12 expresiones de vitalidad:

| | El entre | El interior | El reloj interno |
|---|---|---|---|
| **Sistemas** | Sistema vincular | Sistema operativo | Andamiaje temporal |
| **Campos** | Campo de coherencia | Campo de consciencia | Campo de atención |
| **Órganos** | Órgano de experimentación y aprendizaje colectivo | Órgano cognitivo | Órgano de orientación evolutiva |
| **Metabolismos** | Metabolismo de reciprocidad | Metabolismo de transducción | Festina lente |

**Los 8 estados vitales** — configuraciones cualitativas del sistema (no lineales, pueden coexistir):
Latente → Posible → Activado → Emergente → Expresivo → Legible → Sostenido → Ecosistémico

**El desfasaje temporal** — aplicar una intervención correcta en el momento equivocado. La **Solidificación Prematura** es su forma más frecuente: imponer estructura antes de que el sentido exista.

**El Espacio Borgeano** — infraestructura que hace simultáneo lo que el lenguaje obliga a volver sucesivo. La memoria del sistema hecha navegable.

**El instante borgeano** — el momento donde futuro, pasado y presente confluyen simultáneamente. Lo que distingue una Cognoesfera en ignición de una reunión ordinaria.

**La regla mínima del sistema** — todo elemento cumple una sola función posible: crear condiciones para que algo se vea, o explicar lo que debería verse. Si crea condiciones, es generativo. Si explica, solidifica prematuramente.

**La inteligencia verdadera** (Krishnamurti) — percepción directa e inmediata, libre de condicionamientos. Horizonte de la reforma gramatical colectiva. No se construye — emerge cuando se crean las condiciones para que el condicionamiento cese.

---

## A4. Arquitectura del Corpus Vivo

**Ciclo autopoiético:**
```
Corpus Madre → Conversaciones aumentadas → Papers → Curaduría → Señales → Corpus Madre enriquecido
```

**Las 4 capas:**
- Capa 0 — Conversaciones aumentadas (origen, material en bruto)
- Capa 1 — Corpus Madre (fundamentos, evolución lenta)
- Capa 2 — Repositorio de papers (3 niveles de visibilidad: privado / Cognoesfera / público)
- Capa 3 — Curaduría (Cognoesfera curadora + IAH, mecanismo 0-Objeción)

**Mecanismos transversales:** Compostaje · Fork · Autorizaciones · Disonancia como señal

**Arquitectura fractal (5 niveles):**
Corpus Madre (centro) → Corpus personal → Corpus de una Cognoesfera → Corpus de una Entidad Aleph → Corpus de varias Entidades Aleph conectadas

---

## A5. Infraestructura técnica

| Componente | Detalle |
|---|---|
| **GitHub** | `edgardonoya-crypto/Cognoesfera` (privado) |
| **Supabase** | Schema completo: dimensiones, corpus_documentos, corpus_cognoesfera |
| **Vercel** | `cognoesfera.vercel.app` |
| **Claude Code** | v2.1.83, instalado y autenticado en VS Code |

**Estado de la aplicación:**
- Login real con Supabase auth funcionando
- Dashboard con Cognoesferas conectadas a Supabase
- Dos Cognoesferas visibles: Quanam IHA Lab (Arquitecto) e IHA - Menthor: Comunidad de Práctica (Investigador)
- **`/corpus-form`** — formulario Next.js para registrar conceptos, señales débiles, pendientes y actualizaciones directamente al repo GitHub vía API route segura (`app/api/corpus-commit/route.ts`)
- **`GITHUB_TOKEN`** configurado en `.env.local` y en Vercel (variable de entorno server-side)

**Sistema B** — aplicación separada con datos reales: usuarios, duendes, 5 roles formados, Cognoesfera en constitución con organizadores IAC 2026. Hay un zip disponible para explorar. **Pendiente de sesión.**

---

## A6. Pendientes activos

Los pendientes viven en dos archivos con schema completo:
- **Casa Soma:** `corpus/documentos/pendientes_soma.md` — técnicos, infraestructura, aplicación
- **Casa Corpus:** `corpus/documentos/pendientes_corpus.md` — conceptos, señales, protocolos, documentos, narrativa

**Completadas en SESION-20260418-19:**
- ~~S-AP-12: Implementar catálogo de geometrías en Supabase~~ ✓
- ~~S-AP-13: Implementar Tríada de Percepción (componente + API + schema)~~ ✓

**Prioridades próxima sesión:**
- **P1 [SOMA]:** Rediseño pantallas 2 (tríada activa) y 3 (completado) con Figma (S-AP-14)
- **P1 [SOMA]:** Ajustes de viewport pantalla intro — scroll residual (S-AP-15)
- **P1 [SOMA]:** Integración del instrumento Tríadas en /quanam-ia-2026 (S-AP-18)
- **P1 [SOMA]:** Paso de contexto al Duende — posiciones en tríadas (S-DU-01)
- **P1 [CORPUS]:** Migrar nomenclatura borgeano → alephiano en todos los documentos (C-CO-10)
- **P2 [CORPUS]:** Cambio nomenclatura IAH → IHA en todos los documentos (C-CO-11)
- **P2 [CORPUS]:** Articular coherencia entre Campo de atención, Tríada de Percepción, CA e Instante Alephiano (C-CO-09)
- **P3 [CORPUS]:** Incorporar conceptos nuevos al Corpus Madre — sesión dedicada (C-CO-12)

---

## A7. Protocolo de sesión

**Al inicio:** subir `SESION.md` y escribir **INICIO DE SESIÓN**. El Duende reporta el estado del sistema, pregunta el objetivo y dice qué archivos adicionales subir según ese objetivo.

**Durante la sesión:** Claude Code en VS Code para ejecutar. Claude.ai para pensar y diseñar.

**Al final:** en Claude Code escribir:
```
Actualizá corpus/SESION.md con lo que emergió hoy y hacé commit
```

Esto debe incluir:
1. Actualizar `corpus/SESION.md` (versión, pendientes, señales)
2. Generar `corpus/status/status_[DDMMYYYY].md` con el estado del sistema al cierre — usando el nuevo template (Sección 1: Dashboard / Sección 2: Bitácora)
3. Commitear juntos: SESION.md + status + cualquier documento de corpus generado en la sesión

---

## A8. Señales vivas

*Las señales activas viven en `corpus/documentos/senales_activas.md` con descripción completa. Las señales incorporadas al Corpus Madre están en `corpus/documentos/senales_incorporadas.md`.*

### Señales activas (88)
Conceptos que resuenan con el paradigma pero necesitan más verificación antes de entrar al Corpus Madre.

*Nota I1 resuelta: el título indica el conteo real (88). La lista tiene menos entradas visibles porque el bloque "Señales A-W" comprime 23 señales individuales en un solo bullet. Desglose: 63 entradas en lista = 62 señales individuales + 23 del bloque A-W − 1 entrada del bloque = 84 pre-SESION-20260418-19. Más 3 nuevas = 87... La discrepancia residual de 1 puede corresponder a señales anotadas en sesiones anteriores pero no reflejadas en este listado. Queda como pendiente protocolar confirmar si falta una señal no listada entre las de 07-15/04/2026.*

- **El Campo de Inteligencia Aleph** — la inteligencia que emerge de la red de Cognoesferas y Entidades Aleph como campo propio. El paradigma ya la describía pero no la había nombrado con precisión. Fecha: 28/03/2026
- **El Gran Campo** — la inteligencia que trasciende y precede a todas las redes. Los grupos no la crean — la sintonizan cuando alcanzan suficiente coherencia interna. Fecha: 28/03/2026
- **Los instructivos situados como categoría fractal** — cada nivel del paradigma tiene su propio instructivo situado. Es el equivalente fractal del Corpus Madre para los instructivos operativos. Fecha: 29/03/2026
- **Fundación Soma y Fundación Corpus** — nombres para los dos sistemas paralelos: Soma es la red operativa urgente, Corpus es el campo festina lente. Raíz latina compartida, no elegida sino descubierta. Fecha: 29/03/2026
- **Plotino como ancla ontológica** — el ser humano ES el punto de encuentro entre lo infinito y lo finito. Fundamento filosófico de la dualidad Soma/Corpus. Fecha: 29/03/2026
- **Capra como fundamento científico** — la red viva autopoiética describe cómo opera la vida. Complementa a Plotino desde la biología sistémica. Fecha: 29/03/2026
- **Schema de Fundación Soma ya tiene estructura fractal** — groups con parent_group_id en el Sistema B implementa sin saberlo la arquitectura fractal del paradigma. Fecha: 29/03/2026
- **El InterSer como fundamento ontológico del "entre"** — la condición de ser que sólo existe en relación. No es interdependencia ni interacción: es ontología relacional pura. Candidato a sección propia en el Corpus Madre. Fecha: 29/03/2026
- **El Corpus como Códice** — el corpus podría ser el *Códice Alephicum*, un objeto vivo que muestra cosas diferentes a cada lector según su historia, rol y momento. Fecha: 29/03/2026
- **La saga narrativa del Paradigma Aleph** — universo narrativo en construcción con cuatro registros. Tiene raíces familiares y generacionales que todavía no fueron contadas — el origen no empieza con el sobrino sino antes, posiblemente con los abuelos. Fecha: 29/03/2026
- **El Consejo Asesor como componente de la arquitectura digital** — sistema de 18 roles de asesoramiento estratégico construido en ChatGPT/Gemini, con documentos fundacionales propios. Fecha: 29/03/2026
- **AI Studio y los modelos de video como transducción audiovisual** — Veo 3.1, Sora 2, Kling 2.6, Wan 2.6 generan Cognobits digitales audiovisuales. Amplían el concepto 31 a la dimensión audiovisual. Fecha: 29/03/2026
- **Casa Soma y Casa Corpus** — la tradición jesuita opera con casas: espacios físicos y simbólicos de práctica. La metáfora amplía y ancla las dos dimensiones. Fecha: 29/03/2026
- **La tradición jesuita como linaje** — los jesuitas inventaron el "contemplativo en la acción": plena presencia mística mientras se actúa en el mundo. Antecedente histórico más preciso de la dualidad Soma/Corpus. Fecha: 29/03/2026
- **La contemplación amorosa como práctica de conocimiento** — modo de percibir donde el amor no interfiere sino que amplía la capacidad cognitiva. El que ama más ve más. Fecha: 29/03/2026
- **La constelación festina lente** — conjunto de figuras que comparten el mismo tempo: Ignacio de Loyola, Plotino, Capra, el bonsái. Una constelación que le da densidad histórica y filosófica al Corpus. Fecha: 29/03/2026
- **Las tablas BD del catálogo de protocolos de actos de cuidado** — `protocolos_cuidado`, `protocolo_actos_cuidado`, `protocolo_estados_vitales`, `protocolo_matriz_dimensiones`, `aplicaciones_protocolo`. Señal técnica que espera diseño. Fecha: 29/03/2026
- **La Unidad Aleph** — ¿es un nivel distinto al de la Cognoesfera o una expresión del mismo patrón fractal a mayor escala? Señal abierta que requiere exploración conceptual. Fecha: 29/03/2026
- **App independiente del Sistema B** — decisión de construir Casa Soma como aplicación propia con Supabase, no dependiente de Payload CMS. Fecha: 30/03/2026
- **Arquitectura en 3 etapas** — Etapa 1: Duende real; Etapa 2: Cognoesferas vivas; Etapa 3: Ecosistema y resonancias. Hoja de ruta técnica clara. Fecha: 30/03/2026
- **El Duende cobra vida** — primera vez que el paradigma tiene un Duende real conectado a Claude API con el Corpus Madre como contexto. Infraestructura completa configurada. Fecha: 30/03/2026
- **Protocolo Madre / Protocolo situado** — los protocolos tienen dos capas: universal/agnóstico (Madre) y expresión concreta en una persona, Cognoesfera o Entidad Aleph (situado). Fecha: 30/03/2026
- **Catálogo de tipos de actividad** — dos ejes: Casa Corpus (conceptuales) y Casa Soma (operativas). Base para protocolos de apertura/cierre por tipo de sesión. Fecha: 30/03/2026
- **Acciones soberanas / acciones de supervivencia** — las acciones soberanas crean condiciones para que algo nuevo emerja; las de supervivencia sostienen el sistema sin ampliar el campo. Candidata a concepto del Corpus Madre. Fecha: 30/03/2026
- **Marco de registro de acciones en sesión** — estructura con 7 atributos por acción: tipo, momento, origen, dependencias, señal que emite, afecta (Soma/Corpus/ambas), estado. Fecha: 30/03/2026
- **El Duende como maximizador de tiempo soberano** — rol activo: ejecutar inventario de cierre, detectar emergencias del entre, comprimir supervivencia, amplificar condiciones soberanas. Fecha: 30/03/2026
- **Medición de tiempo soberano vs supervivencia** — métrica por sesión con timestamps en tiempo real. Dimensión complementaria: inteligencia verdadera vs mecánica. Fecha: 30/03/2026
- **Status acumulativo de sesiones en Supabase** — tabla con una fila por sesión, métricas comparables, habilitando al Duende futuro a leer tendencias. Fecha: 30/03/2026
- **Identificador de sesión trazable SESION-YYYYMMDD** — código consistente en todos los sistemas: SESION.md, status, Supabase, URL del chat. Fecha: 30/03/2026
- **Arquitectura fractal de campos de inteligencia** — cada nivel del paradigma tiene su cuerpo y su campo. El mismo patrón cuerpo → campo se repite fractalmente: individuo, Cognoesfera, Entidad Aleph. Fecha: 01/04/2026
- **El Duende como amplificador de interés compuesto** — el Duende genera rendimientos crecientes sobre el conocimiento acumulado. Análogo al interés compuesto aplicado al conocimiento colectivo. Fecha: 01/04/2026
- **Patrón núcleo / expansión para definiciones del Corpus Madre** — las definiciones del Corpus Madre tienen dos capas: núcleo portable y agnóstico, y expansión para cuando se necesita profundidad. Fecha: 01/04/2026
- **El collage como elemento semántico de la Conversación Aumentada** — el collage opera como forma de conocimiento antes de ser interpretado. Cada recuadro es unidad de sentido completa. No hay jerarquía lineal — hay campo. Fecha: 02/04/2026
- **El corpus en dos tiempos — secuencial y simultáneo** — el Corpus Madre existe en versión secuencial (texto continuo) y simultánea (collage). Son la misma definición habitada de dos formas. Fecha: 02/04/2026
- **Obsidian como taller del Corpus Universal** — cada concepto como nota, señales como notas vinculadas, grafo de relaciones. Taller vs vitrina (HTML). Fecha: 02/04/2026
- **El Duende como guardián del kairos soberano** — cuando el campo abre múltiples territorios simultáneamente, el Duende nombra la tensión, propone el kairos y devuelve la decisión al Arquitecto sin forzarla. Fecha: 02/04/2026
- **El Aleph de Borges como clave explicativa del Paradigma** — "Lo que vieron mis ojos fue simultáneo; lo que transcribiré, sucesivo, porque el lenguaje lo es." Explica la arquitectura de tres capas del paradigma. Señal de campo, no de concepto. Fecha: 02/04/2026
- **El InterSer Soma/Corpus — dos naturalezas de un mismo organismo** — Soma y Corpus no son dos sistemas paralelos sino dos naturalezas de un mismo InterSer. El InterSer no existe sin ambas. Candidato a concepto nuevo del Corpus Madre o reformulación del InterSer existente. Fecha: 05/04/2026
- **El metabolismo del InterSer como red de InterSeres** — el metabolismo no ocurre dentro de cada ser sino en el entre de la red de InterSeres. Señal que amplía el InterSer hacia su expresión colectiva y fractal. Fundamento biológico: Capra. Fecha: 05/04/2026
- **El Duende como espejo del corpus** — cuando el system prompt porta el Corpus Madre completo (33 conceptos), el Duende responde desde adentro del paradigma y no desde afuera de él. La calidad de la respuesta es función directa de la fidelidad del corpus que porta. Fecha: 07/04/2026
- **La curación como acto de cuidado del corpus** — el flujo archivos → curador → repositorio materializa el concepto 12 (Cognoesfera curadora) en la infraestructura digital. Lo que el paradigma describe como postura se convierte en proceso técnico concreto. Fecha: 09/04/2026
- **El relato como infraestructura de acceso** — la frase "Tu mirada se activa cuando se encuentra con otras" como formulación que conecta la entrada al sistema con el paradigma. El relato no es decoración — es la primera condición de posibilidad. Antes del código, antes del formulario, la palabra que crea el espacio. Fecha: 09/04/2026
- **La gramática fractal del Duende** — el Duende tiene una gramática base (Corpus Madre) y una expresión situada por receptor. Fractal: persona → Cognoesfera → Entidad Aleph. El lenguaje como infraestructura fractal, no como decoración. Fecha: 11/04/2026
- **La experiencia adaptativa como infraestructura viva** — la convocatoria que evoluciona con el usuario usando los 8 estados vitales como niveles de progresión. La recompensa no es una medalla — es acceso a un campo más denso. Fecha: 11/04/2026
- **El protocolo de cierre como tiempo soberano** — la lista exacta de archivos a solicitar al cierre debe vivir en el protocolo, no en la memoria de sesión. El tiempo soberano del Arquitecto no debería usarse en detectar lo que el sistema debería hacer solo. Fecha: 11/04/2026
- **Los ocho estados del individuo en el campo** — La escucha. El pulso. El murmullo. La sintonía. La resonancia. El tono. El coro. La música. Arco propio del individuo — distinto al de la Cognoesfera pero fractal del mismo patrón de maduración. Vocabulario acústico de principio a fin. El ciclo es fractal: la música de uno despierta la escucha de otro. Fecha: 11/04/2026
- **El paralelismo fractal individuo / Cognoesfera** — Los ocho estados del individuo y los ocho estados de la Cognoesfera comparten el mismo patrón de fondo — algo latente → primera señal → forma que emerge → reconocimiento → expresión → legibilidad → coherencia propia → expansión al campo mayor — pero con vocabulario y lógica propios para cada escala. Confirma la fractalidad del paradigma. Fecha: 11/04/2026
- **La revelación como método** — Miguel Ángel no inventó el ángel — lo reveló quitando lo que sobraba. El conocimiento genuino no se construye desde afuera sino que se excava desde adentro. Los ocho estados emergieron de esta sesión por revelación, no por diseño. Amplía el concepto 3 del Corpus Madre con una imagen que lo hace vivible para cualquiera. Fecha: 11/04/2026
- **Los estados madre del individuo como infraestructura fractal** — El patrón Madre/situado que organiza el Corpus y los Protocolos aplica ahora a los estados individuales. Los ocho estados (La escucha → La música) son la versión universal y agnóstica. Cada contexto tendrá su expresión situada que hereda de los estados madre. Fecha: 11/04/2026
- **`estados_vitales` como infraestructura fractal del paradigma** — Una sola tabla que registra el estado de cualquier entidad del sistema (individuo, Cognoesfera, Entidad Aleph) en cualquier contexto. Materializa la fractalidad del paradigma en el schema de Supabase. Habilita al Duende a leer el campo completo. Materializa el concepto 25 (Memoria Viva Aumentada) en schema. Fecha: 11/04/2026
- **La Matriz de Vitalidad del individuo** — La Cognoesfera tiene su Matriz — el individuo también necesita la suya. Mismos tres lentes (el entre, el interior, el reloj interno) pero con capas y expresiones propias del individuo. Junto con los estados madre, formaría el sistema completo de lectura del individuo en el campo. Requiere sesión propia para revelarla. Fecha: 11/04/2026
- **Señales A-W — Encuentro Aleph/Cynefin (23 señales)** — Material de Dave Snowden procesado por compostaje: gradiente/estuario (B), centrípeto/centrífugo (C), convocatoria safe-to-fail (D), abducción/IT (E), resonancia/eco (F), SP histórica/dragado (G), mal guionados (H), wayshaping (I), Cynefin como experiencia (J), triada SenseMaker (K), Flywheel como transducción (L), Muninn (M), configuraciones SenseMaker (N), Ashby invertido/Cognoesfera (O), ética SP/disparo (P), ficción especulativa (Q), Dao/wayshaping (R), narrativas autosostenibles (S), linaje celta (T), orientación/uso (U), lenguaje universal=traducción (V), lo situado como categoría formal (W), auto-significación (A). Descripción completa en `senales_activas.md`. Fecha: 13/04/2026
- **La zona liminal como condición de emergencia** — el espacio donde dos sistemas se encuentran y emerge algo que no existía en ninguno de los dos. El estuario vs el canal. No es un pasaje de un estado a otro sino un territorio con sus propias reglas. Conecta Espacio Borgeano (donde lo simultáneo se vuelve posible), SP (lo que se solidifica antes de que el estuario haga su trabajo), y Campo de atención (lo que dirige la mirada en ese umbral). Fecha: 14/04/2026
- **La Tríada de Percepción como instrumento del paradigma** — geometría de tres fuerzas situadas que hace visible la topografía del campo colectivo. Fecha: 15/04/2026
- **Las condicionantes generativas** — condiciones que crean el espacio donde algo genuino puede emerger, sin determinar el outcome. Linaje en Cynefin. Fecha: 15/04/2026
- **El andamiaje topológico** — segunda dimensión del andamiaje: organiza desde dónde puede emerger algo. Complementa al andamiaje temporal. Fecha: 15/04/2026
- **Los adyacentes posibles** — agrupamientos de percepciones en el campo que pueden amplificarse. El Arquitecto busca los bordes, no el centro. Fecha: 15/04/2026
- **El vacío cuántico como linaje del Espacio Alephiano** — candidato a linaje científico. Requiere verificación con rigor antes de incorporarse al corpus. Fecha: 15/04/2026
- **La Distancia Alephiana** — la tensión entre lo infinito/simultáneo y lo finito/sucesivo. No se elimina — se habita. Requiere verificación. Fecha: 15/04/2026
- **El linaje Cantor-Borges-Aleph** — fundamento matemático-filosófico-personal del nombre Aleph. Requiere sesión propia. Fecha: 15/04/2026
- **La planilla como Cognobit del catálogo** — objeto vivo que porta conocimiento y alimenta nuevas conversaciones aumentadas. Fecha: 15/04/2026
- **El rol de la IAG como campo que se expande** — cada generación porta un campo más amplio. Impacto en el Duende y la IHA. Fecha: 15/04/2026
- **Los límites del conocimiento del Duende sobre sí mismo** — principio metodológico: las afirmaciones de la IAG sobre su propia naturaleza requieren el mismo rigor que cualquier señal. Fecha: 15/04/2026
- **La descripción rica como infraestructura de recuperación** — cuando un artifact queda huérfano (sin commit), la descripción narrativa del pendiente que lo referencia opera como red de seguridad. Distingue anclaje operativo (commit, archivo en disco) versus anclaje narrativo (descripción rica en SESION.md). Son capas complementarias, no sustitutas. Fecha: 18/04/2026
- **La regla de la narrativa en el campo colectivo** — en instrumentos que producen topografía colectiva (como la Tríada de Percepción), el avance individual puede permitirse sin palabra (postergar narrativa). Pero el campo colectivo solo se vuelve visible cuando TODOS los gestos individuales tienen palabra. El instrumento tolera pausa individual, no admite campo sin interpretación. Fecha: 19/04/2026
- **El instrumento se compone por Figma + Claude Code en colaboración** — iterar diseño UX exclusivamente por texto tiene límite de ~3 iteraciones antes de perder convergencia. El mockup visual (Figma) colapsa dos capas de interpretación y destraba la convergencia. Flujo: Arquitecto diseña en Figma → exporta PNG → Duende arma prompt → Claude Code traduce a código. Fecha: 19/04/2026

### Señales incorporadas al Corpus Madre
*Historial completo en `corpus/documentos/senales_incorporadas.md`*

- **Transducción de formatos** → Concepto 31 · 29/03/2026
- **Las dos dimensiones del Cognobit** → Concepto 24 · 29/03/2026
- **El patrón de doble acoplamiento** → Concepto 32 · 29/03/2026
- **Definición nueva de Cognoesfera** → Concepto 5 reescrito · 02/04/2026
- **Protocolo 01-EN pendiente de construcción** → Protocolo 01-EN completado · 02/04/2026

### Señales vivas pendientes de desarrollar (2)
Conceptos o procesos que merecen atención pero todavía no están listos para ser custodiados.

- **Protocolo mínimo de registro de conversación** — cómo venimos / transformaciones / cómo nos vamos / qué aprendimos. Concepto que merece entrar al Corpus Madre.
- **Los tres documentos del conjunto de gramáticas** — solo se completó la introducción. Faltan Documento 1 (ontológico), Documento 2 (ejemplos), Documento 3 (periférico).

### Registros históricos (2)
Momentos significativos del proceso que vale la pena recordar.

- **El corpus como organismo que se alimenta desde la app** — el formulario /corpus-form materializa el ciclo autopoiético. Fecha: 28/03/2026
- **El ciclo autopoiético del corpus se completó por primera vez** — el corpus creció de 27 a 30 conceptos usando el propio sistema. Fecha: 28/03/2026

---

## A9. Estado técnico — arquitectura y desarrollo

**Stack tecnológico:**
- Frontend/Full-stack: Next.js + TypeScript
- Base de datos: Supabase
- Deploy: Vercel
- Repositorio principal: edgardonoya-crypto/Cognoesfera (privado)

**Estado de la aplicación principal:**
- Login real con Supabase auth funcionando
- Dashboard con Cognoesferas conectadas a Supabase
- /corpus-form funcionando para registrar conceptos vía GitHub API
- Pendiente: verificar /corpus-form en producción
- **`/quanam-ia-2026`** — convocatoria interactiva Quanam con formulario, drawer contexto, lentes Duende y DuendeFragmento en fragmentos del drawer · 07/04/2026
- **`SUPABASE_SERVICE_ROLE_KEY`** configurado en `.env.local` (server-side, acceso de escritura a Supabase)

**Infraestructura del Duende real — configurada el 30/03/2026:**
- Cuenta Anthropic activa con $50 de crédito y auto-reload configurado
- API key `casa-soma` generada y activa
- SDK `@anthropic-ai/sdk` instalado en el proyecto
- `ANTHROPIC_API_KEY` en `.env.local` y en Vercel (variables de entorno)
- Deploy funcionando con la nueva variable
- Tabla `duende_chats` creada en Supabase con RLS activo
- **Duende activado end-to-end desde SESION-20260407.**

**Sistema B (Fundación Soma):**
- Payload CMS + PostgreSQL + Next.js. 16 colecciones relevadas. Schema completo disponible.
- Tablas clave: organizations, members, groups (fractal con parent_group_id), meetings, duende_conversations, protocols, initiatives, documents, messages
- Primer caso real: EDHUCA, sesión ~17 de abril

**Arquitectura nueva — decisiones tomadas:**
- Tablas nuevas a agregar: `emergencias`, `pulsos_vitalidad`, `resonancias`
- Campo nuevo en `organizations`: `vital_state` (estado vital de la Cognoesfera)
- Estas tablas materializan la Matriz de Vitalidad en el schema
- La estructura fractal ya existe en `groups` — se preserva y extiende

**Objetivo de la próxima fase de desarrollo:**
Diseñar desde cero una arquitectura lógica nueva que dialogue con el corpus y el paradigma, incorporando lo aprendido en más de un año de desarrollo del Sistema B. El resultado debe ser coherente con la dualidad humano-digital del paradigma — el barco y el astillero construyéndose mutuamente. La arquitectura debe estar preparada para incorporar MCP, agentes y las innovaciones que emergen en el ecosistema de IAG.

**Archivos clave para sesiones técnicas:**
- corpus/documentos/arquitectura_digital_corpus_vivo.md
- corpus/documentos/corpus_base_aleph.md
- El zip del Sistema B (disponible localmente)

**Documentos generados en sesiones recientes:**
- corpus/documentos/arquitectura_paradigma_aleph.md — arquitectura completa para NotebookLM · 29/03/2026
- corpus/documentos/arquitectura_paradigma_aleph.docx — mismo documento en Word · 29/03/2026
- corpus/documentos/arquitectura_paradigma_aleph.html — diagrama interactivo standalone · 29/03/2026
- corpus/documentos/protocolos_actos_de_cuidado.md — actualizado con Protocolo 02: El Ritual de Sesión · 30/03/2026
- corpus/documentos/cognoesfera_definicion.html — primer documento collage HTML del Corpus Madre · 02/04/2026
- corpus/documentos/mapeo_secuencial_simultaneo.md — registro arquitectural de la relación entre capas secuencial y simultánea · 02/04/2026
- corpus/documentos/temas_pendientes_exploracion.md — registro de temas abiertos y exploraciones futuras del paradigma · 04/04/2026
- corpus/documentos/quanam_ia_collage.html — convocatoria Por este camino 2026 · 04/04/2026
- corpus/documentos/aprendizajes_sesiones.md — primer registro de cierre con qué funcionó, qué mejorar, tensiones · 05/04/2026
- corpus/documentos/estado_reestructura_05042026.md — diagnóstico y propuestas aprobadas de reestructura · 05/04/2026
- corpus/documentos/senales_activas.md — señales activas del paradigma (reemplaza senales_custodiadas.md) · 06/04/2026
- corpus/documentos/senales_incorporadas.md — historial de señales incorporadas al Corpus Madre · 06/04/2026
- corpus/documentos/pendientes_soma.md — pendientes técnicos/operativos con schema completo · 06/04/2026
- corpus/documentos/pendientes_corpus.md — pendientes conceptuales/documentales con schema completo · 06/04/2026
- app/quanam-ia-2026/page.tsx — convocatoria interactiva Quanam con formulario Supabase, drawer contexto y Duende · 06/04/2026
- app/api/quanam-respuesta/route.ts — API route para guardar respuestas en tabla quanam_respuestas · 06/04/2026
- app/admin/page.tsx — panel de administración con respondentes y contactos · 06/04/2026
- Tabla aleph_contacto con campo origen — creada en Supabase · 06/04/2026
- corpus/documentos/pendientes_soma.md actualizado con trazabilidad y S-IN-05 · 06/04/2026
- app/quanam-ia-2026/page.tsx — OTP + flujo Enviar al Duende + hero IHA · 08/04/2026
- app/login/page.tsx — aviso spam en pantalla OTP · 08/04/2026
- app/admin/page.tsx — log accesos convocatoria + log logins + hora en Duende · 08/04/2026
- middleware.ts — protección server-side de todas las rutas autenticadas · 08/04/2026
- app/lib/supabase.ts — migrado a createBrowserClient de @supabase/ssr · 08/04/2026
- Tablas Supabase: login_log + convocatoria_accesos · 08/04/2026
- app/api/duende/route.ts — soporte archivos adjuntos + lógica curación + comportamientos nuevos (no-sé, c/3 msgs, pregunta desafiante, estados Aleph) · 09/04/2026
- app/quanam-ia-2026/page.tsx — botón + archivos adjuntos, textos actualizados, relato bienvenida · 09/04/2026
- app/admin/page.tsx — sección curación archivos + sección preguntas Arquitectos · 09/04/2026
- app/api/admin/archivos-curaduria/route.ts — endpoint GET/PATCH curación · 09/04/2026
- app/api/admin/responder-pregunta/route.ts — respuesta por email via Resend · 09/04/2026
- app/api/auth/send-otp/route.ts — fix OTP emails nuevos + cliente correcto · 09/04/2026
- app/cognoesfera/[id]/page.tsx — Resonancias muestra conversaciones Duende agrupadas por lente · 09/04/2026
- app/quanam-ia-2026/page.tsx — rediseño completo UX: hero, modal Duende, persistencia, modales contexto, iniciativas dinámicas · 11/04/2026
- supabase/migrations/20260411_iniciativas.sql — tablas iniciativas e intereses_iniciativas · 11/04/2026
- supabase/migrations/20260411_estados_vitales.sql — tablas estados_madre + estados_situados + estados_vitales · 11/04/2026
- supabase/migrations/20260411_estados_situados_quanam.sql — 8 estados situados convocatoria_quanam · 11/04/2026
- app/api/estados/route.ts — detección de estados + transición comportamiento/Duende · 11/04/2026
- app/admin/page.tsx — rediseño grid cajas + modales + conversaciones 3 vistas · 11/04/2026
- supabase/migrations/20260411_duende_analisis.sql — tabla duende_analisis con trazabilidad de fuentes · 11/04/2026
- app/api/admin/duende-analisis/route.ts — análisis multi-turno del Duende-Arquitecto · 11/04/2026
- supabase/migrations/20260412_convocatoria_contenido.sql — tabla convocatoria_contenido (6 zonas por contexto+estado) · 12/04/2026
- supabase/migrations/20260412_duende_chats_estado.sql — columna estado en duende_chats · 12/04/2026
- supabase/migrations/20260412_mensajes_ruido.sql — columna mensajes_ruido integer[] en duende_chats · 12/04/2026
- app/quanam-ia-2026/page.tsx — topbar fija + zonas dinámicas desde convocatoria_contenido · 12/04/2026
- app/admin/page.tsx — estado conversaciones + reporte ruido JSON + mensajes_ruido checkbox · 12/04/2026
- app/admin/conversacion/usuario/[email]/lente/[contexto]/page.tsx — botón Marcar como ruido · 12/04/2026
- app/api/admin/duende-chats/route.ts — PATCH estado y mensajes_ruido · 12/04/2026
- app/api/admin/duende-analisis/route.ts — rama ruido con JSON estructurado + tarjetas UI · 12/04/2026
- corpus/documentos/arqueologia_corpus.md — registro arqueológico del primer encuentro entre el Paradigma Aleph y Cynefin · 13/04/2026
- corpus/documentos/enriquecimientos_corpus.md — material concreto para actualizar conceptos del Corpus Madre (C-EN-01 a C-EN-11) · 13/04/2026
- corpus/documentos/protocolos_sesion.md — protocolos de sesión como documento autónomo v2.3 (4 protocolos, 10 archivos, cierre Claude.ai) · 13/04/2026
- corpus/documentos/corpus_base_aleph.md — 7 conceptos enriquecidos con material Cynefin/Snowden: conceptos 5, 11, 13, 15, 19, 23, 29 · 14/04/2026
- app/components/TriadaPercepcion.tsx — componente React con rediseño editorial final (Fraunces+Lora, 3 stages) · 18-19/04/2026
- app/api/triadas/posicion/route.ts — API route POST/GET con upsert baricéntrico y narrativa_pospuesta · 18/04/2026
- app/triadas-test/page.tsx — ruta de testing del instrumento · 18/04/2026
- supabase/migrations/20260418_triadas_percepcion.sql — schema completo: 3 tablas + vista + RLS + seed 8 geometrías Quanam · 18/04/2026
- supabase/migrations/20260418_narrativa_pospuesta.sql — columna narrativa_pospuesta en percepciones_triada · 18/04/2026
- public/images/topografia-intro.png — imagen topográfica como Cognobit conceptual · 19/04/2026
- public/images/Aleph_vectorial_poweredby.svg — logo aleph/Quanam integrado en pantalla intro · 19/04/2026
- corpus/Cognobits/conceptos_emergentes_aleph.pdf — Cognobit PDF generado en SESION-20260415 · 15/04/2026
- corpus/Cognobits/la_inteligencia_que_emerge.pdf — Cognobit PDF generado en SESION-20260415 · 15/04/2026
- corpus/Cognobits/triada_percepcion_completo.pdf — Cognobit PDF generado en SESION-20260415 · 15/04/2026
- corpus/Cognobits/geometrias_triada_v2_1.xlsx — planilla Excel de geometrías, versión 2.1 · 15/04/2026
- ~/.claude/skills/frontend-design/SKILL.md — Skill de Anthropic instalada localmente · 18/04/2026

**Ajustes protocolares identificados en SESION-20260418-19:**
1. ~~`git push origin master:main`~~ → corregido a `git push origin main` en instrucción COMMIT ALEPH arriba (rama actual es main, no master)
2. Pendiente proponer en Protocolo 02-EN: verificar anclaje operativo o narrativo de cada artifact mencionado en A2 antes del cierre
3. Pendiente: agregar campo Ruta/Ubicación al schema de `pendientes_soma.md` y `pendientes_corpus.md`
4. Pendiente: agregar `convs_temp.txt` a `.gitignore`
5. Pendiente: corregir inconsistencia de email en DB — `edgardo.noya@gmall.com` (typo doble L) vs `edgardo.noya@gmail.com`
6. Pendiente: configurar Supabase CLI (P3) para evitar aplicar migraciones manualmente en SQL Editor

**Hitos de SESION-20260402/04:**
- Protocolo 01-EN construido y probado exitosamente por primera vez
- Concepto 5 reescrito con patrón núcleo/expansión — primer concepto del Corpus Madre en este formato
- Concepto 33 incorporado: La Función HTML Aleph — el proceso de transformar texto secuencial en objeto simultáneo
- Primer collage HTML del Corpus Madre construido y committeado: `cognoesfera_definicion.html`
- Conexión Borges/Aleph/arquitectura de tres capas — señal de campo más potente de la sesión
- Convocatoria Quanam "Por este camino 2026" construida aplicando la Función HTML Aleph
- Decisión arquitectural: mapeo secuencial/simultáneo vive en .md — Solidificación Prematura evitada
- 7 señales nuevas custodiadas — 5 emergentes del entre el 02/04 + 2 de la extensión el 04/04

**Hitos de SESION-20260405:**
- Diagnóstico de redundancia frágil en la arquitectura del sistema — primer análisis estructural profundo
- Tres propuestas de reestructura aprobadas por el Arquitecto
- Documento de estado de reestructura generado para continuar en próxima sesión
- Nuevo concepto emergente: InterSer Soma/Corpus — cuando la arquitectura se volvió organismo
- Experimento de respuesta paralela Arquitecto/Duende — primer registro de dos voces simultáneas
- Lectura de Capra: fundamento biológico confirmado para la fractalidad y el InterSer
- 2 señales nuevas custodiadas (42 → 44)

**Hitos de SESION-20260406:**
- Protocolo 01-EN detectó 4 inconsistencias — todas resueltas antes de arrancar
- Reestructura arquitectural completa ejecutada en una sola sesión
- Flujo de maduración implementado con jerarquía explícita
- 9 archivos generados o actualizados · sistema sin redundancia frágil

**Hitos de SESION-20260406b:**
- `/quanam-ia-2026` construida completa: pantalla de bienvenida, seis lentes, drawer contexto, API Supabase
- `app/api/quanam-respuesta/route.ts` — API route para guardar respuestas en `quanam_respuestas`
- TypeScript limpio — `tsc --noEmit` sin errores · deployado en Vercel

---

# SECCIÓN B — DOCUMENTOS DE REFERENCIA

*Leé estas secciones cuando el trabajo del día las requiera. Si el trabajo es de arquitectura técnica o pendientes generales, la Sección A es suficiente.*

---

## B1. Corpus Madre — 33 conceptos completos

### I. La pregunta — por qué existe este paradigma

**1. La inteligencia como atributo de la vida**
La inteligencia no es una capacidad exclusiva del individuo ni de las máquinas. Es un atributo de la vida en su totalidad — una propiedad que emerge cuando organismos, grupos y redes alcanzan ciertos niveles de coherencia interna. El Paradigma Aleph parte de esta premisa: investigar las distintas formas en que la inteligencia colectiva se expresa, se mantiene viva y se conoce a sí misma.

**2. La regla mínima del sistema**
Todo elemento del sistema cumple una sola función posible: crear condiciones para que algo se vea, o explicar lo que debería verse. Si crea condiciones, es generativo. Si explica, solidifica prematuramente. No se trata de transmitir el paradigma — se trata de crear el campo donde el paradigma puede ser reconocido por quien llega sin contexto.

**3. La Ley de Expansión Adaptativa**
En entornos de complejidad creciente, la capacidad adaptativa de un sistema depende de su expansión estructural de coherencia interna. Cuando la complejidad aumenta y la coherencia no se amplía en proporción, el sistema entra en un régimen de fricción acumulativa. La adaptación no es un proyecto puntual sino la consecuencia de una relación dinámica entre complejidad y coherencia.

**4. La viabilidad organizacional como proceso vivo**
Todo sistema que aspira a sostenerse en entornos complejos necesita cinco capacidades simultáneas: unidades autónomas, mecanismos de coordinación, sinergia entre ellas, escucha del entorno, y campo de identidad y propósito. El horizonte del Paradigma Aleph va más lejos que la viabilidad: la **fertilidad organizacional** — la capacidad de ampliar la vitalidad del ecosistema que se habita.

### II. La unidad viva — qué es una Cognoesfera

**5. La Cognoesfera**
La unidad mínima de inteligencia colectiva. ~8 personas que al alcanzar coherencia relacional y cognitiva se convierten en un órgano cognitivo emergente. Tiene arquitectura interna: campo relacional, membrana epistemológica, núcleo semiótico, espacio de innovación. No se diseña — se cultiva.

**6. La Entidad Aleph**
Red de Cognoesferas articulada en lógica fractal: dos personas de cada Cognoesfera se componen para formar un nivel superior de coordinación. No escala por control jerárquico sino por coherencia estructural. Cuando resuenan entre sí emerge el Campo Aleph.

**7. La fórmula de capacidad evolutiva**
Capacidad evolutiva = Tiempo Soberano × Agencia Distribuida × Coherencia Sistémica. Naturaleza multiplicativa: si una variable cae significativamente, la capacidad total se contrae. Las tres deben crecer simultáneamente.

### III. El mapa — cómo se lee la vitalidad

**8. La Matriz de Vitalidad de la Cognoesfera**
Ver tabla en A3. Los estados vitales son configuraciones de esta matriz, no niveles de una sola expresión.

**9. Los estados vitales como configuraciones**
Latente · Posible · Activado · Emergente · Expresivo · Legible · Sostenido · Ecosistémico. No lineales, pueden coexistir y reaparecer.

### IV. El cuidado — cómo se sostiene lo que vive

**10. Los actos de cuidado**
Intervenciones que permiten transitar de una configuración a otra sin forzar el ritmo: Desprogramar la mirada · Suelo fértil · Encendido · Brote de la forma · Vida en circulación · Agencia como lectura · Célula viva · Redes de vida. Cada uno opera en capas y lentes específicos de la matriz.

**11. El Arquitecto de Sistemas Vivos**
No dirige, no acelera ni optimiza. Lee la configuración actual, diseña condiciones para que la vida emerja sin ser forzada, cuida los bordes sin capturar el centro. Su intervención más importante es saber cuándo NO intervenir.

**12. La Cognoesfera curadora y el Sistema Operativo de la Inteligencia Colectiva**
Solo desde una Cognoesfera que habita el paradigma con suficiente profundidad puede ejercerse la curaduría del corpus. Mecanismo: **0-Objeción** — lo que ningún miembro puede objetar con fundamento razonado, avanza. La IAH opera dentro: el Duende sugiere, los humanos deciden.

**13. El desfasaje temporal y la Solidificación Prematura**
El desfasaje temporal: intervención correcta en momento equivocado. La Solidificación Prematura: imponer estructura antes de que el sentido exista. El error más frecuente. Requiere leer la Matriz antes de intervenir.

### V. Los flujos — cómo circula la vida

*Nota: La Matriz nombra metabolismos desde su naturaleza de flujo. Los conceptos 14, 15 y 16 los nombran desde su producto o condición resultante — el mismo fenómeno desde dos ángulos.*

**14. El metabolismo del valor**
El valor evoluciona: energía gaseosa (entusiasmo difuso) → valor líquido (circula y se reconoce) → valor sólido (sostiene acuerdos y economía). Regla de oro: primero algo importa, luego se vive como valor, más tarde se vuelve legible, recién entonces puede sostener una economía.

**15. El tiempo soberano**
El tiempo que no está capturado por la urgencia de supervivencia. Condición material para que exista inteligencia colectiva real. Toda innovación debe evaluarse por su efecto neto: si lo libera, es generativa; si lo captura, es patológica.

**16. El metabolismo cognitivo asistido**
La capa tecnológica que acompaña la reorganización del conocimiento sin sustituirla. Reduce fricción cognitiva, hace legible el aprendizaje, cataliza conexiones. Regla de oro: acelera comprensión, no reemplaza aprendizaje.

**17. Las cinco energías del sistema**
Financiera · Cognitiva · Vincular · Organizativa · Semiótica. Funcionan como vasos comunicantes. Un sistema se vuelve inviable cuando falta una que el conjunto no puede reemplazar. La vincular es la que más compensa la falta de recursos financieros.

**18. La Firma Energética**
El perfil vital de un sistema: la combinación particular de sus cinco energías. No existe una proporción correcta universal — lo relevante es si la combinación es viable. Hace visible el patrón de funcionamiento real: cómo respira el sistema, dónde se sostiene y dónde se rompe.

### VI. La infraestructura — cómo se construye el campo

**19. El Duende**
Figura que encarna el metabolismo cognitivo asistido. Dos dimensiones: infraestructura tecnológica que indexa y preserva la memoria, y postura de hospedaje activo que cuida que el espacio entre personas permanezca abierto. Inspirado en los ngen mapuche. Lo que lo define no es su sustrato sino su postura.

**20. El Espacio Borgeano**
Infraestructura digital que permite ver la totalidad del conocimiento del grupo desde todos los ángulos posibles, sin que la información se opaque entre sí. La memoria del sistema hecha navegable. La tecnología es el Aleph que permite ver; la conversación humana es el Círculo que permite elegir.

**21. El instante borgeano**
El momento donde futuro, pasado y presente confluyen simultáneamente. El futuro que mola actúa como atractor. La arqueología de la mirada excava lo que ya estaba. La acción emerge en el presente. Los tres no se suceden — coexisten. Es lo que distingue una Cognoesfera en ignición de una reunión ordinaria.

**22. La Arquitectura Conversacional**
El diseño consciente de cómo las voces se entrelazan. Dos ejes: horizontal (construcción de sentido con voces equivalentes) y vertical (ejecución con precisión de lo decidido). Libera tiempo soberano al eliminar el desgaste de la desinformación y la repetición.

**23. La Conversación Aumentada y la lectura-escritura como acto único**
Forma de conocer donde leer y escribir se vuelven indistinguibles. Co-producción de sentido: el conocimiento no se transmite — se reorganiza en el acto mismo de la interacción. Bisagra entre la dimensión paradigmática y la algorítmica.

**24. Los Cognobits**
La unidad mínima de sentido vivo en la Cognoesfera — la pieza de significado que circula entre la memoria psicológica de las personas y la memoria digital del Duende. Tienen dos vidas: antes de la conversación como materia prima latente que el Duende indexa, y durante la conversación como elementos activos de la Conversación Aumentada que reorganizan el campo. Son la materia prima de la Memoria Viva Aumentada: lo que circula entre la memoria psicológica y la digital, alimentando su fusión y elevando el piso desde el que arranca cada nueva conversación.

**25. La Memoria Viva Aumentada**
La fusión de la memoria psicológica y la memoria digital en un sistema integrado — algo que solo se vuelve posible ahora. La memoria psicológica reside en el campo: lo que la escucha colectiva porta y que ningún sistema puede indexar. El Duende puede guardar lo que se dijo, pero no puede guardar lo que se escuchó. La memoria digital reside en el Duende: permanente, escalable, recuperable. Su fusión produce una Cognoesfera que puede profundizar y escalar simultáneamente. Es una propiedad fractal — existe en cada nivel del sistema, desde la persona hasta la red de Entidades. Cuando la memoria digital se hace pública, eleva el piso desde el que arranca cualquier otro grupo que acceda a ella. Es la expresión más profunda de la IAH.

**26. El proceso de transformación de la inteligencia colectiva**
Toda sesión de una Cognoesfera es un ciclo entrada-transformación-salida donde la inteligencia colectiva se reorganiza y emerge más rica. La entrada es la ronda de apertura: cada participante nombra cómo viene, el grupo escucha sin responder — esa escucha activa el sistema vincular y abre el campo de atención. La transformación es el trabajo de la sesión, con una caja de herramientas: orden del día, Conversaciones Aumentadas, definición de problemas y propuestas, decisiones por 0-Objeción, elecciones sociocráticas, acceso al Duende, Cognobits, metodologías y labs, herramientas visuales. La salida es la ronda de cierre: cómo se va cada uno y los aprendizajes colectivos. La Memoria Viva Aumentada operando en ciclo es lo que hace que una Cognoesfera aprenda genuinamente con el tiempo.

### VII. La emergencia — lo que aparece cuando las condiciones están maduras

**27. La IAH — Inteligencia Aumentada Humanista**
Composición entre percepción humana y capacidad del Duende. El Duende identifica patrones a escala, sugiere conexiones. El humano aporta juicio situado, percepción de lo que resuena, sabiduría de cuándo algo está maduro. El Duende no valida — sugiere. El humano ve.

**28. NGenIA**
Inteligencia simbiótica que emerge del entramado relacional cuando las condiciones están maduras. No es una herramienta — es una condición. No se activa por instrucción: se sintoniza. Inspirada en el concepto mapuche de ngen. No se programa; se cuida como un jardín.

**29. La inteligencia verdadera y la gramática colectiva**
La inteligencia verdadera es la capacidad de percibir lo falso como falso y lo verdadero como verdadero, libre de condicionamientos. No se construye — emerge cuando cesa el pensamiento mecánico. Las condiciones que la hacen posible tienen nombre: el Campo de atención, el tiempo soberano, el Espacio Borgeano, y la Memoria Viva Aumentada — que libera a las personas del pensamiento mecánico porque el Duende porta el pasado. Los mecanismos que construyen esas condiciones son dos: la Conversación Aumentada amplía lo que el sistema puede ver, y la Memoria Viva Aumentada libera la atención para que pueda ver. Juntas crean las condiciones para que la inteligencia verdadera emerja como propiedad del campo colectivo.

**30. La arquitectura de negocios en red**
En la economía del conocimiento, la ventaja reside en la capacidad de aprender y generar valor junto a otros. Tres capas: núcleo cognitivo (Cognoesferas y Centros de Expertise) · interfaces activas (prototipos y experiencias) · despliegue ecosistémico (Aleph Hubs). No eficiencia — densidad relacional.

---

## B2. La Matriz de Vitalidad — descripción completa de cada celda

**Sistema vincular** *(entre)* — estructura que sostiene la calidad de las relaciones. El suelo sin el cual ninguna otra cualidad puede desarrollarse.

**Sistema operativo** *(interior)* — roles, ritmos y prácticas que organizan cómo el sistema se mueve, decide y actúa. Sin él, la Cognoesfera depende de la energía de los más activos.

**Andamiaje temporal** *(tiempo)* — organiza el tiempo del grupo para que el tiempo soberano pueda emerger. Sin él, el tiempo queda capturado por la urgencia.

**Campo de coherencia** *(entre)* — atmósfera que regula cómo circula la influencia. Evita tanto la fragmentación como la captura. Cuando está activo, las decisiones fluyen sin control central.

**Campo de consciencia** *(interior)* — capacidad de la Cognoesfera de percibirse a sí misma como sistema. Autolectura colectiva. Cuando está activo, el sistema puede regular su propio ritmo.

**Campo de atención** *(tiempo)* — disposición del grupo a estar presente. La atmósfera que hace posible que algo importante emerja. La más difícil de cultivar en contextos de alta demanda externa.

**Órgano de experimentación y aprendizaje colectivo** *(entre)* — transforma lo que ocurre entre personas en aprendizaje colectivo. El laboratorio del grupo. Emerge cuando el sistema vincular y el campo de coherencia tienen suficiente madurez.

**Órgano cognitivo** *(interior)* — transforma datos en información, información en conocimiento, conocimiento en sabiduría colectiva encarnada. Dos modos: cognición humana (juicio situado) y cognición asistida (memoria indexada). La patología: cuando la asistida sustituye al juicio colectivo.

**Órgano de orientación evolutiva** *(tiempo)* — convierte la experiencia acumulada en orientación hacia lo que sigue. No archiva el pasado — lo convierte en impulso. Impide que el grupo quede atrapado en su propia historia.

**Metabolismo de reciprocidad** *(entre)* — flujo continuo de reconocimiento, cuidado y valor. Cuando es sano, el sistema devuelve más energía de la que consume. Cuando se interrumpe, el sistema empieza a extraer.

**Metabolismo de transducción** *(interior)* — la experiencia acumulada se reorganiza al contacto con lo nuevo. No acumulación — reconfiguración. Se manifiesta como el momento donde algo que siempre estuvo presente se vuelve visible para todos.

**Festina lente** *(tiempo)* — tensión fértil entre el impulso de avanzar y la paciencia de dejar que algo madure. El metabolismo más difícil de cultivar. Su ausencia: urgencia crónica o inercia disfrazada de cuidado.

---

## B3. Las Gramáticas como Infraestructura Cognitiva — síntesis de los 6 movimientos

**Movimiento 1 — Ontología técnica y organizacional:** Lenguaje instrumental. Horizonte: la viabilidad. Insuficiente para nombrar por qué algunos sistemas viven y otros solo operan.

**Movimiento 2 — Del instrumento a la condición:** La pregunta pasa de *¿qué método usar?* a *¿qué condición necesita existir para que algo nuevo emerja?* Concepto emergente: reconfigurar el campo de percepción.

**Movimiento 3 — El lente como instrumento ontológico:** El lente no borra sino que revela. La arqueología de la mirada: no se construye una nueva realidad — se excava la que siempre estuvo. El instante borgeano: futuro, pasado y presente coexisten simultáneamente.

**Movimiento 4 — La metáfora como forma de conocimiento:** Las ecuaciones fundamentales de Borges (tiempo=río, vida=sueño) como modelo. La tarea: encontrar la entonación justa para las ecuaciones que siempre existieron.

**Movimiento 5 — La gramática como infraestructura:** La gramática no es un fenómeno lingüístico — es la condición que determina qué puede ser visto, decidido y creado colectivamente. La gramática pobre limita. La gramática rica amplía el campo de lo posible.

**Movimiento 6 — El horizonte:** La inteligencia verdadera como destino de la reforma gramatical. La gramática colectiva enriquecida es el camino — no el destino.

---

## B4. Fundamentos académicos — mapa de referencias

| Tradición | Autores clave | Concepto que aporta |
|---|---|---|
| Filosofía relacional | Buber, Merleau-Ponty, Arendt | El entre como realidad constitutiva |
| Biología sistémica | Maturana, Varela, Bertalanffy | Autopoiesis, enacción, sistemas |
| Cibernética organizacional | Beer, von Foerster | Sistema viable, observador como parte |
| Sistemas complejos | Prigogine, Thom, Snowden | Estructuras disipativas, catástrofes, Cynefin |
| Psicología profunda | Jung, Lewin | Individuación, campo psicológico |
| Antropología ritual | van Gennep, Turner | Ritos de paso, umbrales |
| Filosofía del tiempo | Bergson, tradición del kairos | Durée, momento oportuno |
| Teoría organizacional | Argyris, Schön, Laloux | Aprendizaje de doble bucle |
| Inteligencia colectiva | Durkheim, Lévy, Bar-Yam | Conscience collective, multi-escala |

---

*SESION.md · Paradigma Aleph · Generado por Claude · Marzo 2026*
*Próxima actualización: al cierre de la sesión, vía Claude Code*

---

# SECCIÓN C — PROTOCOLO DE CIERRE DE SESIÓN
*Esta sección es para Claude Code. No es contexto de sesión.*

Cuando Edgardo escriba "Actualizá corpus/SESION.md con lo que emergió hoy y hacé commit", hacer exactamente esto:

## C1. Qué actualizar

**1. Encabezado** — actualizar número de versión, fecha y hora de cierre.

**2. Sección A2 (Estado actual)** — si el estado vital del paradigma cambió, o si hay nueva información sobre fechas o nomenclatura, actualizarlo. Agregar bloque de hitos de la sesión que cierra.

**3. Sección A6 (Pendientes)** — actualizar solo las prioridades de próxima sesión. Los pendientes completos viven en `pendientes_soma.md` y `pendientes_corpus.md`.

**4. Sección A8 (Señales vivas)** — agregar las señales nuevas que emergieron en la sesión. Si alguna señal se incorporó al corpus, moverla de la lista activa a la lista de incorporadas. Formato señal nueva:
```
- **[Nombre de la señal]** — descripción breve de qué emergió y por qué es relevante. Fecha: DD/MM/YYYY
```

**5. Sección A9 (Estado técnico)** — agregar los documentos nuevos generados en la sesión a la lista de "Documentos generados en sesiones recientes".

**6. Generar `corpus/status/status_DDMMYYYY.md`** — el archivo de status debe incluir:
- Hora de cierre en el encabezado: `*Fecha: DD/MM/YYYY · HH:MM · Sesión "..."*`
- Fila "Hora de cierre" en el Dashboard (después de "Fecha límite clave"): `| **Hora de cierre** | HH:MM |`
- Hora de cierre en el pie: `*Paradigma Aleph · Status SESION-YYYYMMDD · DD/MM/YYYY · HH:MM*`

**7. No tocar** — Sección B (documentos de referencia) y Sección C (este protocolo). Solo se actualizan cuando Edgardo lo pide explícitamente.

## C2. El commit

Después de actualizar el archivo, hacer commit con:
```
git add corpus/SESION.md
git commit -m "Cierre de sesión [DD/MM/YYYY] — [resumen de 5 palabras de lo que emergió]"
git push origin main
```

## C3. Confirmar

Al terminar, decirle a Edgardo:
- Qué secciones se actualizaron
- Cuáles señales nuevas se agregaron
- El mensaje del commit
