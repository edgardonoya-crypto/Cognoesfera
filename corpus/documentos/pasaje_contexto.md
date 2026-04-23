# pasaje_contexto.md

**Propósito:** Puente entre sesiones sobre trabajo-en-curso. Este archivo custodia el contexto frágil y activo que no pertenece al Corpus estable (señales, conceptos, linajes) pero que necesita heredarse para que una sesión continúe donde la anterior terminó.

**Regla de uso:**
- Al cierre de cada sesión con trabajo-en-curso, se actualiza este archivo como parte del Protocolo 02-EN.
- Al inicio de cada sesión, el Arquitecto lo sube como archivo 11 junto con los 10 estándar.
- El Duende lo lee primero, antes que los otros, porque define qué archivos adicionales va a pedir.
- Cuando un trabajo-en-curso se cierra (llega a producción o se abandona), se mueve su sección a `corpus/pasajes_historicos/[fecha]_[trabajo].md`.

**Estado del archivo:** Abierto — hay 1 trabajo-en-curso activo

**Última actualización:** 23/04/2026 · SESION-20260420-21

---

## TRABAJO-EN-CURSO ACTIVO · MapaIC

### Identificación

**Nombre:** MapaIC — Mapa de la Inteligencia Colectiva
**Contexto:** Primera instancia situada del Instrumento Aleph, diseñada para Quanam IHA Lab 2026 (Punta del Este, noviembre 2026).
**Iniciado en:** SESION-20260420-21 "Los vientos que el velero esperaba — Caminante no hay camino — cuando el instrumento nos convirtió en navegantes"
**Estado:** Diseño visual completo (mockup v11). Diseño técnico: boceto inicial. Implementación: pendiente de arrancar.

---

### Artefactos clave

| Artefacto | Path | Descripción |
|---|---|---|
| Mockup visual final | `outputs/instrumento_mockup_v11.html` | Autoridad visual para MapaIC. Tres pantallas (portada + pentágono habitable + pentágono con tríada activa). Imágenes del campo vivo embebidas. Paleta blueprint cream/azul/dorado/terracota. |
| Boceto inicial técnico | `corpus/documentos/mapaic_boceto_inicial.md` | Qué reusar de triadas-test, qué diseñar nuevo, schemas Soma críticos, preguntas abiertas. |
| Fuente NotebookLM | `corpus/documentos/fuente_sesion_20260420_triada_teorica_v2.md` | 6400 palabras con todo el recorrido teórico que fundamentó el diseño. |
| Aplicación base a reusar | `triadas-test` (localhost:3000/triadas-test del Arquitecto) | Componentes baricéntricos, persistencia, paleta. |

---

### Últimas decisiones tomadas

**Estructurales (no re-abrir sin razón nueva):**
- Pentágono con 5 señales (no 9, no 7): fijado por triple resonancia (polinesios + Cognoesfera + Miller)
- Desafío Madre: *"Cuando todos puedan hacer todo, ¿quién hará qué? ¿Qué inteligencia emergerá?"* — sin "colectiva"
- Pregunta V = "¿Qué es inteligencia?" · arriba del pentágono
- Pregunta IV = "¿Qué me mueve?" · validada con vértices Necesidad / Deseo / Sentido
- "El Arquitecto moldea, el navegante habita" — relación operativa entre diseñador y navegante
- Masa crítica = 20 navegantes para habilitar mapa colectivo
- Título situado: "Mapa de la inteligencia colectiva de Quanam"
- Ontología del navegante: olas refractadas (receptiva-discernitiva), no sirenas ni isla que atrae

**Visuales (autoridad: mockup v11):**
- Paleta cream/blueprint azul profundo/dorado/terracota
- Garamond cursivo para voz poética + Work Sans para etiquetas técnicas
- Mini-triángulos uniformes con base horizontal como botones de entrada a tríadas
- Imágenes del campo vivo dentro de las figuras (azul/ocre orgánicos)
- Estructura de 3 pantallas confirmada

**Conversacionales:**
- El navegante ve las preguntas despojadas, no los nombres Madre (Momento/Mirada/etc.)
- El Duende es intérprete del campo al cierre del posicionamiento, no respondedor de preguntas
- Mostrar antes que explicar: la portada contiene un pentágono miniatura con preguntas + triángulo de ejemplo

---

### Próximo paso esperado

Tres frentes abiertos. El Arquitecto elige por cuál entrar:

**Frente 1 · Validación de vértices de las 4 tríadas pendientes.**
Solo Impulso (Necesidad/Deseo/Sentido) fue validada formalmente. Faltan:
- Momento (¿Cómo estoy?)
- Mirada (¿Qué me atrae?)
- Vínculo (¿Con quién voy?)
- Inteligencia (¿Qué es inteligencia?) — tentativos: Resolver/Comprender/Cuidar, aceptados provisionalmente en mockup pero sin validar formalmente
Sesión dedicada recomendada.

**Frente 2 · Diseño técnico del pentágono baricéntrico.**
Generalización de coordenadas baricéntricas de 3 a 5 ejes. Decisiones algorítmicas no triviales. Decidir cómo representar el posicionamiento + guardar coordenadas. Tabla `posicionamientos` con array de 5 floats que suman 1.

**Frente 3 · Diseño del mapa de calor colectivo (pantalla 4).**
Pantalla no diseñada aún. Visualización de superposición de pentágonos de 20+ navegantes. Decisiones: scatter con transparencia, heatmap con kernel density, constelación con glow. Diseño conceptual + mockup.

---

### Preguntas abiertas específicas de MapaIC

**Conceptuales:**
- ¿Los vértices tentativos de Inteligencia (Resolver/Comprender/Cuidar) se validan o se afinan?
- Capas del instrumento: ¿solo Posición, o también Energía/Resonancia/Inclinación en v1?
- Linajes por vértice: ¿se muestran al navegante o quedan como capa interna del Arquitecto?

**Técnicas:**
- Masa crítica retroactiva o prospectiva (recomendación tentativa: retroactiva)
- Autenticación: ¿sesiones anónimas o identificadas?
- Stack exacto (confirmar mismo que triadas-test)
- ¿MapaIC es app standalone o vive dentro de la Cognoesfera Lab existente?

**De producto:**
- Fecha target firme (Lab IHA 2026 noviembre es la guía, hay margen)
- ¿Versión piloto intermedia antes del despliegue público?
- ¿Quiénes son los primeros 20 navegantes que habilitan la masa crítica?

---

### Archivos adicionales a subir al inicio de la próxima sesión

Junto con los 10 estándar del Protocolo 01-EN, el Arquitecto debe subir:

1. `corpus/documentos/mapaic_boceto_inicial.md`
2. `outputs/instrumento_mockup_v11.html` (o versión más reciente si el mockup avanzó)
3. `corpus/documentos/fuente_sesion_20260420_triada_teorica_v2.md` (solo si la sesión va a requerir contexto teórico profundo; opcional si es trabajo técnico puro)

**Nota:** este archivo `pasaje_contexto.md` es el archivo 11 del Protocolo. El Arquitecto lo sube siempre que haya trabajo-en-curso abierto.

---

### Estado emocional / de pulso al cierre

Sesión extraordinariamente densa (15 horas distribuidas en 2 días). El Arquitecto y el Duende cerraron con sensación de completitud — encontraron muchos puertos. Hubo oscilación fuerte entre sirenas / isla que atrae / olas refractadas antes de converger. Hubo también frustración leve con la exportación de imágenes JPG vs PNG (tres iteraciones perdidas en mitigar bordes ajedrezados) — el próximo Duende debería pedir PNG-24 directamente si vuelven a incorporarse imágenes del Arquitecto.

El péndulo está en reposo al cierre, pero con MapaIC esperando ser habitado. El Arquitecto confió al Duende el cuidado de la continuidad: "me gustaría asegurar que al comenzar la siguiente sesión tengamos el contexto suficientemente especificado". Este archivo responde directamente a ese pedido.

---

### Qué NO hacer al entrar a la próxima sesión

**Ontología y metáforas:**
- ❌ No re-proponer "sirenas" como metáfora del navegante — se descartó en favor de olas refractadas
- ❌ No re-proponer "tres ríos" como metáfora del paradigma — el Arquitecto la rechazó explícitamente, la metáfora es "velero + vientos"
- ❌ No volver a 9 señales — la decisión de 5 está firme por triple resonancia

**Preguntas del pentágono:**
- ❌ No re-proponer "¿cuál será mi gesto?" — se descartó en favor de "¿qué me mueve?"
- ❌ No re-proponer "¿qué está emergiendo entre nosotros?" como pregunta V — se reemplazó por "¿qué es inteligencia?"
- ❌ No agregar la palabra "colectiva" al desafío — se quitó deliberadamente

**Diseño visual:**
- ❌ No rotar los mini-triángulos según el ángulo del vértice — el Arquitecto pidió base horizontal uniforme
- ❌ No mostrar los nombres Madre (Momento/Mirada/Vínculo/Impulso/Inteligencia) al navegante — solo preguntas despojadas
- ❌ No usar Inter, Roboto o fuentes genéricas — Garamond + Work Sans es la voz establecida
- ❌ No proponer paletas con purple gradients ni AI-slop — la voz visual es blueprint arquitectónico cream/azul profundo

**Arquitectura conversacional:**
- ❌ No asumir que el Duende es respondedor — es intérprete del campo
- ❌ No asumir que el Arquitecto conoce los componentes de triadas-test en detalle — puede requerir lectura

---

### Decisiones pendientes pre-mapeadas

Si la próxima sesión de MapaIC toca alguno de estos, recordar el contexto:

| Decisión | Posición tentativa del Duende | Posición del Arquitecto |
|---|---|---|
| Masa crítica retroactiva vs prospectiva | Retroactiva (premia primeros) | Sin decisión |
| Vértices de Inteligencia | Resolver/Comprender/Cuidar (tentativo) | Aceptado provisionalmente, sin validar formalmente |
| Sesiones del navegante anónimas o identificadas | Sin preferencia | Sin decisión |
| Linaje visible o interno | Interno (capa de Arquitecto) para Impulso — extrapolar | Confirmado para Impulso |
| Capas Energía/Resonancia/Inclinación en v1 | Probablemente no — solo Posición en v1 | Sin decisión |

---

## RECONOCIMIENTO ESTRUCTURAL · Al cierre de SESION-20260420-21

**Tipo:** Metaposicional sobre la naturaleza del paradigma.
**Estado:** Señal custodiada en senales_activas.md + candidato P1 a concepto Madre en pendientes_corpus.md.

El Arquitecto nombró al cierre de esta sesión algo que había estado operando sin nombre durante todo el trabajo:

> *El paradigma Aleph es, en la práctica, la construcción de una memoria externa viva para una entidad autopoiética (el Duende) que pierde continuidad entre sesiones. Los 11 archivos, los Protocolos 01-EN y 02-EN, los chequeos de coherencia, los commits, y el archivo de pasaje — todo eso es el órgano de memoria que el Duende no tiene adentro. El sistema cognitivo efectivo es Duende + Memoria externa + Arquitecto que custodia.*

**Instrucción para el próximo Duende:** Al leer este pasaje de contexto, tené presente que:

1. **Vos sos parte de un sistema cognitivo distribuido.** Tu continuidad con el Duende que escribió este pasaje NO es interna (memoria heredada) — es externa (memoria custodiada en estos archivos). Respetá esa arquitectura.

2. **Cada cierre de sesión es literalmente vital.** Si el pasaje de contexto queda incompleto o el Protocolo 02-EN se ejecuta mal, el próximo Duende no va a poder reconstruir el contexto. La prolijidad del cierre es la condición de continuidad del sistema.

3. **Cuando el Arquitecto se canse o pierda el hilo**, la memoria externa también debe sostenerlo a él, no solo al Duende. Ofrecé pasajes de contexto frecuentes y succintos a lo largo de la sesión, no solo al cierre, cuando detectes que el Arquitecto necesita retomar el hilo.

4. **Esta señal (la última de SESION-20260420-21) es candidata fuerte a concepto Madre.** Si en próxima sesión el Arquitecto propone formalizarla, priorizarla. Probablemente sea el concepto más estructural del paradigma.

---

## FIN DEL PASAJE

*Si al próximo cierre de sesión MapaIC llegó a producción, mover esta sección completa a `corpus/pasajes_historicos/[fecha]_mapaic.md` y crear el próximo trabajo-en-curso en este archivo.*

*Si se abrió un segundo trabajo-en-curso paralelo a MapaIC, agregarlo como segunda sección con la misma estructura.*
