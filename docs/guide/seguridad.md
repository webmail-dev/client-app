# Seguridad

## Almacenamiento del token

`PocketbaseService` crea el cliente con `new PocketBase(environment.pocketbaseUrl)` y no inyecta un `authStore` personalizado. En navegador, el SDK usa `LocalAuthStore` por defecto.

Resultado actual:

| Elemento | Estado |
| --- | --- |
| Medio de persistencia | `localStorage` |
| Clave usada por el SDK | `pocketbase_auth` |
| Contenido | JWT de PocketBase y record autenticado serializado |
| Cookies HTTP-only | No configuradas |

`AuthPocketbaseService` opera sobre `this.pb.authStore`: `authWithPassword`, `authWithOAuth2`, `authRefresh`, `save` y `clear`. El token se envía como header `Authorization` en las llamadas del SDK, no como cookie de sesión.

Implicacion: cualquier XSS con ejecucion de JavaScript puede leer `localStorage`. La prioridad en frontend es mantener sanitizacion estricta de contenido dinamico, evitar HTML arbitrario desde PocketBase y no interpolar datos externos como markup.

## CORS

En local, el frontend apunta a PocketBase con:

```ts
export const environment = {
  production: false,
  pocketbaseUrl: 'http://127.0.0.1:8090',
};
```

No hay `pb_hooks`, reverse proxy ni configuracion CORS versionada en el repo. El binario local de PocketBase expone `--origins` y su valor por defecto es `*`, por lo que el desarrollo local funciona desde el origen de Angular sin configuracion adicional.

Para AWS/produccion no se debe dejar CORS abierto. El backend debe arrancar con origenes explicitos:

```sh
./pocketbase serve app.dalepues.com \
  --migrationsDir pb_migrations \
  --http=127.0.0.1:8090 \
  --origins=https://app.dalepues.com,https://www.dalepues.com
```

Si PocketBase queda detras de Nginx, ALB o CloudFront, la lista de `--origins` debe coincidir con los dominios publicos reales del frontend, no con `127.0.0.1`. OAuth Google tambien debe usar esas URLs publicas como redirect permitido.

## Proteccion de `/admin/`

El panel `/admin/` no debe quedar expuesto a Internet abierto en produccion. Recomendacion operativa:

1. Servir PocketBase detras de un reverse proxy HTTPS.
2. Restringir `/admin/` por IP allowlist, VPN, Zero Trust Access o autenticacion adicional del proxy.
3. Mantener publicos solo los endpoints necesarios para la app: `/api/*` y archivos publicados.
4. Usar superusuarios/admins con MFA cuando este disponible y credenciales separadas de cuentas operativas.
5. No publicar `pb_data` ni backups; deben vivir fuera del directorio publico y con permisos de sistema restrictivos.

Ejemplo de politica en proxy:

```nginx
location /admin/ {
  allow 203.0.113.10;
  deny all;
  proxy_pass http://127.0.0.1:8090;
}

location /api/ {
  proxy_pass http://127.0.0.1:8090;
}
```
