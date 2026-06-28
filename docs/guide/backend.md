# Backend

El backend actual es PocketBase `0.39.4`. Se usa para autenticacion, perfil de usuario y contenido dinamico.

```txt
backend/
  pocketbase
  pb_data/
    data.db
    auxiliary.db
    types.d.ts
  pb_migrations/
    20260624000100_update_users_auth.js
    20260624000200_content_collections_seed.js
```

| Elemento | Estado |
| --- | --- |
| `backend/pocketbase` | Binario PocketBase version `0.39.4`. |
| `backend/pb_data` | Datos locales de desarrollo. No documenta una configuracion productiva por si mismo. |
| `backend/pb_migrations` | Migraciones versionadas del esquema. |
| `backend/pb_hooks` | No existe actualmente. |
| Configuracion frontend | `environment.pocketbaseUrl = http://127.0.0.1:8090`. |

## Colecciones de contenido

| Coleccion | Uso |
| --- | --- |
| `categories` | Categorias por seccion: home, food, grocery y pharmacy. |
| `businesses` | Restaurantes, mercados, farmacias, comercios y futuros couriers. |
| `products` | Productos de comida, mercado y farmacia. |
| `banners` | Banners por seccion con posicion y CTA. |
| `promotions` | Promociones por seccion, producto o negocio. |

## Gestion de usuarios

La coleccion principal es `users`, una coleccion Auth de PocketBase modificada por `20260624000100_update_users_auth.js`.

| Grupo | Valores |
| --- | --- |
| Tipos | `client`, `merchant`, `courier`, `admin`, `support` |
| Estados | `active`, `pending`, `inactive`, `blocked`, `rejected` |

### Campos agregados

| Campo | Uso |
| --- | --- |
| `phone`, `address`, `city`, `state`, `country` | Datos basicos y ubicacion. |
| `type`, `status`, `roleDescription` | Clasificacion y control operativo de cuenta. |
| `avatar` | Archivo de imagen jpeg/png/webp con thumbs 100x100 y 300x300. |
| `lastLoginAt` | Auditoria de ultimo ingreso, actualizada sin bloquear login si falla. |
| `profileCompleted`, `termsAccepted` | Control de flujo de completar perfil. |
| `businessName`, `businessType` | Datos temporales para comercios. Pendiente mover a `merchant_profiles`. |
| `identityDocument`, `vehicleType` | Datos temporales para repartidores. Pendiente mover a `courier_profiles`. |

### Flujos implementados

1. **Login email/password:** `AuthPocketbaseService.login` usa `authWithPassword`, normaliza defaults, actualiza `lastLoginAt` y redirige.
2. **Login Google OAuth:** `loginWithGoogle` usa `authWithOAuth2({ provider: 'google' })`. Requiere proveedor configurado en PocketBase.
3. **Recuperacion de contrasena:** `requestPasswordReset` delega en PocketBase y muestra mensaje generico si el correo existe.
4. **Complete profile:** exige telefono y terminos para todos; para merchant exige nombre/tipo de negocio; para courier exige documento/vehiculo.
5. **Logout:** limpia `pb.authStore` y navega a `/login`.

::: warning
Los roles admin y support existen en modelo/migracion, pero no tienen pantallas especificas todavia.
:::

## Migraciones

```sh
cd backend
./pocketbase migrate create nombre_de_la_migracion --migrationsDir pb_migrations
./pocketbase migrate up --migrationsDir pb_migrations
./pocketbase migrate down --migrationsDir pb_migrations
```

Flujo recomendado: crear la migracion, probarla localmente contra `pb_data`, validar el frontend que depende del esquema, commitear migracion y codigo juntos, aplicar migraciones en backend productivo antes de desplegar el frontend.

La migracion de contenido hace seed idempotente usando slugs o `title + section`, por lo que no duplica registros al ejecutarse mas de una vez.

::: danger
`migrate down` revierte esquema y puede remover campos segun la migracion. Usarlo con respaldo de datos cuando haya informacion real.
:::
