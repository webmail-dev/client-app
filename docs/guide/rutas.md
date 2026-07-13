# Navegacion y rutas

| Ruta | Componente | Proposito | Flujo |
| --- | --- | --- | --- |
| `/` | Redirect | Entrada raiz. | Redirige a `/home`; si no hay sesion, `authGuard` lleva a `/login`. |
| `/login` | `LoginPage` | Login email/password, Google OAuth y recuperacion de contrasena. | Al autenticar llama `redirectAfterAuth`: perfil incompleto a `/complete-profile`, valido a `/home`. |
| `/register` | `RegisterPage` | Alta de cliente, comercio afiliado o repartidor. | Crea usuario en PocketBase y luego inicia sesion. |
| `/complete-profile` | `CompleteProfilePage` | Captura datos minimos por tipo de usuario y terminos. | `profileCompletionGuard` bloquea usuarios no autenticados y redirige si ya completaron perfil. |
| `/home` | `HomePage` | Vista principal con accesos a verticales. | Usa `BottomNav`, sidebar y cards con `routerLink` a food/grocery/pharmacy. |
| `/food` | `FoodHomePage` | Home visual de comida/restaurantes. | Protegida por `authGuard`; inicializa Swiper. |
| `/grocery` | `GroceryHomePage` | Home visual de supermercado. | Protegida por `authGuard`; aplica `grocery-color`. |
| `/pharmacy` | `PharmacyHomePage` | Home visual de farmacia. | Protegida por `authGuard`; aplica `pharmacy-color`. |
| `/profile` | `ProfilePage` | Perfil y accesos de cuenta. | Protegida por `authGuard`; usa header simple y bottom nav. |
| `**` | Redirect | Fallback SPA interno. | Redirige a `/home`. |
