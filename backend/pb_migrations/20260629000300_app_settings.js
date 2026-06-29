const ADMIN_RULE = '@request.auth.type = "admin"';

function findCollection(app, name) {
  try {
    return app.findCollectionByNameOrId(name);
  } catch {
    return null;
  }
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

function configureAppSettingsCollection(collection) {
  collection.listRule = ADMIN_RULE;
  collection.viewRule = ADMIN_RULE;
  collection.createRule = ADMIN_RULE;
  collection.updateRule = ADMIN_RULE;
  collection.deleteRule = ADMIN_RULE;

  addFields(collection, [
    { type: 'text', name: 'key', required: true, max: 80 },
    { type: 'text', name: 'appName', required: true, max: 160 },
    { type: 'text', name: 'slogan', required: false, max: 255 },
    {
      type: 'file',
      name: 'logoHorizontal',
      required: false,
      maxSelect: 1,
      maxSize: 5242880,
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
      thumbs: ['300x100', '600x200'],
    },
    {
      type: 'file',
      name: 'logoSquare',
      required: false,
      maxSelect: 1,
      maxSize: 5242880,
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
      thumbs: ['100x100', '300x300'],
    },
    { type: 'text', name: 'primaryColor', required: false, max: 20 },
    { type: 'text', name: 'secondaryColor', required: false, max: 20 },
    { type: 'text', name: 'accentColor', required: false, max: 20 },
    { type: 'email', name: 'supportEmail', required: false },
    { type: 'text', name: 'supportPhone', required: false, max: 40 },
    { type: 'url', name: 'websiteUrl', required: false },
    { type: 'text', name: 'country', required: false, max: 80 },
    { type: 'text', name: 'currency', required: false, max: 12 },
    { type: 'text', name: 'timezone', required: false, max: 80 },
    { type: 'bool', name: 'maintenanceMode', required: false },
    { type: 'bool', name: 'active', required: false },
  ]);

  addIndexes(collection, ['CREATE UNIQUE INDEX idx_app_settings_key ON app_settings (key)']);
}

function upsertDefaultSettings(app) {
  const collection = app.findCollectionByNameOrId('app_settings');
  let record;

  try {
    record = app.findFirstRecordByFilter('app_settings', 'key = "default"');
  } catch {
    record = new Record(collection);
  }

  Object.entries({
    key: 'default',
    appName: 'Dale Pues',
    slogan: 'Delivery rápido y confiable',
    primaryColor: '#FF7A00',
    secondaryColor: '#1B1D2A',
    accentColor: '#FFD700',
    country: 'Venezuela',
    currency: 'VES',
    timezone: 'America/Caracas',
    maintenanceMode: false,
    active: true,
  }).forEach(([key, value]) => {
    record.set(key, value);
  });

  app.save(record);
}

migrate((txApp) => {
  const existing = findCollection(txApp, 'app_settings');
  const collection = existing || new Collection({ type: 'base', name: 'app_settings' });

  configureAppSettingsCollection(collection);
  txApp.save(collection);
  upsertDefaultSettings(txApp);
}, (txApp) => {
  const collection = findCollection(txApp, 'app_settings');

  if (collection) {
    txApp.delete(collection);
  }
});
