import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    group: 'Digital Assets',
    description: 'Upload documents, spreadsheets, and presentations.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      name: 'usedIn',
      type: 'join',
      collection: 'projects',
      on: 'documentation',
      hasMany: true, // Since media can be used multiple times
      admin: {
        position: 'sidebar',
        allowCreate: false,
      },
    },
  ],
  upload: {
    displayPreview: true,
    withMetadata: true,
    disableLocalStorage: true,
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.presentation',
      'application/epub+zip',
      'application/zip',
      'application/rtf',
      'application/x-rtf',
      'text/plain',
      'text/csv',
      'text/tab-separated-values',
    ],
  },
  // {
  //   name: 'usedIn',
  //   type: 'join',
  //   collection: 'events',
  //   on: 'Main Image',
  //   hasMany: true, // Since media can be used multiple times
  //   admin: {
  //     position: 'sidebar',
  //   },
  // },
}
