# Dale Pues

Aplicación web progresiva (PWA) desarrollada con Angular para servicios de entrega y comercio local.

## Tecnologías

* Angular 21
* TypeScript
* SCSS / CSS
* Angular Router
* Angular Service Worker (PWA)
* HTML5
* Responsive Design

---

## Requisitos

Antes de iniciar asegúrese de tener instalado:

* Node.js 20 o superior
* NPM 10 o superior
* Angular CLI

Verificar versiones:

```bash
node -v
npm -v
ng version
```

---

## Instalación

Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd dale-pues
```

Instalar dependencias:

```bash
npm install
```

---

## Ejecución en desarrollo

Iniciar servidor local:

```bash
ng serve
```

Abrir:

```text
http://localhost:4200
```

La aplicación recargará automáticamente al detectar cambios.

---

## Compilación

Generar versión de producción:

```bash
ng build
```

Los archivos compilados se generan en:

```text
dist/
```

---

## Estructura del proyecto

```text
src/
│
├── app/
│   ├── components/
│   │   ├── header/
│   │   ├── footer/
│   │   ├── sidebar/
│   │   ├── bottom-nav/
│   │   └── componentes reutilizables
│   │
│   ├── pages/
│   │   ├── home/
│   │   ├── food-home/
│   │   ├── grocery-home/
│   │   ├── pharmacy-home/
│   │   └── profile/
│   │
│   ├── services/
│   │   └── script-loader.service.ts
│   │
│   ├── app.routes.ts
│   └── app.config.ts
│
├── assets/
│   ├── images/
│   ├── css/
│   ├── js/
│   └── fonts/
│
├── styles.css
└── main.ts
```

---

## Rutas principales

```text
/
 /food
 /grocery
 /pharmacy
 /profile
```

---

## Assets

Los recursos estáticos se encuentran dentro de:

```text
src/assets
```

Incluyen:

* Imágenes
* Fuentes
* Hojas de estilo
* Scripts externos

---

## Scripts dinámicos

Los scripts que requieren inicialización después del renderizado de Angular deben cargarse mediante:

```text
ScriptLoaderService
```

Esto permite:

* Evitar cargas duplicadas
* Inicializar sliders
* Inicializar carruseles
* Mantener compatibilidad con navegación SPA

---

## PWA

La aplicación incluye soporte para:

* Instalación en dispositivos móviles
* Caché de recursos estáticos
* Funcionamiento optimizado en dispositivos móviles
* Experiencia similar a aplicación nativa

---

## Calidad de código

Verificar compilación:

```bash
ng build
```

Ejecutar pruebas:

```bash
ng test
```

---

## Autor

Buckapi Development
