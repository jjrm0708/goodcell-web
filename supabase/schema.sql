
create table categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text unique not null,
  descripcion text,
  imagen text,
  activo boolean default true,
  creado_en timestamptz default now()
);

create table productos (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid references categorias(id),
  nombre text not null,
  slug text unique not null,
  descripcion text,
  descripcion_larga text,
  precio numeric(12,2) not null,
  precio_anterior numeric(12,2),
  imagen_principal text,
  imagenes text[],
  marca text,
  modelo text,
  stock integer default 0,
  destacado boolean default false,
  nuevo boolean default false,
  activo boolean default true,
  creado_en timestamptz default now()
);

alter table categorias enable row level security;
alter table productos enable row level security;

create policy "Lectura publica de categorias activas"
  on categorias for select using (activo = true);

create policy "Lectura publica de productos activos"
  on productos for select using (activo = true);
