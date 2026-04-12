CREATE TABLE archivos_curaduria (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  email_participante TEXT,
  contexto_origen TEXT,
  nombre_archivo TEXT,
  tipo_archivo TEXT,
  contenido_base64 TEXT,
  mensaje_asociado TEXT,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'descartado', 'señal')),
  notas_curador TEXT
);

-- RLS: solo el service role puede insertar/leer
ALTER TABLE archivos_curaduria ENABLE ROW LEVEL SECURITY;
