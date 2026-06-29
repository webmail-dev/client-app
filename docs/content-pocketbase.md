# Contenido dinámico, JSON y PocketBase

Esta guía documenta cómo Dale Pues carga contenido visible para Home, Food, Grocery, Pharmacy y Profile.

## Estado actual

La fuente principal de contenido es PocketBase cuando está disponible. Los JSON locales se conservan como fallback temporal y como baseline editable para desarrollo.

```text
PocketBase
 ↓
ContentDataService
 ↓
Componentes
 ↓
Vista
```

Si PocketBase falla o no devuelve datos:

```text
JSON
 ↓
ContentDataService
 ↓
Componentes
 ↓
Vista
```

## JSON locales

Archivos fuente:

```text
src/assets/data/
├── home.json
├── food.json
├── grocery.json
├── pharmacy.json
└── profile.json
```

Archivos publicados en runtime:

```text
public/assets/data/
├── home.json
├── food.json
├── grocery.json
├── pharmacy.json
└── profile.json
```

Contenido:

- `home.json`: `categories`, `offerStrip`, `banners`, `featuredProducts`.
- `food.json`: `categories`, `banners`, `restaurants`, `popularProducts`, `offers`.
- `grocery.json`: `categories`, `banners`, `products`, `popularProducts`, `offers`, `bestSellers`, `recentItems`.
- `pharmacy.json`: `categories`, `banners`, `products`, `wellnessItems`, `offers`, `discountBanners`, `bestSellers`.
- `profile.json`: usuario demo visible y opciones del menú.

## Componentes Home

```text
src/app/components/home/
├── home-categories
├── home-offer-strip
├── home-banners
└── home-featured-products
```

- `home-categories`: accesos a verticales.
- `home-offer-strip`: franja promocional.
- `home-banners`: banners con CTA.
- `home-featured-products`: carrusel de productos destacados.

Cada componente recibe datos desde `HomePage` y mantiene las clases CSS originales.

## ContentDataService

Archivo:

```text
src/app/services/content-data.service.ts
```

Responsabilidades:

- Consultar PocketBase como fuente principal.
- Consultar JSON local como fallback.
- Normalizar records a los modelos usados por templates.
- Resolver imágenes con `resolveImage(record, fieldName)`.
- Mantener los templates desacoplados del origen de datos.

Métodos:

```ts
getHomeContent()
getFoodContent()
getGroceryContent()
getPharmacyContent()
getProfileContent()
resolveImage(record, fieldName)
```

## Colecciones PocketBase

La migration `20260624000200_content_collections_seed.js` crea y alimenta:

- `categories`
- `businesses`
- `products`
- `banners`
- `promotions`

Reglas:

- Lectura pública solo para registros activos.
- Lectura completa para `admin` o `support`.
- Escritura solo para `admin` o `support`.

## Imágenes

La primera carga usa campos auxiliares:

- `imageUrl`
- `logoUrl`
- `coverUrl`

Estos campos apuntan a rutas existentes como `assets/images/...`. TODO: migrar a archivos PocketBase (`image`, `logo`, `cover`) cuando exista un flujo de administración de imágenes.

## Seed

La migration usa upsert por `slug` o por `title + section`, por lo que no duplica registros si se ejecuta más de una vez.

Conteos de seed verificados localmente:

- `categories`: 15
- `businesses`: 7
- `products`: 22
- `banners`: 12
- `promotions`: 3

## Renderizado dinámico

Problema resuelto: Swiper se inicializaba antes de que Angular pintara datos cargados desde JSON/PocketBase.

Flujo actual:

```text
Carga de datos
 ↓
Render Angular
 ↓
DetectChanges
 ↓
Inicialización de sliders
 ↓
Interfaz lista
```

Herramientas usadas:

- `AfterViewInit`
- `ChangeDetectorRef`
- `requestAnimationFrame`
- `UiInitService`
- `VisualPluginService`

## Sliders

`UiInitService`:

- Carga `swiper-bundle.min.js` con `ScriptLoaderService`.
- Espera render con `requestAnimationFrame`.
- Evita inicializar sliders vacíos.
- Destruye instancias previas.
- Evita reinicializaciones duplicadas.
- Limpia instancias al navegar.

Sliders cubiertos:

- Home: `main-seller-product`.
- Food: `banner1`, `categories`, `products`, `brands-logo`.
- Grocery: `grocery-categories`, `grocery-product`.
- Pharmacy: `pharmacy-categories`, `grocery-product`, `discount-banner`.

## Comandos

Aplicar migrations:

```bash
cd backend
./pocketbase migrate up --migrationsDir pb_migrations
```

Levantar PocketBase:

```bash
cd backend
./pocketbase serve --migrationsDir pb_migrations
```

Si PocketBase debe escuchar desde fuera del equipo local:

```bash
./pocketbase serve --migrationsDir pb_migrations --http=0.0.0.0:8090
```

Levantar Angular:

```bash
npm start
```

## Pruebas manuales

1. Ejecutar migrations.
2. Levantar PocketBase.
3. Abrir Home, Food, Grocery y Pharmacy.
4. Confirmar requests a `/api/collections/...`.
5. Apagar PocketBase.
6. Recargar la app.
7. Confirmar que el contenido aparece desde JSON fallback.
