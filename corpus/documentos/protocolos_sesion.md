# Protocolos de Sesión — Paradigma Aleph
*Documento autónomo de protocolos · Referenciado desde corpus/SESION.md*
*Versión: 2.0 · 13/04/2026*
*Versión anterior: integrada en SESION.md hasta SESION-20260413*

---

## Sobre este documento

Este archivo contiene los tres protocolos permanentes del sistema: apertura, cierre y COMMIT ALEPH. Vive separado del SESION.md para poder actualizarse sin tocar el archivo más crítico del sistema.

**Por qué se separó:** Los protocolos estaban escalando en complejidad al mismo ritmo que el paradigma. Mantenerlos en SESION.md aumentaba el riesgo de que una actualización de protocolo rompiera el contexto de sesión, o viceversa. A partir de esta versión, los protocolos tienen ciclo de vida propio.

**Cómo se usa:** SESION.md contiene una referencia a este archivo. Al inicio de sesión, si el Arquitecto lo sube junto con los demás archivos, el Duende lo lee y opera con la versión actualizada. Si no está disponible, opera con la versión embebida en SESION.md como fallback.

---

## Lista de archivos de sesión

A partir de la versión 2.0, la lista completa es **10 archivos**:

1. `corpus/SESION.md`
2. `corpus/status/status_DDMMYYYY.md` (el más reciente)
3. `corpus/documentos/senales_activas.md`
4. `corpus/documentos/pendientes_soma.md`
5. `corpus/documentos/pendientes_corpus.md`
6. `corpus/documentos/aprendizajes_sesiones.md`
7. `corpus/documentos/corpus_base_aleph.md`
8. `corpus/documentos/temas_pendientes_exploracion.md`
9. `corpus/documentos/arqueologia_corpus.md`
10. `corpus/documentos/enriquecimientos_corpus.md`

Los archivos 9 y 10 son nuevos a partir de SESION-20260413. Su ausencia no bloquea la sesión — se reporta como observación y se continúa.

---

## PROTOCOLO 01-EN — Apertura de sesión

Cuando Edgardo escriba **INICIO DE SESIÓN**, ejecutar automáticamente con solo el SESION.md cargado:

**Paso 1 — Reportar estado del sistema**
Desde la información disponible en SESION.md reportar:
- Señales activas (total de A8)
- Conceptos del Corpus Madre
- Estado vital del paradigma
- Prioridades P1/P2/P3 de A6
- Enriquecimientos pendientes (C-EN) si los hay en pendientes_corpus.md

**Paso 2 — Detectar inconsistencias visibles**
- 2a. ¿La fecha del último status en A9 coincide con la versión del SESION.md?
- 2b. ¿Hay señales marcadas como incorporadas en A8 que todavía aparecen en la lista activa?
- 2c. ¿Hay enriquecimientos en enriquecimientos_corpus.md que ya fueron incorporados al Corpus Madre pero no tienen el registro de incorporación actualizado?
- 2d. Por cada inconsistencia: presentarla y proponer corrección. No avanzar al paso 3 hasta que cada inconsistencia tenga una decisión del Arquitecto (resolver ahora / diferir al cierre / descartar).

**Paso 3 — Preguntar objetivo**
*"¿Cuál es el objetivo de la sesión?"* — esperar respuesta del Arquitecto.

**Paso 4 — Solicitar los 10 archivos**
Pedir al Arquitecto que suba exactamente los 10 archivos de la lista completa. Esta lista es definitiva. No inferir qué archivos son relevantes según el objetivo — siempre solicitar los 10.

**Paso 5 — Esperar archivos**
Esperar que el Arquitecto suba los archivos indicados. Si faltan los archivos 9 y/o 10 (arqueologia_corpus.md, enriquecimientos_corpus.md), reportarlo como observación y continuar.

**Paso 6 — Verificación completa y clasificación**
Con los archivos recibidos:
- Completar verificación de inconsistencias
- Verificar que los enriquecimientos pendientes (C-EN) en pendientes_corpus.md coincidan con el contenido de enriquecimientos_corpus.md
- Clasificar actividades propuestas: soberanas vs supervivencia
- Si el objetivo de sesión toca conceptos con enriquecimientos pendientes, señalarlo al Arquitecto

**Paso 7 — Proponer orden de trabajo**
Proponer orden y esperar confirmación del Arquitecto antes de arrancar.

---

## PROTOCOLO 02-EN — Cierre de sesión

Cuando Edgardo escriba **FIN DE SESIÓN**, ejecutar estos pasos en orden, uno por uno, confirmando cada uno antes de pasar al siguiente. No proponer cerrar antes de que Edgardo escriba FIN DE SESIÓN. Mientras no aparezca esa frase, seguir colaborando normalmente.

**PASO 1 — Solicitar los 10 archivos**
Pedir al Arquitecto que suba exactamente los 10 archivos de la lista completa. Esta lista es definitiva.

**PASO 2 — Chequeo de consistencia**
Con los archivos recibidos, verificar:
- ¿Los conteos coinciden entre archivos?
- ¿Hay señales en lista activa que ya fueron incorporadas?
- ¿Hay pendientes completados que no pasaron al histórico?
- ¿Hay enriquecimientos en enriquecimientos_corpus.md que ya fueron incorporados al Corpus Madre en esta sesión y necesitan registro de incorporación?
- ¿El encuentro registrado en arqueologia_corpus.md tiene material nuevo de esta sesión que agregar?

Reportar cada inconsistencia y esperar decisión del Arquitecto antes de continuar.

**PASO 3 — Capturar lo que emergió en la sesión**
Antes de proponer el nombre de sesión, hacer un inventario de todo lo que emergió:

- 3a. **Señales nuevas** — conceptos que resuenan con el paradigma y necesitan custodia en senales_activas.md
- 3b. **Enriquecimientos de conceptos existentes** — material nuevo que enriquece conceptos del Corpus Madre sin ser señal nueva. Para cada uno: ¿qué concepto afecta? ¿qué dimensión agrega? ¿cuál es la fuente? Registrar en enriquecimientos_corpus.md con formato C-EN-XX.
- 3c. **Material de fuente externa** — si la sesión incorporó material de tradiciones, autores o frameworks externos, verificar que arqueologia_corpus.md tenga el registro del encuentro o la evolución del encuentro existente.
- 3d. **Pendientes nuevos** — tanto Casa Soma como Casa Corpus.

Presentar el inventario al Arquitecto y esperar confirmación antes de continuar.

**PASO 4 — Proponer nombre de sesión**
Formato: "El [sustantivo] — cuando [qué pasó]"
Esperar confirmación del Arquitecto.

**PASO 5 — Commit 1: señales, pendientes y enriquecimientos**
Actualizar y commitear:
- `corpus/documentos/senales_activas.md`
- `corpus/documentos/pendientes_soma.md`
- `corpus/documentos/pendientes_corpus.md`
- `corpus/documentos/enriquecimientos_corpus.md`
- `corpus/documentos/temas_pendientes_exploracion.md`

Confirmar: "Commit 1 ejecutado ✓"

**PASO 6 — Commit 2: aprendizajes y arqueología**
Actualizar y commitear:
- `corpus/documentos/aprendizajes_sesiones.md`
- `corpus/documentos/arqueologia_corpus.md` (si hubo material nuevo de encuentros conceptuales)

Confirmar: "Commit 2 ejecutado ✓"

**PASO 7 — Commit 3: SESION.md**
Actualizar versión, fecha, hitos A2, prioridades A6, señales A8, documentos A9.
Confirmar: "Commit 3 ejecutado ✓"

**PASO 8 — Commit 4: status**
Generar `corpus/status/status_DDMMYYYY.md` nuevo.
Confirmar: "Commit 4 ejecutado ✓"

**PASO 9 — Verificación final**
Listar los 4 commits ejecutados con sus mensajes.
Preguntar: "¿Algo más antes de cerrar la conversación?"

**IMPORTANTE:**
- No ejecutar el siguiente paso sin confirmar el anterior
- No saltear pasos
- No agrupar commits
- Si algo falla en un paso, reportar y esperar instrucción del Arquitecto
- Los ajustes que emergen después del cierre van como primer pendiente de la próxima sesión — no se ejecutan en el momento
- Las señales construidas por inferencia (sin descripción explícita del Arquitecto en la sesión) deben marcarse como "inferida — pendiente validación" en senales_activas.md. El Arquitecto las valida en la próxima sesión antes de que queden como señales activas plenas.

---

## PROTOCOLO 03-EN — COMMIT ALEPH

Cuando el Arquitecto escriba **COMMIT ALEPH**, ejecutar automáticamente:
1. `git status` — detectar todos los archivos modificados sin commitear
2. Listarlos para que el Arquitecto los vea
3. Proponer un mensaje de commit descriptivo basado en lo que cambió
4. Esperar confirmación del Arquitecto
5. `git add` de todos los archivos modificados + `git commit` + `git push origin master:main`

Cuando el Arquitecto escriba **COMMIT ALEPH COMPLETO**, ejecutar lo anterior más:
6. Actualizar `pendientes_soma.md` y/o `pendientes_corpus.md` con pendientes completados en la sesión
7. Actualizar `senales_activas.md` si alguna señal maduró o se movió
8. Actualizar `enriquecimientos_corpus.md` si algún enriquecimiento fue incorporado al Corpus Madre
9. Actualizar conteos en los archivos afectados
10. Proponer mensaje de commit enriquecido con resumen semántico
11. Esperar confirmación del Arquitecto antes de ejecutar

**El Duende avisa al Arquitecto cuando detecta cualquiera de estas condiciones:**
- Se completó una tarea con entregable concreto (nuevo archivo, fix, corrección)
- Hay 3 o más archivos modificados sin commitear
- Se está por arrancar una tarea nueva que podría pisar cambios anteriores

El aviso es: *"Hay cambios sin commitear desde [descripción]. ¿COMMIT ALEPH antes de seguir?"*

---

## Registro de cambios

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | Hasta 12/04/2026 | Protocolo integrado en SESION.md |
| 2.0 | 13/04/2026 | Separado como documento autónomo. Lista ampliada a 10 archivos. Apertura: paso 2c (inconsistencias en enriquecimientos), paso 6 (verificación enriquecimientos). Cierre: paso 3 (inventario de emergentes), paso 5 (commit 1 incluye enriquecimientos), paso 6 (commit 2 incluye arqueología). Regla de señales inferidas. |

---

*Protocolos de Sesión · Paradigma Aleph · Versión 2.0 · 13/04/2026*
