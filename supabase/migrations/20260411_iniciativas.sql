-- Tabla de iniciativas del Paradigma Aleph
CREATE TABLE IF NOT EXISTS iniciativas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  responsable TEXT DEFAULT '',
  estado TEXT DEFAULT 'activa' CHECK (estado IN ('activa', 'pausada', 'completada')),
  fecha_inicio DATE,
  visible_convocatoria BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Datos iniciales
INSERT INTO iniciativas (nombre, descripcion, visible_convocatoria) VALUES
  ('Varios equipos de Quanam', '', false),
  ('En una ONG', '', false),
  ('En una institución educativa — IAC 2026 Punta del Este', '', false),
  ('Grupos de trabajo internacionales — Inteligencia Colectiva', '', false),
  ('Propuestas de implementación IHA', '', false);

-- Tabla de intereses registrados por participantes
CREATE TABLE IF NOT EXISTS intereses_iniciativas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  iniciativa_id UUID REFERENCES iniciativas(id) ON DELETE CASCADE,
  email_participante TEXT,
  lente_origen TEXT,
  fragmento_origen TEXT,
  momento TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
