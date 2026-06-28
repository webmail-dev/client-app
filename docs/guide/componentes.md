# Componentes

## Componentes compartidos

| Componente | Responsabilidad | Inputs / notas |
| --- | --- | --- |
| `AppHeader` | Header superior con titulo, menu lateral, ubicacion y botones visuales. | `title`, `showSidebar`. |
| `AppSidebar` | Offcanvas lateral con perfil, enlaces y switches RTL/dark. | Usa `RouterLink`; interacciones conectadas por `VisualPluginService`. |
| `BottomNav` | Navegacion inferior fija. | `active`, `logo`, `brand`; rutas a home, food, grocery, pharmacy y profile. |
| `SearchBar` | Buscador visual compartido con boton de filtros. | `placeholder`. No ejecuta busqueda real todavia. |
| `FilterModal` | Modal fullscreen de filtros estaticos. | No emite filtros al codigo Angular todavia. |
| `LocationModal` | Modal fullscreen para seleccion visual de ubicacion. | No persiste ubicacion todavia. |
| `page-section-title` | Carpeta residual. | No contiene archivos en el estado actual. |

## Arquitectura de componentes Home

El template de Home quedo como composicion de layout y cada seccion visual se movio a un componente reutilizable preparado para datos dinamicos.

```txt
src/app/components/home/
├── home-categories
├── home-offer-strip
├── home-banners
└── home-featured-products
```

| Componente | Responsabilidad | Datos esperados |
| --- | --- | --- |
| `home-categories` | Accesos principales a verticales. | Lista de categorias con titulo, imagen, alt y link. |
| `home-offer-strip` | Franja de promocion del dia. | Texto, imagen y alt de promocion. |
| `home-banners` | Banners principales con CTA. | Titulo, subtitulo, highlight, imagen, alt, link y CTA. |
| `home-featured-products` | Carrusel de productos destacados. | Productos con titulo, descripcion, precio, rating e imagen. |

::: tip
Las secciones pueden recibir datos desde JSON o PocketBase sin tocar clases CSS ni estructura visual.
:::
