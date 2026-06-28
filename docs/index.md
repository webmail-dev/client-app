---
layout: home

hero:
  name: Dale Pues
  text: Documentacion tecnica
  tagline: Angular 21 + PWA + PocketBase para delivery y comercio local.
  image:
    src: /logo.svg
    alt: Dale Pues
  actions:
    - theme: brand
      text: Ver arquitectura
      link: /guide/arquitectura
    - theme: alt
      text: Backend
      link: /guide/backend
    - theme: alt
      text: Operacion
      link: /guide/operacion

features:
  - title: Aplicacion
    details: Dale Pues
  - title: Framework
    details: Angular 21 standalone
  - title: Backend
    details: PocketBase 0.39.4
  - title: Alcance
    details: Auth + contenido dinamico
---

# Resumen

Dale Pues es una PWA mobile-first para delivery y comercio local. El estado actual implementa autenticacion con PocketBase, registro, completar perfil, navegacion protegida y contenido dinamico para home, comida, supermercado, farmacia y perfil.

## Inventario del codigo actual

Inventario levantado desde `package.json`, `angular.json`, `src/app/**`, `src/assets/**`, `backend/**`, `pb_migrations/**`, `src/environments/**` y rutas Angular.

| Tipo | Elementos detectados | Observacion |
| --- | --- | --- |
| Rutas | `/`, `/login`, `/register`, `/complete-profile`, `/home`, `/food`, `/grocery`, `/pharmacy`, `/profile`, wildcard | Las vistas de negocio estan protegidas por `authGuard`. |
| Paginas | `login`, `register`, `complete-profile`, `home`, `food-home`, `grocery-home`, `pharmacy-home`, `profile` | Standalone components cargados por ruta. |
| Componentes | `app-header`, `app-sidebar`, `bottom-nav`, `search-bar`, `filter-modal`, `location-modal`, `components/home/*` | El Home esta dividido en componentes por seccion. |
| Servicios | `PocketbaseService`, `AuthPocketbaseService`, `ContentDataService`, `ScriptLoaderService`, `UiInitService`, `VisualPluginService`, `BodyClassService` | Autenticacion, contenido dinamico, scripts visuales, Swiper y clases de pagina. |
| Guards | `authGuard`, `profileCompletionGuard`, `roleGuard` | `roleGuard` esta disponible pero no aplicado en rutas actuales. |
| Backend | `backend/pocketbase`, `backend/pb_data`, `backend/pb_migrations` | Migraciones para usuarios y contenido dinamico; no hay `pb_hooks`. |
| Ambientes | `src/environments/environment.ts` | `pocketbaseUrl` apunta a `http://127.0.0.1:8090`. |
