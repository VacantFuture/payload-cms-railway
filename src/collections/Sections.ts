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
      async ({ data }) => {
        if (data.sectionName?.Title) {
          data.primaryTitle = data.sectionName.Title
        } else {
          data.primaryTitle = null
        }
        return data
      },
    ],
    afterRead: [
      async ({ doc }) => {
        // If primaryTitle is missing (i.e., for a legacy document), generate it for display.
        if (!doc.primaryTitle && doc.sectionName?.Title) {
          doc.primaryTitle = doc.sectionName.Title
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'sectionName',
      label: 'Section Name',
      type: 'group',
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
