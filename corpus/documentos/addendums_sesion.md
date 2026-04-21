# Addendums de sesión
*Registro de trabajos técnicos post-cierre acotados que no ameritan sesión nueva*
*Paradigma Aleph · Iniciado Abril 2026*

---

## ¿Qué es un addendum?

Un addendum es un trabajo técnico corto (usualmente fix, verificación o ajuste puntual) que ocurre después de que una sesión del paradigma se cerró formalmente con Protocolo 02-EN, y cuya naturaleza no amerita abrir una sesión nueva completa con Protocolo 01-EN.

El addendum se declara explícitamente al comenzar, se trabaja con disciplina técnica, y se cierra con un commit que usa el prefijo `addendum:` en el mensaje para trazabilidad.

El addendum NO modifica SESION.md ni el status de la sesión a la que pertenece — esos ya son historia custodiada. Solo agrega commits al repo y una entrada aquí.

---

## Addendum 1 — 21/04/2026 · Dev-reset del instrumento TriadaPercepcion

**Sesión a la que corresponde:** SESION-20260419 "La sintonización del Duende — Corpus y Soma encontrándose en el ojo"
**Fecha del addendum:** 21/04/2026 (dos días después del cierre formal)
**Motivo de apertura:** tras el cierre de la sesión, al testear el componente TriadaPercepcion en /triadas-test, se detectó que una vez completado el flujo de 8 tríadas, no había manera de volver al inicio para testear iterativamente. La app dejaba al usuario permanentemente en la pantalla final "Ya estás adentro del campo".

**Trabajo realizado:**

1. **Botón "Reiniciar progreso (dev)"** agregado al componente TriadaPercepcion.tsx visible solo en la ruta `/triadas-test` (no en `/quanam-ia-2026` productivo). Click → confirmación → DELETE del progreso → recarga del componente sin reload de página.

2. **Endpoint DELETE /api/triadas/posicion** nuevo que elimina filas de `percepciones_triada` del usuario autenticado. Doble guarda de seguridad: `NODE_ENV !== 'development'` devuelve 403, y `auth.getUser()` valida sesión activa.

3. **Política RLS DELETE** en la tabla `percepciones_triada` de Supabase, permitiendo a usuarios autenticados borrar solo sus propias filas. Se aplicó vía SQL Editor y se dejó trazable en el repo como migración.

**Commits del addendum:**
- `2cf3032` — feat: botón dev-reset y endpoint DELETE
- `d544c43` — addendum: política RLS DELETE para percepciones_triada

**Aprendizaje custodiado:**

Este incidente reveló un tipo nuevo de default silencioso, complementario a los ya registrados en el manual de sintonización del Duende:

- "Clear site data" del navegador borra silenciosamente la sesión de Supabase Auth, sin aviso al usuario. No es un default de CSS ni de Next.js — es un default del ecosistema navegador + backend auth.
- Supabase RLS sin política DELETE bloquea la operación silenciosamente y devuelve `200 OK` con body `{"ok":true}`, sin error SQL ni mensaje explícito. El cliente nunca sabe que el DELETE no se ejecutó. Es un ejemplo de default silencioso del backend.

Ambos ejemplos enriquecen la señal 5 de SESION-20260419 ("Los defaults silenciosos traicionan la intención"). Se incorporarán al catálogo del manual de sintonización en su próxima versión (v1.1).

**Pendiente implícito para futuro:**

Cuando el instrumento TriadaPercepcion se use en producción (/quanam-ia-2026), evaluar si los usuarios productivos también necesitan un mecanismo de reinicio de progreso (quizás menos visible, quizás desde perfil). Hoy solo existe el modo dev-reset. Esto no es bloqueante pero merece la pregunta.

---
