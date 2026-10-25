import { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'primaryTitle',
  },
  labels: {
    singular: 'Tag',
    plural: 'Tags',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data.tagName?.Title) {
          data.primaryTitle = data.tagName.Title
        } else {
          data.primaryTitle = null
        }
        return data
      },
    ],
    afterRead: [
      async ({ doc }) => {
        // If primaryTitle is missing (i.e., for a legacy document), generate it for display.
        if (!doc.primaryTitle && doc.tagName?.Title) {
          doc.primaryTitle = doc.tagName.Title
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'tagName',
      label: 'Tag Name',
      type: 'group',
      access: {
        read: () => true,
        create: ({ req: { user } }) => {
          if (user) {
            // Admins can always update
            if (user.Role === 'admin') {
              return true
            }
            // Editors or Copy writers can update
            if (user.Role === 'editor' || user.Role === 'copy') {
              return true
            }
          }
          // Deny for all other users or if no user is logged in
          return false
        },
        update: ({ req: { user } }) => {
          if (user) {
            // Admins can always update
            if (user.Role === 'admin') {
              return true
            }
            // Editors or Copy writers can update
            if (user.Role === 'editor' || user.Role === 'copy') {
              return true
            }
          }
          // Deny for all other users or if no user is logged in
          return false
        },
      },
      fields: [
        {
          name: 'Title',
          type: 'text',
        },
        {
          name: 'Description',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'primaryTitle',
      type: 'text',
      admin: {
        readOnly: true, // This field is populated by hooks
      },
    },
  ],
}