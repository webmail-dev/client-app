# Arquitectura

La app usa Angular standalone, rutas lazy por componente, PWA con Angular Service Worker, PocketBase para identidad/contenido y JSON local como fallback temporal.

```txt
Navegador / PWA
  |
  |-- Angular bootstrapApplication(App, appConfig)
  |   |-- Router standalone con loadComponent
  |   |-- Guards de sesion, perfil completo y roles
  |   |-- Componentes compartidos mobile-first
  |   |-- Componentes Home por seccion
  |   |-- ContentDataService: PocketBase primero, JSON fallback
  |   |-- UiInitService: reinicio seguro de Swiper
  |   |-- Servicios de Auth, PocketBase, scripts y clases visuales
  |   `-- Service Worker Angular en produccion
  |
  |-- Assets estaticos publicados desde public/**
  |   |-- CSS vendor: Metropolis, Remixicon, Swiper, Bootstrap, tema
  |   |-- JS: Bootstrap global y Swiper diferido
  |   |-- JSON fallback en assets/data
  |   `-- Imagenes, fuentes e iconos
  |
  `-- PocketBase 0.39.4
      |-- coleccion Auth users
      |-- categories, businesses, products, banners, promotions
      |-- password auth por email
      |-- OAuth2 Google configurable
      `-- migraciones en backend/pb_migrations
```

::: info
No hay API de pedidos, pagos, carrito o seguimiento implementada todavia. Las pantallas de catalogo ya consumen contenido dinamico, pero las acciones internas siguen pendientes.
:::

## Estructura de carpetas

```txt
backend/
  pocketbase
  pb_data/
  pb_migrations/

docs/
  .nojekyll
  content-pocketbase.md
  index.md
  logo.svg

public/
  assets/
    data/
  icons/
  manifest.webmanifest

src/
  app/
    components/
      home/
    guards/
    models/
    pages/
    services/
    app.config.ts
    app.routes.ts
  assets/
    data/
  environments/
  index.html
  main.ts
  styles.css
```

| Ruta | Responsabilidad | Detalle |
| --- | --- | --- |
| `src/app/components` | Componentes compartidos | Header, sidebar, navegacion inferior, busqueda, modales y secciones del Home. |
| `src/app/components/home` | Secciones reutilizables del Home | Categorias, franja de oferta, banners y productos destacados. |
| `src/app/pages` | Paginas de ruta | Auth, completar perfil, home y vistas por vertical. |
| `src/app/services` | Servicios transversales | Auth PocketBase, contenido dinamico, SDK PocketBase, scripts, plugins visuales, Swiper y clases de body. |
| `src/app/models/content.models.ts` | Contratos de contenido | Interfaces para categorias, banners, productos, restaurantes y perfil. |
| `src/app/guards` | Proteccion de rutas | Sesion, perfil completo y roles. |
| `public/assets/data` | JSON fallback servido en runtime | Home, Food, Grocery, Pharmacy y Profile. |
| `src/assets/data` | JSON fuente editable | Base local para fallback y trazabilidad. |
| `backend/pb_migrations` | Migraciones PocketBase | Usuarios y contenido dinamico. |
