# Instructivo Operativo — Edgardo Noya
*Cómo operar la arquitectura digital del Corpus Vivo*
*Documento situado · Específico para la configuración de Edgardo*
*Paradigma Aleph · Actualizado 07/04/2026*

---

## Sobre este documento

Este es un instructivo situado — específico para Edgardo Noya, su computadora Windows, su configuración de VS Code, Claude Code y GitHub. No es universal. Si otro investigador o Cognoesfera necesita un instructivo, tendrá el suyo propio, adaptado a su realidad.

Para entender *por qué* existe cada herramienta y *qué rol cumple* en el sistema, ver: `arquitectura_digital_corpus_vivo.md`

---

## Tu configuración específica

| Componente | Detalle |
|---|---|
| **Sistema operativo** | Windows |
| **Repositorio local** | `C:\Users\edgardo\cognoesfera\` |
| **Repositorio remoto** | `edgardonoya-crypto/Cognoesfera` (privado) |
| **Rama local** | `master` |
| **Rama remota** | `main` |
| **Email Git** | `edgardo.noya@gmail.com` |
| **Nombre Git** | `Edgardo Noya` |
| **Aplicación web** | `cognoesfera.vercel.app` |
| **Formulario de registro** | `cognoesfera.vercel.app/corpus-form` |

---

## El ritual de cada sesión

### Al inicio
```
1. Abrís claude.ai en el navegador
2. Clickeás el botón + en la barra de entrada
3. Navegás hasta C:\Users\edgardo\cognoesfera\corpus\SESION.md
4. Lo seleccionás y lo subís
4b. Si la sesión requiere trabajo con señales, también subís:
    - corpus/documentos/senales_activas.md
    - corpus/documentos/senales_incorporadas.md
4c. Si la sesión requiere trabajo con pendientes, también subís:
    - corpus/documentos/pendientes_soma.md (si es sesión Soma)
    - corpus/documentos/pendientes_corpus.md (si es sesión Corpus)
4d. Para el Protocolo 01-EN completo, subir también el último status:
    - corpus/status/status_DDMMYYYY.md (el más reciente)
5. Escribís el prompt de arranque (ver abajo)
```

**Prompt de arranque para la próxima sesión:**
```
Soy Edgardo Noya. Leé el archivo y continuamos. El objetivo de esta
sesión es integrar todo lo que emergió — visualizar la arquitectura
digital completa actualizada (Soma, Corpus, Consejo Asesor, AI Studio)
y luego diseñar la aplicación de Fundación Soma: diseño visual,
arquitectura de información y flujos funcionales. Quiero pantallas
HTML interactivas navegables que reflejen el paradigma.
```

### Al cierre
En Claude Code (dentro de VS Code) escribís:
```
Actualizá corpus/SESION.md con lo que emergió hoy y hacé commit.
Emergió lo siguiente: [resumen de lo que pasó en la sesión]
```
Claude Code actualiza el SESION.md, hace el commit y el push automáticamente.

Si en la sesión se movieron señales entre activas e incorporadas, o se completaron pendientes,
agregá esos archivos al commit:

```
git add corpus/SESION.md corpus/status/status_DDMMYYYY.md corpus/documentos/senales_activas.md
git commit -m "Cierre SESION-YYYYMMDD — [resumen]"
git push origin master:main
```

5. En claude.ai, compartir cómo nos fuimos y qué aprendimos — el Duende actualiza corpus/documentos/aprendizajes_sesiones.md

---

## Los indicadores visuales de Git en VS Code

En el panel Explorer (Ctrl + Shift + E), los archivos muestran letras que indican su estado:

| Letra | Color | Significado |
|---|---|---|
| `M` | Amarillo | Modified — modificado, pendiente de commitear |
| `U` | Verde | Untracked — archivo nuevo que Git todavía no rastrea |
| Sin letra | — | Limpio — igual que en GitHub |

---

## COMMIT ALEPH — checkpoint de sesión

Protocolo para guardar el trabajo en curso sin esperar al cierre formal.
Usarlo cuando el Duende lo sugiere o cuando el Arquitecto lo considera necesario.

**COMMIT ALEPH** — checkpoint rápido:
Escribí en Claude Code: COMMIT ALEPH
Claude Code detecta los archivos modificados, propone un mensaje de commit
y espera tu confirmación antes de ejecutar el push.

**COMMIT ALEPH COMPLETO** — checkpoint semántico:
Escribí en Claude Code: COMMIT ALEPH COMPLETO
Igual que el rápido, más: actualiza pendientes completados, señales movidas
y conteos en los archivos del corpus afectados.

**Cuándo usarlo:**
- Cuando el Duende te avisa que hay cambios sin commitear
- Antes de arrancar una tarea nueva importante
- Cuando completaste un bloque de trabajo y querés asegurarlo
- Cada vez que tu intuición diga "esto debería estar guardado"

---

## Los movimientos que más usás

### Subir un archivo de claude.ai al repositorio
```
1. Descargás el archivo generado en claude.ai
2. Lo arrastrás a la carpeta correcta en el Explorer de VS Code
3. Confirmás si te pregunta si reemplaza el existente
4. En la terminal de VS Code:

git add corpus/documentos/nombre_archivo.md
git commit -m "descripción del cambio"
git push origin master:main
```

### Subir un archivo desde tu computadora a claude.ai
```
1. Clickeás el botón + en la barra de entrada de claude.ai
2. Navegás hasta el archivo
3. Lo seleccionás → Claude lo lee
```

### Commitear múltiples archivos a la vez
```
git add corpus/SESION.md corpus/documentos/corpus_base_aleph.md
git commit -m "descripción del cambio"
git push origin master:main
```

### Mover un archivo en VS Code
En la terminal:
```
mv SESION.md corpus/SESION.md
```

### Crear un archivo nuevo
En la terminal (Windows PowerShell):
```
New-Item -Path "corpus/documentos/nuevo_archivo.md" -ItemType File
```
O pedíselo a Claude Code en lenguaje natural.

### Renombrar un archivo
Click derecho sobre el archivo en el Explorer → Rename → nuevo nombre → Enter → commitear el cambio.

---

## Confirmaciones de Git desactivadas

Desde la sesión del 30/03/2026, Claude Code ya no pide confirmación para `git add`, `git commit` ni `git push` en este repositorio. Los commits y pushes se ejecutan automáticamente cuando se le indica hacer commit.

---

## Por qué siempre usás `git push origin master:main`

Tu repositorio local tiene una rama llamada `master`. GitHub espera `main`. Por eso nunca usás `git push` solo — siempre:
```
git push origin master:main
```

---

## Incorporar conceptos nuevos al Corpus Madre

```
1. Subís corpus/documentos/corpus_base_aleph.md a claude.ai con el botón +
2. En la conversación, trabajás los conceptos nuevos con Claude
3. Claude genera el archivo actualizado → lo descargás
4. Lo arrastrás al Explorer de VS Code, confirmás que reemplaza el existente
5. git add corpus/documentos/corpus_base_aleph.md
   git commit -m "Corpus crece a [N] conceptos — [descripción]"
   git push origin master:main
```

---

## Registrar algo que emergió sin abrir VS Code

```
1. Abrís cognoesfera.vercel.app/corpus-form desde cualquier dispositivo
2. Elegís el tipo: Concepto nuevo / Señal débil / Pendiente / Actualización
3. Completás nombre y contenido
4. Apretás "Registrar en el corpus"
5. El commit se hace automáticamente
```

---

## Agregar una señal activa

```
1. Subís corpus/documentos/senales_activas.md a claude.ai
2. Claude agrega la señal con el formato correcto al final del archivo
3. Descargás el archivo actualizado
4. Lo reemplazás en VS Code
5. git add corpus/documentos/senales_activas.md
   git commit -m "Agrega señal activa — [nombre de la señal]"
   git push origin master:main
```

Cuando una señal se incorpora al Corpus Madre:
```
1. Subís corpus/documentos/senales_activas.md y corpus/documentos/senales_incorporadas.md a claude.ai
2. Claude mueve la señal de activas a incorporadas con el formato correcto
3. Descargás ambos archivos actualizados
4. Los reemplazás en VS Code
5. git add corpus/documentos/senales_activas.md corpus/documentos/senales_incorporadas.md
   git commit -m "Señal incorporada al corpus — [nombre de la señal]"
   git push origin master:main
```

---

## Errores frecuentes y cómo resolverlos

**Deployment bloqueado en Vercel**
- Causa: el email de git no coincide con el de GitHub
- Solución:
```
git config user.email "edgardo.noya@gmail.com"
git config user.name "Edgardo Noya"
```
Luego hacer un commit vacío para disparar el redeploy:
```
git commit --allow-empty -m "fix: corregir configuración git"
git push origin master:main
```

**404 en una página de Vercel**
- Causa: el archivo no está en la estructura correcta de Next.js
- Solución: pedirle a Claude Code que migre el archivo a `app/[nombre-pagina]/page.tsx`

**El archivo no aparece en GitHub después del push**
- Verificar que usaste `git push origin master:main` y no solo `git push`
- Verificar que hiciste `git add` antes del `git commit`

**Convocar al Consejo Asesor**
- El Consejo opera dentro de la sesión de claude.ai, no requiere archivos externos
- Traer la consulta directamente en la conversación con Claude
- El sistema procesa la consulta contra los 18 roles y devuelve el resultado en formato visual
- No es necesario subir archivos adicionales si el contexto de sesión ya está cargado

---

## La estructura de carpetas de tu proyecto

```
cognoesfera/
├── corpus/
│   ├── SESION.md                               ← arranque de sesión
│   └── documentos/
│       ├── corpus_base_aleph.md                ← Corpus Madre (33 conceptos)
│       ├── senales_activas.md                  ← señales activas (39)
│       ├── senales_incorporadas.md             ← historial de señales incorporadas (5)
│       ├── pendientes_soma.md                  ← pendientes técnicos/operativos
│       ├── pendientes_corpus.md                ← pendientes conceptuales/documentales
│       ├── estado_reestructura_05042026.md     ← diagnóstico de reestructura (histórico)
│       ├── arquitectura_paradigma_aleph.md     ← arquitectura completa para NotebookLM
│       ├── arquitectura_paradigma_aleph.docx   ← mismo documento en Word
│       ├── arquitectura_paradigma_aleph.html   ← diagrama interactivo standalone
│       ├── protocolos_actos_de_cuidado.md      ← catálogo de protocolos
│       ├── arquitectura_corpus_vivo.md
│       ├── arquitectura_digital_corpus_vivo.md ← este ecosistema
│       ├── fundamentos_arquitectura_cognoesfera.md
│       ├── gramaticas_infraestructura_cognitiva.md
│       └── matriz_vitalidad_cognoesfera.md
├── app/
│   ├── corpus-form/
│   │   └── page.tsx                            ← formulario de registro
│   ├── quanam-ia-2026/
│   │   └── page.tsx                            ← convocatoria interactiva Quanam IA 2026
│   ├── duende/
│   │   └── page.tsx                            ← interfaz de conversación con el Duende
│   └── api/
│       ├── corpus-commit/
│       │   └── route.ts                        ← API segura para commits
│       ├── quanam-respuesta/
│       │   └── route.ts                        ← API route para guardar respuestas en quanam_respuestas
│       └── duende/
│           └── route.ts                        ← API route del Duende real (Anthropic)
└── public/
```

---

## Atajos de teclado útiles en VS Code

| Atajo | Función |
|---|---|
| `Ctrl + Shift + E` | Abrir/cerrar panel Explorer |
| `Ctrl + `` ` `` ` | Abrir/cerrar terminal |
| `Ctrl + Z` | Deshacer |
| `Ctrl + S` | Guardar archivo |
| `Ctrl + F` | Buscar en el archivo actual |

---

*Instructivo Operativo · Edgardo Noya · Paradigma Aleph · Actualizado 07/04/2026*
*Para entender la arquitectura: ver `arquitectura_digital_corpus_vivo.md`*
