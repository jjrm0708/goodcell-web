<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Good Cell — contexto del proyecto

## Quién y qué
- Dueño del proyecto: Juan, estudiante de tecnología en desarrollo de software (UTP, Colombia). **Principiante: está aprendiendo la terminal, Git y el código.**
- Negocio: Good Cell SAS, tienda familiar de tecnología premium en el Centro Comercial Unicentro, local 252, Armenia (Quindío). Vende Apple, Bose, JBL, DJI, Shokz, Logitech, Xiaomi, Razer y más. Todo es original, sellado de fábrica y con garantía de la marca.
- Es la tienda web real del negocio (catálogo + pedido por WhatsApp + panel de administración) y también el proyecto final de la universidad.
- Contacto del negocio: WhatsApp 310 5000800, Instagram @good_cell. Los datos del negocio viven SOLO en `lib/site.ts`.

## Cómo trabajar con Juan (reglas obligatorias)
1. Responde siempre en español, con frases cortas y sencillas. Explica el porqué en pocas líneas.
2. Un paso pequeño a la vez. Antes de cambios grandes, propón un plan corto y espera su visto bueno (usa el modo Plan).
3. Un commit por pieza que ya funciona, con mensaje en español que empiece con verbo ("Agregar...", "Corregir..."). **No ejecutes `git commit` ni `git push`**: muéstrale los comandos para que los corra él y aprenda.
4. Antes de proponer un commit corre `npm run lint` y `npm run build`; ambos deben pasar sin errores.
5. Su terminal es **Fish** (Linux, CachyOS). No uses sintaxis exclusiva de bash (heredocs `<<EOF`, `export VAR=...`). Para archivos largos, crea o edita el archivo directamente.
6. **Nunca leas, imprimas ni copies `.env.local`** ni ninguna clave. Solo se pueden mencionar los nombres: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
7. No instales paquetes, no borres archivos y no ejecutes comandos destructivos (`rm -rf`, `git reset --hard`, `git push --force`, `DROP`) sin pedir permiso explícito.
8. No inventes datos del negocio (correos, plazos de garantía, textos legales, precios). Si falta un dato, pregúntale.
9. Cambios en la base de datos: NO se aplican desde la terminal. Crea un archivo nuevo en `supabase/migraciones/` (siguiente: `006_...sql`) y dile a Juan que lo ejecute en el SQL Editor de Supabase.
10. Next.js 16 tiene cambios respecto a lo que sabes: lee `node_modules/next/dist/docs/` antes de usar APIs poco comunes. Los `params` de las rutas dinámicas son una Promesa (`await params`).

## Stack
- Next.js 16.3 (App Router, Turbopack), React 19, TypeScript, Tailwind v4 (sin `tailwind.config`; los estilos viven en `app/globals.css` y `app/theme.css`).
- Supabase (Postgres, Auth, RLS) con `@supabase/supabase-js`. Despliegue en Vercel (plan Hobby, URL de prueba `goodcell-web.vercel.app`; dominio goodcell.com aún sin conectar). Cada push a `main` redespliega.
- `next-themes` (clase `.dark`), `lucide-react` v1 (**no trae íconos de marcas**: el de Instagram es propio en `components/instagram-icon.tsx`), shadcn/ui con Base UI instalado pero casi sin usar (solo donde dé accesibilidad: diálogos, selects, tablas).
- Fuente: Inter. Moneda: COP con `formatCOP` (`lib/utils.ts`). Zona horaria de negocio: `America/Bogota`.

## Diseño
- Estilo tipo Apple: espacioso, tarjetas muy redondeadas, acento verde `#4ade80`, tema claro y oscuro (por defecto el del sistema).
- Usa SIEMPRE las clases semánticas definidas con `@utility` en `app/globals.css`: `bg-app-primary`, `bg-app-surface-1/2/card/elevated`, `bg-app-navbar`, `text-app-primary/secondary`, `border-app-subtle/card/hover`, `bg-app-accent`, `text-app-accent`, `text-app-accent-contrast`, `bg-app-accent-subtle`. Variables en `app/theme.css`. Verde WhatsApp `#25d366` (botones de WhatsApp).
- Responsive obligatorio (celular primero), zonas táctiles de mínimo 44px, accesible (aria-label, foco visible).
- El prototipo original (hecho en Google AI Studio con Vite/React, rutas con `#/`) es la REFERENCIA visual de solo lectura. Ruta: `<COMPLETAR: carpeta del prototipo>`. Se porta componente por componente a Next.js; no se copia tal cual.

## Estructura del proyecto
- `app/`: `page.tsx` (inicio con hero, catálogo y filtros), `producto/[slug]`, `contacto`, `sobre-nosotros`, `[doc]` (legales: terminos-y-condiciones, politica-de-privacidad, politica-de-cookies, garantias), `pedido-enviado`, `not-found.tsx`, `admin/` (layout + `page.tsx` resumen, `categorias`, `pedidos`).
- `components/`: tienda (navbar, footer, hero, trust-strip, category-bar, catalogo, product-card, product-detail, product-placeholder, cart-provider, cart-drawer, whatsapp-button, cookie-banner, scroll-to-top-button, visit-us, order-confirmation, legal-document, theme-provider, theme-toggle, instagram-icon, back-button, ocultar-en-admin) y `components/admin/` (admin-app con login y menú, resumen-admin, categorias-admin, categoria-form-modal, pedidos-admin, pedido-detalle-modal, estado-badge).
- `lib/`: `supabase.ts`, `types.ts`, `utils.ts` (formatCOP, cn), `site.ts` (datos del negocio y `whatsappUrl`), `precios.ts` (oferta vigente, descuento, texto de garantía), `catalogo.ts` (lecturas a Supabase), `pedidos.ts`, `fechas.ts`, `url.ts`, `legal.tsx` (textos legales).
- `supabase/`: `schema.sql`, `migraciones/001`–`005`, `datos_de_ejemplo.sql` (8 productos de prueba, no es inventario real).

## Base de datos (Supabase)
- Tablas: `categorias` (con `orden`), `productos` (con `precio_oferta`, `oferta_hasta`, `garantia_meses` ∈ {3,6,12,24}, `eslogan`, `especificaciones`, `stock`, `activo`, `destacado`, `nuevo`, `imagen_principal`, `imagenes`), `pedidos` (código `GC-1001`, `GC-1002`…; estados `pendiente`, `en_preparacion`, `completado`, `cancelado`), `pedido_items`, `administradores`.
- RLS activado en todo. El público solo LEE productos y categorías activos. Los pedidos solo se crean con la función `crear_pedido` (valida datos, recalcula precios en el servidor, revisa stock). `cambiar_estado_pedido` (solo administradores) descuenta el stock al pasar a «en preparación»/«completado» y lo devuelve al volver a «pendiente»/«cancelado». `es_admin()` define quién es administrador.
- El registro de usuarios está apagado: solo entran los administradores creados a mano.

## Decisiones ya tomadas
- Rutas reales de Next.js; categoría, búsqueda y orden viven en la URL (`?categoria=...&q=...&orden=...`). El catálogo se filtra en el navegador. La página de inicio se revalida cada 60 s.
- Carrito en `localStorage`, empieza vacío. Pedido: se guarda en Supabase y luego se abre WhatsApp con el mensaje (incluye el código real). Nombre y teléfono obligatorios; dirección y ciudad si es domicilio.
- Garantía depende de cada producto (casi todos 1 año); la página de Garantías no fija plazos por categoría.
- Etiquetas de oferta con fecha de fin; precios mostrados con `precioEfectivo`.

## Estado actual
- Hecho: tienda pública completa, carrito y pedidos guardados, páginas legales (textos de ejemplo), despliegue de prueba, login de admin con Supabase Auth, panel con Resumen, Categorías y Pedidos (con control de inventario).
- Pendiente (en orden): 1) Panel > Productos (crear/editar/activar, oferta, garantía, stock) con subida de fotos a Supabase Storage; 2) Panel > Configuración; 3) fotos reales de productos y del local (hoy hay relleno con ícono); 4) correos reales y revisión legal de los textos (hoy son borradores); 5) dominio goodcell.com y revisar plan de Vercel (Hobby es solo uso no comercial); 6) SEO (sitemap, robots, metadatos), estadísticas, límite de pedidos por abuso, verificación en dos pasos del admin; 7) pruebas en celulares reales y documentación para la entrega universitaria.