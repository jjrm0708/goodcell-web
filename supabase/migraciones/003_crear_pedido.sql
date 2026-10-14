-- 003: función segura para crear pedidos desde la tienda

create or replace function crear_pedido(
  p_nombre text,
  p_telefono text,
  p_metodo text,
  p_direccion text,
  p_ciudad text,
  p_items jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pedido_id uuid;
  v_codigo text;
  v_total numeric(12,2) := 0;
  v_item jsonb;
  v_prod productos%rowtype;
  v_cantidad integer;
  v_precio numeric(12,2);
  v_hoy date := (now() at time zone 'America/Bogota')::date;
begin
  p_nombre := trim(coalesce(p_nombre, ''));
  p_telefono := trim(coalesce(p_telefono, ''));
  p_direccion := trim(coalesce(p_direccion, ''));
  p_ciudad := trim(coalesce(p_ciudad, ''));

  if p_nombre = '' or length(p_nombre) > 120 then
    raise exception 'Nombre inválido';
  end if;
  if length(p_telefono) < 7 or length(p_telefono) > 20 then
    raise exception 'Teléfono inválido';
  end if;
  if p_metodo not in ('recoger', 'domicilio') then
    raise exception 'Método de entrega inválido';
  end if;
  if p_metodo = 'domicilio' and (
    p_direccion = '' or p_ciudad = ''
    or length(p_direccion) > 200 or length(p_ciudad) > 80
  ) then
    raise exception 'La dirección y la ciudad son obligatorias para el domicilio';
  end if;
  if jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0
     or jsonb_array_length(p_items) > 30 then
    raise exception 'Carrito inválido';
  end if;

  insert into pedidos (
    cliente_nombre, cliente_telefono, metodo_entrega, direccion, ciudad, total
  ) values (
    p_nombre, p_telefono, p_metodo,
    case when p_metodo = 'domicilio' then p_direccion end,
    case when p_metodo = 'domicilio' then p_ciudad end,
    0
  )
  returning id, codigo into v_pedido_id, v_codigo;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_cantidad := (v_item->>'cantidad')::integer;
    if v_cantidad is null or v_cantidad < 1 or v_cantidad > 20 then
      raise exception 'Cantidad inválida';
    end if;

    select * into v_prod
    from productos
    where id = (v_item->>'producto_id')::uuid and activo = true;

    if not found then
      raise exception 'Uno de los productos ya no está disponible';
    end if;
    if v_prod.stock < v_cantidad then
      raise exception 'No hay existencias suficientes de %', v_prod.nombre;
    end if;

    v_precio := case
      when v_prod.precio_oferta is not null
       and (v_prod.oferta_hasta is null or v_prod.oferta_hasta >= v_hoy)
      then v_prod.precio_oferta
      else v_prod.precio
    end;

    insert into pedido_items (
      pedido_id, producto_id, nombre, cantidad, precio_unitario, garantia_meses
    ) values (
      v_pedido_id, v_prod.id, v_prod.nombre, v_cantidad, v_precio, v_prod.garantia_meses
    );

    v_total := v_total + v_precio * v_cantidad;
  end loop;

  update pedidos set total = v_total where id = v_pedido_id;

  return jsonb_build_object('codigo', v_codigo, 'total', v_total);
end;
$$;

revoke all on function crear_pedido(text, text, text, text, text, jsonb) from public;
grant execute on function crear_pedido(text, text, text, text, text, jsonb)
  to anon, authenticated;