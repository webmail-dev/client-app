# PWA y assets

## PWA

`app.config.ts` registra `ngsw-worker.js` con `provideServiceWorker`. Solo se habilita fuera de desarrollo mediante `!isDevMode()` y usa `registerWhenStable:30000`.

`registerWhenStable:30000` retrasa el registro del Service Worker hasta que Angular quede estable, con un maximo de 30 segundos. Esto evita competir con el primer render, la carga de datos dinamicos y la inicializacion de scripts visuales. Si la app no queda estable por tareas async largas, el Service Worker se registra al cumplirse el timeout.

Los JSON de fallback en `assets/data/*.json` estan dentro del grupo `assets` de `ngsw-config.json`, con `installMode: lazy` y `updateMode: prefetch`. Cuando el contenido real vive en PocketBase, esos JSON deben tratarse solo como respaldo de emergencia. Si se actualizan los JSON publicados, hay que generar un nuevo build para que Angular Service Worker cambie el hash del manifest y descargue la version nueva. Para datos que cambian seguido, preferir PocketBase sobre JSON estatico o excluir esos JSON del cache del Service Worker; agregar query strings desde Angular no resuelve el problema si el archivo sigue cubierto por el manifest de `ngsw`.

| Archivo | Configuracion actual |
| --- | --- |
| `public/manifest.webmanifest` | `name` y `short_name` Dale Pues, tema `#dc3545`, display `standalone`, scope y start URL raiz, iconos 192/512. |
| `ngsw-config.json` | Grupo `app` con `prefetch` para shell y grupo `assets` con `lazy`/`prefetch` para `/assets/**` y `/icons/**`, incluyendo JSON fallback. |
| `src/index.html` | Metadatos PWA, manifest, favicon, apple touch icon y theme color. |

## Assets

La aplicacion referencia recursos como `assets/...`. Angular copia `public/**`; por eso los assets efectivos de runtime viven en `public/assets`.

| Tipo | Ruta | Uso |
| --- | --- | --- |
| CSS global | `public/assets/css/vendors/*.css` y `public/assets/css/style.css` | Metropolis, Remixicon, Swiper, Bootstrap y tema visual. |
| JS global | `public/assets/js/bootstrap.bundle.min.js` | Modales y offcanvas desde `angular.json`. |
| JS diferido | `public/assets/js/swiper-bundle.min.js` | Cargado por `ScriptLoaderService`. |
| Imagenes | `public/assets/images/**` | Banners, categorias, productos, SVG, perfil y recursos por vertical. |
| JSON runtime | `public/assets/data/*.json` | Fallback de contenido cuando PocketBase no responde. |
| Fuentes | `public/assets/fonts/**` | Metropolis y Remixicon. |
| JSON fuente | `src/assets/data/*.json` | Base editable y trazabilidad del contenido local. |

::: warning
`src/index.html` tambien enlaza CSS vendor que ya esta en `angular.json`. Si aparecen estilos duplicados, conviene centralizar la carga en una sola estrategia.
:::
