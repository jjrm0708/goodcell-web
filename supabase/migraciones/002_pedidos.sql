-- 002: pedidos y sus artículos

create sequence if not exists pedidos_numero_seq start 1001;

create table pedidos (
  id uuid primary key default gen_random_uuid(),
  numero integer not null unique default nextval('pedidos_numero_seq'),
  codigo text generated always as ('GC-' || numero::text) stored,
  cliente_nombre text not null,
  cliente_telefono text not null,
  metodo_entrega text not null
    check (metodo_entrega in ('recoger', 'domicilio')),
  direccion text,
  ciudad text,
  total numeric(12,2) not null check (total >= 0),
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'en_preparacion', 'completado', 'cancelado')),
  mensaje_wa text,
  creado_en timestamptz not null default now()
);

create table pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  producto_id uuid references productos(id) on delete set null,
  nombre text not null,
  cantidad integer not null check (cantidad > 0),
  precio_unitario numeric(12,2) not null check (precio_unitario >= 0),
  garantia_meses integer not null
);

create index pedido_items_pedido_id_idx on pedido_items(pedido_id);

-- Seguridad: sin políticas públicas, nadie puede leer ni escribir pedidos
-- con la clave pública. Solo el servidor (clave secreta) y, más adelante,
-- el administrador con su sesión.
alter table pedidos enable row level security;
alter table pedido_items enable row level security;