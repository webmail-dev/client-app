# Dale Pues

Dale Pues es una aplicación web progresiva mobile-first para delivery y comercio local. El estado actual cubre autenticación con PocketBase, registro de usuarios, completar perfil, navegación protegida y contenido dinámico para Home, Food, Grocery, Pharmacy y Profile.

## Tecnologías

* Angular 21 standalone
* Angular Router con `loadComponent`
* Angular Service Worker / PWA
* TypeScript 5.9
* Reactive Forms
* PocketBase SDK `0.27.x`
* PocketBase backend `0.39.4`
* Bootstrap, Swiper, Remixicon y assets de plantilla mobile
* Contenido dinámico con PocketBase y fallback JSON local
* Vitest vía Angular unit-test builder

## Requisitos

* Node.js compatible con Angular 21: `^20.19.0`, `^22.12.0` o `>=24.0.0`
* npm 10
* Angular CLI
* PocketBase incluido en `backend/pocketbase`

## Instalación

```bash
npm install
```

## Desarrollo local

Backend:

```bash
cd backend
./pocketbase migrate up --migrationsDir pb_migrations
./pocketbase serve --migrationsDir pb_migrations
```

Para que PocketBase escuche conexiones desde fuera de la máquina local, iniciarlo indicando `0.0.0.0`:

```bash
./pocketbase serve --migrationsDir pb_migrations --http=0.0.0.0:8090
```

Frontend:

```bash
npm start
```

La URL configurada para PocketBase está en `src/environments/environment.ts`:

```text
http://127.0.0.1:8090
```

## Scripts

```bash
npm start
npm run build
npm run watch
npm test
```

## Rutas actuales

| Ruta | Acceso | Componente | Propósito |
| --- | --- | --- | --- |
| `/` | pública | redirect | Redirige a `/home`. |
| `/login` | pública | `LoginPage` | Login email/password, Google OAuth y recuperación de contraseña. |
| `/register` | pública | `RegisterPage` | Alta de usuarios client, merchant o courier. |
| `/complete-profile` | autenticada incompleta | `CompleteProfilePage` | Completa datos mínimos y términos. |
| `/home` | `authGuard` | `HomePage` | Vista principal de categorías de delivery. |
| `/food` | `authGuard` | `FoodHomePage` | Home de comida/restaurantes. |
| `/grocery` | `authGuard` | `GroceryHomePage` | Home de supermercado. |
| `/pharmacy` | `authGuard` | `PharmacyHomePage` | Home de farmacia. |
| `/profile` | `authGuard` | `ProfilePage` | Perfil y accesos de cuenta. |
| `**` | pública | redirect | Redirige a `/home`. |

## Estructura principal

```text
backend/
  pocketbase
  pb_data/
  pb_migrations/

docs/
  index.html
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
  main.ts
  styles.css
```

## Componentes compartidos

`src/app/components` contiene:

* `app-header`: header superior con título, ubicación, botón de sidebar y acceso a modales.
* `app-sidebar`: offcanvas lateral con enlaces y switches visuales.
* `bottom-nav`: navegación inferior entre home, food, grocery, pharmacy y profile.
* `search-bar`: buscador visual con apertura de modal de filtros.
* `filter-modal`: modal estático de filtros.
* `location-modal`: modal estático de ubicación.
* `page-section-title`: carpeta residual sin archivos.

## Arquitectura de componentes

El Home se dividió por secciones reutilizables:

```text
src/app/components/home/
├── home-categories
├── home-offer-strip
├── home-banners
└── home-featured-products
```

Responsabilidades:

* `home-categories`: accesos principales a comida, mercado y farmacia.
* `home-offer-strip`: franja promocional superior.
* `home-banners`: banners principales con CTA.
* `home-featured-products`: carrusel de productos destacados.

La separación reduce el tamaño del template de `HomePage`, conserva las clases CSS originales y prepara cada sección para recibir datos dinámicos desde JSON o PocketBase sin reescribir el layout.

## Servicios y guards

* `PocketbaseService`: instancia única del SDK de PocketBase usando `environment.pocketbaseUrl`.
* `AuthPocketbaseService`: login, registro, Google OAuth, recuperación de contraseña, sesión, logout, roles, defaults de usuario y completar perfil.
* `ContentDataService`: carga contenido dinámico desde PocketBase y usa JSON local en `/assets/data/*.json` como fallback temporal.
* `ScriptLoaderService`: carga scripts externos evitando duplicados.
* `UiInitService`: reinicializa Swiper después de que Angular renderiza datos dinámicos y destruye instancias previas.
* `VisualPluginService`: inicializa listeners visuales heredados de la plantilla y delega Swiper a `UiInitService`.
* `BodyClassService`: administra clases visuales del `body`.
* `authGuard`: protege rutas autenticadas y bloquea cuentas inactive/blocked.
* `profileCompletionGuard`: permite `/complete-profile` solo cuando falta completar perfil.
* `roleGuard`: helper disponible para rutas por tipo de usuario, aún no aplicado en `app.routes.ts`.

## Backend

El backend usa PocketBase `0.39.4` en `backend/`.

```text
backend/
  pocketbase
  pb_data/
  pb_migrations/
    20260624000100_update_users_auth.js
    20260624000200_content_collections_seed.js
```

No existe `pb_hooks/` en el estado actual.

La migración actual modifica la colección Auth `users`, habilita password auth por email, mapea `name` desde OAuth2 y agrega campos de perfil, tipo, estado y auditoría.

La migración de contenido crea y alimenta:

```text
categories
businesses
products
banners
promotions
```

Las reglas públicas permiten leer registros activos:

```text
active = true || @request.auth.type = "admin" || @request.auth.type = "support"
```

La escritura queda limitada a usuarios `admin` o `support`.

El seed inicial usa rutas públicas en campos auxiliares `imageUrl`, `logoUrl` y `coverUrl` para reutilizar los assets existentes. TODO: migrar esos campos a archivos PocketBase cuando exista una interfaz de administración de imágenes.

## Gestión de usuarios

Colección:

```text
users
```

Tipos soportados:

```text
client
merchant
courier
admin
support
```

Estados soportados:

```text
active
pending
inactive
blocked
rejected
```

Flujos implementados:

* Login email/password con `authWithPassword`.
* Login Google OAuth con `authWithOAuth2({ provider: 'google' })`.
* Recuperación de contraseña con `requestPasswordReset`.
* Registro de `client`, `merchant` y `courier`.
* Completar perfil en `/complete-profile`.
* Logout limpiando `authStore` y redirigiendo a `/login`.

Pendiente/futuro:

* Vistas específicas por rol.
* Separar datos temporales de comercio en `merchant_profiles`.
* Separar datos temporales de repartidor en `courier_profiles`.
* Panel admin/support.

## Migraciones

Crear migración:

```bash
cd backend
./pocketbase migrate create nombre_de_la_migracion --migrationsDir pb_migrations
```

Aplicar migraciones:

```bash
cd backend
./pocketbase migrate up --migrationsDir pb_migrations
```

Revertir la última migración:

```bash
cd backend
./pocketbase migrate down --migrationsDir pb_migrations
```

Flujo recomendado: crear o modificar migraciones en `backend/pb_migrations`, probarlas contra una base local, validar frontend con `npm run build`, commitear migraciones junto con los cambios de código que dependen de ellas y aplicarlas en producción antes de publicar el frontend que usa el nuevo esquema.

## Gestión de contenido

La app consume primero PocketBase y conserva JSON local como fallback temporal. Los JSON publicados en runtime están en:

```text
public/assets/data/home.json
public/assets/data/food.json
public/assets/data/grocery.json
public/assets/data/pharmacy.json
public/assets/data/profile.json
```

Los JSON fuente se conservan también en `src/assets/data/` para edición local y trazabilidad:

```text
src/assets/data/
├── home.json
├── food.json
├── grocery.json
├── pharmacy.json
└── profile.json
```

Contenido por archivo:

* `home.json`: `categories`, `offerStrip`, `banners`, `featuredProducts`.
* `food.json`: `categories`, `banners`, `restaurants`, `popularProducts`, `offers`.
* `grocery.json`: `categories`, `banners`, `products`, `popularProducts`, `offers`, `bestSellers`, `recentItems`.
* `pharmacy.json`: `categories`, `banners`, `products`, `wellnessItems`, `offers`, `discountBanners`, `bestSellers`.
* `profile.json`: datos visibles del usuario demo y menú de perfil.

Flujo fallback:

```text
JSON
 ↓
ContentDataService
 ↓
Componentes
 ↓
Vista
```

Flujo principal:

```text
PocketBase
 ↓
ContentDataService
 ↓
Componentes
 ↓
Vista
```

Estrategia de fallback:

```text
PocketBase
 ↓
Si responde correctamente
 ↓
Mostrar datos remotos

Si falla o viene vacío
 ↓
Usar JSON local
```

Ventajas: desarrollo local rápido, menor dependencia del backend y mejor experiencia durante mantenimiento.

## ContentDataService

`src/app/services/content-data.service.ts` centraliza la carga y normalización de contenido.

Métodos expuestos:

```ts
getHomeContent()
getFoodContent()
getGroceryContent()
getPharmacyContent()
getProfileContent()
resolveImage(record, fieldName)
```

Responsabilidades:

* Consultar PocketBase como fuente principal para `categories`, `banners`, `products`, `promotions` y `businesses`.
* Convertir records de PocketBase a las interfaces que consumen los templates.
* Resolver imágenes desde archivos PocketBase, rutas `assets/images/...` o URLs externas.
* Usar JSON local si PocketBase falla o no devuelve contenido.
* Mantener estable la estructura esperada por los componentes.

## Preparación para PocketBase

La integración de contenido remoto ya está preparada y activa en el servicio de contenido. El backend expone:

```text
categories
businesses
products
banners
promotions
```

`ContentDataService` arma la misma estructura que antes venía de JSON local, por lo que los templates siguen desacoplados del origen. El siguiente paso natural es construir vistas admin/support para administrar esas colecciones y migrar `imageUrl`, `logoUrl` y `coverUrl` hacia campos de archivo PocketBase.

Consultas principales:

* Home: categorías `type="home"`, banners `section="home"`, productos `featured=true`, promociones `section="home"`.
* Food: categorías `type="food"`, banners `section="food"`, productos `type="food"`, comercios `type="restaurant"`.
* Grocery: categorías `type="grocery"`, banners `section="grocery"`, productos `type="grocery"`, comercios `type="grocery"`.
* Pharmacy: categorías `type="pharmacy"`, banners `section="pharmacy"`, productos `type="pharmacy"`, comercios `type="pharmacy"`.

Guía adicional: `docs/content-pocketbase.md`.

## Renderizado dinámico

Los sliders de la plantilla fallaban cuando Swiper se inicializaba antes de que Angular pintara datos dinámicos. El flujo actual en páginas con carruseles es:

```text
Carga de datos
 ↓
Render Angular
 ↓
ChangeDetectorRef.detectChanges()
 ↓
requestAnimationFrame
 ↓
Inicialización de sliders
 ↓
Interfaz lista
```

`HomePage`, `FoodHomePage`, `GroceryHomePage` y `PharmacyHomePage` usan `AfterViewInit`, flags de vista lista y `ChangeDetectorRef` para inicializar plugins solo cuando existe contenido renderizado.

`UiInitService` encapsula Swiper:

* Espera el DOM con `requestAnimationFrame`.
* Evita inicializar sliders sin slides.
* Destruye instancias previas con `destroy(true, true)`.
* Evita inicializaciones duplicadas con un contador de versión.
* Limpia instancias al navegar entre rutas para evitar memory leaks.

## Sliders y componentes interactivos

Swiper se usa en:

* Home: `main-seller-product`.
* Food: `banner1`, `categories`, `products`, `brands-logo`.
* Grocery: `grocery-categories`, `grocery-product`.
* Pharmacy: `pharmacy-categories`, `grocery-product`, `discount-banner`.

`VisualPluginService` conserva listeners heredados de la plantilla, como dark mode, RTL, rangos y likes, y delega la creación/destrucción de Swiper a `UiInitService`.

## Build y despliegue

Frontend:

```bash
npm run build
```

El build se genera en:

```text
dist/dale-pues/browser
```

Opciones contempladas:

* GitHub Pages: publicar el contenido estático y configurar fallback SPA/base href si se sirve desde subcarpeta.
* AWS Amplify: conectar repositorio, usar `npm ci` y `npm run build`, publicar `dist/dale-pues/browser`.

Backend:

* PocketBase en EC2 Ubuntu.
* Ejecutar migraciones antes de levantar el servicio.
* Exponer HTTPS con reverse proxy.
* Configurar OAuth Google según la URL pública de PocketBase.

## Flujo de trabajo

1. Levantar PocketBase local.
2. Aplicar migraciones.
3. Ejecutar Angular con `npm start`.
4. Implementar cambios.
5. Validar con `npm run build` y pruebas aplicables.
6. Commits pequeños con frontend, backend y migraciones relacionadas.
7. Push de la rama.
8. Desplegar backend/migraciones.
9. Desplegar frontend.

## Troubleshooting

* Assets no encontrados: la app referencia `assets/...`, pero Angular copia `public/**`; verificar `public/assets`.
* Scripts externos: cargar scripts de interacción con `ScriptLoaderService`/`VisualPluginService`; evitar duplicar `script.js` global.
* OAuth Google: habilitar proveedor en PocketBase y usar el redirect URI mostrado por PocketBase para la URL activa.
* PocketBase local: confirmar que `./backend/pocketbase serve` esté activo en `http://127.0.0.1:8090`.
* Rutas Angular: configurar fallback a `index.html` en hosting estático.
* Build: Angular 21 falla con versiones viejas de Node.
* Linux ENOSPC watchers: aumentar watchers con `fs.inotify.max_user_watches`.
* CSS duplicado: `src/index.html` y `angular.json` cargan CSS vendor; si aparecen estilos duplicados, centralizar la estrategia.

## Documentación completa

La documentación técnica navegable está en:

```text
docs/index.html
```
