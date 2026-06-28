# Operacion

## Dependencias

| Paquete | Version | Proposito |
| --- | --- | --- |
| `@angular/*` | `^21.0.x` | Runtime, router, forms, service worker, compiler y build. |
| `pocketbase` | `^0.27.0` | SDK cliente para autenticacion y operaciones contra PocketBase. |
| `rxjs` | `~7.8.0` | Base reactiva usada por Angular. |
| `typescript` | `~5.9.2` | Compilacion TypeScript. |
| `vitest`, `jsdom` | `^4.0.8`, `^27.1.0` | Pruebas unitarias. |

## Despliegue

### Gestion de Variables de Entorno

El frontend usa `environment.pocketbaseUrl` para construir el cliente de PocketBase. Hoy el valor esta fijo en `src/environments/environment.ts`:

```ts
pocketbaseUrl: 'http://127.0.0.1:8090'
```

No se debe cambiar ese archivo a mano para cada deploy. La salida correcta es separar entornos:

1. Crear `src/environments/environment.prod.ts` con la URL publica de PocketBase.
2. Configurar `fileReplacements` en `angular.json` para que el build de produccion reemplace `environment.ts` por `environment.prod.ts`.
3. En hosting como AWS Amplify, usar variables del entorno de build para generar o sustituir el archivo de entorno antes de `npm run build`, evitando commitear URLs temporales o secretos.

Ejemplo de reemplazo Angular:

```json
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
]
```

Variables criticas del despliegue:

| Variable | Uso |
| --- | --- |
| `POCKETBASE_URL` | URL publica del backend consumida por Angular, por ejemplo `https://api.dalepues.com`. |
| `POCKETBASE_ORIGINS` | Lista CORS permitida para `./pocketbase serve --origins`. |
| `POCKETBASE_ENCRYPTION_KEY` | Clave de 32 caracteres para `--encryptionEnv` si se cifran ajustes sensibles de PocketBase. |
| `GOOGLE_OAUTH_CLIENT_ID` | Cliente OAuth configurado en PocketBase para login con Google. |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Secreto OAuth. Debe vivir solo en PocketBase/hosting, nunca en Angular. |
| `PUBLIC_APP_URL` | Dominio publico del frontend usado para redirects OAuth, PWA y reglas de CORS. |

### Frontend

```sh
npm ci
npm run build
```

Publicar `dist/dale-pues/browser`.

| Destino | Notas |
| --- | --- |
| GitHub Pages | Configurar `.nojekyll`, base href/fallback SPA si se sirve desde subcarpeta, y publicar el build estatico. |
| AWS Amplify | Usar `npm ci`, `npm run build` y artifact `dist/dale-pues/browser`. |

### Backend

Backend objetivo: PocketBase en EC2 Ubuntu, servido por systemd y reverse proxy HTTPS. Antes de publicar frontend que dependa de nuevos campos, aplicar migraciones en el backend.

```sh
cd backend
./pocketbase migrate up --migrationsDir pb_migrations
./pocketbase serve --migrationsDir pb_migrations --http=127.0.0.1:8090
```

## Flujo de trabajo

1. **Desarrollo local:** aplicar migraciones, levantar PocketBase y ejecutar `npm start`.
2. **Migraciones:** cada cambio de esquema va en `backend/pb_migrations` y se prueba localmente.
3. **Validacion:** ejecutar build y pruebas aplicables antes de subir cambios.
4. **Commits:** agrupar cambios relacionados: frontend, backend y migracion que dependen entre si.
5. **Push:** subir rama y revisar que el build del hosting use la version correcta de Node.
6. **Despliegue:** aplicar migraciones de PocketBase, verificar OAuth/configuracion y publicar frontend.

## Troubleshooting

| Problema | Causa probable | Solucion |
| --- | --- | --- |
| Assets no encontrados | El build copia `public/**`. | Verificar el archivo en `public/assets`. Para JSON fallback, revisar `public/assets/data`. |
| Scripts externos no funcionan | Scripts de plantilla inicializados antes de render Angular. | Usar `ScriptLoaderService`, `VisualPluginService` y `UiInitService`. |
| Sliders vacios o duplicados | Swiper inicializado antes del render o sin destruir instancia previa. | Confirmar que la pagina cargue datos, ejecute `detectChanges` y luego `initPagePlugins`. |
| Contenido no aparece | PocketBase apagado y JSON fallback no publicado. | Verificar `/assets/data/*.json` y revisar fallback en `ContentDataService`. |
| OAuth Google falla | Proveedor no configurado o redirect URI incorrecto. | Configurar Google en PocketBase Admin usando la URL OAuth del servidor activo. |
| PocketBase no responde | Servidor local apagado o URL distinta a `environment.pocketbaseUrl`. | Ejecutar `cd backend && ./pocketbase serve --migrationsDir pb_migrations` y validar puerto `8090`. |
| Rutas Angular dan 404 en hosting | Falta fallback SPA. | Reescribir rutas a `index.html`; en GitHub Pages cuidar base href/subcarpeta. |
| Build falla por Node | Version incompatible con Angular 21. | Usar Node `^20.19.0`, `^22.12.0` o `>=24.0.0`. |
| Watchers ENOSPC en Linux | Limite bajo de inotify watchers. | Aumentar `fs.inotify.max_user_watches` en el sistema. |
| CSS duplicado | CSS vendor cargado en `src/index.html` y `angular.json`. | Centralizar carga si aparecen inconsistencias visuales. |
| Prueba inicial de App falla | `app.spec.ts` espera un `h1` generado por Angular nuevo. | Actualizar test para una app con solo `router-outlet`. |
