# Housekeeping pendiente — 23/04/2026

**Propósito:** Custodiar decisiones de mantenimiento del repo que quedaron pendientes al cierre de SESION-20260423-22. No forman parte del Protocolo 02-EN — son tareas para un addendum posterior o para la próxima sesión de Soma.

**Contexto:** Al ejecutar `git status` al cierre del Protocolo 02-EN, aparecieron archivos sin commitear que requieren decisión. Se documentan aquí para no perder el contexto sin tomar decisiones apresuradas.

---

## Acción 1 · Commitear `fuente_sesion_20260420_triada_teorica_v2.md`

**Archivo:** `corpus/documentos/fuente_sesion_20260420_triada_teorica_v2.md`
**Estado:** Untracked — archivo generado en SESION-20260420-21, referenciado en A9 de SESION.md.
**Decisión sugerida:** Commitear con mensaje:
```
docs(corpus): fuente NotebookLM SESION-20260420-21 — recorrido teórico triada v2
```
**Riesgo de no hacerlo:** El archivo existe localmente pero no está en el repo remoto. Si se pierde el entorno local, se pierde la fuente.

---

## Acción 2 · Verificar e incorporar `entrada_aprendizajes_sesiones.md`

**Archivo:** `corpus/documentos/entrada_aprendizajes_sesiones.md`
**Estado:** Untracked — contiene el borrador de aprendizajes de SESION-20260419 ("La sintonización del Duende").
**Decisión requerida:** Verificar si el contenido ya fue incorporado a `aprendizajes_sesiones.md` en el cierre de SESION-20260419.
- Si **ya está incorporado**: descartar el archivo (residuo de trabajo).
- Si **no está incorporado**: incorporar el contenido a `aprendizajes_sesiones.md` y commitear.
**Nota:** El archivo tiene contenido rico y propio de esa sesión — no descartar sin verificar primero.

---

## Acción 3 · Descartar `instrucciones_estado.md`

**Archivo:** `corpus/documentos/instrucciones_estado.md`
**Estado:** Untracked — instrucciones para aplicar el Commit 4 del cierre de SESION-20260419 (actualizar SESION.md a v32, desdoblar fila P1, etc.).
**Decisión sugerida:** Descartar. Ese trabajo ya fue ejecutado hace sesiones. El archivo es residuo operativo sin valor futuro.
**Acción:** `rm corpus/documentos/instrucciones_estado.md` — no requiere commit.

---

## Acción 4 · Decidir sobre `Output/instrumento_mockup_v11.html` ⚠

**Archivo:** `outputs/instrumento_mockup_v11.html` (carpeta `Output/` en la raíz del repo)
**Estado:** Untracked — carpeta `Output/` no está en `.gitignore`.
**Por qué esta decisión no es trivial:**
- El archivo `instrumento_mockup_v11.html` es la **autoridad visual de MapaIC** — está referenciado explícitamente en `corpus/documentos/pasaje_contexto.md` como "Referencia visual final del Mapa de la inteligencia colectiva de Quanam. Autoridad de diseño para MapaIC."
- También referenciado en A9 de `corpus/SESION.md` como `outputs/instrumento_mockup_v11.html`.
- Si no está en el repo, el próximo Duende que arranque Vector 4 no puede acceder al mockup como SKILL implícita (Señal 1402 de `senales_activas.md`).

**Dos opciones:**
- **Opción A — Commitear:** `git add Output/ && git commit -m "feat(mockup): instrumento_mockup_v11.html — autoridad visual de MapaIC"`. Ventaja: el mockup viaja con el repo. Desventaja: los archivos HTML grandes pueden inflar el historial.
- **Opción B — Gitignorear:** Agregar `Output/` a `.gitignore` y custodiar el archivo por otra vía (Drive, Dropbox, etc.) con referencia en el pasaje_contexto.md. Requiere actualizar las referencias en SESION.md y pasaje_contexto.md para que apunten a la ubicación real.

**Recomendación:** Opción A, a menos que haya política de no versionar archivos HTML generados.

---

## Acción 5 · Agregar `Output/` y `convs_temp.txt` a `.gitignore`

**Archivos:** `Output/` (carpeta) y `convs_temp.txt` (raíz del repo)
**Estado:** Untracked — ninguno está en `.gitignore` actual.
**`convs_temp.txt`:** Logs temporales de conversaciones del Duende. Residuo de entorno. No hay razón para versionarlo.
**`Output/`:** Depende de la decisión de la Acción 4. Si se elige Opción B (gitignorear el mockup), agregar aquí. Si se elige Opción A (commitear), no agregar a `.gitignore`.
**Acción sugerida para `convs_temp.txt`:** Agregar a `.gitignore` incondicionalmente.

```
# Agregar al .gitignore:
convs_temp.txt
# Output/ — solo si se decide no versionar (ver Acción 4)
# Output/
```

---

*Generado al cierre de SESION-20260423-22 · Para procesar en addendum o próxima sesión de Soma.*
