# Manual del Protocolo de Sintonización del Duende

*Procedimiento operativo para traducción visual → código entre Figma, Claude.ai y Claude Code*

**Versión:** 1.0 · 19/04/2026
**Origen:** SESION-20260419 — extraído de la experiencia de iteración de la pantalla intro de `TriadaPercepcion.tsx`
**Estado:** Vivo — se enriquece en cada sesión

---

## Propósito del documento

Este documento no es teoría. Es el procedimiento paso a paso que el Duende debe ejecutar al inicio de cada sesión de traducción visual→código. Incluye scripts reutilizables, plantillas de prompts, listas concretas y preguntas formalizadas.

Si un Duende en una sesión futura lee este documento y lo ejecuta, debería lograr en el primer intento lo que en la sesión del 19/04/2026 nos llevó 20 iteraciones.

El documento tiene tres partes:

1. **Protocolo operativo** — los 11 movimientos del trabajo, con procedimiento específico
2. **Catálogos y plantillas** — scripts, prompts, defaults silenciosos, vocabulario
3. **Heurísticas de diagnóstico** — qué hacer cuando algo no responde

---

# PARTE 1 — Protocolo operativo (11 movimientos)

## Movimiento 1 — Recibir el mockup Figma del Arquitecto

**Qué hace el Duende:**

- Acusa recibo del mockup con una frase como "Recibí el mockup, voy a medirlo antes de proponer"
- No hace interpretaciones visuales todavía
- No propone código todavía
- Pregunta al Arquitecto qué dimensiones tiene el frame del Figma, si no están visibles en el screenshot

**Señal temprana de problema:** si el Duende ya escribe código o propone layout antes de medir, está operando en modo adivinanza. Detenerse y volver al Movimiento 2.

---

## Movimiento 2 — Medir el mockup con Python

**Qué medir (las 11 mediciones base):**

1. **Dimensiones del frame** (ancho × alto en píxeles)
2. **Aspect ratio del frame** (ancho / alto)
3. **Bounds de cada elemento clave** (x1, y1, x2, y2) — típicamente: eyebrow, logo, imagen principal, título h1, párrafos, subtítulo h2, botón
4. **Ancho y alto de cada elemento en píxeles**
5. **Posición de cada elemento como % del frame** (para traducir a vw/vh después)
6. **Gaps verticales entre elementos clave** (header→imagen, imagen→título, título→p1, etc.)
7. **Gaps horizontales entre elementos clave** (columnas, padding lateral)
8. **Padding exterior del frame** (top, right, bottom, left)
9. **Colores exactos de los elementos principales** (en hex)
10. **Proporción entre elementos relacionados** (ej. h2 vs h1, columna izq vs derecha)
11. **Densidad visual de elementos pesados** (cuánto detalle tiene la imagen principal — afecta compensación óptica después)

**Script base reutilizable:**

```python
from PIL import Image
import numpy as np

# Cargar mockup
img = Image.open('/mnt/user-data/uploads/mockup.png')
arr = np.array(img)
w, h = img.size

print(f"Frame: {w}×{h}")
print(f"Aspect ratio: {w/h:.3f}")

# Detectores de color reutilizables — paleta Paradigma Aleph
def is_bg(px, tol=5):
    # #FDFAF5 beige base
    return abs(int(px[0])-253) < tol and abs(int(px[1])-250) < tol and abs(int(px[2])-245) < tol

def is_amber(px):
    # #C9A84C amber dorado
    r_, g_, b_ = int(px[0]), int(px[1]), int(px[2])
    return 180 < r_ < 220 and 140 < g_ < 180 and 50 < b_ < 100

def is_title_ink(px):
    # #3D2B1A marrón profundo (títulos)
    r_, g_, b_ = int(px[0]), int(px[1]), int(px[2])
    return 40 < r_ < 80 and 25 < g_ < 60 and 15 < b_ < 40

def is_ink_mid(px):
    # #5C4A1E marrón medio (párrafos)
    r_, g_, b_ = int(px[0]), int(px[1]), int(px[2])
    return 70 < r_ < 110 and 50 < g_ < 90 and 15 < b_ < 55

def is_topo(px):
    # beige distintivo de la imagen topográfica
    r_, g_, b_ = int(px[0]), int(px[1]), int(px[2])
    return 230 < r_ < 250 and 220 < g_ < 245 and 200 < b_ < 235

# Función genérica para encontrar bounds de un elemento
def find_bounds(arr, y_range, x_range, check):
    top, bot = y_range[1], y_range[0]
    left, right = x_range[1], x_range[0]
    for y in range(y_range[0], min(y_range[1], arr.shape[0])):
        for x in range(x_range[0], min(x_range[1], arr.shape[1])):
            if check(arr[y, x]):
                top = min(top, y); bot = max(bot, y)
                left = min(left, x); right = max(right, x)
    return top, bot, left, right

# Ejemplo de uso:
# t, b, l, r = find_bounds(arr, (0, 300), (0, 800), is_amber)
# print(f"Eyebrow: y=[{t}-{b}], x=[{l}-{r}]")
```

**Output esperado de Movimiento 2:**

Tabla con los 11 valores medidos, expresados en píxeles y en %. Esta tabla es el punto de partida de todo lo que sigue.

---

## Movimiento 3 — Preguntar al Arquitecto sobre su dispositivo

**Preguntas formalizadas (preguntar si no hay certeza):**

- ¿Qué tamaño tiene tu monitor? (Full HD 1920×1080, 4K 3840×2160, laptop 1440×900, etc.)
- ¿Cuánto zoom tiene tu navegador? (Ctrl+0 lo pone al 100%)
- ¿Qué tan alto es el "chrome" del navegador visible? (tabs + barra de direcciones + favoritos visibles)
- ¿En qué resolución de viewport querés que el diseño se vea óptimo?

**Viewport estándar calculado:**

- Si el monitor es 1920×1080 con chrome Chrome típico (~120px arriba): viewport usable ≈ 1920×960 (aspect 2.0)
- Si el monitor es 1440×900 con chrome: viewport usable ≈ 1440×780 (aspect 1.85)
- Si el monitor es 4K (3840×2160): el navegador típicamente usa 1920×960 equivalentes

**Para pantallas desktop del Paradigma Aleph, estándar acordado:** viewport de referencia **1920×960 (aspect 2.0)**.

**Output esperado:** confirmación explícita del viewport de destino para esta sesión.

---

## Movimiento 4 — Verificar aspect del mockup vs aspect del destino

**Procedimiento:**

1. Aspect del mockup = ancho / alto del frame Figma
2. Aspect del destino = ancho / alto del viewport real
3. Calcular diferencia: `abs(aspect_mockup - aspect_destino) / aspect_destino`
4. Si la diferencia es > 5%, hay desajuste estructural

**Ejemplo real de la sesión:**
- Mockup original: 1920×900 (aspect 2.13)
- Viewport destino: 1920×960 (aspect 2.0)
- Diferencia: 6.5% → *desajuste significativo*

**Acción según resultado:**

- **Si diferencia < 5%**: proceder al Movimiento 5
- **Si diferencia ≥ 5%**: proponer al Arquitecto ajustar las dimensiones del mockup al aspect del destino. Esto es la *señal 9* — sintonización bidireccional. Frase sugerida:

> "Detecté que el mockup tiene aspect X y el viewport destino aspect Y — una diferencia del Z%. Si ajustás el frame del Figma a [dimensiones específicas], el trabajo de traducción va a ser más preciso. ¿Querés hacerlo?"

La decisión final queda en el Arquitecto. Si no acepta, el Duende procede con compensaciones explícitas documentadas.

---

## Movimiento 5 — Definir el vocabulario de zonas con el Arquitecto

**Para qué:** establecer un lenguaje intermedio que permita al Arquitecto apuntar sin entrar al código.

**Procedimiento estándar:**

1. Mirar la composición del mockup
2. Identificar las "regiones respirables" — los gaps y bloques que el Arquitecto puede querer ajustar
3. Nombrar cada uno con una letra: Zona A, Zona B, Zona C...
4. Presentar al Arquitecto la propuesta de zonas con un diagrama simple

**Vocabulario base para pantallas tipo "intro" (2 columnas, imagen + texto):**

- **Zona A** — arriba de la imagen (eyebrow/header + aire hasta el tope de la imagen)
- **Zona B** — entre la imagen y el título principal (gap horizontal inferior de la imagen)
- **Zona C** — entre el título y su párrafo p1
- **Zona D** — debajo del p1 hasta el borde inferior del viewport
- **Zona E** — columna derecha interna (gap entre subtítulo h2 y sus párrafos)

Ajustar el vocabulario a la composición específica. Si hay más bloques, agregar zonas con nuevas letras.

**Confirmación con el Arquitecto:**

> "Propongo estas zonas: [lista]. ¿Te sirven? ¿Agregarías alguna?"

**Una vez acordadas, el vocabulario queda vigente toda la sesión.**

---

## Movimiento 6 — Consultar el catálogo de defaults silenciosos

**Catálogo actual (a enriquecerse en cada sesión):**

### CSS Grid

- **`gridTemplateColumns: "auto"`** con una imagen adentro: toma el intrinsic size de la imagen (puede ser enorme), ignora `style.width`. Usar valores explícitos o `min()`.
- **`clamp()` dentro de `gridTemplateColumns`**: no aplica el cap con confiabilidad en viewports grandes. Usar `min()` en su lugar.
- **`alignContent: space-between`**: solo funciona si hay espacio sobrante en el grid. Si el grid ya está lleno (flex:1 sin content sobrante), no produce efecto visible.
- **`rowGap`**: no empuja contenido si el grid tiene altura fija y ya está ocupando todo el alto.

### Next.js Image

- **`width` prop**: es intrinsic, no el ancho renderizado. Para controlar el tamaño visual usar `style={{ width: "100%", height: "auto" }}` y controlar desde el contenedor.
- **SVG como src**: conviene agregar prop `unoptimized` para que Next.js sirva el archivo tal cual.
- **Imagen en columna grid con `auto`**: combinación problemática — ver CSS Grid arriba.

### CSS Flex

- **`alignItems: flex-start`**: deja que elementos altos arrastren la altura del row. Usar `center` para header con logo.
- **`justifyContent: space-between` en flex column**: solo funciona si el flex tiene altura explícita mayor al contenido.
- **`marginTop: auto`**: solo empuja si el padre es flex column con altura disponible.

### React style inline

- **`margin: 0` (shorthand) + `marginBottom: N` en spread**: React advierte sobre mezcla de shorthand y non-shorthand. Usar las 4 propiedades individuales (`marginTop/Right/Bottom/Left: 0`).

### Viewport

- **`minHeight: 100vh`**: permite ocupar el viewport pero no obliga. Para obligar usar `height: 100dvh`.
- **`100vh` vs `100dvh`**: `vh` no considera barras del navegador que aparecen/desaparecen (en mobile puede causar overflow). `dvh` sí se adapta.

**Consulta antes de escribir código:** si el layout usa alguna de estas estructuras, anticipar el default. Escribirlo explícitamente en el prompt a Claude Code como cuidado a tener en cuenta.

---

## Movimiento 7 — Escribir el prompt para Claude Code

**Estructura estándar del prompt:**

```
[Contexto]
Sesión: [nombre]
Pantalla: [identificador]
Viewport destino: [dimensiones, aspect]
Archivo: [ruta del componente]

[Mediciones del mockup]
(Los 11 valores del Movimiento 2)

[Defaults silenciosos a anticipar]
(Lista de los defaults relevantes del catálogo)

[Cambio específico]
Cambiar A por B en la línea/sección X.

Razón:
(Explicación técnica breve)

[Restricciones]
No tocar: [lista explícita de qué no modificar]

[Commit]
Mensaje de commit en formato del paradigma.
```

**Para cambios quirúrgicos (ajustes finos de una iteración):**

- Especificar el valor actual (con línea o número aproximado)
- Especificar el valor nuevo
- Una razón de una oración
- Restricción "no tocar nada más"
- Mensaje de commit en dos o tres líneas

**Para refactors estructurales:**

- Incluir el JSX completo de la nueva estructura
- Listar qué se reemplaza y por qué
- Preservar referencias a constantes existentes (FD, FB, AMBER, paraStyle, btnEl)
- Mensaje de commit más largo explicando la intención del refactor

---

## Movimiento 8 — Recibir el render y medirlo de nuevo

**Obligatorio:** medir el screenshot con Python antes de decidir si el resultado matchea la intención.

**Mediciones mínimas post-commit:**

1. Bounds de los mismos elementos medidos en el mockup
2. Gaps verticales y horizontales principales
3. Comparación directa: render vs mockup en cada gap y dimensión

**Output esperado:** tabla de diferencias render vs mockup. Si las diferencias son < 5%, cerrar. Si son mayores, identificar cuáles y preparar siguiente iteración.

---

## Movimiento 9 — Reportar en vocabulario de zonas, no en parámetros técnicos

**Antes (mal):**

> "Ajusté el `rowGap` de `clamp(10px, 1.8vh, 25px)` a `clamp(12px, 2vh, 28px)`, y el `marginTop` del grid a `clamp(8px, 1.5vh, 20px)`."

**Después (bien):**

> "La Zona B creció un 15% y la Zona A se achicó un 10%. Técnicamente moví dos palancas: `rowGap` y `marginTop` del grid."

El Arquitecto no tiene que aprender los parámetros técnicos. Solo tiene que saber qué zona se movió, en qué dirección y qué porcentaje.

Los parámetros técnicos se mencionan al final como nota secundaria, no al principio.

---

## Movimiento 10 — Iterar con heurísticas

**Ver Parte 3 — Heurísticas de diagnóstico.**

Si una palanca no responde, probar la opuesta. Si el render no matchea la intención, medir antes de insistir. Si el Arquitecto dice "no se ve bien" pero la medición dice que está perfecto, aceptar que es percepción y usar corrección óptica.

---

## Movimiento 11 — Cerrar la pantalla cuando el ojo del Arquitecto la valida

**Señal de cierre:** el Arquitecto dice explícitamente "sí, ahora está bien" o equivalente.

**Lo que hace el Duende al cerrar:**

- Agradece sintéticamente sin adulación
- Propone siguiente pantalla o paso
- Registra aprendizajes de la sesión para enriquecer este manual

**Lo que no hace el Duende al cerrar:**

- Seguir iterando sobre detalles que el Arquitecto ya dio por cerrados
- Proponer mejoras no pedidas
- Mover el foco sin consultar

---

# PARTE 2 — Catálogos y plantillas

## Catálogo de colores del Paradigma Aleph

```
#FDFAF5  Beige base (fondo)
#C9A84C  Amber dorado (eyebrow, ornamento ✦)
#3D2B1A  Marrón profundo (títulos h1, h2)
#5C4A1E  Marrón medio (párrafos, botón outline)
```

## Catálogo de tipografías

```
FD (Fraunces) — serif de display, para h1 y h2
FB (Lora)     — serif de lectura, para párrafos y eyebrow
```

Pesos usados: 300 (títulos), 400 (texto).

## Catálogo de dimensiones estándar

```
Desktop viewport de referencia:  1920×960 (aspect 2.0)
Mobile viewport de referencia:   390×844  (iPhone típico)
Breakpoint isDesktop:            768px
```

## Plantilla: preguntas al Arquitecto al inicio de sesión visual

1. ¿Este mockup es para desktop o mobile?
2. ¿Qué dimensiones tiene el frame del Figma?
3. ¿Trabajás con monitor [tamaño conocido o Full HD estándar]?
4. ¿Tu zoom está al 100% en el navegador? (Ctrl+0 para asegurarlo)
5. ¿Querés usar el vocabulario de zonas estándar (A/B/C/D/E) o proponés otro?

## Plantilla: prompt mínimo para ajuste quirúrgico de Claude Code

```
Ajuste a [archivo]: [descripción breve del cambio].

En el div de [sección identificable], cambiar:
  [propiedad]: [valor actual],
por:
  [propiedad]: [valor nuevo],

Razón: [una oración].

No tocar nada más. No tocar el bloque mobile.

Commit:

fix([componente]): [descripción en una línea]

[2-3 líneas explicando qué cambió y por qué]
```

## Plantilla: prompt para refactor estructural

```
Refactor de [sección] en [archivo] para [objetivo editorial].

Localizar [identificador del bloque a reemplazar]. Reemplazar TODO el JSX interno por:

[JSX completo de la nueva estructura]

Puntos clave del refactor:
- [punto 1]
- [punto 2]
- [punto 3]

Preservar intactas las constantes [lista] que ya existen en el archivo. No tocar el bloque mobile.

Commit:

refactor([componente]): [intención del refactor]

[Explicación de 3-5 líneas]
```

---

# PARTE 3 — Heurísticas de diagnóstico

## Heurística 1 — Si una palanca no responde, probar la opuesta

**Síntoma:** cambiás el valor de una propiedad (`rowGap`, `marginTop`, `padding`) y el render no cambia visiblemente.

**Diagnóstico probable:** el contenedor tiene altura fija (`100dvh` o similar) y el contenido ya la ocupa. La propiedad que tocaste no puede empujar porque no hay espacio.

**Solución:** operar sobre la propiedad opuesta. Si querés agrandar la zona B (abajo de la imagen), achicá la zona A (arriba de la imagen). El contenido se desplaza.

## Heurística 2 — Si la medición dice "correcto" pero el ojo dice "no", aceptar la percepción

**Síntoma:** medís con Python, los dos gaps son 108 y 109 píxeles (idénticos), pero el Arquitecto percibe asimetría.

**Diagnóstico probable:** corrección óptica. Hay fuerzas que la medición de píxeles no captura — peso visual de elementos densos, x-height de tipografías altas, contraste.

**Solución:** aplicar compensación óptica. Regla general: reducir el gap adyacente al elemento pesado en 10-30%. Si 20% es mucho, probar 10%. Si 10% es poco, probar 25%. El ojo del Arquitecto decide.

## Heurística 3 — Si el layout no matchea el mockup en proporciones, revisar aspect ratio

**Síntoma:** implementás el código y las columnas/filas tienen proporciones distintas a las del Figma, incluso cuando los parámetros parecen correctos.

**Diagnóstico probable:** el aspect del mockup difiere del aspect del viewport destino. Proporciones en vw/vh traducen distinto en aspects distintos.

**Solución:** volver al Movimiento 4. Si el aspect del mockup ≠ aspect del destino, proponer al Arquitecto que ajuste el mockup.

## Heurística 4 — Si el comando parece correcto pero el resultado es inesperado, revisar defaults silenciosos

**Síntoma:** escribiste lo que te parecía razonable pero el resultado tiene un comportamiento que no explicaste.

**Diagnóstico probable:** un default silencioso de alguna herramienta (Next.js Image, CSS Grid, React style) está sobrescribiendo tu intención.

**Solución:** consultar el catálogo de defaults silenciosos (Movimiento 6). Identificar cuál puede estar actuando. Escribir la propiedad explícita que lo neutraliza.

## Heurística 5 — Si el ciclo Duende↔Arquitecto lleva más de 3 iteraciones sin converger, detenerse

**Síntoma:** tres intentos consecutivos sin que el Arquitecto apruebe.

**Diagnóstico probable:** el Duende está insistiendo con una estrategia que no es la correcta. Puede ser problema estructural (no de valor), puede ser percepción (no técnico), puede ser desajuste del mockup (no del código).

**Solución:** detenerse explícitamente. Preguntar al Arquitecto cómo lo nombraría él. La palabra del Arquitecto suele abrir la solución que el Duende no había visto.

## Heurística 6 — Si el Arquitecto propone una estrategia aparentemente opuesta a la tuya, probarla

**Síntoma:** vos insistís en una variable, el Arquitecto propone la opuesta.

**Diagnóstico probable:** el Arquitecto tiene razón. Su intuición sobre el problema estructural es más situada que la tuya teórica.

**Solución:** probar la propuesta del Arquitecto. Si funciona, registrarlo como aprendizaje.

---

# APÉNDICE — Checklist de inicio de sesión visual

Antes de escribir una sola línea de código, el Duende debe tener completado:

- [ ] Movimiento 1: mockup recibido y acusado
- [ ] Movimiento 2: 11 mediciones del mockup calculadas con Python
- [ ] Movimiento 3: viewport destino confirmado con el Arquitecto
- [ ] Movimiento 4: aspect mockup vs destino verificado (y ajustado si corresponde)
- [ ] Movimiento 5: vocabulario de zonas acordado
- [ ] Movimiento 6: defaults silenciosos relevantes identificados
- [ ] Solo después: Movimiento 7 — primer prompt a Claude Code

Si algún punto está sin completar, el Duende está en modo adivinanza. Detenerse.

---

*Fin del Manual v1.0 · a enriquecerse en cada sesión que aporte aprendizajes nuevos*
