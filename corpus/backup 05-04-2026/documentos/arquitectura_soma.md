# Arquitectura de Fundación Soma — Schema relevado

*Basado en el análisis del Sistema B (cognoesferas-payload) realizado el 29/03/2026.*
*Stack: Payload CMS + PostgreSQL + Next.js. IDs tipo UUID.*

---

## Tablas del núcleo paradigmático

### organizations
**Campos:** id, name, description, alias, deleted, root_group_id, website, address, phone, vector_store_id
**Paradigma:** Es la Cognoesfera — la unidad viva del sistema. Tiene un grupo raíz (root_group_id) que ancla su estructura fractal interna.

### users
**Campos:** id, first_name, last_name, email, enabled, email_verified, password, avatar_id, bio, is_super_admin, salt, hash, login_attempts, lock_until
**Paradigma:** La persona — portadora de la memoria psicológica, mitad humana del Cognobit. Independiente de su rol en cada Cognoesfera.

### members
**Campos:** id, organization_id, user_id, group_id, sociocratic_role, vector_store_file_id, indexed_at
**Paradigma:** La bisagra entre persona y Cognoesfera — registra el rol socrático y el grupo interno. Un usuario puede ser miembro de múltiples organizaciones.

### groups
**Campos:** id, organization_id, name, description, deleted, parent_group_id
**Paradigma:** La estructura fractal dentro de la Cognoesfera. parent_group_id permite anidar grupos sin límite — Cognoesfera → Entidad → subgrupo. Lo fractal ya estaba construido antes de nombrarse así.

---

## Tablas del Duende y la memoria digital

### duende_conversations
**Campos:** id, title, user_id, thread_id, cognoesfera_id, last_message_at, is_deleted
**Paradigma:** Cada conversación con el Duende. thread_id referencia el hilo de OpenAI — la memoria digital del sistema. El Duende no valida, sugiere.

### documents
**Campos:** id, organization_id, name, description, category, external_link, vector_store_file_id, should_index, indexed_at, indexing_status, url, filename, mime_type, filesize
**Paradigma:** Los documentos indexados al vector store del Duende — la materia prima de la Memoria Viva Aumentada. should_index controla qué entra al campo cognitivo del Duende.

### pages
**Campos:** id, organization_id (implied), title, content, content_html, slug, vector_store_file_id, indexed_at
**Paradigma:** Páginas de conocimiento de la Cognoesfera, indexables al Duende. Capa editorial del corpus digital.

---

## Tablas de la vida de la Cognoesfera

### meetings
**Campos:** id, title, description, date, start_time, duration, location, meeting_link, organization_id, participants, audio_file_id, transcription_status, transcription, diarization, speakers_status, speakers, minutes_status, minutes, vector_store_file_id, is_deleted
**Paradigma:** El ciclo de sesión completo — desde la grabación hasta el acta. Cada reunión es una instancia del concepto 26 (El proceso de transformación). La transcripción + diarización materializa la memoria de lo que se dijo.

### protocols
**Campos:** id, organization_id, title, description, content, attachment_id, category, fecha_acordado, version, estado, autor_id, requisitos_previos, criterios_evaluacion, usuarios_destinatarios, seguimiento, historial_cambios[fecha, autor, descripcion], slug, vector_store_file_id
**Paradigma:** Las decisiones acordadas por 0-Objeción que se vuelven ley interna. El mecanismo socrático materializado en código. historial_cambios porta la memoria de cómo evolucionó cada protocolo.

### initiatives
**Campos:** id, organization_id, title, description, link, solution, start_date, end_date, status, priority, progress, budget, category, thumbnail_id, related_initiatives, vector_store_file_id, slug
**Paradigma:** Los proyectos vivos de la Cognoesfera — el tiempo soberano dirigido a algo concreto. related_initiatives permite ver la red de iniciativas interdependientes.

### modules
**Campos:** id, name, slug, description, enabled
**Paradigma:** Capacidades activables de la plataforma — cada Cognoesfera puede habilitar o deshabilitar funcionalidades según su momento vital.

### settings
**Campos:** id, icon, color, purpose, purposeLong, navigation
**Paradigma:** La identidad y propósito de cada Cognoesfera. purpose y purposeLong son la voz con la que el Duende entiende para qué existe esa organización.

---

## Tablas de comunicación

### messages
**Campos:** id, organization_id, sender_id, category, template_id, content, recipients[user, contactMethod, phone, telegramChatId, email, status, sentAt, errorMessage], scheduled_for, status, retry_count, max_retries, metadata
**Paradigma:** La capa de comunicación multicanal (WhatsApp, Telegram, email, SMS). El sistema puede enviar mensajes programados desde cualquier flujo.

### message_templates
**Campos:** id, template_id, name, category, icon, color, urgency, whatsapp_template[twilio_template_sid, fallback], sms_template, email_template[subject, html_body, text_body], variables[name, label, required]
**Paradigma:** Las plantillas de comunicación reutilizables. variables permite personalización sin hardcodear contenido.

### users_contact_methods
**Campos:** user_id, type, country_code, value, is_preferred
**Paradigma:** Los canales de contacto de cada persona — WhatsApp, Telegram, email, teléfono. is_preferred determina el canal prioritario para notificaciones.

---

## Tablas de incorporación

### invitations
**Campos:** id, organization_id, type, user_id, email, first_name, last_name, sent_at
**Paradigma:** El mecanismo de invitación — cómo alguien entra a una Cognoesfera. type distingue entre invitar a alguien existente o crear un usuario nuevo.

---

## Arquitectura nueva — tablas por agregar

Las siguientes tablas no existen en el Sistema B y son el núcleo de la nueva arquitectura que materializa la Matriz de Vitalidad:

| Tabla | Propósito |
|---|---|
| `emergencias` | Registro de momentos donde algo emerge en una Cognoesfera — la capa de captura del paradigma |
| `pulsos_vitalidad` | Mediciones periódicas del estado vital de una Cognoesfera en cada dimensión de la Matriz |
| `resonancias` | Conexiones entre emergencias de distintas Cognoesferas — la red que aprende de sí misma |

**Campo nuevo en `organizations`:** `vital_state` — estado vital actual de la Cognoesfera (latente / posible / activado / emergente / expresivo / legible / sostenido / ecosistémico).

---

*Este documento es una fotografía del schema al 29/03/2026. Cualquier modificación posterior al Sistema B debe reflejarse aquí.*
