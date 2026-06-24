const PUBLIC_READ_RULE = 'active = true || @request.auth.type = "admin" || @request.auth.type = "support"';
const STAFF_WRITE_RULE = '@request.auth.type = "admin" || @request.auth.type = "support"';

function findCollection(app, name) {
  try {
    return app.findCollectionByNameOrId(name);
  } catch {
    return null;
  }
}

function ensureCollection(app, name) {
  const existing = findCollection(app, name);
  return existing || new Collection({ type: 'base', name });
}

function addFields(collection, fields) {
  collection.fields.addMarshaledJSON(JSON.stringify(fields));
}

function addIndexes(collection, indexes) {
  const current = collection.indexes || [];

  indexes.forEach((index) => {
    const indexName = index.match(/INDEX\s+([^\s]+)/i)?.[1];

    if (!indexName || !current.some((currentIndex) => currentIndex.includes(indexName))) {
      current.push(index);
    }
  });

  collection.indexes = current;
}

function configureCollection(collection, fields, indexes) {
  collection.listRule = PUBLIC_READ_RULE;
  collection.viewRule = PUBLIC_READ_RULE;
  collection.createRule = STAFF_WRITE_RULE;
  collection.updateRule = STAFF_WRITE_RULE;
  collection.deleteRule = STAFF_WRITE_RULE;

  addFields(collection, fields);
  addIndexes(collection, indexes);
}

function upsertBySlug(app, collectionName, slug, data) {
  let record;

  try {
    record = app.findFirstRecordByFilter(collectionName, `slug = "${slug}"`);
  } catch {
    record = new Record(app.findCollectionByNameOrId(collectionName));
  }

  Object.entries({ ...data, slug }).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      record.set(key, value);
    }
  });
  app.save(record);
  return record;
}

function upsertByTitleSection(app, collectionName, title, section, data) {
  let record;

  try {
    record = app.findFirstRecordByFilter(
      collectionName,
      `title = "${title}" && section = "${section}"`,
    );
  } catch {
    record = new Record(app.findCollectionByNameOrId(collectionName));
  }

  Object.entries({ ...data, title, section }).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      record.set(key, value);
    }
  });
  app.save(record);
  return record;
}

function relationId(record) {
  return record?.id || '';
}

function seedContent(app) {
  const categoryRecords = {};
  const businessRecords = {};
  const productRecords = {};

  [
    {
      slug: 'home-comida',
      name: 'Comida',
      type: 'home',
      imageUrl: 'assets/images/landing/food.png',
      alt: 'comida',
      link: '/food',
      order: 1,
    },
    {
      slug: 'home-mercado',
      name: 'Mercado',
      type: 'home',
      imageUrl: 'assets/images/landing/grocery.png',
      alt: 'mercado',
      link: '/grocery',
      order: 2,
    },
    {
      slug: 'home-farmacia',
      name: 'Farmacia',
      type: 'home',
      imageUrl: 'assets/images/landing/pharmacy.png',
      alt: 'farmacia',
      link: '/pharmacy',
      order: 3,
    },
    {
      slug: 'food-pizzas',
      name: 'Pizzas',
      type: 'food',
      imageUrl: 'assets/images/product/pizaa.png',
      alt: 'pizza',
      link: '#',
      order: 1,
    },
    {
      slug: 'food-hamburguesas',
      name: 'Hamburguesas',
      type: 'food',
      imageUrl: 'assets/images/product/burger.png',
      alt: 'burger',
      link: '#',
      order: 2,
    },
    {
      slug: 'food-wraps',
      name: 'Wraps',
      type: 'food',
      imageUrl: 'assets/images/product/boritto.png',
      alt: 'boritto',
      link: '#',
      order: 3,
    },
    {
      slug: 'food-perros-calientes',
      name: 'Perros calientes',
      type: 'food',
      imageUrl: 'assets/images/product/hotdog.png',
      alt: 'hotdog',
      link: '#',
      order: 4,
    },
    {
      slug: 'food-pastas',
      name: 'Pastas',
      type: 'food',
      imageUrl: 'assets/images/product/noodles.png',
      alt: 'noodles',
      link: '#',
      order: 5,
    },
    {
      slug: 'grocery-panaderia',
      name: 'Panadería',
      type: 'grocery',
      imageUrl: 'assets/images/grocery/svg/1.svg',
      alt: '1',
      link: '#',
      order: 1,
    },
    {
      slug: 'grocery-proteinas',
      name: 'Proteínas',
      type: 'grocery',
      imageUrl: 'assets/images/grocery/svg/2.svg',
      alt: '2',
      link: '#',
      order: 2,
    },
    {
      slug: 'grocery-carniceria',
      name: 'Carnicería',
      type: 'grocery',
      imageUrl: 'assets/images/grocery/svg/3.svg',
      alt: '3',
      link: '#',
      order: 3,
    },
    {
      slug: 'pharmacy-medicinas',
      name: 'Medicinas',
      type: 'pharmacy',
      imageUrl: 'assets/images/pharmacy/svg/1.svg',
      alt: '1',
      link: '#',
      order: 1,
    },
    {
      slug: 'pharmacy-cuidado-respiratorio',
      name: 'Cuidado respiratorio',
      type: 'pharmacy',
      imageUrl: 'assets/images/pharmacy/svg/2.svg',
      alt: '2',
      link: '#',
      order: 2,
    },
    {
      slug: 'pharmacy-cuidado-personal',
      name: 'Cuidado personal',
      type: 'pharmacy',
      imageUrl: 'assets/images/pharmacy/svg/3.svg',
      alt: '3',
      link: '#',
      order: 3,
    },
    {
      slug: 'pharmacy-bienestar',
      name: 'Bienestar',
      type: 'pharmacy',
      imageUrl: 'assets/images/pharmacy/svg/4.svg',
      alt: '4',
      link: '#',
      order: 4,
    },
  ].forEach((category) => {
    categoryRecords[category.slug] = upsertBySlug(app, 'categories', category.slug, {
      ...category,
      active: true,
    });
  });

  [
    {
      slug: 'arepera-la-principal',
      name: 'Arepera La Principal',
      type: 'restaurant',
      coverUrl: 'assets/images/product/vp1.png',
      description: 'Arepas, empanadas, jugos...',
      address: 'Chacao',
      rating: 3.7,
      deliveryTime: '25 min',
      featured: true,
    },
    {
      slug: 'pizza-los-palos',
      name: 'Pizza Los Palos',
      type: 'restaurant',
      coverUrl: 'assets/images/product/vp2.png',
      description: 'Pizzas, pasticho, pan de ajo...',
      address: 'Las Mercedes',
      rating: 4.5,
      deliveryTime: '18 min',
      featured: true,
    },
    {
      slug: 'desayunos-la-guaira',
      name: 'Desayunos La Guaira',
      type: 'restaurant',
      coverUrl: 'assets/images/product/vp3.png',
      description: 'Cachitos, café, huevos, empanadas...',
      address: 'Sabana Grande',
      rating: 4,
      deliveryTime: '35 min',
      featured: true,
    },
    {
      slug: 'cafe-plaza-venezuela',
      name: 'Café Plaza Venezuela',
      type: 'restaurant',
      coverUrl: 'assets/images/product/vp4.png',
      description: 'Café, tortas, almuerzos ejecutivos...',
      address: 'Altamira',
      rating: 5,
      deliveryTime: '20 min',
      featured: true,
    },
    {
      slug: 'antojos-del-centro',
      name: 'Antojos del Centro',
      type: 'restaurant',
      coverUrl: 'assets/images/product/vp5.png',
      description: 'Tequeños, pepitos, combos...',
      address: 'La Candelaria',
      rating: 4.3,
      deliveryTime: '15 min',
      featured: true,
    },
    {
      slug: 'mercado-dale-pues',
      name: 'Mercado Dale Pues',
      type: 'grocery',
      description: 'Frescos y víveres de comercios aliados',
      rating: 4.5,
      deliveryTime: '20min',
      featured: true,
    },
    {
      slug: 'farmacia-dale-pues',
      name: 'Farmacia Dale Pues',
      type: 'pharmacy',
      description: 'Medicamentos y cuidado personal',
      rating: 4.5,
      deliveryTime: '20min',
      featured: true,
    },
  ].forEach((business) => {
    businessRecords[business.slug] = upsertBySlug(app, 'businesses', business.slug, {
      ...business,
      city: 'Paraguaná',
      state: 'Falcón',
      country: 'Venezuela',
      active: true,
    });
  });

  [
    {
      slug: 'kit-de-bienestar',
      name: 'Kit de bienestar',
      type: 'pharmacy',
      description: 'Compra 1 y lleva 2 gratis',
      imageUrl: 'assets/images/landing/banner10.png',
      alt: 'producto destacado',
      price: 8,
      oldPrice: 15,
      rating: 4.5,
      featured: true,
    },
    {
      slug: 'combo-para-la-casa',
      name: 'Combo para la casa',
      type: 'grocery',
      description: 'Ahorra en compras rápidas',
      imageUrl: 'assets/images/landing/banner11.png',
      alt: 'producto destacado',
      price: 8,
      oldPrice: 15,
      rating: 4.5,
      featured: true,
    },
    {
      slug: 'pollo-criollo-con-arroz',
      name: 'Pollo criollo con arroz',
      type: 'food',
      imageUrl: 'assets/images/product/p1.png',
      alt: 'p1',
      price: 19.23,
      rating: 3.7,
      deliveryTime: '20 min',
      category: relationId(categoryRecords['food-pastas']),
      business: relationId(businessRecords['arepera-la-principal']),
    },
    {
      slug: 'pizza-mixta-familiar',
      name: 'Pizza mixta familiar',
      type: 'food',
      imageUrl: 'assets/images/product/p2.png',
      alt: 'p2',
      price: 9.5,
      rating: 4.5,
      deliveryTime: '20 min',
      category: relationId(categoryRecords['food-pizzas']),
      business: relationId(businessRecords['pizza-los-palos']),
    },
    {
      slug: 'pasta-cuatro-quesos',
      name: 'Pasta cuatro quesos',
      type: 'food',
      imageUrl: 'assets/images/product/p3.png',
      alt: 'p3',
      price: 3,
      rating: 4,
      deliveryTime: '20 min',
      category: relationId(categoryRecords['food-pastas']),
    },
    {
      slug: 'bebida-sabor-fresa',
      name: 'Bebida sabor fresa',
      type: 'grocery',
      imageUrl: 'assets/images/grocery/p1.png',
      alt: 'p1',
      price: 16,
      rating: 4.5,
      deliveryTime: '20min',
      tags: { unit: 'kg', offerTag: '20% menos', section: 'products' },
      business: relationId(businessRecords['mercado-dale-pues']),
      category: relationId(categoryRecords['grocery-panaderia']),
      featured: true,
    },
    {
      slug: 'repollo-fresco',
      name: 'Repollo fresco',
      type: 'grocery',
      imageUrl: 'assets/images/grocery/p2.png',
      alt: 'p1',
      price: 16,
      rating: 4.5,
      deliveryTime: '20min',
      tags: { unit: 'kg', offerTag: '20% menos', section: 'products' },
      business: relationId(businessRecords['mercado-dale-pues']),
    },
    {
      slug: 'jugo-de-naranja',
      name: 'Jugo de naranja',
      type: 'grocery',
      imageUrl: 'assets/images/grocery/p3.png',
      alt: 'p1',
      price: 16,
      rating: 4.5,
      deliveryTime: '20min',
      tags: { unit: 'kg', offerTag: '20% menos', section: 'products' },
      business: relationId(businessRecords['mercado-dale-pues']),
      featured: true,
    },
    {
      slug: 'galletas-de-avena',
      name: 'Galletas de avena',
      type: 'grocery',
      imageUrl: 'assets/images/grocery/p4.png',
      alt: 'p4',
      price: 16,
      rating: 4.5,
      deliveryTime: '20min',
      tags: { unit: 'kg', section: 'popular,recent' },
      business: relationId(businessRecords['mercado-dale-pues']),
    },
    {
      slug: 'frutos-secos',
      name: 'Frutos secos',
      type: 'grocery',
      imageUrl: 'assets/images/grocery/p5.png',
      alt: 'p5',
      price: 16,
      rating: 4.5,
      deliveryTime: '20min',
      tags: { unit: 'kg', section: 'popular,recent' },
      business: relationId(businessRecords['mercado-dale-pues']),
    },
    {
      slug: 'cereal-para-desayuno',
      name: 'Cereal para desayuno',
      type: 'grocery',
      imageUrl: 'assets/images/grocery/p6.png',
      alt: 'p6',
      price: 16,
      rating: 4.5,
      deliveryTime: '20min',
      tags: { unit: 'kg', section: 'popular' },
      business: relationId(businessRecords['mercado-dale-pues']),
    },
    {
      slug: 'galletas-de-mantequilla',
      name: 'Galletas de mantequilla',
      type: 'grocery',
      imageUrl: 'assets/images/grocery/p7.png',
      alt: 'p7',
      price: 16,
      rating: 4.5,
      deliveryTime: 'A 20 min de tu casa',
      tags: { unit: 'kg', section: 'recent' },
      business: relationId(businessRecords['mercado-dale-pues']),
    },
    {
      slug: 'oximetro-digital',
      name: 'Oxímetro digital',
      type: 'pharmacy',
      imageUrl: 'assets/images/pharmacy/p1.png',
      alt: 'p1',
      price: 10,
      rating: 4.5,
      deliveryTime: '20min',
      tags: { offerTag: '20% menos', section: 'offers,products' },
      business: relationId(businessRecords['farmacia-dale-pues']),
      category: relationId(categoryRecords['pharmacy-medicinas']),
      featured: true,
    },
    {
      slug: 'nebulizador-compacto',
      name: 'Nebulizador compacto',
      type: 'pharmacy',
      imageUrl: 'assets/images/pharmacy/p2.png',
      alt: 'p2',
      price: 10,
      rating: 4.5,
      deliveryTime: '20min',
      tags: { offerTag: '20% menos', section: 'offers,products' },
      business: relationId(businessRecords['farmacia-dale-pues']),
      featured: true,
    },
    {
      slug: 'suplemento-bienestar',
      name: 'Suplemento bienestar',
      type: 'pharmacy',
      description: 'Tabletas x15',
      imageUrl: 'assets/images/pharmacy/p3.png',
      alt: 'p3',
      price: 15,
      oldPrice: 20,
      rating: 4.5,
      tags: { section: 'wellness' },
    },
    {
      slug: 'bienestar-y-energia',
      name: 'Bienestar y energía',
      type: 'pharmacy',
      description: 'Ashwagandha',
      imageUrl: 'assets/images/pharmacy/p4.png',
      alt: 'p4',
      price: 15,
      oldPrice: 20,
      rating: 4.5,
      tags: { section: 'wellness' },
    },
    {
      slug: 'vitamina-c-naranja',
      name: 'Vitamina C naranja',
      type: 'pharmacy',
      description: 'Sin azúcar',
      imageUrl: 'assets/images/pharmacy/p5.png',
      alt: 'p4',
      price: 15,
      oldPrice: 20,
      rating: 4.5,
      tags: { section: 'wellness' },
    },
    {
      slug: 'nebulizador-familiar',
      name: 'Nebulizador familiar',
      type: 'pharmacy',
      description: 'Entrega segura',
      imageUrl: 'assets/images/pharmacy/p6.png',
      alt: 'p6',
      price: 5,
      oldPrice: 10,
      rating: 4.5,
      tags: { section: 'bestSellers' },
    },
    {
      slug: 'aceite-corporal',
      name: 'Aceite corporal',
      type: 'pharmacy',
      description: 'Cuidado personal',
      imageUrl: 'assets/images/pharmacy/p7.png',
      alt: 'p7',
      price: 8,
      rating: 4.5,
      tags: { section: 'bestSellers' },
    },
    {
      slug: 'refuerzo-inmune',
      name: 'Refuerzo inmune',
      type: 'pharmacy',
      description: 'Vitaminas esenciales',
      imageUrl: 'assets/images/pharmacy/p8.png',
      alt: 'p8',
      price: 10,
      rating: 4.5,
      tags: { section: 'bestSellers' },
    },
    {
      slug: 'multivitaminico',
      name: 'Multivitamínico',
      type: 'pharmacy',
      description: 'OMEGA-3',
      imageUrl: 'assets/images/pharmacy/p9.png',
      alt: 'p9',
      price: 15,
      rating: 4.5,
      tags: { section: 'bestSellers' },
    },
    {
      slug: 'crema-corporal',
      name: 'Crema corporal',
      type: 'pharmacy',
      description: 'Cuidado diario',
      imageUrl: 'assets/images/pharmacy/p10.png',
      alt: 'p10',
      price: 6,
      rating: 4.5,
      tags: { section: 'bestSellers' },
    },
  ].forEach((product) => {
    productRecords[product.slug] = upsertBySlug(app, 'products', product.slug, {
      ...product,
      currency: '$',
      stock: 100,
      active: true,
      ctaText: 'Agregar',
    });
  });

  [
    {
      title: 'Farmacia cerca de ti',
      section: 'home',
      subtitle: 'Medicamentos y cuidado personal en:',
      highlight: '20 min',
      imageUrl: 'assets/images/landing/banner7.png',
      alt: 'banner farmacia',
      ctaText: 'Pedir ahora',
      link: '/pharmacy',
      position: 1,
    },
    {
      title: 'Comida lista sin moverte',
      section: 'home',
      subtitle: 'Restaurantes y antojos en:',
      highlight: '20 min',
      imageUrl: 'assets/images/landing/banner8.png',
      alt: 'banner comida',
      ctaText: 'Pedir ahora',
      link: '/food',
      position: 2,
    },
    {
      title: 'Mercado rápido a domicilio',
      section: 'home',
      subtitle: 'Víveres y productos del hogar en:',
      highlight: '20 min',
      imageUrl: 'assets/images/landing/banner9.png',
      alt: 'banner mercado',
      ctaText: 'Pedir ahora',
      link: '/grocery',
      position: 3,
    },
    {
      title: 'Promoción de comida',
      section: 'food',
      imageUrl: 'assets/images/banner/banner1.png',
      alt: 'promoción de comida',
      position: 1,
    },
    {
      title: 'Combo destacado',
      section: 'food',
      imageUrl: 'assets/images/banner/banner2.png',
      alt: 'combo destacado',
      position: 2,
    },
    {
      title: 'Oferta de restaurante',
      section: 'food',
      imageUrl: 'assets/images/banner/banner3.png',
      alt: 'oferta de restaurante',
      position: 3,
    },
    {
      title: 'Banner de mercado',
      section: 'grocery',
      imageUrl: 'assets/images/grocery/banner12.png',
      alt: 'banner de mercado',
      position: 1,
    },
    {
      title: 'Oferta de mercado',
      section: 'grocery',
      imageUrl: 'assets/images/grocery/banner13.png',
      alt: 'oferta de mercado',
      position: 2,
    },
    {
      title: 'Promoción de víveres',
      section: 'grocery',
      imageUrl: 'assets/images/grocery/banner14.png',
      alt: 'promoción de víveres',
      position: 3,
    },
    {
      title: 'Banner de farmacia',
      section: 'pharmacy',
      imageUrl: 'assets/images/pharmacy/banner15.png',
      alt: 'banner de farmacia',
      position: 1,
    },
    {
      title: 'Descuento de farmacia',
      section: 'pharmacy',
      imageUrl: 'assets/images/pharmacy/banner16.png',
      alt: 'descuento de farmacia',
      position: 2,
    },
    {
      title: 'Promoción de bienestar',
      section: 'pharmacy',
      imageUrl: 'assets/images/pharmacy/banner17.png',
      alt: 'promoción de bienestar',
      position: 3,
    },
  ].forEach((banner) => {
    upsertByTitleSection(app, 'banners', banner.title, banner.section, {
      ...banner,
      active: true,
    });
  });

  [
    {
      title: 'Promos del día y ofertas cerca de ti',
      section: 'home',
      description: 'Promos del día y ofertas cerca de ti',
      discountType: 'text',
      badgeText: 'Promoción',
      imageUrl: 'assets/images/landing/discount-tag.png',
      order: 1,
    },
    {
      title: 'Ofertas para tu primera compra',
      section: 'grocery',
      description: 'Básicos para la casa',
      discountType: 'percentage',
      discountValue: 20,
      badgeText: '20% menos',
      order: 1,
    },
    {
      title: 'Descuentos especiales',
      section: 'pharmacy',
      description: 'Promociones de bienestar y cuidado personal',
      discountType: 'text',
      badgeText: 'Descuento',
      order: 1,
    },
  ].forEach((promotion) => {
    upsertByTitleSection(app, 'promotions', promotion.title, promotion.section, {
      ...promotion,
      active: true,
    });
  });
}

migrate((txApp) => {
  const users = txApp.findCollectionByNameOrId('users');
  const categories = ensureCollection(txApp, 'categories');
  const businesses = ensureCollection(txApp, 'businesses');
  const products = ensureCollection(txApp, 'products');
  const banners = ensureCollection(txApp, 'banners');
  const promotions = ensureCollection(txApp, 'promotions');

  configureCollection(categories, [
    { type: 'text', name: 'name', required: true, max: 160 },
    { type: 'text', name: 'slug', required: true, max: 160 },
    { type: 'select', name: 'type', required: true, maxSelect: 1, values: ['home', 'food', 'grocery', 'pharmacy'] },
    { type: 'file', name: 'image', required: false, maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'], thumbs: ['100x100', '300x300'] },
    { type: 'text', name: 'imageUrl', required: false, max: 255, help: 'TODO: migrar a archivo PocketBase.' },
    { type: 'text', name: 'icon', required: false, max: 255 },
    { type: 'text', name: 'alt', required: false, max: 160 },
    { type: 'text', name: 'link', required: false, max: 255 },
    { type: 'bool', name: 'active', required: false },
    { type: 'number', name: 'order', required: false },
  ], [
    'CREATE UNIQUE INDEX idx_categories_slug ON categories (slug)',
    'CREATE INDEX idx_categories_type ON categories (type)',
    'CREATE INDEX idx_categories_active ON categories (active)',
  ]);

  configureCollection(businesses, [
    { type: 'text', name: 'name', required: true, max: 180 },
    { type: 'text', name: 'slug', required: true, max: 180 },
    { type: 'select', name: 'type', required: true, maxSelect: 1, values: ['restaurant', 'grocery', 'pharmacy', 'courier', 'store'] },
    { type: 'file', name: 'logo', required: false, maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'], thumbs: ['100x100', '300x300'] },
    { type: 'file', name: 'cover', required: false, maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'], thumbs: ['300x200', '600x400'] },
    { type: 'text', name: 'logoUrl', required: false, max: 255, help: 'TODO: migrar a archivo PocketBase.' },
    { type: 'text', name: 'coverUrl', required: false, max: 255, help: 'TODO: migrar a archivo PocketBase.' },
    { type: 'editor', name: 'description', required: false },
    { type: 'text', name: 'phone', required: false, max: 60 },
    { type: 'text', name: 'whatsapp', required: false, max: 60 },
    { type: 'text', name: 'address', required: false, max: 255 },
    { type: 'text', name: 'city', required: false, max: 80 },
    { type: 'text', name: 'state', required: false, max: 80 },
    { type: 'text', name: 'country', required: false, max: 80 },
    { type: 'number', name: 'lat', required: false },
    { type: 'number', name: 'lng', required: false },
    { type: 'number', name: 'rating', required: false },
    { type: 'text', name: 'deliveryTime', required: false, max: 40 },
    { type: 'bool', name: 'active', required: false },
    { type: 'bool', name: 'featured', required: false },
    { type: 'relation', name: 'owner', required: false, maxSelect: 1, collectionId: users.id },
  ], [
    'CREATE UNIQUE INDEX idx_businesses_slug ON businesses (slug)',
    'CREATE INDEX idx_businesses_type ON businesses (type)',
    'CREATE INDEX idx_businesses_active ON businesses (active)',
    'CREATE INDEX idx_businesses_featured ON businesses (featured)',
  ]);

  configureCollection(products, [
    { type: 'relation', name: 'business', required: false, maxSelect: 1, collectionId: businesses.id },
    { type: 'relation', name: 'category', required: false, maxSelect: 1, collectionId: categories.id },
    { type: 'text', name: 'name', required: true, max: 180 },
    { type: 'text', name: 'slug', required: true, max: 180 },
    { type: 'editor', name: 'description', required: false },
    { type: 'file', name: 'image', required: false, maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'], thumbs: ['300x300', '600x600'] },
    { type: 'text', name: 'imageUrl', required: false, max: 255, help: 'TODO: migrar a archivo PocketBase.' },
    { type: 'text', name: 'alt', required: false, max: 160 },
    { type: 'select', name: 'type', required: true, maxSelect: 1, values: ['food', 'grocery', 'pharmacy'] },
    { type: 'number', name: 'price', required: true },
    { type: 'number', name: 'oldPrice', required: false },
    { type: 'text', name: 'currency', required: false, max: 8 },
    { type: 'number', name: 'rating', required: false },
    { type: 'number', name: 'stock', required: false },
    { type: 'bool', name: 'featured', required: false },
    { type: 'bool', name: 'active', required: false },
    { type: 'text', name: 'deliveryTime', required: false, max: 40 },
    { type: 'json', name: 'tags', required: false },
    { type: 'text', name: 'ctaText', required: false, max: 60 },
  ], [
    'CREATE UNIQUE INDEX idx_products_slug ON products (slug)',
    'CREATE INDEX idx_products_type ON products (type)',
    'CREATE INDEX idx_products_active ON products (active)',
    'CREATE INDEX idx_products_featured ON products (featured)',
  ]);

  configureCollection(banners, [
    { type: 'text', name: 'title', required: true, max: 180 },
    { type: 'text', name: 'subtitle', required: false, max: 255 },
    { type: 'text', name: 'highlight', required: false, max: 80 },
    { type: 'file', name: 'image', required: false, maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'], thumbs: ['600x300'] },
    { type: 'text', name: 'imageUrl', required: false, max: 255, help: 'TODO: migrar a archivo PocketBase.' },
    { type: 'text', name: 'alt', required: false, max: 160 },
    { type: 'text', name: 'ctaText', required: false, max: 60 },
    { type: 'text', name: 'link', required: false, max: 255 },
    { type: 'select', name: 'section', required: true, maxSelect: 1, values: ['home', 'food', 'grocery', 'pharmacy'] },
    { type: 'number', name: 'position', required: false },
    { type: 'bool', name: 'active', required: false },
    { type: 'date', name: 'startDate', required: false },
    { type: 'date', name: 'endDate', required: false },
  ], [
    'CREATE INDEX idx_banners_section ON banners (section)',
    'CREATE INDEX idx_banners_active ON banners (active)',
  ]);

  configureCollection(promotions, [
    { type: 'text', name: 'title', required: true, max: 180 },
    { type: 'editor', name: 'description', required: false },
    { type: 'relation', name: 'business', required: false, maxSelect: 1, collectionId: businesses.id },
    { type: 'relation', name: 'product', required: false, maxSelect: 1, collectionId: products.id },
    { type: 'select', name: 'section', required: true, maxSelect: 1, values: ['home', 'food', 'grocery', 'pharmacy'] },
    { type: 'select', name: 'discountType', required: true, maxSelect: 1, values: ['percentage', 'fixed', 'combo', 'text'] },
    { type: 'number', name: 'discountValue', required: false },
    { type: 'text', name: 'badgeText', required: false, max: 80 },
    { type: 'file', name: 'image', required: false, maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/webp'], thumbs: ['600x300'] },
    { type: 'text', name: 'imageUrl', required: false, max: 255, help: 'TODO: migrar a archivo PocketBase.' },
    { type: 'bool', name: 'active', required: false },
    { type: 'date', name: 'startDate', required: false },
    { type: 'date', name: 'endDate', required: false },
    { type: 'number', name: 'order', required: false },
  ], [
    'CREATE INDEX idx_promotions_section ON promotions (section)',
    'CREATE INDEX idx_promotions_active ON promotions (active)',
  ]);

  [categories, businesses, products, banners, promotions].forEach((collection) => txApp.save(collection));
  seedContent(txApp);
}, (txApp) => {
  ['promotions', 'banners', 'products', 'businesses', 'categories'].forEach((name) => {
    const collection = findCollection(txApp, name);
    if (collection) {
      collection.listRule = null;
      collection.viewRule = null;
      collection.createRule = null;
      collection.updateRule = null;
      collection.deleteRule = null;
      txApp.save(collection);
    }
  });
});
