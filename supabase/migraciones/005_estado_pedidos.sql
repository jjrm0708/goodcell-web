-- 005: cambio de estado de pedidos con control de inventario

alter table pedidos
  add column if not exists stock_descontado boolean not null default false;

create or replace function cambiar_estado_pedido(
  p_pedido_id uuid,
  p_estado text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pedido pedidos%rowtype;
  v_item record;
  v_prod productos%rowtype;
  v_compromete boolean;
begin
  if not es_admin() then
    raise exception 'No autorizado';
  end if;
  if p_estado not in ('pendiente', 'en_preparacion', 'completado', 'cancelado') then
    raise exception 'Estado inválido';
  end if;

  select * into v_pedido from pedidos where id = p_pedido_id for update;
  if not found then
    raise exception 'Pedido no encontrado';
  end if;

  v_compromete := p_estado in ('en_preparacion', 'completado');

  if v_compromete and not v_pedido.stock_descontado then
    for v_item in
      select * from pedido_items
      where pedido_id = p_pedido_id and producto_id is not null
    loop
      select * into v_prod from productos where id = v_item.producto_id for update;
      if v_prod.stock < v_item.cantidad then
        raise exception 'No hay existencias suficientes de %', v_prod.nombre;
      end if;
      update productos set stock = stock - v_item.cantidad
        where id = v_item.producto_id;
    end loop;
    update pedidos set stock_descontado = true where id = p_pedido_id;

  elsif not v_compromete and v_pedido.stock_descontado then
    for v_item in
      select * from pedido_items
      where pedido_id = p_pedido_id and producto_id is not null
    loop
      update productos set stock = stock + v_item.cantidad
        where id = v_item.producto_id;
    end loop;
    update pedidos set stock_descontado = false where id = p_pedido_id;
  end if;

  update pedidos set estado = p_estado where id = p_pedido_id;
end;
$$;

revoke all on function cambiar_estado_pedido(uuid, text) from public;
grant execute on function cambiar_estado_pedido(uuid, text) to authenticated;