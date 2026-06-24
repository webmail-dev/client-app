migrate((txApp) => {
  const collection = txApp.findCollectionByNameOrId('users');

  collection.listRule = '@request.auth.id != "" && (@request.auth.type = "admin" || @request.auth.type = "support")';
  collection.viewRule = '@request.auth.id = id || @request.auth.type = "admin" || @request.auth.type = "support"';
  collection.createRule = '';
  collection.updateRule = '@request.auth.id = id || @request.auth.type = "admin" || @request.auth.type = "support"';
  collection.deleteRule = '@request.auth.type = "admin"';
  collection.authRule = 'status = "" || (status != "blocked" && status != "inactive")';
  collection.manageRule = '@request.auth.type = "admin"';

  collection.passwordAuth.enabled = true;
  collection.passwordAuth.identityFields = ['email'];

  collection.oauth2.mappedFields = {
    id: '',
    name: 'name',
    username: '',
    avatarURL: '',
  };

  collection.fields.addMarshaledJSON(JSON.stringify([
    {
      type: 'text',
      name: 'name',
      required: false,
      max: 120,
    },
    {
      type: 'text',
      name: 'phone',
      required: false,
      max: 40,
    },
    {
      type: 'select',
      name: 'type',
      values: ['client', 'merchant', 'courier', 'admin', 'support'],
      maxSelect: 1,
      required: false,
    },
    {
      type: 'select',
      name: 'status',
      values: ['active', 'pending', 'rejected', 'blocked', 'inactive'],
      maxSelect: 1,
      required: false,
    },
    {
      type: 'file',
      name: 'avatar',
      required: false,
      maxSelect: 1,
      maxSize: 5242880,
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      thumbs: ['100x100', '300x300'],
    },
    {
      type: 'text',
      name: 'address',
      required: false,
      max: 255,
    },
    {
      type: 'text',
      name: 'city',
      required: false,
      max: 80,
    },
    {
      type: 'text',
      name: 'state',
      required: false,
      max: 80,
    },
    {
      type: 'text',
      name: 'country',
      required: false,
      max: 80,
    },
    {
      type: 'text',
      name: 'roleDescription',
      required: false,
      max: 255,
    },
    {
      type: 'date',
      name: 'lastLoginAt',
      required: false,
    },
    {
      type: 'bool',
      name: 'profileCompleted',
      required: false,
    },
    {
      type: 'bool',
      name: 'termsAccepted',
      required: false,
    },
    {
      type: 'text',
      name: 'businessName',
      required: false,
      max: 160,
      help: 'Fase 1: campo mínimo temporal. TODO: mover a merchant_profiles.',
    },
    {
      type: 'text',
      name: 'businessType',
      required: false,
      max: 80,
      help: 'Fase 1: campo mínimo temporal. TODO: mover a merchant_profiles.',
    },
    {
      type: 'text',
      name: 'identityDocument',
      required: false,
      max: 80,
      help: 'Fase 1: campo mínimo temporal. TODO: mover a courier_profiles.',
    },
    {
      type: 'text',
      name: 'vehicleType',
      required: false,
      max: 80,
      help: 'Fase 1: campo mínimo temporal. TODO: mover a courier_profiles.',
    },
  ]));

  txApp.save(collection);
}, (txApp) => {
  const collection = txApp.findCollectionByNameOrId('users');

  collection.listRule = null;
  collection.viewRule = null;
  collection.createRule = null;
  collection.updateRule = null;
  collection.deleteRule = null;
  collection.authRule = '';
  collection.manageRule = null;

  [
    'phone',
    'type',
    'status',
    'address',
    'city',
    'state',
    'country',
    'roleDescription',
    'lastLoginAt',
    'profileCompleted',
    'termsAccepted',
    'businessName',
    'businessType',
    'identityDocument',
    'vehicleType',
  ].forEach((fieldName) => collection.fields.removeByName(fieldName));

  txApp.save(collection);
});
