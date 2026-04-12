create table if not exists convocatoria_contenido (
  id uuid primary key default gen_random_uuid(),
  contexto text not null,
  estado text not null,
  zona_titulo_sup text,
  zona_titulo_principal text,
  zona_titulo_sub text,
  zona_argumental text,
  zona_pregunta text,
  zona_convoca text,
  puerta_texto text,
  puerta_boton text,
  created_at timestamptz not null default now(),
  unique (contexto, estado)
);

alter table convocatoria_contenido enable row level security;

create policy "Lectura pública"
  on convocatoria_contenido for select
  using (true);

create policy "Solo service role escribe"
  on convocatoria_contenido for all
  using (false)
  with check (false);

insert into convocatoria_contenido
  (contexto, estado, zona_titulo_sup, zona_titulo_principal, zona_titulo_sub, zona_argumental, zona_pregunta, zona_convoca, puerta_texto, puerta_boton)
values
  (
    'quanam_ia_2026',
    'la_escucha',
    'Convocatoria · Por este camino 2026',
    'IHA',
    'Inteligencia Humana Aumentada',
    'La IA está reconfigurando lo que hacemos más rápido de lo que podemos nombrarlo. Las organizaciones que van a salir bien paradas son las que empiezan a pensar juntas hoy.',
    '¿Qué señales te entusiasman… o te inquietan?',
    'Tu mirada se activa cuando se encuentra con otras.',
    'Seguís acá. Tu mirada ya está activa.',
    'Continuar explorando →'
  );
