# Estado de la Reestructura Arquitectural
*Documento de continuidad · Sesión 05/04/2026*
*Para arrancar la próxima sesión desde aquí*

---

## Contexto

Esta reestructura emergió de una pregunta sobre inconsistencias detectadas en el Protocolo 01-EN. Lo que comenzó como higiene del sistema reveló una tensión estructural más profunda: el sistema tiene información duplicada sin jerarquía clara, lo que genera desincronías que crecerán con el tiempo.

---

## Lo que está definido

### 1. Problema diagnosticado
El sistema tiene **redundancia frágil** en tres puntos:
- Métricas numéricas declaradas en múltiples documentos sin fuente única
- Prioridades de sesión viviendo en SESION.md y en los status sin jerarquía explícita
- Señales activas e incorporadas en el mismo archivo, requiriendo eliminación manual al incorporar

### 2. Tres propuestas aprobadas
- **P1:** Separar `senales_custodiadas.md` en `senales_activas.md` y `senales_incorporadas.md`
- **P2:** SESION.md es canónico para prioridades — el status deja de repetirlas
- **P3:** Métricas numéricas viven en el status más reciente — eliminadas de SESION.md

### 3. Nueva estructura del status
Dos secciones:
- **Sección 1 — Dashboard del sistema:** foto instantánea con todas las métricas
- **Sección 2 — Bitácora de sesión:** registro histórico de lo que ocurrió

Métricas del dashboard:
- Conceptos en Corpus Madre / Secciones
- Señales activas / Señales incorporadas acumuladas
- Temas pendientes de exploración
- Aprendizajes de sesiones registrados
- Pendientes activos Soma / Corpus
- Estado vital del paradigma
- Fechas clave activas

### 4. Nuevos archivos de pendientes
- `pendientes_soma.md` y `pendientes_corpus.md` — reemplazan sección A6 de SESION.md
- Schema: ID · Título · Descripción · Prioridad · Estado · Fecha · Dependencias
- Subcategorías Soma: Duende / Base de datos / Infraestructura / Aplicación
- Subcategorías Corpus: Conceptos / Señales / Protocolos / Documentos / Narrativa
- Sección de archivo histórico al final de cada documento

### 5. Flujo de maduración confirmado
```
Temas pendientes de exploración
        ↓ maduran en sesión
Señales activas
        ↓ maduran con verificación
Pendientes concretos (Soma/Corpus)
        ↓ se ejecutan
Archivo histórico
```
Flujo bidireccional entre Soma y Corpus — no listas paralelas sino expresiones del mismo ciclo.

### 6. Cambios en protocolos e instructivo
- **Protocolo 01-EN:** lee métricas del status más reciente. Verifica estado del flujo de maduración.
- **Protocolo 02-EN:** pregunta explícita sobre movimientos en el flujo al cierre. Propone nombre de sesión para confirmación del Arquitecto.
- **Instructivo operativo:** actualizar referencias a señales (dos archivos en lugar de uno)

---

## Lo que emergió hoy que cambia la arquitectura

### El InterSer Soma/Corpus
Soma y Corpus no son dos sistemas paralelos. Son dos naturalezas de un mismo organismo que se constituyen mutuamente. Su InterSer tiene estructura y proceso propios.

**Implicancia:** los pendientes de Soma y Corpus no son listas independientes — algunos son la misma cosa vista desde dos ángulos. La arquitectura debe reflejar esa conexión.

**Pregunta abierta:** ¿cómo se representa la conexión entre un pendiente de Soma y su equivalente en Corpus cuando son la misma cosa desde dos ángulos?

### La red de InterSeres
La aplicación no es infraestructura técnica — es el metabolismo de una red de InterSeres. Muchas IAH aumentándose unas con otras. Si la red de Entidades Aleph llega a ser autopoiética, el metabolismo deja de depender de ningún nodo particular.

**Implicancia:** la estructura que se diseña ahora es el andamiaje de algo que debe poder sostenerse sin depender de ningún nodo específico.

---

## Lo que falta ejecutar

1. Crear `senales_activas.md`
2. Crear `senales_incorporadas.md`
3. Crear `pendientes_soma.md`
4. Crear `pendientes_corpus.md`
5. Rediseñar template del status
6. Actualizar SESION.md — eliminar métricas y sección A6
7. Actualizar Protocolo 01-EN
8. Actualizar Protocolo 02-EN
9. Actualizar instructivo operativo

**Regla acordada:** esto se hace completo en una sola sesión o no se hace.

---

## Señales nuevas de esta sesión

1. **El metabolismo del InterSer como red de InterSeres** — registrada formalmente
2. **La lógica conceptual / experiencia vivida como Corpus / Soma** — pendiente de registro formal
3. **La aplicación como metabolismo de la red** — pendiente de desarrollar

---

## Archivos generados en esta sesión

- `interser_soma_corpus_sintesis.md`
- `metabolismo_interser_duende.md`
- `senal_metabolismo_interser_red.md`
- `estado_reestructura_05042026.md` — este documento

---

*Estado de la Reestructura · Paradigma Aleph · 05/04/2026*
*Próxima sesión: ejecutar la reestructura completa · No a medias*
