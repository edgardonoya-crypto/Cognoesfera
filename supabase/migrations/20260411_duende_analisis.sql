create table if not exists duende_analisis (
  id uuid primary key default gen_random_uuid(),
  contexto_origen text not null,
  consulta text not null,
  respuesta text not null,
  fuentes jsonb not null default '[]',
  conversaciones_n integer not null default 0,
  created_at timestamptz not null default now()
);

alter table duende_analisis enable row level security;

create policy "Solo service role"
  on duende_analisis for all
  using (false)
  with check (false);
