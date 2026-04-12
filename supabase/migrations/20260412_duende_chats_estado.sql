ALTER TABLE duende_chats
  ADD COLUMN IF NOT EXISTS estado text DEFAULT 'activa'
  CHECK (estado IN ('activa', 'archivada', 'ruido'));
