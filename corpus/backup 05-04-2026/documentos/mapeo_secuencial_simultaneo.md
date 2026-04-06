# Mapeo Secuencial ↔ Simultáneo
*Arquitectura de las dos capas del Corpus Madre*
*Paradigma Aleph · Abril 2026*

---

## La decisión arquitectural

El Corpus Madre existe en dos capas que expresan el mismo conocimiento de formas distintas:

**Capa secuencial** — `corpus_base_aleph.md`
Texto continuo, evolución lenta, fuente de verdad. Lo que el lenguaje obliga a volver sucesivo. Es el Corpus Madre canónico — donde el conocimiento vive, crece y se versiona. Borges lo nombró con exactitud: *"lo que transcribiré, sucesivo, porque el lenguaje lo es."*

**Capa simultánea** — archivos HTML en `corpus/documentos/`
Collage de recuadros, cada uno una unidad completa de sentido. El intento de hacer simultáneo lo que el lenguaje obliga a volver sucesivo. El sentido emerge de las relaciones entre recuadros, no de la secuencia. Es la aproximación al Aleph — el punto donde todos los puntos coexisten.

**La regla que las sostiene:**
La capa secuencial es la fuente de verdad. La capa simultánea es su transducción visual. Si un concepto cambia en el Corpus Madre, el HTML se actualiza. No al revés.

**La tercera capa — futura:**
Obsidian como vault navegable donde cada concepto es una nota, los vínculos son explícitos, y la vista de grafo aproxima la simultaneidad del Aleph. Pendiente de implementación.

---

## Mapeo por concepto

### Concepto 5 — La Cognoesfera

**Archivo simultáneo:** `cognoesfera_definicion.html`
**Fecha de creación:** 02/04/2026

| Recuadro HTML | Etiqueta | Fragmento en Corpus Madre |
|---|---|---|
| El cuerpo que sostiene el campo | qué es | Núcleo — frase 1 y 2 |
| Universos posibles | qué produce | Núcleo — frase 3 |
| Las condiciones | qué la hace emerger | Expansión — frase 1 |
| Capas inseparables | qué la sostiene | Expansión — frase 2 |
| Agnóstica de contexto | dónde existe | Expansión — frase 3 |
| *se cultiva* (cierre) | su naturaleza | Núcleo — frase final |

**Acento del individuo** *(border-left dorado)*
→ Núcleo: "Cada persona mantiene su autonomía y su singularidad — la Cognoesfera no las disuelve sino que las amplifica en un plano que ninguna podría alcanzar sola."

**Nota de coherencia verificada:** cada recuadro del HTML tiene su equivalente exacto en el texto secuencial. El mismo conocimiento — dos formas de habitarlo. Verificación realizada el 02/04/2026.

---

## Convención para nuevos conceptos

Cuando se crea un nuevo archivo HTML para un concepto del Corpus Madre:

1. Agregar una sección en este documento con el nombre del concepto
2. Completar la tabla de mapeo recuadro ↔ fragmento
3. Verificar coherencia entre las dos capas antes de commitear
4. Registrar la fecha de creación y verificación

**Schema futuro en BD** — cuando haya 3 o 4 conceptos mapeados, este documento será la base para diseñar el schema. Campos probables: `concepto_id`, `recuadro_label`, `recuadro_etiqueta`, `fragmento_corpus`, `tipo` (núcleo/expansión), `fecha_verificacion`.

---

*Mapeo Secuencial ↔ Simultáneo · Paradigma Aleph · Abril 2026*
*La BD espera a que el patrón madure — Solidificación Prematura evitada conscientemente.*
