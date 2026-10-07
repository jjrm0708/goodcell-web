-- Datos de ejemplo para desarrollo (no es inventario real)

insert into categorias (nombre, slug, orden) values
  ('Parlantes', 'parlantes', 1),
  ('Audífonos', 'audifonos', 2),
  ('Apple', 'apple', 3),
  ('Gaming', 'gaming', 4),
  ('Fotografía', 'fotografia', 5),
  ('Hogar Inteligente', 'hogar-inteligente', 6),
  ('Accesorios', 'accesorios', 7)
on conflict (slug) do update
  set nombre = excluded.nombre, orden = excluded.orden, activo = true;

delete from productos where slug in (
  'iphone-16-pro-max-256gb', 'bose-quietcomfort-ultra', 'jbl-boombox-3-wifi',
  'razer-viper-v3-pro', 'xiaomi-14-ultra-leica', 'xiaomi-robot-vacuum-x20-plus',
  'logitech-mx-master-3s', 'apple-watch-ultra-2'
);

update productos set activo = false where slug not in (
  'iphone-16-pro-max-256gb', 'bose-quietcomfort-ultra', 'jbl-boombox-3-wifi',
  'razer-viper-v3-pro', 'xiaomi-14-ultra-leica', 'xiaomi-robot-vacuum-x20-plus',
  'logitech-mx-master-3s', 'apple-watch-ultra-2'
);

insert into productos
  (categoria_id, nombre, slug, marca, precio, precio_oferta, oferta_hasta,
   stock, garantia_meses, eslogan, especificaciones, nuevo, destacado, creado_en)
values
((select id from categorias where slug = 'apple'),
  'iPhone 16 Pro Max 256GB', 'iphone-16-pro-max-256gb', 'Apple',
  5890000, null, null, 3, 12,
  'Titanio de grado aeroespacial con chip A18 Pro y cámara de 48 MP Fusion.',
  array['Chip A18 Pro de 3nm', 'Titanio Grado 5', 'Batería hasta 33h de reproducción', 'Pantalla Super Retina XDR 6.9"'],
  true, true, '2026-09-20'),

((select id from categorias where slug = 'audifonos'),
  'QuietComfort Ultra Headphones', 'bose-quietcomfort-ultra', 'BOSE',
  2190000, 1850000, '2026-10-15', 5, 12,
  'Cancelación de ruido espacial de referencia mundial y audio inmersivo.',
  array['Audio Espacial Inmersivo', 'Cancelación Activa de Ruido', '24h de autonomía continua', 'Modo Aware y Silencioso'],
  false, false, '2026-09-12'),

((select id from categorias where slug = 'parlantes'),
  'JBL Boombox 3 Wi-Fi', 'jbl-boombox-3-wifi', 'JBL',
  2490000, null, null, 2, 12,
  'Graves profundos con transmisión HD Wi-Fi y Dolby Atmos 3D.',
  array['Sonido Pro Original JBL', 'Autonomía de hasta 24 horas', 'Protección IP67 resistente al agua y polvo', 'Transmisión Wi-Fi con AirPlay'],
  true, false, '2026-09-18'),

((select id from categorias where slug = 'gaming'),
  'Razer Viper V3 Pro Wireless', 'razer-viper-v3-pro', 'Razer',
  899000, null, null, 0, 24,
  'Sensor óptico Focus Pro Gen-2 de 35.000 DPI con 54g de peso ultraligero.',
  array['Diseño ultraligero de 54g', 'Polling rate inalámbrico de 8000Hz', 'Sensor Focus Pro 35K Gen-2', 'Hasta 95 horas de batería'],
  false, false, '2026-08-30'),

((select id from categorias where slug = 'fotografia'),
  'Xiaomi 14 Ultra Leica Optics', 'xiaomi-14-ultra-leica', 'Xiaomi',
  5290000, null, null, 3, 12,
  'Cuádruple cámara óptica Leica de 50MP con sensor de 1 pulgada LYT-900.',
  array['Sensor principal 1" Sony LYT-900', 'Óptica Summilux Leica de apertura variable', 'Procesador Snapdragon 8 Gen 3', 'Pantalla AMOLED WQHD+ 120Hz'],
  false, false, '2026-09-05'),

((select id from categorias where slug = 'hogar-inteligente'),
  'Robot Vacuum X20+ All-in-One', 'xiaomi-robot-vacuum-x20-plus', 'Xiaomi',
  2490000, null, null, 1, 6,
  'Estación inteligente con autovaciado, lavado y secado térmico de almohadillas.',
  array['Potencia de succión de 6000 Pa', 'Navegación láser LDS inteligente', 'Mapeo 3D de alta precisión', 'Estación todo en uno autolimpiable'],
  false, false, '2026-09-01'),

((select id from categorias where slug = 'accesorios'),
  'Logitech MX Master 3S', 'logitech-mx-master-3s', 'Logitech',
  499000, null, null, 4, 12,
  'Rueda electromagnética MagSpeed con sensor de 8000 DPI sobre cualquier superficie.',
  array['Clics discretos ultra silenciosos', 'Sensor Darkfield 8000 DPI', 'Rueda MagSpeed electromagnética', 'Carga rápida por USB-C'],
  true, false, '2026-09-15'),

((select id from categorias where slug = 'apple'),
  'Apple Watch Ultra 2 Titanium', 'apple-watch-ultra-2', 'Apple',
  4290000, 3790000, null, 2, 12,
  'Caja de titanio de 49 mm, pantalla de 3.000 nits y GPS de doble frecuencia.',
  array['Caja de titanio aeroespacial de 49 mm', 'Pantalla brillante de hasta 3000 nits', 'Profundímetro y sensor de temperatura del agua', 'Autonomía de hasta 72 horas en modo ahorro'],
  false, false, '2026-09-10');