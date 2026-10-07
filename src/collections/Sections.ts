import { CollectionConfig } from 'payload'
//Commit
export const Sections: CollectionConfig = {
  slug: 'sections',
  admin: {
    useAsTitle: 'primaryTitle', // Use the new derived field as the title
  },
  labels: {
    singular: 'Section',
    plural: 'Sections',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, operation }) => {
        let currentSectionNameArray
        // Check if 'Section Name' is being updated in the current operation
        if (data.sectionName !== undefined) {
          currentSectionNameArray = data.sectionName
        } else if (operation === 'update') {
          // If not updated, use the value from the original document (for updates)
          currentSectionNameArray = originalDoc?.sectionName
        }

        if (
          currentSectionNameArray &&
          Array.isArray(currentSectionNameArray) &&
          currentSectionNameArray.length > 0
        ) {
          data.primaryTitle = currentSectionNameArray[0]?.Title || null
        } else {
          data.primaryTitle = null // Clear if 'Section Name' is empty or invalid
        }
        return data
      },
    ],
    afterRead: [
      async ({ doc }) => {
        // If primaryTitle is missing (i.e., for a legacy document), generate it for display.
        if (!doc.primaryTitle) {
          const sectionNameArray = doc.sectionName
          if (sectionNameArray && Array.isArray(sectionNameArray) && sectionNameArray.length > 0) {
            doc.primaryTitle = sectionNameArray[0]?.Title || null
          }
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'sectionName',
      label: 'Section Name',
      type: 'array',
      minRows: 1,
      maxRows: 5,
      access: {
        read: () => true,
        create: ({ req: { user } }) => {
          if (user) {
            // Admins can always update
            if (user.Role === 'admin') {
              return true
            }
            // Editors can update
            if (user.Role === 'editor') {
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
