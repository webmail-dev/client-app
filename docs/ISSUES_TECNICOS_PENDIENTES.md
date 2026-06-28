# Issues tecnicos pendientes

## Issue 1: Mover datos de merchant y courier a colecciones separadas

**Titulo:** Separar perfiles de comercios y repartidores fuera de `users`

**Descripcion:**
Actualmente `users` contiene campos temporales para comercios y repartidores: `businessName`, `businessType`, `identityDocument` y `vehicleType`. Estos datos deben moverse a colecciones dedicadas para evitar que la tabla de autenticacion acumule informacion operacional de perfiles especializados.

**Tareas:**

- [ ] Crear migracion PocketBase para `merchant_profiles`.
- [ ] Crear migracion PocketBase para `courier_profiles`.
- [ ] Relacionar cada perfil con `users`.
- [ ] Migrar datos existentes desde `users` hacia las nuevas colecciones.
- [ ] Actualizar `CompleteProfilePage` y `AuthPocketbaseService.completeProfile`.
- [ ] Actualizar guards o reglas que dependan de `profileCompleted`.
- [ ] Eliminar campos temporales de `users` cuando la migracion sea estable.

**Criterios de aceptacion:**

- [ ] Un usuario `merchant` guarda datos de comercio en `merchant_profiles`.
- [ ] Un usuario `courier` guarda datos de repartidor en `courier_profiles`.
- [ ] El login y completar perfil siguen funcionando.
- [ ] Las reglas de acceso permiten al usuario ver/editar su propio perfil y a `admin`/`support` gestionarlo.

---

## Issue 2: Implementar logica real en SearchBar y FilterModal

**Titulo:** Conectar busqueda y filtros con datos reales de catalogo

**Descripcion:**
`SearchBar` y `FilterModal` existen como componentes visuales, pero no emiten criterios ni filtran datos. Deben convertirse en componentes funcionales que permitan buscar y filtrar productos, categorias o comercios segun la pagina activa.

**Tareas:**

- [ ] Definir contrato de eventos para `SearchBar`.
- [ ] Definir modelo de filtros para `FilterModal`.
- [ ] Emitir cambios de busqueda desde `SearchBar`.
- [ ] Emitir filtros aplicados desde `FilterModal`.
- [ ] Integrar busqueda/filtros en `FoodHomePage`, `GroceryHomePage` y `PharmacyHomePage`.
- [ ] Aplicar filtros sobre datos de PocketBase y fallback JSON.
- [ ] Agregar estados vacios cuando no existan resultados.

**Criterios de aceptacion:**

- [ ] Escribir en el buscador filtra resultados visibles.
- [ ] Aplicar filtros modifica la lista renderizada.
- [ ] Limpiar filtros restaura el contenido original.
- [ ] El comportamiento funciona con datos remotos y con JSON fallback.

---

## Issue 3: Implementar persistencia en LocationModal

**Titulo:** Persistir ubicacion seleccionada por el usuario

**Descripcion:**
`LocationModal` muestra una experiencia visual para elegir ubicacion, pero no persiste ni expone la seleccion. La app necesita guardar la ubicacion activa para usarla en filtros, disponibilidad, tiempos de entrega y futuras ordenes.

**Tareas:**

- [ ] Definir modelo de ubicacion del usuario.
- [ ] Emitir la ubicacion seleccionada desde `LocationModal`.
- [ ] Crear servicio para estado de ubicacion activa.
- [ ] Persistir ubicacion localmente para usuarios anonimos/autenticados.
- [ ] Si el usuario esta autenticado, sincronizar ubicacion con PocketBase.
- [ ] Mostrar la ubicacion activa en `AppHeader`.
- [ ] Manejar estado sin ubicacion y permisos de geolocalizacion denegados.

**Criterios de aceptacion:**

- [ ] La ubicacion seleccionada se mantiene al recargar la app.
- [ ] `AppHeader` muestra la ubicacion activa.
- [ ] La app puede leer la ubicacion desde un servicio central.
- [ ] La seleccion no rompe el flujo si PocketBase no responde.
