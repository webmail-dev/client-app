export default {
  base: '/client-app/',
  title: 'Vecimerca',
  description: 'Documentación técnica de Vecimerca',
  lang: 'es-CO',
  cleanUrls: true,
  lastUpdated: true,
  appearance: true,
  head: [['link', { rel: 'icon', href: '/client-app/logo.svg' }]],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Vecimerca Docs',
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Guía', link: '/guide/arquitectura' },
      { text: 'Backend', link: '/guide/backend' },
      { text: 'Operación', link: '/guide/operacion' }
    ],
    sidebar: [
      {
        text: 'Proyecto',
        items: [
          { text: 'Resumen', link: '/' },
          { text: 'Arquitectura', link: '/guide/arquitectura' },
          { text: 'Rutas', link: '/guide/rutas' },
          { text: 'Seguridad', link: '/guide/seguridad' }
        ]
      },
      {
        text: 'Frontend',
        items: [
          { text: 'Componentes', link: '/guide/componentes' },
          { text: 'Páginas', link: '/guide/paginas' },
          { text: 'Servicios y datos', link: '/guide/servicios-y-datos' },
          { text: 'PWA y assets', link: '/guide/pwa-y-assets' }
        ]
      },
      {
        text: 'Backend',
        items: [{ text: 'PocketBase y usuarios', link: '/guide/backend' }]
      },
      {
        text: 'Operación',
        items: [
          { text: 'Dependencias y despliegue', link: '/guide/operacion' },
          { text: 'Agregar una vertical', link: '/guide/how-to-vertical' },
          { text: 'Diccionario de datos', link: '/guide/diccionario-datos' }
        ]
      }
    ],
    outline: {
      level: [2, 3],
      label: 'En esta página'
    },
    search: {
      provider: 'local'
    },
    docFooter: {
      prev: 'Anterior',
      next: 'Siguiente'
    },
    darkModeSwitchLabel: 'Tema',
    sidebarMenuLabel: 'Menú',
    returnToTopLabel: 'Volver arriba',
    lastUpdatedText: 'Actualizado'
  }
};
