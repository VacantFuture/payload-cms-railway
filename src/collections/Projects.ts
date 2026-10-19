import { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'projectName',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'projectName',
      label: 'Project Name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'assignedArticle',
      label: 'Assigned Article',
      type: 'relationship',
      relationTo: 'Articles',
      hasMany: false,
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'array',
      minRows: 0,
      admin: {
        components: {
          RowLabel: 'src/components/ArrayFieldTitle.tsx',
        },
      },
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
        },
        {
          name: 'note',
          label: 'Note',
          type: 'richText',
        },
      ],
    },

    {
      name: 'documentation',
      label: 'Documentation',
      type: 'upload',
      relationTo: 'documents',
      hasMany: true,
      required: false,
      admin: {
        allowCreate: false,
      },
    },
    {
      name: 'draftImages',
      label: 'Draft Images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: false,
      admin: {
        allowCreate: false,
      },
    },
  ],
}
