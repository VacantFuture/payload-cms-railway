import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'
import isAdminEditorCopyorOwner from './access/isAdminCopyorOwner'
import isAdminEditororAuthor from './access/isAdminEditororAuthor'
import isAdminEditorOrCopy from './access/isAdminEditorOrCopy'
import { createPublishingGatekeeperHook, createStateMachineHook } from '../utils/stateMachine'
import { createMainImageValidationHook } from '../utils/validateMainImageOnPublish'

const articleStateMachine = createStateMachineHook({
  stateField: 'workflowStatus',
  transitions: {
    author: { draft: ['inReview'], changesRequested: ['inReview'] },
    editor: {
      draft: ['inReview'],
      inReview: ['approved', 'changesRequested'],
      changesRequested: ['inReview'],
    },
  },
})

const articlePublishingGatekeeper = createPublishingGatekeeperHook({
  stateField: 'workflowStatus',
  approvedState: 'approved',
  publishingRoles: ['admin', 'editor'],
})

const articleMainImageValidation = createMainImageValidationHook()

/**
 * Collection configuration for Articles.
 * Defines the schema, access control, hooks, and admin UI behavior for articles.
 */
export const Articles: CollectionConfig = {
  /** The slug for the collection, used in API endpoints and database table names. */
  slug: 'Articles',
  /** Admin UI configuration. */
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'author',
      'section',
      'status',
      'workflowStatus',
      'createdAt',
      'updatedAt',
    ],
  },
  /**
   * Document locking configuration.
   * Prevents multiple users from editing the same document simultaneously.
   */
  lockDocuments: {
    duration: 600, // Duration in seconds
  },
  /** Default sort order for articles in the admin UI. */
  defaultSort: '-createdAt',
  /** Labels for the collection in the admin UI. */
  labels: { singular: 'Article', plural: 'Articles' },
  /** Access control rules for the collection. */
  access: {
    /** Defines who can create articles. Uses a custom access control function. */
    create: isAdminEditororAuthor,
    /** Defines who can read articles. */
    read: ({ req: { user } }) => {
      if (user) {
        // Allow access for admin, editor, or copy users to all articles.
        if (user.Role === 'admin' || user.Role === 'editor' || user.Role === 'copy') return true
        // For other users, allow access only to articles they own.
        return {
          owner: {
            equals: user.id, // Ensure the owner matches the logged-in user's ID
          },
        } as any
      }

      // Allow public access to published articles
      return {
        _status: {
          equals: 'published',
        },
      } as any
    },
    /** Defines who can update articles. Uses a custom access control function. */
    update: isAdminEditorCopyorOwner,
    /** Defines who can delete articles. */
    delete: ({ req: { user } }) => {
      // Allow delete access only if the user has the 'admin' role
      return user?.Role === 'admin'
    },
  },
  /**
   * Versioning configuration.
   * Enables drafts and scheduled publishing for articles.
   */
  versions: { drafts: { schedulePublish: true } },
  /** Hooks to run at different stages of the document lifecycle. */
  hooks: {
    beforeChange: [
      // Apply the state machine hook to enforce transition rules.
      articleStateMachine,
      // Apply the publishing gatekeeper to protect the publish action.
      articlePublishingGatekeeper,
      articleMainImageValidation,
    ],
  },

  fields: [
    {
      type: 'tabs', // This must be the first field when using tabbedUI
      tabs: [
        {
          label: 'Content', // Define the 'Content' tab
          fields: [
            /** Upload field for the article's main image. */
            {
              name: 'mainImage',
              label: 'Main Image',
              type: 'upload',
              relationTo: 'media',
              admin: { allowCreate: false },
            },
            /** Text field for the article title. */
            {
              name: 'title',
              type: 'text',
              maxLength: 60,
              required: true,
              admin: {
                components: {
                  Description: 'src/components/TitleCharacterCount.tsx',
                },
              },
            },
            slugField({
              position: 'sidebar',
              required: true,
            }),
            /**
             * Short introductory text — primary excerpt/summary for the article.
             * Appears above the body to set context before the main content.
             */
            {
              name: 'deck',
              label: 'Deck',
              type: 'textarea',
              minLength: 90,
              maxLength: 150,
              required: true,
              admin: {
                placeholder: 'Brief introductory text for the article',
                components: {
                  Description: 'src/components/DeckCharacterCount.tsx',
                },
              },
            },
            /** Rich text editor for the main body of the article. */
            { name: 'body', type: 'richText' },
          ],
        },
      ],
    },
    {
      name: 'workflowStatus',
      label: 'Workflow Status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Review', value: 'inReview' },
        { label: 'Changes Requested', value: 'changesRequested' },
        { label: 'Approved', value: 'approved' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      /** Relationship field to link articles to authors (users). */
      name: 'Author',
      type: 'relationship',
      relationTo: 'users',
      defaultValue: ({ user }) => user?.id,
      hasMany: false,
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      /** Relationship field to link articles to sections. */
      name: 'section',
      label: 'Section',
      type: 'relationship',
      relationTo: 'sections',
      hasMany: false,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sectionFeatured',
      label: 'Section Featured',
      type: 'radio',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
      defaultValue: 'no',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },

    {
      /**
       * Relationship field to store the owner of the article.
       * Defaults to the currently logged-in user.
       * Hidden in the admin UI as it's managed programmatically.
       */
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      defaultValue: ({ user }) => user?.id,
      admin: {
        hidden: true,
        // position: 'sidebar',
        // readOnly: true,
        description: 'This is the owner of the article',
      },
    },
    /** Array of tag objects with label and href for card/category navigation. */
    {
      name: 'tags',
      label: 'Tags',
      type: 'array',
      fields: [
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
          maxLength: 50,
          admin: {
            components: {
              Description: 'src/components/TagLabelCharacterCount.tsx',
            },
          },
        },
        {
          name: 'href',
          label: 'Link',
          type: 'text',
          maxLength: 200,
          admin: {
            placeholder: '/tag/slug or https://...',
            components: {
              Description: 'src/components/TagHrefCharacterCount.tsx',
            },
          },
        },
      ],
      minRows: 0,
      maxRows: 10,
      labels: {
        singular: 'Tag',
        plural: 'Tags',
      },
      admin: {
        position: 'sidebar',
      },
    },
    /** Manual sort order for articles. Lower numbers appear first. */
    {
      name: 'order',
      label: 'Order',
      type: 'number',
      min: 0,
      admin: {
        position: 'sidebar',
        placeholder: 'Optional — lower numbers sort first',
      },
    },
    /** Whether this article is featured in highlighted sections. */
    {
      name: 'featured',
      label: 'Featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
