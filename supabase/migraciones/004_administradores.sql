-- 004: administradores y permisos del panel

create table administradores (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  creado_en timestamptz not null default now()
);

alter table administradores enable row level security;

create policy "Cada administrador ve su propia fila"
  on administradores for select to authenticated
  using (user_id = auth.uid());

create or replace function es_admin() returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from administradores where user_id = auth.uid());
$$;

revoke all on function es_admin() from public;
grant execute on function es_admin() to authenticated;

-- Los administradores pueden ver y modificar todo; el público sigue igual
create policy "Admin gestiona productos"
  on productos for all to authenticated
  using (es_admin()) with check (es_admin());

create policy "Admin gestiona categorias"
  on categorias for all to authenticated
  using (es_admin()) with check (es_admin());

create policy "Admin gestiona pedidos"
  on pedidos for all to authenticated
  using (es_admin()) with check (es_admin());

create policy "Admin gestiona items de pedidos"
  on pedido_items for all to authenticated
  using (es_admin()) with check (es_admin());