# Diccionario de datos

Este diccionario sale de `backend/pb_migrations/20260624000100_update_users_auth.js` y `backend/pb_migrations/20260624000200_content_collections_seed.js`.

Reglas de acceso visibles en migraciones:

| Coleccion | Lectura | Escritura |
| --- | --- | --- |
| `users` | Usuario propio, `admin` o `support`; listado solo `admin` o `support`. | Usuario propio, `admin` o `support`; delete solo `admin`; manage solo `admin`. |
| `categories`, `businesses`, `products`, `banners`, `promotions` | `active = true`, `admin` o `support`. | Solo `admin` o `support`. |

## users

`users` es una coleccion Auth existente. La migracion documenta los campos agregados o sobreescritos por el proyecto; campos base de PocketBase como email/password pertenecen al esquema Auth base y no aparecen definidos en estas migraciones.

| Campo | Tipo | Obligatorio | Restricciones visibles |
| --- | --- | --- | --- |
| `name` | String | No | Max 120. Mapeado desde OAuth `name`. |
| `phone` | String | No | Max 40. |
| `type` | String (select) | No | Max 1 seleccion. Opciones: `client`, `merchant`, `courier`, `admin`, `support`. |
| `status` | String (select) | No | Max 1 seleccion. Opciones: `active`, `pending`, `rejected`, `blocked`, `inactive`. `authRule` bloquea `blocked` e `inactive`. |
| `avatar` | File | No | Max 1 archivo. Max 5 MB. MIME: `image/jpeg`, `image/png`, `image/webp`. Thumbs: `100x100`, `300x300`. |
| `address` | String | No | Max 255. |
| `city` | String | No | Max 80. |
| `state` | String | No | Max 80. |
| `country` | String | No | Max 80. |
| `roleDescription` | String | No | Max 255. |
| `lastLoginAt` | Date | No | Sin restriccion adicional. |
| `profileCompleted` | Boolean | No | Sin restriccion adicional. |
| `termsAccepted` | Boolean | No | Sin restriccion adicional. |
| `businessName` | String | No | Max 160. Campo temporal; TODO mover a `merchant_profiles`. |
| `businessType` | String | No | Max 80. Campo temporal; TODO mover a `merchant_profiles`. |
| `identityDocument` | String | No | Max 80. Campo temporal; TODO mover a `courier_profiles`. |
| `vehicleType` | String | No | Max 80. Campo temporal; TODO mover a `courier_profiles`. |

## categories

| Campo | Tipo | Obligatorio | Restricciones visibles |
| --- | --- | --- | --- |
| `name` | String | Si | Max 160. |
| `slug` | String | Si | Max 160. Indice unico `idx_categories_slug`. |
| `type` | String (select) | Si | Max 1 seleccion. Opciones: `home`, `food`, `grocery`, `pharmacy`. Indice `idx_categories_type`. |
| `image` | File | No | Max 1 archivo. Max 5 MB. MIME: `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`. Thumbs: `100x100`, `300x300`. |
| `imageUrl` | String | No | Max 255. TODO migrar a archivo PocketBase. |
| `icon` | String | No | Max 255. |
| `alt` | String | No | Max 160. |
| `link` | String | No | Max 255. |
| `active` | Boolean | No | Indice `idx_categories_active`. |
| `order` | Number | No | Usado para ordenar categorias. |

## businesses

| Campo | Tipo | Obligatorio | Restricciones visibles |
| --- | --- | --- | --- |
| `name` | String | Si | Max 180. |
| `slug` | String | Si | Max 180. Indice unico `idx_businesses_slug`. |
| `type` | String (select) | Si | Max 1 seleccion. Opciones: `restaurant`, `grocery`, `pharmacy`, `courier`, `store`. Indice `idx_businesses_type`. |
| `logo` | File | No | Max 1 archivo. Max 5 MB. MIME: `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`. Thumbs: `100x100`, `300x300`. |
| `cover` | File | No | Max 1 archivo. Max 5 MB. MIME: `image/jpeg`, `image/png`, `image/webp`. Thumbs: `300x200`, `600x400`. |
| `logoUrl` | String | No | Max 255. TODO migrar a archivo PocketBase. |
| `coverUrl` | String | No | Max 255. TODO migrar a archivo PocketBase. |
| `description` | String (editor) | No | Sin restriccion adicional. |
| `phone` | String | No | Max 60. |
| `whatsapp` | String | No | Max 60. |
| `address` | String | No | Max 255. |
| `city` | String | No | Max 80. |
| `state` | String | No | Max 80. |
| `country` | String | No | Max 80. |
| `lat` | Number | No | Sin restriccion adicional. |
| `lng` | Number | No | Sin restriccion adicional. |
| `rating` | Number | No | Sin restriccion adicional. |
| `deliveryTime` | String | No | Max 40. |
| `active` | Boolean | No | Indice `idx_businesses_active`. |
| `featured` | Boolean | No | Indice `idx_businesses_featured`. |
| `owner` | Relation | No | Max 1 relacion. Relaciona con `users`. |

## products

| Campo | Tipo | Obligatorio | Restricciones visibles |
| --- | --- | --- | --- |
| `business` | Relation | No | Max 1 relacion. Relaciona con `businesses`. |
| `category` | Relation | No | Max 1 relacion. Relaciona con `categories`. |
| `name` | String | Si | Max 180. |
| `slug` | String | Si | Max 180. Indice unico `idx_products_slug`. |
| `description` | String (editor) | No | Sin restriccion adicional. |
| `image` | File | No | Max 1 archivo. Max 5 MB. MIME: `image/jpeg`, `image/png`, `image/webp`. Thumbs: `300x300`, `600x600`. |
| `imageUrl` | String | No | Max 255. TODO migrar a archivo PocketBase. |
| `alt` | String | No | Max 160. |
| `type` | String (select) | Si | Max 1 seleccion. Opciones: `food`, `grocery`, `pharmacy`. Indice `idx_products_type`. |
| `price` | Number | Si | Sin restriccion adicional. |
| `oldPrice` | Number | No | Sin restriccion adicional. |
| `currency` | String | No | Max 8. |
| `rating` | Number | No | Sin restriccion adicional. |
| `stock` | Number | No | Sin restriccion adicional. |
| `featured` | Boolean | No | Indice `idx_products_featured`. |
| `active` | Boolean | No | Indice `idx_products_active`. |
| `deliveryTime` | String | No | Max 40. |
| `tags` | JSON | No | Usado por frontend para `unit`, `offerTag` y `section`. |
| `ctaText` | String | No | Max 60. |

## banners

| Campo | Tipo | Obligatorio | Restricciones visibles |
| --- | --- | --- | --- |
| `title` | String | Si | Max 180. |
| `subtitle` | String | No | Max 255. |
| `highlight` | String | No | Max 80. |
| `image` | File | No | Max 1 archivo. Max 5 MB. MIME: `image/jpeg`, `image/png`, `image/webp`. Thumb: `600x300`. |
| `imageUrl` | String | No | Max 255. TODO migrar a archivo PocketBase. |
| `alt` | String | No | Max 160. |
| `ctaText` | String | No | Max 60. |
| `link` | String | No | Max 255. |
| `section` | String (select) | Si | Max 1 seleccion. Opciones: `home`, `food`, `grocery`, `pharmacy`. Indice `idx_banners_section`. |
| `position` | Number | No | Usado para ordenar banners. |
| `active` | Boolean | No | Indice `idx_banners_active`. |
| `startDate` | Date | No | Sin restriccion adicional. |
| `endDate` | Date | No | Sin restriccion adicional. |

## promotions

| Campo | Tipo | Obligatorio | Restricciones visibles |
| --- | --- | --- | --- |
| `title` | String | Si | Max 180. |
| `description` | String (editor) | No | Sin restriccion adicional. |
| `business` | Relation | No | Max 1 relacion. Relaciona con `businesses`. |
| `product` | Relation | No | Max 1 relacion. Relaciona con `products`. |
| `section` | String (select) | Si | Max 1 seleccion. Opciones: `home`, `food`, `grocery`, `pharmacy`. Indice `idx_promotions_section`. |
| `discountType` | String (select) | Si | Max 1 seleccion. Opciones: `percentage`, `fixed`, `combo`, `text`. |
| `discountValue` | Number | No | Sin restriccion adicional. |
| `badgeText` | String | No | Max 80. |
| `image` | File | No | Max 1 archivo. Max 5 MB. MIME: `image/jpeg`, `image/png`, `image/webp`. Thumb: `600x300`. |
| `imageUrl` | String | No | Max 255. TODO migrar a archivo PocketBase. |
| `active` | Boolean | No | Indice `idx_promotions_active`. |
| `startDate` | Date | No | Sin restriccion adicional. |
| `endDate` | Date | No | Sin restriccion adicional. |
| `order` | Number | No | Usado para ordenar promociones. |
