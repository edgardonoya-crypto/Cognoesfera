-- Migración: distinguir narrativa no-respondida-aún vs postergada explícitamente
-- Fecha: 18/04/2026 · SESION-20260418

ALTER TABLE percepciones_triada
ADD COLUMN IF NOT EXISTS narrativa_pospuesta BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN percepciones_triada.narrativa_pospuesta IS
  'TRUE si el usuario eligió "no deseo responder ahora". Diferente de narrativa NULL sin postergar.';
