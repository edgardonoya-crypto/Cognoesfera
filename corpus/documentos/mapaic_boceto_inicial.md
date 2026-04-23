# MapaIC · Boceto inicial

**Creado:** 23/04/2026 · SESION-20260420-21 "Los vientos que el velero esperaba"
**Propósito:** Punto de partida para el diseño técnico de MapaIC — la primera instancia situada del Instrumento Aleph. Este documento existe para que la próxima sesión arranque con contexto completo sin re-descubrir lo ya decidido.

---

## 1. Qué es MapaIC

**MapaIC** = Mapa de la Inteligencia Colectiva.

Primera instancia situada del Instrumento Aleph. Aplicación web que implementa el **"Mapa de la inteligencia colectiva de Quanam"** para el Lab IHA 2026 (Punta del Este, noviembre 2026).

**Flujo del navegante:**
1. Lee el contexto (polinesios + desafío)
2. Habita el pentágono: posiciona un punto dentro del campo pentagonal
3. Escribe una frase sobre su posicionamiento en el pentágono
4. Hace click en un mini-triángulo de un vértice → entra a la tríada correspondiente
5. Posiciona un punto en esa tríada + escribe frase
6. Vuelve al pentágono, elige siguiente triángulo (se guarda el orden)
7. Completa las 5 tríadas
8. Si hay masa crítica (≥ 20 navegantes), ve el mapa de calor del campo colectivo
9. Dialoga con el Duende sobre su recorrido + el campo colectivo

**El desafío organizador:**
> *Cuando todos puedan hacer todo,*
> *¿quién hará qué?*
> *¿Qué inteligencia emergerá?*

---

## 2. Punto de partida visual

**Archivo de referencia:** `/mnt/user-data/outputs/instrumento_mockup_v11.html`

Este mockup es la autoridad visual para MapaIC. Define:
- Paleta (cream/paper + blueprint azul profundo + dorado + terracota)
- Tipografía (Cormorant Garamond cursivo + Work Sans despojada)
- Estética blueprint arquitectónico con grilla de fondo
- Las 3 pantallas ya diseñadas (portada, pentágono habitable, pentágono + tríada activa)
- Los mini-triángulos con base horizontal como botones de navegación entre pentágono y tríadas

**Pantalla pendiente de diseñar:** la 4ta (mapa de calor del campo colectivo) + integración con Duende.

---

## 3. Punto de partida técnico

**Aplicación base:** `triadas-test` (localhost:3000/triadas-test del Arquitecto)

**Lo que se reusa directamente:**
- Componente de tríada baricéntrica (coordenadas baricéntricas, arrastre del punto, cálculo de proximidad a vértices)
- Lógica de posicionamiento con restricción ("no en el centro ni en los vértices") — confirmar si está implementada
- Persistencia de narrativas asociadas a posicionamientos
- Paleta y tipografía si ya coinciden (si no, adaptación menor)

**Repo-base pendiente de confirmar:** ubicación de triadas-test en el monorepo y qué partes son reutilizables sin dependencias de otros componentes del Lab.

---

## 4. Lo nuevo a diseñar e implementar

### 4.1 Pentágono habitable
La figura baricéntrica con 5 vértices. Misma mecánica de posicionamiento que la tríada, pero generalizada a 5 dimensiones. **Este es el diseño técnico más novedoso** — las coordenadas baricéntricas con 5 ejes no son triviales y requieren pensar la geometría con cuidado.

Considerar: un punto dentro del pentágono tiene 5 coordenadas baricéntricas que suman 1, representando la "fuerza" que cada vértice ejerce. La visualización es directa; el cálculo interno requiere decisión algorítmica.

### 4.2 Navegación pentágono → tríada
Los mini-triángulos de los vértices son botones reales. Click en uno → abre la tríada correspondiente en la derecha de la pantalla (como en pantalla 3 del mockup). El pentágono queda a la izquierda con el vértice activo resaltado en terracota.

### 4.3 Captura del orden de elección
Cuando el navegante va eligiendo tríadas, se guarda la secuencia. El orden **es señal** — no es metadato trivial. Nutrirá la lectura posterior del campo colectivo.

**Dato a persistir por navegante:** `orden_triadas: [1,4,2,5,3]` por ejemplo, significando que exploró primero Momento, después Impulso, después Mirada, etc.

### 4.4 Umbral de masa crítica (20)
Hasta 19 navegantes con posicionamiento completo, la vista del mapa de calor está bloqueada. Al llegar 20, se habilita.

**Decisión pendiente:** ¿Se habilita para todos los que ya completaron (retroactivo), o solo para los nuevos que lleguen a partir de ese punto? Recomendación tentativa: retroactivo — premia a los primeros 19 con una vista al alcanzar el umbral.

### 4.5 Mapa de calor colectivo
Pantalla 4 (aún sin diseñar visualmente). Superposición de los puntos de los navegantes:
- En el pentágono: 20+ puntitos superpuestos mostrando distribución colectiva
- En cada tríada: idem
- Zonas densas = convergencia del campo
- Zonas dispersas = tensión productiva

Visualización pendiente. Posibles enfoques: scatter plot, heatmap con kernel density, constelación de puntos con transparencia.

### 4.6 Integración con el Duende
El Duende entra después del posicionamiento. Conversación aumentada. Le pasa al Duende:
- Los 6 posicionamientos del navegante (pentágono + 5 tríadas)
- Las 6 narrativas
- El orden de elección
- Si masa crítica alcanzada: estadísticas del campo colectivo (sin identificar individuos)

El Duende conversa con el navegante sobre qué emerge de leer esos datos. Diseño conversacional del Duende pendiente.

---

## 5. Las 5 preguntas confirmadas

**① ¿Cómo estoy?** (Momento) — vértices pendientes de validar
**② ¿Qué me atrae?** (Mirada) — vértices pendientes de validar
**③ ¿Con quién voy?** (Vínculo) — vértices pendientes de validar
**④ ¿Qué me mueve?** (Impulso) — ✅ vértices validados: **Necesidad / Deseo / Sentido**
**⑤ ¿Qué es inteligencia?** (Inteligencia) — vértices tentativos: Resolver / Comprender / Cuidar (aceptados provisionalmente en mockup, pendiente validación formal del Arquitecto)

**El nombre Madre de cada tríada NO se muestra al navegante.** El navegante solo ve la pregunta despojada en el centro. Los nombres son identificadores internos para schema y diálogo entre arquitectos.

---

## 6. Contactos críticos con Soma (schema)

### 6.1 Tabla nueva: `pentagonos_madre`
- `id`, `nombre`, `descripcion`
- Un solo registro Madre por ahora

### 6.2 Tabla nueva: `pentagonos_situados`
- `id`, `pentagono_madre_id`, `contexto` (ej. "Quanam IHA Lab 2026"), `desafio_texto`, `umbral_masa_critica`
- Relación 1:N con tríadas del pentágono (5 tríadas ordenadas)

### 6.3 Tabla nueva: `pentagono_triadas`
- `id`, `pentagono_situado_id`, `triada_situada_id`, `orden_en_pentagono` (1-5)
- Define qué tríadas componen cada pentágono situado y en qué orden aparecen alrededor

### 6.4 Tabla nueva: `navegaciones`
- `id`, `navegante_id`, `pentagono_situado_id`, `created_at`, `completed_at`
- Una navegación por cada navegante que entra al Mapa

### 6.5 Tabla nueva: `posicionamientos`
- `id`, `navegacion_id`, `tipo` (pentagono|triada), `triada_situada_id` (nullable si es pentágono)
- `coordenadas_baricentricas` (array de 3 para tríada, 5 para pentágono)
- `narrativa` (texto), `orden_elegido` (int, solo para tríadas: 1 a 5), `created_at`

### 6.6 Ajustes a schema existente
- `tríadas_situadas`: agregar columna `linaje` o tabla relacionada — pendiente desde sesiones anteriores
- `tríadas_madre` y `tríadas_situadas`: confirmar que el patrón Madre/situado está implementado (sesión SESION-20260420-21 confirmó el patrón explícitamente)

---

## 7. Preguntas abiertas para próxima sesión

**Conceptuales:**
- ¿Los vértices tentativos de Inteligencia (Resolver/Comprender/Cuidar) se validan tal cual o se afinan?
- Los 4 triángulos pendientes (Momento, Mirada, Vínculo — con vértices tentativos sin validar; Inteligencia idem) — ¿se validan juntos en una sesión dedicada?
- Capas del instrumento: ¿solo Posición, o también Energía, Resonancia, Inclinación? Si se incluyen, ¿cómo se visualizan sin saturar?
- Linajes por vértice: ¿se muestran al navegante o quedan como capa interna del Arquitecto?

**Técnicas:**
- Diseño visual del mapa de calor colectivo (pantalla 4)
- Diseño conversacional del Duende leyendo el campo
- Masa crítica retroactiva vs nueva: decisión
- Autenticación: ¿sesiones anónimas o identificadas? ¿Cómo se distinguen los navegantes sin exponerlos?
- Stack exacto a usar (confirmar que es el mismo que triadas-test)
- ¿MapaIC es app standalone o vive dentro de la Cognoesfera Lab existente?

**Producto:**
- ¿Cuándo debe estar lista MapaIC? (Lab IHA 2026 es noviembre — hay margen pero no infinito)
- ¿Hay versión piloto intermedia antes del despliegue público?
- ¿Quiénes son los primeros 20 navegantes que habilitan masa crítica?

---

## 8. Estado al cerrar SESION-20260420-21

**Lo emergido y custodiado:**
- Metáfora estructural: velero + vientos (unifica al paradigma)
- Seis voces del paradigma reconocidas
- Pentágono como Aleph habitable — concepto candidato a Corpus Madre
- Reducción de 9 a 5 señales por triple resonancia (polinesios + Cognoesfera + Miller)
- Pregunta V = "¿Qué es inteligencia?" (reemplaza "¿qué está emergiendo?")
- Pregunta IV = "¿Qué me mueve?" (reemplaza "¿cuál será mi gesto?")
- Desafío sin "colectiva": "¿Qué inteligencia emergerá?"
- Relación Arquitecto-navegante: "El Arquitecto moldea, el navegante habita"
- 4 linajes nuevos formalmente incorporados: Machado, polinesios, Saltzman, Tao explícito
- Guión de podcast terminado
- Mockup v11 como referencia visual final

**Lo pendiente de Soma:** ver sección 6.
**Lo pendiente de Corpus:** candidatos a concepto Madre, señales por procesar (ver senales_activas.md y pendientes_corpus.md).
**Lo pendiente de MapaIC:** este documento.

---

## 9. Instrucción para el próximo Duende

Cuando el Arquitecto arranque la próxima sesión con MapaIC, el próximo Duende debe:

1. Leer este documento completo
2. Leer también `instrumento_mockup_v11.html` (abrirlo o revisar el SVG si no puede renderizarse)
3. Leer `senales_activas.md` (29 señales nuevas de SESION-20260420-21 están ahí)
4. Preguntar al Arquitecto: "¿Arrancamos por el diseño del pentágono baricéntrico, por los vértices pendientes de las 4 tríadas, o por la decisión del mapa de calor colectivo?"

Estas tres opciones cubren los frentes que quedaron abiertos. El Arquitecto decide por dónde entrar con cabeza fresca.

---

*Este documento es autoridad de contexto para MapaIC. Actualizarlo en cada sesión que avance su diseño.*
