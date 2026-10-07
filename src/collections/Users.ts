import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'fullName',
    group: 'Admin',
    description: 'Manage system settings, user accounts and roles.',
  },
  auth: true,
  hooks: {
    // This hook ensures the 'Full Name' is created and saved to the database
    // whenever a user is created or updated.
    beforeChange: [
      ({ data }) => {
        if (data.firstName || data.lastName) {
          data.fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim()
        }
        return data
      },
    ],
    // This hook ensures that for any existing documents that have not yet been
    // re-saved, the 'Full Name' is still available for display in the admin UI.
    // Once a document is saved, this hook will no longer be necessary for it.
    afterRead: [
      ({ doc }) => {
        // If 'Full Name' is missing (i.e., for a legacy document), generate it for display.
        if (!doc.fullName && (doc.firstName || doc.lastName)) {
          doc.fullName = `${doc.firstName || ''} ${doc.lastName || ''}`.trim()
        }
        return doc
      },
    ],
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true, // Required field
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true, // Required field
    },
    {
      name: 'profilePicture',
      label: 'Profile Picture',
      type: 'upload',
      relationTo: 'media',
      required: false,
      hasMany: false,
      displayPreview: true,
      admin: {
        width: '50%',
      },
    },
    {
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'Role',
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Author',
          value: 'author',
        },
      ],
      defaultValue: 'user',
      required: true, // Required field
    },

    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
      required: false, // Optional field
    },
  ],
}
