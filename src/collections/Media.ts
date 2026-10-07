import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',

  admin: {
    useAsTitle: 'alt',
    description: 'Upload images, videos, and audio files.',
    group: 'Digital Assets',
  },
  folders: true,
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      async ({ data }) => {
        // Ensure data object exists before proceeding
        if (!data) return

        let creditSourcesCount = 0
        // Initialize or clear the warning message field on the data object.
        // This ensures it's reset for each validation pass.
        data.mediaCreditWarning = null

        let hasUserCredit = false
        let hasBusinessCredit = false
        let hasManualCredit = false

        // Check User Assigned Media Credit
        if (data?.user) {
          hasUserCredit = true
          creditSourcesCount++
        }

        // Check Manual Entry Media Credit
        const manualCreditFields = [
          data?.firstName,
          data?.lastName,
          data?.title,
          data?.company,
          data?.creditUrl,
        ]
        if (manualCreditFields.some((field) => field && String(field).trim() !== '')) {
          hasManualCredit = true
          creditSourcesCount++
        }

        if (creditSourcesCount >= 2) {
          // Set a warning message on the data object.
          // This message will be displayed in the 'mediaCreditWarning' field in the admin UI.
          data.mediaCreditWarning =
            'Warning: Media credit information has been provided in 2 or more of the 3 credit options. Please consolidate to a single credit source for clarity.'
        }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'mediaCreditWarning',
      label: 'Media Credit Notice',
      type: 'text', // Using a simple text field to display the warning.
      admin: {
        description:
          'This notice appears if media credit information is entered in multiple sections below.',
        readOnly: true, // The user should not edit this field directly.
        condition: (data) => !!data.mediaCreditWarning, // Only display this field if there is a warning message.
      },
      // Note: This field, as defined, will be saved to the database.
      // If this warning should be transient and not persisted,
      // an additional 'beforeChange' hook could be used to remove 'mediaCreditWarning' from 'data' before database save.
    },
    {
      label: 'User Assigned Media Credit',
      type: 'collapsible',
      fields: [
        {
          name: 'user',
          label: 'User',
          type: 'relationship',
          relationTo: 'users',
          defaultValue: ({ user }) => user?.id,
        },
      ],
    },
    {
      label: 'Manual Entry Media Credit',
      type: 'collapsible',
      fields: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
        },
        {
          name: 'title',
          label: 'Title',
          type: 'text',
        },
        {
          name: 'company',
          label: 'Company',
          type: 'text',
        },
        {
          name: 'creditUrl',
          label: 'Credit URL',
          type: 'text',
        },
      ],
    },

    {
      name: 'usedInArticles',
      label: 'Used In Articles',
      type: 'join',
      collection: 'Articles', // Target Articles collection
      on: 'mainImage',
      hasMany: true, // Since media can be used multiple times
      admin: {
        position: 'sidebar',
        allowCreate: false,
        defaultColumns: ['title'],
      },
    },
  ],
  upload: {
    adminThumbnail: 'thumbnail',
    displayPreview: true,
    withMetadata: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        generateImageName: ({ sizeName, extension, height, width, originalName }) => {
          return `${sizeName}-${height}x${width}-${originalName}.${extension}`
        },
        formatOptions: {
          format: 'webp',
          options: {
            quality: 89,
            nearLossless: true,
            smartSubsample: true,
          },
        },
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
        generateImageName: ({ sizeName, extension, height, width, originalName }) => {
          return `${sizeName}-${height}x${width}-${originalName}.${extension}`
        },
        formatOptions: {
          format: 'webp',
          options: {
            quality: 89,
            nearLossless: true,
            smartSubsample: true,
          },
        },
      },
      {
        name: 'tablet',
        width: 1024,
        // By specifying `undefined` or leaving a height undefined,
        // the image will be sized to a certain width,
        // but it will retain its original aspect ratio
        // and calculate a height automatically.
        height: undefined,
        position: 'centre',
        generateImageName: ({ sizeName, extension, height, width, originalName }) => {
          return `${sizeName}-${height}x${width}-${originalName}.${extension}`
        },
        formatOptions: {
          format: 'webp',
          options: {
            quality: 89,
            nearLossless: true,
            smartSubsample: true,
          },
        },
      },
      {
        name: 'metasquare',
        width: 1080,
        height: 1080,
        position: 'centre',
        generateImageName: ({ sizeName, extension, height, width, originalName }) => {
          return `${sizeName}-${height}x${width}-${originalName}.${extension}`
        },
        formatOptions: {
          format: 'webp',
          options: {
            quality: 89,
            nearLossless: true,
            smartSubsample: true,
          },
        },
      },
      {
        name: 'metaportrait',
        width: 1080,
        height: 1350,
        position: 'centre',
        generateImageName: ({ sizeName, extension, height, width, originalName }) => {
          return `${sizeName}-${height}x${width}-${originalName}.${extension}`
        },
        formatOptions: {
          format: 'webp',
          options: {
            quality: 89,
            nearLossless: true,
            smartSubsample: true,
          },
        },
      },
      {
        name: 'metalandscape',
        width: 1080,
        height: 566,
        position: 'centre',
        generateImageName: ({ sizeName, extension, height, width, originalName }) => {
          return `${sizeName}-${height}x${width}-${originalName}.${extension}`
        },
        formatOptions: {
          format: 'webp',
          options: {
            quality: 89,
            nearLossless: true,
            smartSubsample: true,
          },
        },
      },
      {
        name: 'twitter',
        width: 1200,
        height: 675,
        position: 'centre',
        generateImageName: ({ sizeName, extension, height, width, originalName }) => {
          return `${sizeName}-${height}x${width}-${originalName}.${extension}`
        },
        formatOptions: {
          format: 'webp',
          options: {
            quality: 89,
            nearLossless: true,
            smartSubsample: true,
          },
        },
      },
      {
        name: 'linkedin',
        width: 1200,
        height: 1200,
        position: 'centre',
        generateImageName: ({ sizeName, extension, height, width, originalName }) => {
          return `${sizeName}-${height}x${width}-${originalName}.${extension}`
        },
        formatOptions: {
          format: 'webp',
          options: {
            quality: 89,
            nearLossless: true,
            smartSubsample: true,
          },
        },
      },
    ],
    mimeTypes: ['image/*', 'video/*', 'audio/*'],
    formatOptions: {
      format: 'webp',
      options: {
        quality: 90, // 0-100
        preset: 'photo',
      },
    },
  },
}
