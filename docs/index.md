---
layout: home

hero:
  name: Vecimerca
  text: Documentación técnica
  tagline: Angular 21 + PWA + PocketBase para delivery y comercio local.
  image:
    src: /logo.svg
    alt: Vecimerca
  actions:
    - theme: brand
      text: Ver arquitectura
      link: /guide/arquitectura
    - theme: alt
      text: Backend
      link: /guide/backend
    - theme: alt
      text: Operación
      link: /guide/operacion

features:
  - title: Aplicación
    details: Vecimerca
  - title: Framework
    details: Angular 21 standalone
  - title: Backend
    details: PocketBase 0.39.4
  - title: Alcance
    details: Auth + contenido dinámico
---

# Resumen

Vecimerca es una PWA mobile-first para delivery y comercio local. El estado actual implementa autenticación con PocketBase, registro, completar perfil, navegación protegida y contenido dinámico para home, comida, supermercado, farmacia y perfil.

## Inventario del código actual

Inventario levantado desde `package.json`, `angular.json`, `src/app/**`, `src/assets/**`, `backend/**`, `pb_migrations/**`, `src/environments/**` y rutas Angular.

| Tipo | Elementos detectados | Observación |
| --- | --- | --- |
| Rutas | `/`, `/login`, `/register`, `/complete-profile`, `/home`, `/food`, `/grocery`, `/pharmacy`, `/profile`, wildcard | Las vistas de negocio están protegidas por `authGuard`. |
| Páginas | `login`, `register`, `complete-profile`, `home`, `food-home`, `grocery-home`, `pharmacy-home`, `profile` | Standalone components cargados por ruta. |
| Componentes | `app-header`, `app-sidebar`, `bottom-nav`, `search-bar`, `filter-modal`, `location-modal`, `components/home/*` | El Home está dividido en componentes por sección. |
| Servicios | `PocketbaseService`, `AuthPocketbaseService`, `ContentDataService`, `ScriptLoaderService`, `UiInitService`, `VisualPluginService`, `BodyClassService` | Autenticación, contenido dinámico, scripts visuales, Swiper y clases de página. |
| Guards | `authGuard`, `profileCompletionGuard`, `roleGuard` | `roleGuard` está disponible pero no aplicado en rutas actuales. |
| Backend | `backend/pocketbase`, `backend/pb_data`, `backend/pb_migrations` | Migraciones para usuarios y contenido dinámico; no hay `pb_hooks`. |
| Ambientes | `src/environments/environment.ts` | `pocketbaseUrl` apunta a `http://127.0.0.1:8090`. |
