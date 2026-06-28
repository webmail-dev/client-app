# Servicios y datos

## Servicios, guards y helpers

| Elemento | Responsabilidad | API / comportamiento |
| --- | --- | --- |
| `PocketbaseService` | Crear y exponer la instancia SDK. | `new PocketBase(environment.pocketbaseUrl)` y `getInstance()`. |
| `AuthPocketbaseService` | Autenticacion y estado de usuario. | `login`, `register`, `loginWithGoogle`, `logout`, `requestPasswordReset`, `refreshSession`, `completeProfile`, `redirectAfterAuth`. |
| `ContentDataService` | Contenido dinamico. | Consulta PocketBase, normaliza records, resuelve imagenes y usa JSON local como fallback. |
| `ScriptLoaderService` | Carga scripts externos. | `load` y `loadAll`; evita duplicados por URL. |
| `UiInitService` | Inicializacion visual post-render. | Carga Swiper, espera DOM renderizado, destruye instancias previas y evita sliders vacios. |
| `VisualPluginService` | Inicializa interacciones heredadas. | Listeners para RTL, dark mode, rangos y likes; delega Swiper a `UiInitService`. |
| `BodyClassService` | Helper visual de layout. | Administra `grocery-color` y `pharmacy-color` en `body`. |
| `authGuard` | Proteccion de rutas autenticadas. | Refresca sesion, bloquea inactive/blocked y exige perfil completo. |
| `profileCompletionGuard` | Control de completar perfil. | Solo permite usuarios autenticados con perfil incompleto. |
| `roleGuard` | Autorizacion por tipo. | Lee `route.data.types`; no esta aplicado actualmente. |

## Gestion de contenido

La app usa PocketBase como fuente principal cuando esta disponible y JSON local como fallback temporal.

```txt
PocketBase
 ↓
ContentDataService
 ↓
Componentes
 ↓
Vista
```

```txt
JSON
 ↓
ContentDataService
 ↓
Componentes
 ↓
Vista
```

| Archivo JSON | Contenido | Uso |
| --- | --- | --- |
| `home.json` | `categories`, `offerStrip`, `banners`, `featuredProducts` | Home principal. |
| `food.json` | `categories`, `banners`, `restaurants`, `popularProducts`, `offers` | Vista comida. |
| `grocery.json` | `categories`, `banners`, `products`, `offers`, `bestSellers`, `recentItems` | Vista mercado. |
| `pharmacy.json` | `categories`, `banners`, `products`, `wellnessItems`, `offers` | Vista farmacia. |
| `profile.json` | Usuario demo y menu de perfil. | Vista perfil. |

### ContentDataService

`src/app/services/content-data.service.ts` expone `getHomeContent`, `getFoodContent`, `getGroceryContent`, `getPharmacyContent`, `getProfileContent` y `resolveImage`.

El servicio consulta `categories`, `banners`, `products`, `promotions` y `businesses`, transforma los records al modelo esperado por los templates y cae a JSON si PocketBase falla o viene vacio.

### Preparacion para PocketBase

La integracion remota ya esta preparada sobre las colecciones `categories`, `businesses`, `products`, `banners` y `promotions`. Los templates no conocen esas colecciones directamente: reciben modelos normalizados desde `ContentDataService`.

```txt
PocketBase
 ↓
Si responde correctamente
 ↓
Mostrar datos remotos

Si falla
 ↓
Usar JSON local
```

## Renderizado dinamico

El contenido dinamico hizo necesario retrasar la inicializacion de plugins visuales hasta que Angular termine de pintar el DOM.

```txt
Carga de datos
 ↓
Render Angular
 ↓
DetectChanges
 ↓
Inicializacion de sliders
 ↓
Interfaz lista
```

| Herramienta | Uso |
| --- | --- |
| `AfterViewInit` | Marca la vista como lista antes de inicializar plugins. |
| `ChangeDetectorRef` | Fuerza render tras asignar contenido desde PocketBase/JSON. |
| `requestAnimationFrame` | Espera al DOM real antes de crear Swipers. |
| `UiInitService` | Destruye y reinicializa sliders de forma controlada. |

## Sliders y componentes interactivos

Swiper se carga de forma diferida y se reinicializa despues del render dinamico para evitar instancias duplicadas, memory leaks y sliders vacios.

| Pantalla | Sliders |
| --- | --- |
| Home | `main-seller-product` |
| Food | `banner1`, `categories`, `products`, `brands-logo` |
| Grocery | `grocery-categories`, `grocery-product` |
| Pharmacy | `pharmacy-categories`, `grocery-product`, `discount-banner` |

::: tip
La estrategia actual destruye la instancia anterior antes de crear una nueva, ignora reinicializaciones obsoletas y no inicializa contenedores sin `.swiper-slide`.
:::
