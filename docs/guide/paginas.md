# Paginas

| Pagina | Objetivo | Componentes / servicios |
| --- | --- | --- |
| `LoginPage` | Formulario de login, Google OAuth y recuperacion. | `ReactiveFormsModule`, `RouterLink`, `AuthPocketbaseService`. |
| `RegisterPage` | Registro de client, merchant o courier. | Reactive forms, validacion de contrasenas y terminos. |
| `CompleteProfilePage` | Completar perfil minimo. | Validadores condicionales para merchant y courier. |
| `HomePage` | Landing autenticada de servicios. | Carga `getHomeContent()`, renderiza secciones Home y reinicializa Swiper. |
| `FoodHomePage` | Home visual de restaurantes/comida. | Carga `getFoodContent()`, renderiza sliders, categorias, productos, marcas y restaurantes. |
| `GroceryHomePage` | Home visual de supermercado. | Carga `getGroceryContent()`, aplica `grocery-color` y reinicializa carruseles. |
| `PharmacyHomePage` | Home visual de farmacia. | Carga `getPharmacyContent()`, aplica `pharmacy-color` y reinicializa carruseles. |
| `ProfilePage` | Perfil y accesos de usuario. | Carga `getProfileContent()` desde JSON fallback y maneja estado de error. |

::: warning
Las acciones internas de catalogo, pedidos, pagos, wishlist y ajustes todavia son visuales o enlaces estaticos; no hay logica de negocio implementada para esas areas.
:::
