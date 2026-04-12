ALTER TABLE duende_chats
  ADD COLUMN IF NOT EXISTS mensajes_ruido integer[] DEFAULT '{}';
