-- 001: campos que necesita el diseño del prototipo

alter table productos
  add column if not exists precio_oferta numeric(12,2),
  add column if not exists oferta_hasta date,
  add column if not exists garantia_meses integer not null default 12,
  add column if not exists eslogan text,
  add column if not exists especificaciones text[] not null default '{}';

alter table productos
  add constraint productos_garantia_valida
    check (garantia_meses in (3, 6, 12, 24)),
  add constraint productos_oferta_valida
    check (precio_oferta is null or precio_oferta < precio);

alter table categorias
  add column if not exists orden integer not null default 0;