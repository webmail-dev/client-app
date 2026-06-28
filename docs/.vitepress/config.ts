export default {
  title: 'Dale Pues',
  description: 'Documentacion tecnica de Dale Pues',
  lang: 'es-CO',
  cleanUrls: true,
  lastUpdated: true,
  appearance: true,
  head: [['link', { rel: 'icon', href: '/logo.svg' }]],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Dale Pues Docs',
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Guia', link: '/guide/arquitectura' },
      { text: 'Backend', link: '/guide/backend' },
      { text: 'Operacion', link: '/guide/operacion' }
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
          { text: 'Paginas', link: '/guide/paginas' },
          { text: 'Servicios y datos', link: '/guide/servicios-y-datos' },
          { text: 'PWA y assets', link: '/guide/pwa-y-assets' }
        ]
      },
      {
        text: 'Backend',
        items: [{ text: 'PocketBase y usuarios', link: '/guide/backend' }]
      },
      {
        text: 'Operacion',
        items: [
          { text: 'Dependencias y despliegue', link: '/guide/operacion' },
          { text: 'Agregar una vertical', link: '/guide/how-to-vertical' },
          { text: 'Diccionario de datos', link: '/guide/diccionario-datos' }
        ]
      }
    ],
    outline: {
      level: [2, 3],
      label: 'En esta pagina'
    },
    search: {
      provider: 'local'
    },
    docFooter: {
      prev: 'Anterior',
      next: 'Siguiente'
    },
    darkModeSwitchLabel: 'Tema',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Volver arriba',
    lastUpdatedText: 'Actualizado'
  }
};
