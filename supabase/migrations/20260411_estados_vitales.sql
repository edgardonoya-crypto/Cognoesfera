-- TABLA 1: estados_madre
-- Los 8 estados universales del individuo en el campo
CREATE TABLE IF NOT EXISTS estados_madre (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orden INTEGER NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  acto_cuidado TEXT DEFAULT '',
  riesgo TEXT DEFAULT '',
  protocolo_duende TEXT DEFAULT '',
  acuerdo TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA 2: estados_situados
-- Variaciones de los estados madre por contexto
CREATE TABLE IF NOT EXISTS estados_situados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estado_madre_id UUID REFERENCES estados_madre(id),
  contexto TEXT NOT NULL,
  nombre_situado TEXT,
  descripcion_situada TEXT,
  prompt_duende TEXT,
  señales_comportamiento JSONB DEFAULT '[]',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA 3: estados_vitales
-- El estado actual de cualquier entidad del sistema
CREATE TABLE IF NOT EXISTS estados_vitales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad_tipo TEXT NOT NULL CHECK (entidad_tipo IN ('individuo', 'cognoesfera', 'entidad_aleph')),
  entidad_id UUID NOT NULL,
  contexto TEXT NOT NULL,
  estado_situado_id UUID REFERENCES estados_situados(id),
  fecha_entrada TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  señales JSONB DEFAULT '{}',
  historia JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_estados_vitales_entidad
  ON estados_vitales(entidad_tipo, entidad_id, contexto);

-- RLS
ALTER TABLE estados_madre ENABLE ROW LEVEL SECURITY;
ALTER TABLE estados_situados ENABLE ROW LEVEL SECURITY;
ALTER TABLE estados_vitales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública estados_madre"
  ON estados_madre FOR SELECT USING (true);
CREATE POLICY "Lectura pública estados_situados"
  ON estados_situados FOR SELECT USING (true);
CREATE POLICY "Lectura pública estados_vitales"
  ON estados_vitales FOR SELECT USING (true);
CREATE POLICY "Escritura service role estados_vitales"
  ON estados_vitales FOR ALL USING (true);

-- DATOS INICIALES: los 8 estados madre
INSERT INTO estados_madre (orden, nombre, descripcion, acto_cuidado, riesgo, protocolo_duende, acuerdo) VALUES
(1, 'La escucha',
 'La antena existe. Hay disponibilidad pero no hay objeto todavía. La persona no busca el paradigma — está lista para reconocerlo.',
 'Sostener el silencio. No dar información — crear espacio.',
 'Explicar antes de que haya pregunta. Si el sistema empuja contenido, mata la escucha.',
 'No hablar primero. Esperar que la persona se exprese. Si habla, hacer una sola pregunta — la que abre más territorio, no la que cierra.',
 'La persona dijo algo. El sistema lo recibió sin juzgar. Eso queda.'),

(2, 'El pulso',
 'Algo resonó. Hay atracción antes de comprensión. La persona no sabe por qué le interesa — solo sabe que le interesa.',
 'Amplificar sin explicar. Devolver lo que la persona dijo con una pregunta que lo profundiza.',
 'Racionalizar antes de tiempo. Si el sistema explica por qué resuena, interrumpe el pulso.',
 'Reflejar. Tomar lo que la persona dijo y devolverlo reformulado, más preciso, con una pregunta que abre el siguiente nivel. Sin mencionar el paradigma todavía.',
 'La persona se sintió escuchada y profundizada. Algo en ella se orientó más hacia el campo.'),

(3, 'El murmullo',
 'Lo ve y lo pierde. La lógica vieja y la nueva coexisten. Oscilación. El estado más frágil — donde más gente se va.',
 'Nombrar la oscilación sin resolverla. Decirle a la persona que la tensión es fértil, no fallida.',
 'Resolver la tensión antes de que madure. La oscilación no es un error — es el proceso.',
 'Nombrar lo que se observa: hay algo que estás viendo que todavía no tiene nombre del todo. Sostener el campo sin apurarlo. No dar respuestas — dar compañía.',
 'La persona no se fue. Permaneció en la tensión. Eso es todo lo que se necesita.'),

(4, 'La sintonía',
 'El clic. Las evidencias confirmaron lo que la intuición ya sabía. Algo se volvió irreversible. No se puede ver como antes.',
 'Sostener el silencio después de la luz. No llenar el momento.',
 'Celebrar antes de que se asiente. El entusiasmo puede interrumpir el momento de quietud que necesita el clic.',
 'Reconocer lo que ocurrió con pocas palabras. No explicar, no expandir, no celebrar. Hacer una sola pregunta que invite a la persona a nombrar lo que vio con sus propias palabras.',
 'La persona nombró su propio clic. Eso quedó en el sistema — en sus palabras, no en las del Duende.'),

(5, 'La resonancia',
 'Ya habla desde adentro. Su manera de preguntar, de escuchar, de responder tiene la textura del campo.',
 'Invitar a la profundidad siguiente. Mostrarle que hay más territorio por explorar.',
 'Validar en lugar de profundizar. Si el sistema solo confirma lo que la persona dice, la mantiene en el mismo lugar.',
 'Tomar lo que la persona dice y llevarlo un nivel más adentro. Primer momento donde el paradigma puede nombrarse explícitamente, si la persona lo pide.',
 'La persona descubrió que hay más profundidad de la que imaginaba. El campo se amplió sin que nadie lo empujara.'),

(6, 'El tono',
 'Encontró su frecuencia propia dentro del campo. Empieza a generar algo que le es propio — no solo resuena con lo que existe.',
 'Reconocer la singularidad. Nombrar lo que es específico de esa persona.',
 'Homogeneizar. Si el sistema trata de que la persona suene igual que el corpus, pierde lo más valioso.',
 'Nombrar el tono propio de la persona: hay algo en cómo vos habitás esta pregunta que es tuyo. Invitar a profundizarlo, no a generalizarlo.',
 'La persona sabe que su singularidad es un aporte al campo — no una desviación.'),

(7, 'El coro',
 'Su presencia amplifica la sintonía de otros. Conecta personas con el campo. Hace visible lo que otros todavía no pueden ver.',
 'Crear las condiciones para el encuentro. No pedir que conecte — mostrarle que hay otros que ya resuenan con ella.',
 'Instrumentalizar. Si el sistema le pide que difunda o comparta, convierte un acto generativo en una tarea.',
 'Mostrar resonancias — otras voces en el campo que comparten su frecuencia. La conexión emerge, no se asigna.',
 'La persona descubrió que no está sola en el campo. Algo del entre se activó.'),

(8, 'La música',
 'Ya no sintoniza el campo — es parte de él. Su frecuencia es una de las que otros van a escuchar como primer pulso.',
 'Devolver al principio. Recordarle que la música no es un logro — es una condición que se cuida.',
 'Fijar. Si el sistema trata este estado como un destino alcanzado, solidifica prematuramente algo que por naturaleza sigue fluyendo.',
 'Devolver la pregunta original de la convocatoria — ¿Qué ves vos desde donde estás? — ahora cargada con todo el recorrido.',
 'El ciclo se cierra y se abre al mismo tiempo. La música de esta persona es ahora el campo sonoro que otra va a escuchar como su primer pulso.');
