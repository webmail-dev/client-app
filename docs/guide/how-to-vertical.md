# Como agregar una nueva vertical

Esta guia usa como referencia las verticales actuales `food`, `grocery` y `pharmacy`. El ejemplo sera una vertical `liquor` para "Licoreria".

Antes de implementarla, revisar una restriccion importante: las colecciones remotas de PocketBase usan campos `select` con valores cerrados. En `backend/pb_migrations/20260624000200_content_collections_seed.js`, `categories.type`, `products.type`, `banners.section` y `promotions.section` solo aceptan `home`, `food`, `grocery` y `pharmacy`. Si la nueva vertical tambien va a consumir PocketBase, hay que crear una migracion que agregue `liquor` a esos selects.

## 1. Crear el archivo JSON fallback

Crear el archivo en ambos lugares:

```txt
public/assets/data/liquor.json
src/assets/data/liquor.json
```

`public/assets/data` es el runtime real servido por Angular. `src/assets/data` queda como fuente editable y trazabilidad del contenido local.

Usar una estructura compatible con el tipo de pantalla que se va a reutilizar. Para una vertical parecida a supermercado/farmacia, partir de `grocery.json` o `pharmacy.json`:

```json
{
  "categories": [],
  "banners": [],
  "products": [],
  "popularProducts": [],
  "offers": [],
  "bestSellers": [],
  "recentItems": []
}
```

Luego agregar en `ContentDataService` un metodo equivalente a `getGroceryContent()` o `getPharmacyContent()`:

```ts
getLiquorContent(): Observable<GroceryContent> {
  return this.http.get<GroceryContent>(`${this.baseUrl}/liquor.json`);
}
```

Si se integra PocketBase, extender tambien el tipo `Section` y los filtros de `getPocketBaseCollections()`.

## 2. Crear el componente de la pagina

Crear una carpeta nueva en `src/app/pages/`:

```txt
src/app/pages/liquor-home/
  liquor-home.ts
  liquor-home.html
  liquor-home.css
```

Tomar como base `grocery-home` o `pharmacy-home`. La pagina debe:

1. Importar `AppSidebar`, `AppHeader`, `SearchBar`, `BottomNav`, `FilterModal` y `LocationModal`.
2. Inyectar `BodyClassService`, `ContentDataService`, `VisualPluginService`, `ChangeDetectorRef` y `DestroyRef`.
3. Cargar `getLiquorContent()`.
4. Ejecutar `visualPlugins.initPagePlugins(true)` despues de pintar contenido dinamico.
5. Limpiar plugins y clase de body en `ngOnDestroy()`.

Ejemplo base:

```ts
@Component({
  selector: 'app-liquor-home-page',
  imports: [AppSidebar, AppHeader, SearchBar, BottomNav, FilterModal, LocationModal],
  templateUrl: './liquor-home.html',
})
export class LiquorHomePage implements AfterViewInit, OnDestroy {
  private readonly bodyClass = inject(BodyClassService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly contentData = inject(ContentDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly visualPlugins = inject(VisualPluginService);
  content?: GroceryContent;
  private viewReady = false;

  constructor() {
    this.bodyClass.setPageClass('liquor-color');
    this.contentData
      .getLiquorContent()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((content) => {
        this.content = content;
        this.renderDynamicUi();
      });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    void this.visualPlugins.initPagePlugins(false);
    this.renderDynamicUi();
  }

  ngOnDestroy(): void {
    this.visualPlugins.destroyPagePlugins();
    this.bodyClass.setPageClass();
  }

  private renderDynamicUi(): void {
    if (!this.viewReady || !this.content) return;
    this.cdr.detectChanges();
    void this.visualPlugins.initPagePlugins(true);
  }
}
```

## 3. Registrar la ruta protegida

Agregar la ruta en `src/app/app.routes.ts` con `authGuard`, siguiendo `food`, `grocery` y `pharmacy`:

```ts
{
  path: 'liquor',
  canActivate: [authGuard],
  loadComponent: () => import('./pages/liquor-home/liquor-home').then((m) => m.LiquorHomePage),
  title: 'Licoreria',
},
```

La ruta queda protegida: usuarios sin sesion pasan por `authGuard` y terminan en `/login`.

## 4. Añadir el color tematico

`BodyClassService` solo limpia clases registradas en `managedClasses`. Agregar la clase nueva:

```ts
private readonly managedClasses = ['grocery-color', 'pharmacy-color', 'liquor-color'];
```

Luego definir el estilo en la hoja global que controla los temas visuales de la plantilla, actualmente `public/assets/css/style.css`. La nueva clase debe cambiar las variables o selectores equivalentes que usa la UI.

La pagina debe activar la clase en el constructor:

```ts
this.bodyClass.setPageClass('liquor-color');
```

Y limpiarla al destruir:

```ts
this.bodyClass.setPageClass();
```

## 5. Añadir el enlace en BottomNav y AppSidebar

En `BottomNav`, ampliar el union type:

```ts
type NavKey = 'home' | 'food' | 'grocery' | 'pharmacy' | 'liquor' | 'profile';
```

Agregar el item al template `bottom-nav.html`:

```html
<li [class.active]="active() === 'liquor'">
  <a routerLink="/liquor" class="icon">
    <img class="unactive" src="assets/images/svg/liquor.svg" alt="licoreria" />
    <img class="active" src="assets/images/svg/liquor-fill.svg" alt="licoreria" />
    <span>Licoreria</span>
  </a>
</li>
```

Tambien crear los iconos referenciados en:

```txt
public/assets/images/svg/liquor.svg
public/assets/images/svg/liquor-fill.svg
```

En `AppSidebar`, agregar un enlace operativo:

```html
<li>
  <a routerLink="/liquor" class="pages">
    <h3>Licoreria</h3>
    <i class="ri-arrow-drop-right-line"></i>
  </a>
</li>
```

Finalmente, si la vertical debe aparecer en el Home, agregar una categoria `home` con `link: '/liquor'` en `home.json` y en la coleccion `categories` de PocketBase.
